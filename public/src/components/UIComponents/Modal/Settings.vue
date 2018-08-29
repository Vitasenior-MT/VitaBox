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
            <h2 class="dialog-c-title"><i class="fas fa-tasks"></i> Configurações</h2>
          <div>
            <h4>Utilize as <i class="fas fa-arrows-alt"></i> do comando para navegar nas configurações.</h4>
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
          <div>
            <h4>Pressione [OK] para alterar o estado. <br> Pressione [EXIT] para sair.</h4>
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
        }
      ],
      params: {},
      defaultButtons: [{ title: 'CLOSE' }]
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
    /* var i = 0
    setInterval(() => {
      this.updateItem(!this.items[i].default, this.items[i], i)
    }, 10000) */
  },
  methods: {
    updateItem(toggle, type, i) {
      switch (type.type) {
        case 'mode':
          EventBus.$emit('mode')
          this.items[i].default = toggle
          break
        case 'sound':
          EventBus.removeAudio(toggle ? type.values[0] : type.values[1])
          this.items[i].default = toggle
          break
        case 'language':
          EventBus.currentLanguage = toggle ? type.values[0] : type.values[1]
          this.$store.dispatch('setLangNew', EventBus.currentLanguage)
          this.items[i].default = toggle
          break
        default:
          break
      }
    },
    saveItens() {
      var data = []
      for (let index = 0; index < this.items.length; index++) {
        let object = {
          type: this.items[index].type,
          default: this.items[index].default
        }
        data.push(object)
        // updateItem(this.items[index].default, this.items[index].type, index)
      }
      this.$http
        .get('/api/sensor/allCriticalSensors')
        .then(response => {
          var datasensores = response.data.data
          for (var index in datasensores) {
            this.warningCards.push({
              id: datasensores[index].board_id,
              idchart: 'chartid-' + index,
              avg: datasensores[index].avg.toFixed(),
              threshold_max_acceptable: datasensores[index].threshold_max_acceptable === undefined ? 100 : datasensores[index].threshold_max_acceptable,
              threshold_max_possible: datasensores[index].threshold_max_possible === undefined ? 100 : datasensores[index].threshold_max_possible,
              threshold_min_acceptable: datasensores[index].threshold_min_acceptable === undefined ? 100 : datasensores[index].threshold_min_acceptable,
              threshold_min_possible: datasensores[index].threshold_min_possible === undefined ? 100 : datasensores[index].threshold_min_possible,
              sensor: datasensores[index].sensortype,
              location: datasensores[index].location,
              measure: datasensores[index].measure,
              symbol: datasensores[index].unit,
              to_read: datasensores[index].to_read,
              dateupdate: this.dateFormat(datasensores[index].avgLastUpdate),
              footerIcon: 'ti-reload'
            })
          }
          this.$refs.DefaultView.hide()
        })
        .catch(error => {
          console.log(error)
        })
        console.log(data)
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
        EventBus.elementControlModal = document.getElementsByClassName('control-modal')
        switch (cmd) {
          // evento do 'OK'
          case 'ok_btn':
            try {
              let elem = EventBus.elementControlModal[EventBus.currentActiveRightCompModal].dataset
              console.log('Teste btn - ', elem)
              // @change="updateItem($event.value, items[i], i)"
              self.updateItem(!self.items[elem.itempos].default, self.items[elem.itempos], elem.itempos)
            } catch (e) {
              console.log('error btn ok change.')
            }
            break
          // evento para sair para a sidebar ou para a lista anterior
          case 'exit':
            // this.$modal.hide('settings')
            break
          case 'right': // tecla para a direita
          case 'left': // tecla para a esquerda
            EventBus.elementControlModal[EventBus.currentActiveRightCompModal].classList.remove('btn-shadow')
            EventBus.moveLeftRightInModal(cmd === 'left' ? -1 : 1)
            EventBus.elementControlModal[EventBus.currentActiveRightCompModal].classList.add('btn-shadow')
            EventBus.firstRightEventModal = false
            break
          case 'up': // tecla para a cima
          case 'down': // tecla para a baixo
            EventBus.elementControlModal[EventBus.currentActiveRightCompModal].classList.remove('btn-shadow')
            EventBus.moveLeftRightInModal(cmd === 'up' ? -1 : 1)
            EventBus.elementControlModal[EventBus.currentActiveRightCompModal].classList.add('btn-shadow')
            EventBus.firstRightEventModal = false
            break
          default:
            break
        }
      })
    },
    beforeOpened(event) {
      EventBus.firstRightEventModal = true
      EventBus.currentActiveRightCompModal = 0
      window.addEventListener('keyup', this.onKeyUp)
      this.params = event.params || {}
      this.$emit('before-opened', event)
      this.controlEventsBus()
      this.items[0].default = this.sidebarStore.mode.advanced
      this.items[1].default = EventBus.flg_sound
      EventBus.currentLanguage === 'pt' ? this.items[2].default = true : this.items[2].default = false
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
.vue-settings {
  margin-left: 25% !important;
  margin-top: 10%;
  width: 50%;
  position: absolute;
  background-color: rgba(255, 255, 255, 1);
}

.background-opacity {
  background-color: rgba(0, 0, 0, 0.5) !important;
  height: 100%;
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
}
.changed-font {
  font-size: 25px !important;
}
.btn-shadow label {
  border-bottom: 5px solid black;
  border-radius: 100px;
}
</style>
