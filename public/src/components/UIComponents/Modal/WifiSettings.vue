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
      <div class="row vue-welcome">
        <div class="col-md-12 vue-height-out">
          <div class="dialog-content">
            <h2 class="dialog-c-title"><i class="fas fa-tasks"></i> Wifi Configuração</h2>
            <div>
              <h4>Utilize as <i class="fas fa-arrows-alt"></i> do comando para navegar nas configurações.</h4>
            </div>
          </div>
          <div class="col-md-12 card-layout-out">
            <div v-for="(item, i) in params" v-bind:key='item.key'>
              <!-- <div class="col-md-8 card-layout-in control-modal" :data-ssid="params[i].ssid">{{params[i].ssid}}</div> -->
              <show-ssid :data="params[i]"></show-ssid>
            </div>
          </div>
          <div class="col-md-12">
            <div class="col-md-3">
              <h3>Password</h3>
            </div>
            <div class="col-md-9">
                <input class="changed-font" type="password" v-model="password"><br>
            </div>
          </div>
          <div class="col-md-12">
            <h4>Pressione [OK] para alterar o estado. <br> Pressione [EXIT] para sair.</h4>
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
      password: null,
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
        EventBus.elementControlModal = document.getElementsByClassName('control-modal')
        switch (cmd) {
          // evento do 'OK'
          case 'ok_btn':
            let elem = EventBus.elementControlModal[EventBus.currentActiveRightCompModal]
            console.log(elem.dataset.ssid)
            console.log(self.password)
            self.saveItens(elem.dataset.ssid, self.password)
            /* try {
              let elem = EventBus.elementControlModal[EventBus.currentActiveRightCompModal].dataset
              console.log('Teste btn - ', elem)
              // @change="updateItem($event.value, items[i], i)"
              self.updateItem(!self.items[elem.itempos].default, self.items[elem.itempos], elem.itempos)
            } catch (e) {
              console.log('error btn ok change.')
            } */
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
            EventBus.elementControlModal[EventBus.currentActiveRightCompModal].classList.remove('card-layout-in-selected')
            EventBus.moveLeftRightInModal(cmd === 'up' ? -1 : 1)
            EventBus.elementControlModal[EventBus.currentActiveRightCompModal].classList.add('card-layout-in-selected')
            EventBus.firstRightEventModal = false
            break
          default:
            break
        }
      })
    },
    beforeOpened(event) {
      this.params = event.params || {}
      this.controlEventsBus()
    },
    beforeClosed(event) {
      // this.saveItens()
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
