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
            <h2 class="dialog-c-title" v-html="'Configurações'"></h2>
          </div>
          <div v-for="(item, i) in items" v-bind:key='item.key'>
            <div class="row">
              <div class="col-md-12">
                <div class="col-md-3">
                  <h3 :for="items[i].type + item.key">{{items[i].title}}</h3>
                </div>
                <div class="col-md-9">
                  <h3>
                    <toggle-button class="control-remote changed-font"
                      @change="updateItem($event.value, items[i], i)"
                      :key="i"
                      :sync="true"
                      :value="items[i].default"
                      :labels="items[i].labels"
                      :color="items[i].color"
                      :width="200"
                      :height="50"/>
                    </h3>
                </div>
              </div>
            </div>
          </div>
          <div>
            <h5> Pressione [EXIT] para sair.</h5>
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
          title: 'Modo',
          type: 'mode',
          default: true,
          labels: {checked: 'Avançado', unchecked: 'Básico'},
          color: {checked: '#7DCE94', unchecked: '#82C7EB'},
          values: ['advanced', 'basic']
        },
        {
          title: 'Som',
          type: 'sound',
          default: EventBus.flg_sound,
          labels: {checked: 'Ligado', unchecked: 'Desligado'},
          color: {checked: '#7DCE94', unchecked: '#82C7EB'},
          values: ['on', 'off']
        },
        {
          title: 'linguagem',
          type: 'language',
          default: true,
          labels: {checked: 'pt', unchecked: 'en'},
          color: {checked: '#7DCE94', unchecked: '#82C7EB'},
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
          console.log(this.items[i])
          break
        case 'sound':
          EventBus.removeAudio(toggle ? type.values[0] : type.values[1])
          break
        case 'language':
          this.$store.dispatch('setLangNew', toggle ? type.values[0] : type.values[1])
          break
        default:
          break
      }
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
        EventBus.elementControl = document.getElementsByClassName('control-remote')
        switch (cmd) {
          // evento do 'OK'
          case 'ok_btn':
            try {
              let elem = EventBus.elementControl[EventBus.currentActiveRightComp]
              var evt = document.createEvent("HTMLEvents");
              evt.initEvent("change", false, true);
              elem.dispatchEvent(evt);
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
            EventBus.elementControl[EventBus.currentActiveRightComp].classList.remove('on-shadow')
            EventBus.moveLeftRightInView(cmd === 'left' ? -1 : 1)
            EventBus.elementControl[EventBus.currentActiveRightComp].classList.add('on-shadow')
            break
          case 'up': // tecla para a cima
          case 'down': // tecla para a baixo
            EventBus.elementControl[EventBus.currentActiveRightComp].classList.remove('on-shadow')
            EventBus.moveLeftRightInView(cmd === 'up' ? -1 : 1)
            EventBus.elementControl[EventBus.currentActiveRightComp].classList.add('on-shadow')
            break
          default:
            break
        }
      })
    },
    beforeOpened(event) {
      window.addEventListener('keyup', this.onKeyUp)
      this.params = event.params || {}
      this.$emit('before-opened', event)
      this.controlEventsBus()
    },
    beforeClosed(event) {
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
  margin-left: 30% !important;
  margin-top: 15% !important;
  width: 40%;
  position: absolute;
  background-color: rgba(255, 255, 255, 1) !important;
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
.on-shadow {
  border-bottom: 5px solid black;
  border-radius: 100px;
}
</style>
