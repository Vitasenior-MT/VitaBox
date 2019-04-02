<template>
  <div class="row">
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
          <video class="invisible" id="remoteVideo" autoplay playinline></video>
          <video class="invisible" id="localVideo" autoplay playinline></video>
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
</template>
<script>
import { EventBus } from '../../../event-bus.js'
import DefaultForm from 'components/UIComponents/Forms/defaultform.vue'
export default {
  components: {
    DefaultForm
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
        if (self.status === 2 && self.remotePeerID === mediaConnection.peer) {
          self.mediaConnection = mediaConnection
          self.mediaConnection.answer(self.streamToSend)
          self.status = 4
          self.message = ""
          self.listenMediaConnection()
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
      var self = this
      this.mediaConnection.on("stream", stream => {
        console.log('Stream   ---> ')
        console.log(stream)
        console.log(`Using video device: ${stream.getVideoTracks()[0].label}`);
        window.stream = stream
        let localView = document.getElementById("localVideo")
        localView.classList.remove('invisible')
        localView.classList.add('localView')
        localView.src = this.streamToShow
        if(window.URL) {
          localView.src = window.URL.createObjectURL(this.streamToShow)
        } else {
          localView.src = this.streamToShow
        }
        let remoteView = document.getElementById("remoteVideo")
        remoteView.classList.remove('invisible')
        remoteView.classList.add('remoteView')
        if(window.URL) {
          remoteView.src = window.URL.createObjectURL(stream)
        } else {
          remoteView.src = stream
        }
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
      var self = this
      navigator.getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia)
      try {
        this.streamToSend = await navigator.getUserMedia({ audio: true, video: true },
          localMediaStream => {
            self.streamToSend = localMediaStream
          },
          // callbackError
          err => { console.log("Error: " + err) })
        this.streamToShow = await navigator.getUserMedia({ audio: false, video: true },
          localMediaStream => {
            self.streamToShow = localMediaStream
            callback(true)
          },
          // callbackError
          err => { console.log("Error: " + err) })
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
      let remoteView = document.getElementById("remoteVideo")
      remoteView.src = null
      remoteView.classList.add('invisible')
      remoteView.classList.remove('remoteView')
      let localView = document.getElementById("localVideo")
      localView.src = null
      localView.classList.add('invisible')
      localView.classList.remove('localView')
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
    controlEventsBus() {
      var self = this
      if (self.warningCards.length > 0) {
        self.$refs.DefaultView.hide()
      }
      EventBus.$on('move-components', function(cmd) {
        EventBus.elementControl = document.getElementsByClassName('control-remote')
        if (EventBus.elementControl.length === 0) {
          self.$refs.DefaultView.setMsg(self.msg)
          self.$refs.DefaultView.show()
          EventBus.currentActiveRightComp = 0
          EventBus.firstRightEvent = true
          EventBus.elementControl = []
          EventBus.currentComponent = EventBus.sidebarName
          return
        }
        self.$refs.DefaultView.hide()
        switch (cmd) {
          // evento do 'OK'
          case 'ok_btn':
            // console.log("'Ok btn")
            EventBus.elementControl[EventBus.currentActiveRightComp].click()
            break
            // evento para sair para a sidebar
          case 'exit':
            EventBus.removeAudio()
            // remove o preenchimento
            EventBus.elementControl[EventBus.currentActiveRightComp].classList.remove('btn-fill')
            EventBus.elementControl[EventBus.currentActiveRightComp].blur()
            // atribui para que passe a seer novamento a primenra vez que entra nesta view
            EventBus.firstRightEvent = true
            // define como o elemento ativo seja o '0'
            EventBus.currentActiveRightComp = 0
            // desloca a div para o inicio
            EventBus.scrollScreen(EventBus.elementControl[EventBus.currentActiveRightComp])
            // define o elemento ativo coomo sendo a barra lateral
            EventBus.currentComponent = EventBus.sidebarName
            // console.log('if exit', cmd, EventBus.currentActiveRightComp)
            break
          case 'up':
            try {
              self.elem = EventBus.elementControl[EventBus.currentActiveRightComp]
              self.content = document.getElementsByClassName('container-data-sensors')[0]
              self.numberCol = parseInt((self.content.clientWidth / self.elem.clientWidth))
              self.movepos = EventBus.currentActiveRightComp - self.numberCol
              if (self.movepos < 0) {
                self.movepos += (EventBus.elementControl.length - 1)
                if (self.movepos === (EventBus.elementControl.length - 1) - self.numberCol) {
                  self.movepos += self.numberCol
                }
              }
              EventBus.elementControl[EventBus.currentActiveRightComp].classList.remove('btn-fill')
              EventBus.currentActiveRightComp = self.movepos
              self.elem = EventBus.elementControl[EventBus.currentActiveRightComp]
              self.elem.focus()
              self.elem.classList.add('btn-fill')
              EventBus.scrollScreen(self.elem)
              self.audioPlayer(EventBus.elementControl[EventBus.currentActiveRightComp].dataset)
            } catch (e) {
              console.log('error move up', e.toStrig())
            }
            break
          case 'down':
            try {
              self.elem = EventBus.elementControl[EventBus.currentActiveRightComp]
              self.content = document.getElementsByClassName('container-data-sensors')[0]
              self.numberCol = parseInt((self.content.clientWidth / self.elem.clientWidth))
              self.movepos = EventBus.currentActiveRightComp + self.numberCol
              if (self.movepos > (EventBus.elementControl.length - 1)) {
                self.movepos -= (EventBus.elementControl.length - 1)
                if (self.movepos === self.numberCol) {
                  self.movepos = 0
                }
              }
              EventBus.elementControl[EventBus.currentActiveRightComp].classList.remove('btn-fill')
              EventBus.currentActiveRightComp = self.movepos
              self.elem = EventBus.elementControl[EventBus.currentActiveRightComp]
              self.elem.focus()
              self.elem.classList.add('btn-fill')
              EventBus.scrollScreen(self.elem)
              self.audioPlayer(EventBus.elementControl[EventBus.currentActiveRightComp].dataset)
            } catch (e) {
              console.log('error move down', e.toStrig())
            }
            break
          case 'right': // tecla para a direita
            EventBus.moveLeftRightInElemts(1, 'btn-fill')
            self.audioPlayer(EventBus.elementControl[EventBus.currentActiveRightComp].dataset)
            break
          case 'left': // tecla para a esquerda
            if (cmd === 'left' && EventBus.currentActiveRightComp - 1 < 0) {
              return EventBus.$emit('move-components', 'exit')
            }
            EventBus.moveLeftRightInElemts(-1, 'btn-fill')
            self.audioPlayer(EventBus.elementControl[EventBus.currentActiveRightComp].dataset)
            break
          default:
            console.log("No key available")
            EventBus.currentActiveRightComp = 0
            break;
        }
      })
    }
  },
  mounted() {
    
  },
  created() {
    this.controlEventsBus()
    this.vitaboxAddress = "Something"
    this.getPeers()
  },
  beforeDestroy() {
    this.dataConnections.forEach(x => x.connection.close())
    if (this.mediaConnection) {
      this.mediaConnection.close()
      this.stopCamera()
    }
    this.peer.destroy()
    this.peer = null

    this.params = {}
    EventBus.$off('move-components')
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
