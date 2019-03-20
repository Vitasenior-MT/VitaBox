<template>
  <modal
    name="videocall"
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
      <v-card>
        <v-card-title class="headline grey lighten-2" primary-title>
          <span>Video Call</span>
        </v-card-title>
        <v-card-text class="cameraBoard">
          <div v-if="status!==4">
            <p class="px-2 headline primary_d--text" style="height:32px">{{message}}</p>
            <v-divider></v-divider>
          </div>

          <div v-if="status===1">
            <v-list two-line>
              <v-list-tile v-for="item in dataConnections" :key="item.peer">
                <v-list-tile-avatar>
                  <v-icon small color="green">fas fa-bullseye</v-icon>
                </v-list-tile-avatar>
                <v-list-tile-content>{{ item.name }}</v-list-tile-content>
                <v-list-tile-action>
                  <v-btn fab dark small color="primary" @click="startConnection(item.connection)">
                    <v-icon dark>fas fa-video</v-icon>
                  </v-btn>
                </v-list-tile-action>
              </v-list-tile>
            </v-list>
            <v-list-tile v-for="item in offlineUsers" :key="item.id">
              <v-list-tile-avatar>
                <v-icon small color="red">fas fa-bullseye</v-icon>
              </v-list-tile-avatar>
              <v-list-tile-content>{{ item.name }}</v-list-tile-content>
            </v-list-tile>
          </div>

          <div v-if="status==2">
            <div class="buttonsView">
              <v-btn fab dark small color="error" @click="cancelConnection">
                <v-icon dark>fas fa-video-slash</v-icon>
              </v-btn>
            </div>
          </div>

          <div v-if="status==3">
            <div class="buttonsView">
              <v-btn fab dark small color="error" @click="rejectConnection">
                <v-icon dark>fas fa-times</v-icon>
              </v-btn>
              <v-btn fab dark small color="success" @click="acceptConnection">
                <v-icon dark>fas fa-check</v-icon>
              </v-btn>
            </div>
          </div>

          <video class="invisible" ref="remoteVideo" autoplay playinline></video>
          <video class="invisible" ref="localVideo" autoplay playsinline></video>

          <div v-if="status==4">
            <div class="buttonsView">
              <v-btn fab dark small color="error" @click="stopConnection">
                <v-icon dark>fas fa-video-slash</v-icon>
              </v-btn>
            </div>
          </div>
        </v-card-text>
        <v-dialog v-model="warningDialog" width="300px">
          <v-card>
            <v-card-title>
              <h3>If you close you'll finish the call</h3>
            </v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn class="ash--text" flat @click="warningDialog=false">Cancel</v-btn>
              <v-btn class="error" @click="closeWhileConnection">Finish</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-card>
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
              if (elem.dataset.ssid) {
                if (self.ssid) {
                  self.ssid = false
                  setTimeout(() => {
                    self.$refs.psswrd.focus()
                  }, 100);
                } else {
                  if (self.password) {
                    self.saveItens(elem.dataset.ssid, self.password)
                    self.$modal.hide('wifi-settings')
                    EventBus.enterLastElementDefinitions()
                  }
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
