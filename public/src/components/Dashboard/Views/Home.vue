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
      },
      elementControl: []
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
      var self = this
      EventBus.$on('move-components', function(cmd) {
        switch (cmd) {
          // evento do 'OK'
          case 'ok_btn':
            console.log("'Ok btn")
            self.elementControl[EventBus.currentActiveRightComp].click()
            break
            // evento para sair para a sidebar
          case 'exit':
            // remove o preenchimento
            self.elementControl[EventBus.currentActiveRightComp].classList.remove('btn-fill')
            self.elementControl[EventBus.currentActiveRightComp].blur()
            // atribui para que passe a seer novamento a primenra vez que entra nesta view
            EventBus.firstRightEvent = true
            // define como o elemento ativo seja o '0'
            EventBus.currentActiveRightComp = 0
            // desloca a div para o inicio
            EventBus.scrollScreen(self.elementControl[EventBus.currentActiveRightComp])
            // define o elemento ativo coomo sendo a barra lateral
            EventBus.currentComponent = EventBus.sidebarName
            console.log('if exit', cmd, EventBus.currentActiveRightComp)
            break
          case 1:   // tecla para a direita
          case -1:  // tecla para a esquerda
            // primeira vez que se entra nesta view
            if (EventBus.firstRightEvent) {
              cmd = 0
              EventBus.firstRightEvent = false
            }
            // remove a class que sinboliza o elemento ativo
            self.elementControl[EventBus.currentActiveRightComp].classList.remove('btn-fill')
            // Actualiza a variavel de controlo do elemento activo
            EventBus.currentActiveRightComp += cmd
            // verifica se chegou ao fim do array se sim volta ao principio
            if (EventBus.currentActiveRightComp >= self.elementControl.length) {
              EventBus.currentActiveRightComp = 0
            }
            // verifica se estou na posição '0' e se foi carregado para a esquerda
            // se sim é para sair desta view e ativar a sidebar
            if (EventBus.currentActiveRightComp <= -1 && cmd === -1) {
              self.elementControl[EventBus.currentActiveRightComp].blur()
              EventBus.firstRightEvent = true
              EventBus.currentActiveRightComp = 0
              console.log('if', cmd, EventBus.currentActiveRightComp)
              return
            }
            // ativa o novo elemento adiconando a class que simboliza o elemento activo
            let elem = self.elementControl[EventBus.currentActiveRightComp]
            elem.focus()
            elem.classList.add('btn-fill')
            EventBus.scrollScreen(elem)
            break;
          default:
            break
        }
      })
    }
  },
  created() {
    this.elementControl = document.getElementsByClassName('control-remote')
    this.controlEventsBus()
    console.log('Remotes', this.elementControl)
  },
  beforeDestroy() {
    EventBus.$off('move-components')
  }
}
</script>
<style>
</style>
