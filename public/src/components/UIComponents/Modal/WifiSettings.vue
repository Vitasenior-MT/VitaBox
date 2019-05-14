<template>
  <modal
    name="wifi-settings"
    :classes="['v--modal', 'vue-dialog', this.params.class]"
    :width="width"
    :height="width"
    :pivot-y="0.3"
    :adaptive="true"
    :clickToClose="clickToClose"
    :transition="transition"
    @before-open="beforeOpened"
    @before-close="beforeClosed"
    @opened="$emit('opened', $event)"
    @closed="$emit('closed', $event)">
    <div class="background-opacity">
      <div class="row  vue-settings">
        <div class="col-md-12 vue-height-out">
          <div class="dialog-content">
            <h2 class="dialog-c-title"><i class="fas fa-tasks"></i> &nbsp; {{$t('modal.wifisettings.title')}}</h2>
            <div>
              <h4>{{$t('modal.wifisettings.navigation.0')}} <i class="fas fa-arrows-alt"></i> {{$t('modal.wifisettings.navigation.1')}}</h4>
            </div>
          </div>
          <div v-show="!displayWifi" class="col-lg-12 btn btn-round btn-fill btn-block resize-form-wifi">
            <div class="row">
              <div class="col-md-12">
                <h4 class="text-center">
                  A carregar as redes WIFI disponiveis. Aguarde...
                </h4>
              </div>
            </div>
            <div class="row">
              <div class="col-md-12">
                <img src='static/img/logo_B.png' alt='' style="width:36%;">
              </div>
            </div>
          </div>
          <div v-show="displayWifi" class="col-lg-12 btn btn-round btn-fill btn-block resize-form-wifi">
            <div class="col-lg-3 col-ajust" v-for="(item, i) in params" v-bind:key='item.key' v-show="ssid">
              <show-ssid :data="params[i]" :data-ssid="params[i].ssid"></show-ssid>
            </div>
            <h3 v-show="!ssid">{{$t('modal.wifisettings.password')}}</h3>
            <input class="input-font-color-black" type="password" v-model="password" v-show="!ssid" ref="psswrd">
          </div>
          <div class="col-md-12">
            <h4>{{$t('modal.wifisettings.exit.0')}} <br>{{$t('modal.wifisettings.exit.1')}}</h4>
          </div>
        </div>
      </div>
    </div>
  </modal>
</template>
<script>
import { EventBus } from '../../../event-bus.js'
import ShowSsid from 'components/UIComponents/Cards/ShowSsids.vue'
export default {
  name: 'VueJsDialog',
  components: {
    ShowSsid
  },
  props: {
    width: {
      type: [Number, String],
      default: 800
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
      params: {},
      displayWifi: false,
      password: null,
      ssid: true,
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
  },
  sockets: {
    connectionsList(list) {
      this.params = list
      this.displayWifi = true
    }
  },
  methods: {
    saveItens(ssid, psswd) {
      this.$socket.emit('connectWifi', { ssid: ssid, psswd: psswd })
    },
    /**
     * TODO: Metodo para controlar os eventos do comando remoto quando esta é a view ativa no momento
     */
    controlEventsBus() {
      var self = this
      /**
       * TODO: Monitorização dos eventos do controlo remoto
       */
      EventBus.$on('move-components-wifi-modal', function(cmd) {
        EventBus.elementControl = document.getElementsByClassName('control-modal-wifi')
        if (EventBus.elementControl.length > 0) {
          switch (cmd) {
            // evento do 'OK'
            case 'ok_btn':
              let elem = EventBus.elementControl[EventBus.currentActiveRightComp]
              console.log(elem.dataset.ssid)
              console.log(self.password)
              if (elem.dataset.ssid) {
                if (self.ssid) {
                  self.ssid = false
                  setTimeout(() => {
                    self.$refs.psswrd.focus()
                  }, 100);
                } else {
                  if (self.password) {
                    self.saveItens(elem.dataset.ssid, self.password)
                  } else {
                    self.saveItens(elem.dataset.ssid, '')
                  }
                  self.$modal.hide('wifi-settings')
                  EventBus.enterLastElementDefinitions()
                }
              }
              break
            // evento para sair para a sidebar ou para a lista anterior
            case 'exit':
              // this.$modal.hide('settings')
              break
            case 'right': // tecla para a direita
            case 'left': // tecla para a esquerda
              EventBus.moveLeftRightInElemts(cmd === 'left' ? -1 : 1, 'btn-fill')
              EventBus.firstRightEvent = false
              break
            case 'up': // tecla para a cima
            case 'down': // tecla para a baixo
              // EventBus.moveLeftRightInElemts(cmd === 'up' ? -1 : 1, 'card-layout-in-selected')
              EventBus.moveLeftRightInElemts(cmd === 'up' ? -1 : 1, 'btn-fill')
              EventBus.firstRightEvent = false
              break
            default:
              break
          }
        }
      })
    },
    beforeOpened(event) {
      // this.params = event.params || {}
      this.controlEventsBus()
    },
    beforeClosed(event) {
      window.removeEventListener('keyup', this.onKeyUp)
      this.params = {}
      this.$emit('before-closed', event)
      EventBus.$off('move-components-wifi-modal')
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
.resize-form-wifi {
  height: 340px !important;
  overflow: hidden;
}
</style>
