<template>
  <modal
    name="settings"
    height="auto"
    :classes="['v--modal', 'vue-dialog', this.params.class]"
    :width="width"
    :pivot-y="0.3"
    :adaptive="true"
    :clickToClose="clickToClose"
    :transition="transition"
    @before-open="beforeOpened"
    @before-close="beforeClosed"
    @opened="$emit('opened', $event)"
    @closed="$emit('closed', $event)">
    <div class="background-opacity">
      <div class="row vue-settings">
        <div class="col-md-12">
          <div class="dialog-content">
            <h2 class="dialog-c-title"><i class="fas fa-tasks"></i> &nbsp; {{$t('modal.settings.title')}}</h2>
            <div>
              <h4>{{$t('modal.settings.navigation.0')}}<i class="fas fa-arrows-alt"></i>{{$t('modal.settings.navigation.1')}}<i class="fas wifi"></i></h4>
            </div>
          </div>
          <div v-for="(item, i) in items" v-bind:key='item.key'>
            <div class="row">
              <div class="col-md-12">
                <div class="col-md-3">
                  <h3 :for="items[i].type + item.key">{{items[i].title}}</h3>
                </div>
                <div class="col-md-9 control-modal" :data-itempos="i">
                  <toggle-button class="changed-font"
                    @change="updateItem($event.value, items[i], i)"
                    :key="i"
                    :sync="true"
                    :value="items[i].default"
                    :labels="items[i].labels"
                    :color="items[i].color"
                    :width="200"
                    :height="40"/>
                </div>
              </div>
            </div>
          </div>
          <div class="row" v-if="gitlastupdate != ''">
            <div class="col-md-12 text-right">
              <h4><i class="ti-github"></i> Última Atualização: <i class="fas fa-calendar-alt"></i> {{ gitlastupdate }}</h4>
            </div>
          </div>
          <div>
            <h4>{{$t('modal.settings.exit.0')}} <br> {{$t('modal.settings.exit.1')}}</h4>
        </div>
        </div>
      </div>
    </div>
  </modal>
</template>
<script>
import { EventBus } from '../../../event-bus.js'
export default {
  name: 'VueJsDialog',
  props: {
    width: {
      type: [Number, String],
      default: 400
    },
    clickToClose: {
      type: Boolean,
      default: true
    },
    transition: {
      type: String,
      default: 'fade'
    }
  },
  data() {
    return {
      items: [
        {
          title: this.$t('modal.settings.mode.title'),
          type: 'mode',
          default: true,
          labels: {checked: this.$t('modal.settings.mode.checked'), unchecked: this.$t('modal.settings.mode.unchecked')},
          color: {checked: '#f7931d', unchecked: '#f05a28'},
          values: ['advanced', 'basic']
        },
        {
          title: this.$t('modal.settings.sound.title'),
          type: 'sound',
          default: true,
          labels: {checked: this.$t('modal.settings.sound.checked'), unchecked: this.$t('modal.settings.sound.unchecked')},
          color: {checked: '#f7931d', unchecked: '#f05a28'},
          values: ['on', 'off']
        },
        {
          title: this.$t('modal.settings.language.title'),
          type: 'language',
          default: true,
          labels: {checked: this.$t('modal.settings.language.checked'), unchecked: this.$t('modal.settings.language.unchecked')},
          color: {checked: '#f7931d', unchecked: '#f05a28'},
          values: ['pt', 'en']
        },
        {
          title: this.$t('modal.settings.wifi.title'),
          type: 'wifi',
          default: true,
          labels: {checked: this.$t('modal.settings.wifi.open'), unchecked: ''},
          color: {checked: '#f7931d', unchecked: '#f05a28'},
          values: ['Open', '']
        }
      ],
      params: {},
      defaultButtons: [{ title: 'CLOSE' }],
      gitlastupdate: ''
    }
  },
  computed: {
    buttons() {
      return this.params.buttons || this.defaultButtons
    },
    /**
      * Returns FLEX style with correct width for arbitrary number of
      * buttons.
      */
    buttonStyle() {
      return {
        flex: `1 1 ${100 / this.buttons.length}%`
      }
    }
  },
  mounted() {
    this.getGitLastUpdate()
    this.getSettings()
  },
  methods: {
    getGitLastUpdate() {
      this.$http
      .get('/api/git/gitlastupdate')
      .then(response => {
        if (response.data.status) {
          this.gitlastupdate = EventBus.dateFormat(response.data.data)
        } else {
          console.log('getGitLastUpdate error', response.data)
        }
      })
      .catch(error => {
        console.log('----> ', error)
      })
    },
    getSettings() {
      this.$http
      .get('/api/settings/get')
      .then(response => {
        // console.log("settings data", response)
        if (response.data) {
          var appSettings = JSON.parse(response.data.data.app_settings)
          for (var index in this.items) {
            if (appSettings[this.items[index].type]) {
              switch (this.items[index].type) {
                case 'mode':
                  this.items[index].default = appSettings['mode'].default
                  break
                case 'sound':
                  this.items[index].default = appSettings['sound'].default
                  break
                case 'language':
                  this.items[index].default = appSettings['language'].default
                  break
                default:
                  break
              }
            }
          }
        } else {
          console.log('Receive error', response)
        }
      })
      .catch(error => {
        console.log('----> ', error)
      })
    },
    updateItem(toggle, type, i) {
      switch (type.type) {
        case 'mode':
          EventBus.$emit('mode', toggle)
          this.items[i].default = toggle
          break
        case 'sound':
          EventBus.removeAudio(toggle ? type.values[0] : type.values[1])
          EventBus.flg_sound = toggle
          this.items[i].default = toggle
          break
        case 'language':
          EventBus.currentLanguage = toggle ? type.values[0] : type.values[1]
          this.$store.dispatch('setLangNew', EventBus.currentLanguage)
          this.items[i].default = toggle
          break
        case 'wifi':
          if (toggle === false) {
            this.items[i].default = toggle
            EventBus.enterNewElementDefinitions('wifi-settings')
            EventBus.wifi = true
            this.$modal.show('wifi-settings')
            this.$socket.emit('openWIFI', '')
            setTimeout(() => {
              this.items[i].default = !this.items[i].default
            }, 1000);
          }
          break
        default:
          break
      }
    },
    saveItens() {
      var data = {}
      for (let index = 0; index < this.items.length; index++) {
        data[this.items[index].type] = {
          type: this.items[index].type,
          default: this.items[index].default,
          value: this.items[index].default ? this.items[index].values[0] : this.items[index].values[1]
        }
      }
      EventBus.settingsData = data
      this.$socket.emit('saveSettings', JSON.stringify(data))
    },
    /**
     * TODO: Metodo para controlar os eventos do comando remoto quando esta é a view ativa no momento
     */
    controlEventsBus() {
      var self = this
      /**
       * TODO: Monitorização dos eventos do controlo remoto
       */
      EventBus.$on('move-components-modal', function(cmd) {
        EventBus.elementControl = document.getElementsByClassName('control-modal')
        // console.log(cmd, EventBus.elementControl)
        switch (cmd) {
          // evento do 'OK'
          case 'ok_btn':
            try {
              let elem = EventBus.elementControl[EventBus.currentActiveRightComp].dataset
              // console.log('Teste btn - ', self.items[elem.itempos].default, self.items[elem.itempos], elem.itempos)
              // @change="updateItem($event.value, items[i], i)"
              if (elem.itempos < self.items.length) {
                self.updateItem(!self.items[elem.itempos].default, self.items[elem.itempos], elem.itempos)
              } /* else {
                self.open()
              } */
            } catch (e) {
              console.log('error btn ok change.')
            }
            break
          // evento para sair para a sidebar  para a lista anterior
          case 'exit':
            // this.$modal.hide('settings')
            break
          case 'right': // tecla para a direita
          case 'left': // tecla para a esquerda
            EventBus.moveLeftRightInElemts(cmd === 'left' ? -1 : 1, 'btn-shadow')
            EventBus.firstRightEvent = false
            break
          case 'up': // tecla para a cima
          case 'down': // tecla para a baixo
            EventBus.moveLeftRightInElemts(cmd === 'up' ? -1 : 1, 'btn-shadow')
            EventBus.firstRightEvent = false
            break
          default:
            break
        }
      })
    },
    beforeOpened(event) {
      EventBus.firstRightEvent = true
      EventBus.currentActiveRightComp = 0
      window.addEventListener('keyup', this.onKeyUp)
      this.params = event.params || {}
      this.$emit('before-opened', event)
      this.controlEventsBus()
      for (var index in this.items) {
        switch (this.items[index].type) {
          case 'mode':
            this.items[index].default = EventBus.settingsData['mode'].default
            break
          case 'sound':
            this.items[index].default = EventBus.settingsData['sound'].default
            break
          case 'language':
            this.items[index].default = EventBus.settingsData['language'].default
            break
          default:
            break
        }
      }
    },
    beforeClosed(event) {
      this.saveItens()
      window.removeEventListener('keyup', this.onKeyUp)
      this.params = {}
      this.$emit('before-closed', event)
      EventBus.$off('move-components-modal')
    },
    click(i, event, source = 'click') {
      const button = this.buttons[i]
      if (button && typeof button.handler === 'function') {
        button.handler(i, event, { source })
      } else {
        this.$modal.hide('dialog')
      }
    },
    onKeyUp(event) {
      if (event.which === 13 && this.buttons.length > 0) {
        const buttonIndex = this.buttons.length === 1 ? 0 : this.buttons.findIndex(button => button.default)
        if (buttonIndex !== -1) {
          this.click(buttonIndex, event, 'keypress')
        }
      }
    }
  }
}
</script>
<style>
</style>
