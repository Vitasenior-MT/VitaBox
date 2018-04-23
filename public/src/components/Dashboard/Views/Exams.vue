<template>
  <div class="row">
    <div class="col-md-12">
      <div class="card">
        <div class="content">
          <div class="row">
            <div class="col-md-2" v-for="btn in btnExams"  :key='btn.id'>
              <button v-tooltip.bottom="'Pecione em [OK] para iniciar.'" class="btn btn-block control-remote" type="button" :data-type="btn.type" v-on:click="bleExecExam">
                <h2><b :class="btn.icon"></b></h2>
                <h5>{{ btn.nome }}</h5>
              </button>
            </div>
          </div>
        </div>
        <div class="footer">
        </div>
      </div>
    </div>
    <div class="row" v-show="examEvent == 'bloodpressure'">
      <div class="col-md-12">
        <div class="col-md-8">
          <div class="card">
            <div class="header">
                <h4 class="title">Modo de Utilização</h4>
                <p class="category"></p>
            </div>
            <div class="content">
              <table class="table table-Striped">
                <thead>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <h4>
                        Coloque a bracelete no braço.
                        <br>
                        Ajuste a bracelete conforme mostrado na imagem.
                      </h4>
                    </td>
                    <td><img src='static/img/bloodpressure.png' alt=""></td>
                  </tr>
                  <tr>
                    <td>
                      <h4>Percione no botão para ligar <b class="ti-power-off"></b>.</h4>
                    </td>
                    <td>
                      <img src='static/img/bloodpressure.gif' alt="">
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <h4>Aguarde...</h4>
                    </td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="footer">
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <stats-card>
            <div :class="bloodpressureClass" class="icon-big text-center" slot="header">
              <i class="ti-stats-up"></i>
            </div>
            <div :class="bloodpressureClass" class="numbers" slot="content">
              <p>Máxima &nbsp;&nbsp;&nbsp;</p>
              {{dataPressArt.pressmax}} &nbsp;&nbsp;&nbsp;
            </div>
            <div class="stats" slot="footer">
            </div>
          </stats-card>
        </div>
        <div class="col-md-4">
          <stats-card>
            <div :class="bloodpressureClass" class="icon-big text-center" slot="header">
              <i class="ti-stats-down"></i>
            </div>
            <div :class="bloodpressureClass" class="numbers" slot="content">
              <p>Minima &nbsp;&nbsp;&nbsp;</p>
              {{dataPressArt.pressmin}} &nbsp;&nbsp;&nbsp;
            </div>
            <div class="stats" slot="footer">
            </div>
          </stats-card>
        </div>
        <div class="col-md-4">
          <stats-card>
            <div :class="bloodpressureClass" class="icon-big text-center" slot="header">
              <i class="ti-pulse"></i>
            </div>
            <div :class="bloodpressureClass" class="numbers" slot="content">
              <p>Pulso Minimo &nbsp;&nbsp;&nbsp;</p>
              {{dataPressArt.pulso}} &nbsp;&nbsp;&nbsp;
            </div>
            <div class="stats" slot="footer">
            </div>
          </stats-card>
        </div>
      </div>
    </div>
    <div class="row" v-show="examEvent == 'bodyscale'">
      <div class="col-md-12">
        <div class="col-md-8">
          <div class="card">
            <div class="header">
                <h4 class="title">Modo de Utilização</h4>
                <p class="category"></p>
            </div>
            <div class="content">
              <table class="table table-Striped">
                <thead>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <h4>
                      </h4>
                    </td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>
                      <h4></h4>
                    </td>
                    <td>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <h4>Aguarde...</h4>
                    </td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="footer">
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <stats-card>
            <div :class="bodyscaleClass" class="icon-big text-center" slot="header">
              <i class="fas fa-tachometer-alt"></i>
            </div>
            <div :class="bodyscaleClass" class="numbers" slot="content">
              <p>Peso &nbsp;&nbsp;&nbsp;</p>
              {{dataBodyScale.weight}} Kg &nbsp;&nbsp;&nbsp;
            </div>
            <div class="stats" slot="footer">
            </div>
          </stats-card>
        </div>
        <div class="col-md-4">
          <div class="card">
            <div class="header">
              <h3>Pesar</h3>
            </div>
            <div class="content">
              :class="bodyscaleClass" bodyscale
            </div>
            <div class="footer">
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="row" v-show="examEvent == 'bloodglucose'">
      <div class="col-md-12">
        <div class="col-md-8">
          <div class="card">
            <div class="header">
                <h4 class="title">Modo de Utilização</h4>
                <p class="category"></p>
            </div>
            <div class="content">
              <table class="table table-Striped">
                <thead>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <h4>
                      </h4>
                    </td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>
                      <h4></h4>
                    </td>
                    <td>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <h4>Aguarde...</h4>
                    </td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="footer">
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card">
            <div class="header">
              <h3>Medir a Glucose</h3>
            </div>
            <div class="content">
              :class="bloodglucoseClass" bloodglucose
            </div>
            <div class="footer">
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="row" v-show="examEvent == 'bodytemperature'">
      <div class="col-md-12">
        <div class="col-md-8">
          <div class="card">
            <div class="header">
              <h4 class="title">Modo de Utilização</h4>
              <p class="category"></p>
            </div>
            <div class="content">
              <table class="table table-Striped">
                <thead>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <h4>
                        Coloque o equipamento conforme mostrado na imagem.
                      </h4>
                    </td>
                    <td><img src='static/img/bodytemp.png' alt=""></td>
                  </tr>
                  <tr>
                    <td>
                      <h4>Percione no botão para ligar <b class="ti-power-off"></b>.</h4>
                    </td>
                    <td>
                      <img src='static/img/bodytemp.gif' alt="">
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <h4>Aguarde...</h4>
                    </td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="footer">
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <stats-card >
            <div :class="bodytemperatureClass" class="icon-big text-center" slot="header">
              <span v-show="this.battery < 15"><i class="fas fa-battery-empty"></i></span>
              <span v-show="this.battery >= 15 && this.battery < 40"><i class="fas fa-battery-quarter"></i></span>
              <span v-show="this.battery >= 40 && this.battery < 65"><i class="fas fa-battery-half"></i></span>
              <span v-show="this.battery >= 65 && this.battery < 90"><i class="fas fa-battery-three-quarters"></i></span>
              <span v-show="this.battery >= 90"><i class="fas fa-battery-full"></i></span>
            </div>
            <div :class="bodytemperatureClass" class="numbers" slot="content">
              <p>Bateria &nbsp;&nbsp;&nbsp;</p>
              {{battery}}% &nbsp;&nbsp;&nbsp;
            </div>
          </stats-card>
        </div>
        <div class="col-md-4">
          <stats-card>
            <div :class="bodytemperatureClass" class="icon-big text-center" slot="header">
              <i class="fas fa-thermometer"></i>
            </div>
            <div :class="bodytemperatureClass" class="numbers" slot="content">
              <p>Temperatura Corporal &nbsp;&nbsp;&nbsp;</p>
              {{tempCorp}}ºC &nbsp;&nbsp;&nbsp;
            </div>
            <div class="stats" slot="footer">
            </div>
          </stats-card>
        </div>
      </div>
    </div>
    <div class="row" v-show="examEvent == 'bodypulse'">
      <div class="col-md-12">
        <div class="col-md-8">
          <div class="card">
            <div class="header">
                <h4 class="title">Modo de Utilização</h4>
                <p class="category"></p>
            </div>
            <div class="content">
              <table class="table table-Striped">
                <thead>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <h4>
                        Coloque o dedo conforme apresentado na imagem.
                      </h4>
                    </td>
                    <td><img src='static/img/pulse.png' alt=""></td>
                  </tr>
                  <tr>
                    <td>
                      <h4>Percione no botão para ligar <b class="ti-power-off"></b>.</h4>
                    </td>
                      <td><img src='static/img/pulse.gif' alt=""></td>
                  </tr>
                  <tr>
                    <td>
                      <h4>Aguarde...</h4>
                    </td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="footer">
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <stats-card>
            <div :class="bodypulseClass" class="icon-big text-center" slot="header">
              <i class="fas fa-fire"></i>
            </div>
            <div :class="bodypulseClass" class="numbers" slot="content">
              <p>Oxigénio &nbsp;&nbsp;&nbsp;</p>
              {{spoVal}}% &nbsp;&nbsp;&nbsp;
            </div>
            <div class="stats" slot="footer">
            </div>
          </stats-card>
        </div>
        <div class="col-md-4">
          <stats-card>
            <div :class="bodypulseClass" class="icon-big text-center" slot="header">
              <i class="fas fa-heartbeat"></i>
            </div>
            <div :class="bodypulseClass" class="numbers" slot="content">
              <p>Pulso &nbsp;&nbsp;&nbsp;</p>
              {{pulseVal}} PPM &nbsp;&nbsp;&nbsp;
            </div>
            <div class="stats" slot="footer">
            </div>
          </stats-card>
        </div>
      </div>
    </div>
    <div id="loader-wrapper" v-if="execProcess">
      <div v-if="examEvent == 'bloodpressure'" id="loader-chart">
        <ChartGauge :id="dataPressArt.id"
          :typechartdonut="false"
          :chartid="dataPressArt.id"
          :valueChart="dataPressArt.val"
          :labelChart="''"
          :chartmax="dataPressArt.max"
          :symbol="''">
        </ChartGauge>
        <h4 class="text-center"><i class="fas fa-spinner fa-pulse fa-5x"></i></h4>
        <h1 class="text-center">Aguarde</h1>
      </div>
      <div v-else id="loader">
        <h4><i class="fas fa-spinner fa-pulse fa-10x"></i></h4>
        <h1>Aguarde</h1>
      </div>
    </div>
  </div>
</template>
<script>
import { EventBus } from '../../../event-bus.js'
import StatsCard from 'components/UIComponents/Cards/StatsCard.vue'
import ChartGauge from 'components/UIComponents/Charts/chartGaugeItem1.vue'
export default {
  components: {
    ChartGauge,
    StatsCard
  },
  data() {
    return {
      btnExams: [{
        nome: '',
        type: '',
        icon: ''
      }],
      dataPressArt: {
        // definição do ojecto para medir a pressão arterial
        id: 'pressArterial',
        val: 0,
        max: 100,
        pulso: 0,
        pressmax: 0,
        pressmin: 0
      },
      dataBodyScale: {
        weight: 0,
        bodyfat: 0,
        bonemass: 0,
        musclemass: 0,
        visceralfat: 0,
        water: 0,
        calories: 0
      },
      examEvent: '', // frag para mostrar o elemento selecionado
      canBeShown: true,
      battery: 0,
      tempCorp: 0,
      spoVal: 0,
      pulseVal: 0,
      execProcess: false,
      bodytemperatureClass: [],
      bodypulseClass: [],
      bloodpressureClass: [],
      bodyscaleClass: [],
      bloodglucoseClass: []
    }
  },
  sockets: {
    bleExecFimScale: function(data) {
      if (data.satus === true) {
        this.dataBodyScale = {
          weight: data.data.weight,
          bodyfat: data.data.bodyfat,
          bonemass: data.data.bonemass,
          musclemass: data.data.musclemass,
          visceralfat: data.data.visceralfat,
          water: data.data.water,
          calories: data.data.calories
        }
        this.bodyscaleClass.push('ajustinfo')
      } else {
        console.log('Receive error', data)
        this.$notifications.notify({
          message: '<h4>' + data.data + '</h4>',
          icon: 'ti-bell',
          horizontalAlign: 'right',
          verticalAlign: 'top',
          type: 'warning'
        })
        this.dataBodyScale = {
          weight: 0,
          bodyfat: 0,
          bonemass: 0,
          musclemass: 0,
          visceralfat: 0,
          water: 0,
          calories: 0
        }
      }
      this.execProcess = false
    },
    bleExecFimPulse: function(data) {
      // console.log('Pulse', data)
      if (data.satus === true) {
        this.spoVal = data.data.spo2
        this.pulseVal = data.data.pulse
        this.bodypulseClass.push('ajustinfo')
      } else {
        console.log('Receive error', data)
        this.$notifications.notify({
          message: '<h4>' + data.data + '</h4>',
          icon: 'ti-bell',
          horizontalAlign: 'right',
          verticalAlign: 'top',
          type: 'warning'
        })
        this.spoVal = 0
        this.pulseVal = 0
      }
      this.execProcess = false
    },
    /**
     * TODO: Recebe do socket a informação da bateria
     */
    bleMsgBattery: function(data) {
      if (data.satus === true) {
        this.battery = data.data
      } else {
        this.battery = 0
      }
    },
    /**
     * TODO: Recebe do socket a informação da temperatura corporal
     */
    bleExecFimTemp: function(data) {
      if (data.satus === true) {
        this.tempCorp = data.data
        this.bodytemperatureClass.push('ajustinfo')
      } else {
        console.log('Receive error', data)
        this.$notifications.notify({
          message: '<h4>' + data.data + '</h4>',
          icon: 'ti-bell',
          horizontalAlign: 'right',
          verticalAlign: 'top',
          type: 'warning'
        })
        this.tempCorp = 0
      }
      this.execProcess = false
    },
    /**
     * TODO: Recebe do socket as mensagens
     */
    bleMsg: function(data) {
      // console.log('BleMsg', data)
      if (data.satus === true) {
        this.$notifications.notify({
          message: '<h4>' + data.data + '</h4>',
          icon: 'ti-info',
          horizontalAlign: 'right',
          verticalAlign: 'top',
          type: 'success'
        })
      } else {
        console.log('Receive error', data)
        this.$notifications.notify({
          message: '<h4>' + data.data + '</h4>',
          icon: 'ti-bell',
          horizontalAlign: 'right',
          verticalAlign: 'top',
          type: 'warning'
        })
        this.execProcess = false
      }
    },
    /**
     * TODO: Recebe do socket os dasos da execução do processode medição da pressão arterial
     */
    bleExec: function(data) {
      if (data.satus === true) {
        var val = data.data
        // console.log('bleExec', data, val.replace(/\D/g, ''))
        if (val.length < 5) {
          this.dataPressArt.val = val.replace(/\D/g, '')
        }
      } else {
        console.log('Receive error', data)
        this.$notifications.notify({
          message: '<h4>' + data.data + '</h4>',
          icon: 'ti-bell',
          horizontalAlign: 'right',
          verticalAlign: 'top',
          type: 'warning'
        })
        this.execProcess = false
      }
    },
    /**
     * TODO: Recebe do socket os dados finais da medição
     */
    bleExecFimPress: function(data) {
      if (data.satus === true) {
        console.log('bleExecFim', data)
        var val = data.data.split('/')
        this.dataPressArt.val = 0
        this.dataPressArt.pressmax = val[1].replace(/\D/g, '') * 1
        this.dataPressArt.pressmin = val[2].replace(/\D/g, '') * 1
        this.dataPressArt.pulso = val[3].replace(/\D/g, '') * 1
        this.bloodpressureClass.push('ajustinfo')
      } else {
        console.log('Receive error', data)
        this.$notifications.notify({
          message: '<h4>' + data.data + '</h4>',
          icon: 'ti-bell',
          horizontalAlign: 'right',
          verticalAlign: 'top',
          type: 'warning'
        })
      }
      this.execProcess = false
    },
    /**
     * TODO: Recebe do socket os erros na execução do processo de medição da pressão arterial
     */
    bleError: function(data) {
      console.log("error", data)
      this.$notifications.notify({
        message: '<h4>' + data.data + '</h4>',
        icon: 'ti-close',
        horizontalAlign: 'right',
        verticalAlign: 'top',
        type: 'danger'
      })
      this.execProcess = false
    }
  },
  methods: {
    bleExecExam() {
      this.bodytemperatureClass = []
      this.bodypulseClass = []
      this.bloodpressureClass = []
      this.bodyscaleClass = []
      this.bloodglucoseClass = []
      this.execProcess = true
      this.dataBodyScale = {
        weight: 0,
        bodyfat: 0,
        bonemass: 0,
        musclemass: 0,
        visceralfat: 0,
        water: 0,
        calories: 0
      }
      this.dataPressArt.val = 0
      this.dataPressArt.pressmax = 0
      this.dataPressArt.pressmin = 0
      this.dataPressArt.pulso = 0
      this.battery = 0
      this.tempCorp = 0
      this.spoVal = 0
      this.pulseVal = 0
      let userid = '02d3468c-d8b7-4895-a678-71f2efa715dd'
      this.$http
        .get('/api/ble/' + this.examEvent.toLowerCase() + '/' + userid)
        .then(response => {
          console.log("Data", response.data)
          if (response.data.status === true) {
          } else {
            this.$notifications.notify({
              message: '<h4>' + response.data.data + '</h4>',
              icon: 'ti-bell',
              horizontalAlign: 'right',
              verticalAlign: 'top',
              type: 'warning'
            })
            this.execProcess = false
          }
        })
        .catch(error => {
          console.log('----> ', error)
          this.data = error
        })
    },
    /**
     * TODO: Metodo para controlar os eventos do comando remoto quando esta é a view ativa no momento
     */
    controlEventsBus() {
      var self = this
      /**
       * TODO: Monitorização dos eventos do controlo remoto
       */
      EventBus.$on('move-components', function(cmd) {
        if (!self.execProcess) {
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
              self.examEvent = EventBus.elementControl[EventBus.currentActiveRightComp].dataset.type.toLowerCase()
              break
            case 'left': // tecla para a esquerda
              EventBus.moveLeftRightInView(-1)
              self.examEvent = EventBus.elementControl[EventBus.currentActiveRightComp].dataset.type.toLowerCase()
              break
            default:
              break
          }
        }
      })
    }
  },
  created() {
    let btns = [
      {
        nome: 'Pressão Arterial',
        type: 'bloodpressure',
        icon: 'ti-heart-broken'
      }, {
        nome: 'Temperatura',
        type: 'bodyTemperature',
        icon: 'fas fa-thermometer-half'
      }, {
        nome: 'Pulsometro',
        type: 'bodyPulse',
        icon: 'ti-heart-broken'
      }, {
        nome: 'Pesar',
        type: 'bodyscale',
        icon: 'ti-dashboard'
      }, {
        nome: 'Glicemia',
        type: 'bloodglucose',
        icon: 'fas fa-chart-bar'
      }]
    this.btnExams = btns
    // Consulta o DOM HTML por todos os elemento pertencentes à class 'control-remote'
    this.controlEventsBus()
    // console.log('Remotes', EventBus.elementControl)
  },
  beforeCreate() {},
  /**
   * TODO: Destroi o evento das teclas do comando para esta view
   */
  beforeDestroy() {
    EventBus.$off('move-components')
  }
}
</script>
<style>
.ajustinfo {
  border-radius: 20px;
  border-width: 4px;
  border-style: solid;
  border-color: black;
  animation: blinker 3s linear infinite;
}
@keyframes blinker {
  0% {background-color: white;}
  50% {background-color: #F7931D;}
}
#loader-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;
  background-color: #000000;
  opacity: 0.6;
  filter: alpha(opacity=60); /* For IE8 and earlier */
}
#loader {
  display: block;
  position: relative;
  left: 50%;
  top: 50%;
  width: 30px;
  height: 30px;
  margin: -150px 0 0 -150px;
  z-index: 1500;
}
#loader-chart {
  display: block;
  position: relative;
  left: 50%;
  top: 50%;
  width: 600px;
  height: 600px;
  margin: -300px 0 0 -300px;
  z-index: 1500;
}
</style>
