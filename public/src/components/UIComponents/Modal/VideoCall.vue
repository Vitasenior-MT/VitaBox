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
      <div>
        <div class="panel panel-primary">
          <div class="panel-heading">
            <h3>Utilizadores</h3>
          </div>
          <div class="panel-body cameraBoard" style="text-align:left;">
            <div v-if="status!==4">
              <p class="headline">{{message}}</p>
              <hr>
            </div>
            <div v-if="status===1">
              <div class="list-group" style="padding:0 10px;">
                <a class="list-group-item" v-for="item in dataConnections" :key="item.peer"
                  @click="startConnection(item.connection)">
                  <div>
                    <span class="fas fa-bullseye" style="color: #4caf50; padding-right:10px;" aria-hidden="true"> </span>
                    {{ item.name }} </div>
                </a>
                <li class="list-group-item" v-for="item in offlineUsers" :key="item.id">
                  <div>
                    <i class="fas fa-bullseye" style="color: #f44336; padding-right:10px;" aria-hidden="true"></i>
                    {{ item.name }} </div>
                </li>
              </div>
            </div>
            <div v-if="status==2">
              <div class="buttonsView">
                <button type="button" class="mybtn" @click="cancelConnection" style="background-color: #f44336;">
                  <div>
                    <span class="fas fa-video-slash" style="font-size: 18px;" aria-hidden="true"></span>
                  </div>
                </button>
              </div>
            </div>
            <div v-if="status==3">
              <div class="buttonsView">
                <button type="button" class="mybtn" @click="rejectConnection" style="background-color: #f44336;">
                  <div>
                    <span class="fas fa-times" style="font-size: 18px;" aria-hidden="true"></span>
                  </div>
                </button>
                <button type="button" class="mybtn" @click="acceptConnection" style="background-color: #4caf50;">
                  <div>
                    <span class="fas fa-check" style="font-size: 18px;" aria-hidden="true"></span>
                  </div>
                </button>
              </div>
            </div>
            <video class="invisible" ref="remoteVideo" autoplay playinline></video>
            <video class="invisible" ref="localVideo" autoplay playsinline></video>
            <div v-if="status==4">
              <div class="buttonsView">
                <button type="button" class="mybtn" @click="stopConnection" style="background-color: #212121;">
                  <div>
                    <span class="fas fa-video-slash" style="font-size: 18px;" aria-hidden="true"></span>
                  </div>
                </button>
              </div>
            </div>
            <div v-if="warningDialog" class="panel panel-danger">
              <div class="panel-heading">
                <h3>If you close you'll finish the call</h3>
              </div>
              <div class="panel-body" style="text-align: right;">
                <button type="button" class="btn btn-default" @click="warningDialog=false">Cancel</button>
                <button type="button" class="btn btn-danger" @click="closeWhileConnection">Finish</button>
              </div>
            </div>
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
      params: {},
      defaultButtons: [{ title: 'CLOSE' }],
      vitaboxId: null,
      vitaboxToken: null,
      vitaboxAddress: null,
      streamToSend: null,
      streamToShow: null,
      peer: null,
      remotePeerID: null,
      mediaConnection: null,
      host: null,
      port: null,
      peerport: null,
      peerhost: null,
      secure: null,
      dataConnections: [],
      status: 0,
      message: "initializing...",
      ringing: null,
      warningDialog: null,
      users: [],
      offlineUsers: []
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
  },
  methods: {
    getPeers() {
      this.$http
      .get('/api/connectServer/getUsers')
      .then(response => {
        console.log(response.data.data)
        let data = response.data.data
        this.users = this.offlineUsers = data.data.users.concat(data.data.doctors)
        this.vitaboxToken = data.token
        this.host = data.host
        this.port = data.port
        this.secure = data.secure
        this.vitaboxId = data.vitaboxId
        this.peerport = data.peerport
        this.peerhost = data.peerhost
        this.inititatePeer()
      })
      .catch(error => {
        console.log(error)
        this.$notifications.notify({
          message: '<h4>Falha ao tentar adquirir o tempo.</h4>',
          icon: 'ti-bell',
          horizontalAlign: 'right',
          verticalAlign: 'top',
          type: 'warning'
        })
      })
    },
    inititatePeer() {
      this.peer = Peer(this.vitaboxId, {
        key: "8dnMsRvmGdz3fPG8RYO8muaUfQ2Iy1lE",
        token: this.vitaboxToken,
        host: this.peerhost,
        port: this.peerport,
        secure: this.secure,
        debug: 3
      })

      this.listenPeerEvent()
    },
    listenPeerEvent() {
      var self = this
      this.peer.on("call", mediaConnection => {
         console.log('Call done cmon')
        if (self.status === 2 && self.remotePeerID === mediaConnection.peer) {
          self.mediaConnection = mediaConnection
          self.mediaConnection.answer(self.streamToSend)
          self.status = 4
          self.message = ""
          self.listenMediaConnection()
          setTimeout(() => {
            console.log(self.streamToSend)
            console.log(self.streamToShow)
          }, 1000);
        } else {
          self.dataConnections.forEach(x => {
            if (x.peer === mediaConnection.peer) {
              x.connection.send({ type: "unauthorized" })
            }
          })
        }
      })
      this.peer.on("connection", dataConnection => {
        console.log("peer connected")
        let user = this.users.find(x => x.id === dataConnection.peer)
        this.listenDataConnection(dataConnection, user)
      })
      this.peer.on("error", error => {
        console.log("peer error: ", error.message)
      })
      // this.peer.on("disconnected", () => {
      //   setTimeout(this.peer.connect(this.vitaboxId), 30000)
      // })
      this.status = 1
      this.message = ""
    },
    startConnection(connection) {
      if (this.status === 1) {
        this.status = 2
        this.message = "waiting..."
        this.remotePeerID = connection.peer
        connection.send({
          type: "call",
          username: this.vitaboxAddress
        })
        this.startCallSound()
      } else this.message = "You're in another call"
    },
    acceptConnection() {
      this.stopCallSound()
      this.status = 2
      this.message = "waiting..."
      this.startCamera(success => {
        console.log('aaaaaaaaaaaaaa ', success)
        if (success) {
          this.dataConnections.forEach(x => {
            if (x.peer === this.remotePeerID) {
              x.connection.send({ type: "accept" })
            }
          })
        } else {
          this.dataConnections.forEach(x => {
            if (x.peer === this.remotePeerID) {
              x.connection.send({
                type: "unable",
                message: "error starting the WebCam"
              })
            }
          })
          this.status = 1
          this.message = "error starting the WebCam"
        }
      })
    },
    rejectConnection() {
      this.stopCallSound()
      this.dataConnections.forEach(x => {
        if (x.peer === this.remotePeerID) x.connection.send({ type: "reject" })
      })
      this.status = 1
      this.message = ""
    },
    cancelConnection() {
      this.stopCallSound()
      this.dataConnections.forEach(x => {
        if (x.peer === this.remotePeerID) x.connection.send({ type: "cancel" })
      })
      this.status = 1
      this.message = ""
    },
    listenDataConnection(dataConnection, user) {
      dataConnection.on("data", data => {
        console.log('connetion ------> ', data)
        switch (data.type) {
          case "call":
            if (this.status === 1) {
              this.remotePeerID = user.id
              this.status = 3
              this.message = user.name + " is calling"
              this.startCallSound()
            } else {
              dataConnection.send({ type: "occupied" })
            }
            break
          case "accept":
            this.startCamera(success => {
              if (success) {
                console.log(this.streamToSend)
                console.log(this.streamToShow)
                this.stopCallSound()
                this.mediaConnection = this.peer.call(
                  this.remotePeerID,
                  this.streamToSend
                )
                this.status = 4
                this.message = ""
                this.listenMediaConnection()
              } else {
                this.status = 1
                this.message = "error starting the WebCam"
                dataConnection.send({
                  type: "unable",
                  message: "error starting the WebCam"
                })
              }
            })
            break
          case "reject":
            this.stopCallSound()
            this.status = 1
            this.message = "the call was rejected"
            break
          case "occupied":
            this.stopCallSound()
            this.status = 1
            this.message = "the user is occupied"
            break
          case "unable":
            this.stopCallSound()
            this.status = 1
            this.message = "unable to connect: " + data.message
            break
          case "unauthorized":
            this.status = 1
            this.message = "access not allowed"
            break
          case "cancel":
            this.stopCallSound()
            this.status = 1
            this.message = "connection canceled"
            break
        }
      })
      dataConnection.on("error", err => {
        console.log("dataConnection error: ", err)
      })
      dataConnection.on("close", () => {
        this.dataConnections.splice(
          this.dataConnections.map(x => x.peer).indexOf(user.id),
          1
        )
      })

      console.log(user)
      this.dataConnections.push({
        connection: dataConnection,
        peer: user.id,
        name: user.name
      })
      console.log(this.dataConnections)
    },
    listenMediaConnection() {
      this.mediaConnection.on("stream", stream => {
        this.$refs.localVideo.className = "localView"
        this.$refs.localVideo.srcObject = this.streamToShow
        this.$refs.remoteVideo.className = "remoteView"
        this.$refs.remoteVideo.srcObject = stream
      })
      this.mediaConnection.on("close", () => {
        this.stopCamera()
        this.status = 1
        this.message = "Call finished"
      })
      this.mediaConnection.on("error", err => {
        console.log("mediaConnection error: ", err)
        this.stopConnection()
      })
    },
    stopConnection() {
      this.mediaConnection.close()
      this.stopCamera()
      this.status = 1
      this.message = "Call finished"
    },
    async startCamera(callback) {
      console.log('***********************************')
      var self = this
      navigator.getUserMedia = ( navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia)
      try {
        this.streamToSend = await navigator.getUserMedia({ audio: true, video: true },
          localMediaStream => {
            self.streamToSend = localMediaStream
            console.log(localMediaStream)
          },
          // callbackError
          err => {console.log("Error: " + err)})
        this.streamToShow = await navigator.getUserMedia({ audio: false, video: true },
          localMediaStream => {
            console.log(localMediaStream)
          },
          // callbackError
          err => {
            console.log("Error: " + err)
          })
        setTimeout(() => {
          console.log('******localMediaStream*********')
          console.log(this.streamToSend)
          console.log(this.streamToShow)
        }, 20000);
        callback(true)
      } catch (e) {
        callback(false)
      }
    },
    stopCamera() {
      if (this.streamToSend) {
        this.streamToSend.getTracks().forEach(track => track.stop())
      }
      if (this.streamToShow) {
        this.streamToShow.getTracks().forEach(track => track.stop())
      }
      if (this.$refs.remoteVideo.srcObject) {
        this.$refs.remoteVideo.srcObject = null
        this.$refs.remoteVideo.className = "invisible"
      }
      if (this.$refs.localVideo.srcObject) {
        this.$refs.localVideo.srcObject = null
        this.$refs.localVideo.className = "invisible"
      }
    },
    startCallSound() {
      let ring = new Audio("/static/owl.mp3")
      this.ringing = setInterval(() => {
        ring.play()
      }, 2000)
    },
    stopCallSound() {
      clearInterval(this.ringing)
    },
    closeWhileConnection() {
      this.warningDialog = false
      this.stopConnection()
      this.$emit("close")
    },
    /**
     * TODO: Metodo para controlar os eventos do comando remoto quando esta é a view ativa no momento
     */
    controlEventsBus() {
      var self = this
      /**
       * TODO: Monitorização dos eventos do controlo remoto
       */
      EventBus.$on('move-components-videocall-modal', function(cmd) {
        EventBus.elementControl = document.getElementsByClassName('control-modal-videocall')
        // console.log(cmd, EventBus.elementControl)
        switch (cmd) {
          // evento do 'OK'
          case 'ok_btn':
            try {
              /* let elem = EventBus.elementControl[EventBus.currentActiveRightComp].dataset
              // console.log('Teste btn - ', self.items[elem.itempos].default, self.items[elem.itempos], elem.itempos)
              // @change="updateItem($event.value, items[i], i)"
              if (elem.itempos < self.items.length) {
                self.updateItem(!self.items[elem.itempos].default, self.items[elem.itempos], elem.itempos)
              } */
            } catch (e) {
              console.log('error btn ok change.')
            }
            break
          // evento para sair para a sidebar  para a lista anterior
          case 'exit':
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
      this.controlEventsBus()
      this.vitaboxAddress = "Something"
      this.getPeers()
    },
    beforeClosed(event) {
      this.dataConnections.forEach(x => x.connection.close())
      if (this.mediaConnection) {
        this.mediaConnection.close()
        this.stopCamera()
      }
      this.peer.destroy()
      this.peer = null

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
  },
  watch: {
    dataConnections(dataConnections) {
      this.offlineUsers = this.users.filter(
        x => dataConnections.filter(y => y.peer === x.id).length < 1
      )
    }
  }
}
</script>
<style>
video {
  -webkit-transform: scaleX(-1);
  transform: scaleX(-1);
}

.cameraBoard {
  position: relative;
  height: 500px;
}

.invisible {
  height: 0;
}

.remoteView {
  position: absolute;
  max-width: 100%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}

.localView {
  position: absolute;
  max-width: 200px;
  bottom: 5%;
  left: 5%;
  z-index: 2;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}

.buttonsView {
  position: absolute;
  bottom: 7%;
  right: 5%;
}

.headline {
 font-size: 24px !important;
 line-height: 32px !important;
 font-weight: 400;
 letter-spacing: normal !important;
 font-family: Roboto, sans-serif !important;
 padding: 0 8px;
 height: 32px;
}
.mybtn {
 color: #fff;
 box-shadow: 0 3px 5px -1px rgba(0, 0, 0, 0.2),
   0 6px 10px 0 rgba(0, 0, 0, 0.14), 0 1px 18px 0 rgba(0, 0, 0, 0.12);
 height: 40px;
 width: 40px;
 border-radius: 50%;
 font-size: 13px;
 align-items: center;
 display: inline-flex;
 flex: 0 0 auto;
 font-size: 14px;
 justify-content: center;
 margin: 6px 8px;
 outline: 0;
 text-transform: uppercase;
 text-decoration: none;
 transition: 0.3s cubic-bezier(0.25, 0.8, 0.5, 1), color 1ms;
 position: relative;
 vertical-align: middle;
}
.mybtn:hover {
 opacity: 0.88;
}
.mybtn div {
 flex: 1 1 auto;
 margin: 0;
 height: 100%;
 align-items: center;
 border-radius: inherit;
 color: inherit;
 display: flex;
 flex: 1 0 auto;
 justify-content: center;
 position: relative;
 transition: 0.3s cubic-bezier(0.25, 0.8, 0.5, 1);
 white-space: nowrap;
 width: inherit;
}
</style>
