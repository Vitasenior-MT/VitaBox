<template>
  <modal
    name="videocall"
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
    <v-card>
      <v-card-title class="headline grey lighten-2" primary-title>
        <span>Video Call</span>
      </v-card-title>
      <v-card-text class="cameraBoard">
        <div v-if="status!==4">
          <p class="px-2 headline primary_d--text" style="height:32px;">{{message}}</p>
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
  </modal>
</template>
<script>
import { EventBus } from '../../../event-bus.js'
export default {
  name: 'VideoCall',
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
      vitaboxId: null,
      vitaboxToken: null,
      vitaboxAddress: null,
      streamToSend: null,
      streamToShow: null,
      peer: null,
      remotePeerID: null,
      mediaConnection: null,
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
    // this.vitaboxAddress = "Something";
    // this.vitaboxId = "1df9dabd-b22d-4bb8-b205-548a42a88ba8";
    // this.vitaboxToken ="eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjFkZjlkYWJkLWIyMmQtNGJiOC1iMjA1LTU0OGE0MmE4OGJhOCIsInJvbGUiOiJWaXRhYm94IiwiaWF0IjoxNTUyNDA0NTk2LCJleHAiOjE1NTI0MzMzOTZ9.gV2i6BqdmVePGiR8XjL4MNIfa5EfLcHq0-rChh2xkS93J6pnrzcGQx8u20uLbi0naC8C_1okAvDN6aOqN8Mk6Tuz2xW3AWfFP7He533ll5lrEPaOPa9jyrNPq7_d3B1SvcR0-elWa92l3CQRx97WQzbwacs3becsPhw0LnAd9DP7J4UdcpgERT4xISrq01w0HGxN2ih3GtLTe5kSoAfa9vsVPmWZQbK-8dZTuYfC7Q1U_4N8iRI5s6TnSO4Wl1iENi_ysRZKQpmpf896MFDiMIR7o1_JcdQ-qVgVhH3MvRU0d83Q0oIYvWzjCKaq90GaQybdYuR2rpnPZ6QkribipA";
    this.getPeers();
  },
  sockets: {
  },
  methods: {
    getPeers() {
      this.$http
      .get('/api/connectServer/getUsers')
      .then(response => {
        console.log(response.data.data)
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
      /* this.$http.get(
          "http://192.168.161.153:8080/vitabox/" + this.vitaboxId + "/user",
          { headers: { Authorization: this.vitaboxToken } }
        )
        .then(res => {
          this.users = this.offlineUsers = res.data.users.concat(
            res.data.doctors
          );
          this.inititatePeer();
        }).catch(err => {
          console.log(err.data);
        });*/
    },
    inititatePeer() {
      this.peer = Peer(this.vitaboxId, {
        key: "8dnMsRvmGdz3fPG8RYO8muaUfQ2Iy1lE",
        token: this.vitaboxToken,
        host:
          process.env.NODE_ENV === "production"
            ? "vitasenior-peer-test.eu-gb.mybluemix.net"
            : "192.168.161.119",
        port: process.env.NODE_ENV === "production" ? "443" : "8808",
        secure: process.env.NODE_ENV === "production" ? true : false,
        debug: 3
      });

      this.listenPeerEvent();
    },
    listenPeerEvent() {
      this.peer.on("call", mediaConnection => {
        if (this.status === 2 && this.remotePeerID === mediaConnection.peer) {
          this.mediaConnection = mediaConnection;
          this.mediaConnection.answer(this.streamToSend);
          this.status = 4;
          this.message = "";
          this.listenMediaConnection();
        } else {
          this.dataConnections.forEach(x => {
            if (x.peer === mediaConnection.peer)
              x.connection.send({ type: "unauthorized" });
          });
        }
      });
      this.peer.on("connection", dataConnection => {
        console.log("peer connected");
        let user = this.users.find(x => x.id === dataConnection.peer);
        this.listenDataConnection(dataConnection, user);
      });
      this.peer.on("error", error => {
        console.log("peer error: ", error.message);
      });
      // this.peer.on("disconnected", () => {
      //   setTimeout(this.peer.connect(this.vitaboxId), 30000);
      // });
      this.status = 1;
      this.message = "";
    },
    startConnection(connection) {
      if (this.status === 1) {
        this.status = 2;
        this.message = "waiting...";
        this.remotePeerID = connection.peer;
        connection.send({
          type: "call",
          username: this.vitaboxAddress
        });
        this.startCallSound();
      } else this.message = "You're in another call";
    },
    acceptConnection() {
      this.stopCallSound();
      this.status = 2;
      this.message = "waiting...";
      this.startCamera().then(success => {
        if (success)
          this.dataConnections.forEach(x => {
            if (x.peer === this.remotePeerID)
              x.connection.send({ type: "accept" });
          });
        else {
          this.dataConnections.forEach(x => {
            if (x.peer === this.remotePeerID)
              x.connection.send({
                type: "unable",
                message: "error starting the WebCam"
              });
          });
          this.status = 1;
          this.message = "error starting the WebCam";
        }
      });
    },
    rejectConnection() {
      this.stopCallSound();
      this.dataConnections.forEach(x => {
        if (x.peer === this.remotePeerID) x.connection.send({ type: "reject" });
      });
      this.status = 1;
      this.message = "";
    },
    cancelConnection() {
      this.stopCallSound();
      this.dataConnections.forEach(x => {
        if (x.peer === this.remotePeerID) x.connection.send({ type: "cancel" });
      });
      this.status = 1;
      this.message = "";
    },
    listenDataConnection(dataConnection, user) {
      dataConnection.on("data", data => {
        switch (data.type) {
          case "call":
            if (this.status === 1) {
              this.remotePeerID = user.id;
              this.status = 3;
              this.message = user.name + " is calling";
              this.startCallSound();
            } else {
              dataConnection.send({ type: "occupied" });
            }
            break;
          case "accept":
            this.startCamera().then(success => {
              if (success) {
                this.stopCallSound();
                this.mediaConnection = this.peer.call(
                  this.remotePeerID,
                  this.streamToSend
                );
                this.status = 4;
                this.message = "";
                this.listenMediaConnection();
              } else {
                this.status = 1;
                this.message = "error starting the WebCam";
                dataConnection.send({
                  type: "unable",
                  message: "error starting the WebCam"
                });
              }
            });
            break;
          case "reject":
            this.stopCallSound();
            this.status = 1;
            this.message = "the call was rejected";
            break;
          case "occupied":
            this.stopCallSound();
            this.status = 1;
            this.message = "the user is occupied";
            break;
          case "unable":
            this.stopCallSound();
            this.status = 1;
            this.message = "unable to connect: " + data.message;
            break;
          case "unauthorized":
            this.status = 1;
            this.message = "access not allowed";
            break;
          case "cancel":
            this.stopCallSound();
            this.status = 1;
            this.message = "connection canceled";
            break;
        }
      });
      dataConnection.on("error", err => {
        console.log("dataConnection error: ", err);
      });
      dataConnection.on("close", () => {
        this.dataConnections.splice(
          this.dataConnections.map(x => x.peer).indexOf(user.id),
          1
        );
      });

      console.log(user);
      this.dataConnections.push({
        connection: dataConnection,
        peer: user.id,
        name: user.name
      });
      console.log(this.dataConnections);
    },
    listenMediaConnection() {
      this.mediaConnection.on("stream", stream => {
        this.$refs.localVideo.className = "localView";
        this.$refs.localVideo.srcObject = this.streamToShow;
        this.$refs.remoteVideo.className = "remoteView";
        this.$refs.remoteVideo.srcObject = stream;
      });
      this.mediaConnection.on("close", () => {
        this.stopCamera();
        this.status = 1;
        this.message = "Call finished";
      });
      this.mediaConnection.on("error", err => {
        console.log("mediaConnection error: ", err);
        this.stopConnection();
      });
    },
    stopConnection() {
      this.mediaConnection.close();
      this.stopCamera();
      this.status = 1;
      this.message = "Call finished";
    },
    async startCamera() {
      try {
        this.streamToSend = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: { facingMode: "user" }
        });
        this.streamToShow = await navigator.mediaDevices.getUserMedia({
          audio: false,
          video: { facingMode: "user" }
        });
        return 1;
      } catch (e) {
        return 0;
      }
    },
    stopCamera() {
      if (this.streamToSend)
        this.streamToSend.getTracks().forEach(track => track.stop());
      if (this.streamToShow)
        this.streamToShow.getTracks().forEach(track => track.stop());
      if (this.$refs.remoteVideo.srcObject) {
        this.$refs.remoteVideo.srcObject = null;
        this.$refs.remoteVideo.className = "invisible";
      }
      if (this.$refs.localVideo.srcObject) {
        this.$refs.localVideo.srcObject = null;
        this.$refs.localVideo.className = "invisible";
      }
    },
    startCallSound() {
      let ring = new Audio("/static/owl.mp3");
      this.ringing = setInterval(() => {
        ring.play();
      }, 2000);
    },
    stopCallSound() {
      clearInterval(this.ringing);
    },
    closeWhileConnection() {
      this.warningDialog = false;
      this.stopConnection();
      this.$emit("close");
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
      this.$socket.emit('requestWifiStatus')
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
      this.dataConnections.forEach(x => x.connection.close());
      if (this.mediaConnection) {
        this.mediaConnection.close();
        this.stopCamera();
      }
      this.peer.destroy();
      this.peer = null;
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
  },
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
</style>
