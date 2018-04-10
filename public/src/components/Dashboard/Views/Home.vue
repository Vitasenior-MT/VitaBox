<template>
  <div class="row">
    <div class="col-md-12">
      <div class="card col-md-12">
        <div class="header">
          <h4 class="title">Teste consulta de valores</h4>
        </div>
        <div class="content col-md-12">
          <button class="btn control-remote" type="button" v-on:click="getToken">Request Token</button>
          <button class="btn control-remote" type="button" v-on:click="postSettings">Send Vitabox Settings</button>
          <button class="btn control-remote" type="button" v-on:click="postSensorData">Send Sensor Data</button>
          <button class="btn control-remote" type="button" v-on:click="getBoards">Get Boards</button>
          <button class="btn control-remote" type="button" v-on:click="getPatients">Get Patients</button>
          <button class="btn control-remote" type="button" v-on:click="getSettings">Get Settings</button>
        </div>
        <div class="row">
          <div class="col-sm-12">
            <pre>{{ data | json }}</pre>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { EventBus } from '../../../event-bus.js'
export default {
  data() {
    return {
      token: null,
      data: {
        debug: true
      }
    }
  },
  methods: {
    postSettings() {
      this.$http
        .post('/api/postSettings')
        .then(response => {
          console.log(response)
          this.data = response
        })
        .catch(error => {
          console.log('----> ', error)
          this.data = error
        })
    },
    postSensorData() {
      this.$http
        .post('/api/postSensorData')
        .then(response => {
          this.data = response
          console.log(response)
        })
        .catch(error => {
          this.data = error
          console.log(error)
        })
    },
    getToken() {
      this.$http
        .post('/api/requestToken')
        .then(response => {
          console.log(response)
          this.data = response
        })
        .catch(error => {
          this.data = error
          console.log(error)
        })
    },
    getBoards() {
      console.log(this.token)
      this.$http
        .get('/api/getBoards')
        .then(response => {
          console.log(response)
          this.data = response
        })
        .catch(error => {
          this.data = error
          console.log(error)
        })
    },
    getPatients() {
      this.$http
        .get('/api/getPatients')
        .then(response => {
          console.log(response)
          this.data = response
        })
        .catch(error => {
          this.data = error
          console.log(error)
        })
    },
    getSettings() {
      this.$http
        .get('/api/getSettings')
        .then(response => {
          console.log(response)
          this.data = response
        })
        .catch(error => {
          this.data = error
          console.log(error)
        })
    },
    controlEventsBus() {
      // var self = this
      EventBus.$on('move-components', function(cmd) {
        EventBus.elementControl = document.getElementsByClassName('control-remote')
        switch (cmd) {
          // evento do 'OK'
          case 'ok_btn':
            console.log("'Ok btn")
            EventBus.elementControl[EventBus.currentActiveRightComp].click()
            break
            // evento para sair para a sidebar
          case 'exit':
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
            console.log('if exit', cmd, EventBus.currentActiveRightComp)
            break
          case 'right': // tecla para a direita
            EventBus.moveLeftRightInView(1)
            break
          case 'left': // tecla para a esquerda
            EventBus.moveLeftRightInView(-1)
            break
          default:
            break
        }
      })
    }
  },
  created() {
    this.controlEventsBus()
    // console.log('Remotes', EventBus.elementControl)
  },
  beforeDestroy() {
    EventBus.$off('move-components')
  }
}
</script>
<style>
</style>
