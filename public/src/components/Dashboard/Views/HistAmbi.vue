<template>
  <div class="row">
    <div class="row btnSensors">
      <div class="col-md-2" v-for="sensor in sensorList"  :key='sensor.id'>
        <div class="card clear-padding">
          <div class="content">
            <button v-tooltip.bottom="'Pessione em [OK] para selecionar o sensor.'" class="btn btn-block btn-info control-remote-sensors" type="button" :data-type="sensor.type" v-on:click="getAllDataSensor()">
                <h5><b class="fab fa-galactic-senate"></b> {{ sensor.name }}</h5>
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="row btnLocation">
      <div class="col-md-2" v-for="btn in btnLocation"  :key='btn.id'>
        <div class="card clear-padding">
          <div class="content">
            <button
              v-tooltip.bottom="'Pessione em [OK] para mostrar / esconder o histórico do sensor.'"
              class="btn btn-block btn-success control-remote"
              type="button"
              :data-id="btn.id"
              :data-select="'false'"
              :data-type="btn.type"
              v-on:click="hideShowLocationLine">
              <!-- <h2><b :class="btn.icon"></b></h2> -->
              <h5>{{ btn.nome }}</h5>
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="row clear-margin" v-show="defaultView == 'yes'">
      <div class="col-lg-12 btn btn-round btn-fill">
        <div class="row">
          <div class="col-md-12">
            <h4 class="text-center">
              {{defaultViewDescritivo}}
            </h4>
          </div>
        </div>
        <div class="row">
          <div class="col-md-12">
            <img src='static/img/logo_A.png' alt=''>
          </div>
        </div>
      </div>
    </div>
    <div class="row show-charts-history clear-margin" v-if="dataCharsExists">
      <div class="col-md-12 btn btn-round btn-fill">
        <div class="card">
          <div class="content">
            <chart-line
              :id="'lineChartID'"
              :lineChartId="'lineChartID'"
              :chartTitle="''"
              :defSecoundScale="''"
              :dataChart="chartData"
              :callbackindex="hideShowItem" >
            </chart-line>
          </div>
        </div>
      </div>
    </div>
    <div id="loader-wrapper" v-show="execProcess">
      <div id="loader">
        <h4 class="text-center">
          <img src='static/img/load3_A.gif' alt=''>
        </h4>
        <h1 class="text-center">Aguarde</h1>
      </div>
    </div>
  </div>
</template>
<script>
import { EventBus } from '../../../event-bus.js'
import ChartLine from 'components/UIComponents/Charts/chartLine.vue'
export default {
  components: {
    ChartLine
  },
  data() {
    return {
      msgUser: 'Selecione e pressione me [OK] para visualizar o histórico do sensor.',
      msgExit: 'Pressione para a direita para selecionar o sensor.',
      defaultViewDescritivo: 'Pressione para a direita para selecionar o sensor.',
      defaultView: 'yes',
      classEvent: 'control-remote-sensors',
      posSensorSelected: -1,
      dataCharsExists: false,
      sensorList: [],
      sensorType: '',
      hideShowItem: 0,
      chartData: {
        data: {
          labels: [],
          datasets: []
        }
      },
      btnLocation: []
    }
  },
  sockets: {},
  methods: {
    hideShowLocationLine() {
      this.hideShowItem = -1
      setTimeout(() => {
        let dataIdBtn = EventBus.elementControl[EventBus.currentActiveRightComp].dataset.id
        let btnSelt = EventBus.elementControl[EventBus.currentActiveRightComp].dataset.select
        if (btnSelt === 'false') {
          EventBus.elementControl[EventBus.currentActiveRightComp].classList.add("btn-selected")
          // EventBus.elementControl[EventBus.currentActiveRightComp].classList.remove('btn-success')
          EventBus.elementControl[EventBus.currentActiveRightComp].setAttribute('data-select', 'true')
        } else {
          EventBus.elementControl[EventBus.currentActiveRightComp].classList.remove("btn-selected")
          // EventBus.elementControl[EventBus.currentActiveRightComp].classList.add('btn-success')
          EventBus.elementControl[EventBus.currentActiveRightComp].setAttribute('data-select', 'false')
        }
        this.hideShowItem = dataIdBtn
        document.getElementsByClassName('show-charts-history')[0].scrollIntoView(false)
      }, 10);
    },
    getAllDataSensor() {
      this.sensorType = EventBus.elementControl[EventBus.currentActiveRightComp].dataset.type
      this.posSensorSelected = EventBus.currentActiveRightComp
      // let self = this
      // console.log('Teste ok list', this.sensorType)
      this.$http
        .get('/api/raqsensor/getdata/' + this.sensorType)
        .then(response => {
          if (response.data.status === true) {
            let dataArray = response.data.data
            this.chartData = {
              data: {
                labels: [],
                datasets: []
              }
            }
            for (let index = 0; index < dataArray.length; index++) {
              let color = EventBus.getRandomColor()
              if (this.chartData.data.labels.length < dataArray[index].time.length) {
                this.chartData.data.labels = (function() {
                  let arrTime = [];
                  for (let i = 0; i < dataArray[index].time.length; i++) {
                    arrTime.push(EventBus.smallDateFormat(dataArray[index].time[i]))
                  }
                  return arrTime
                })()
              }
              this.chartData.data.datasets.push({
                label: dataArray[index].location,
                borderColor: color,
                showInLegend: true,
                type: "line",
                yAxisID: "y-axis-0",
                pointBackgroundColor: color,
                backgroundColor: 'rgba(0, 0, 0, 0)',
                data: dataArray[index].value
              })
              this.btnLocation.push({
                id: index,
                type: dataArray[index].location,
                nome: dataArray[index].location
              })
            }
            this.dataCharsExists = true
            this.classEvent = 'control-remote'

            setTimeout(() => {
              EventBus.elementControl = document.getElementsByClassName(this.classEvent)
              EventBus.currentActiveRightComp = 0
              // ativa o novo elemento adiconando a class que simboliza o elemento activo
              let elem = EventBus.elementControl[EventBus.currentActiveRightComp]
              elem.focus()
              elem.classList.add('btn-fill')
              elem.scrollIntoView(false)
              document.getElementsByClassName('show-charts-history')[0].scrollIntoView(false)
            }, 10)
          } else {
            this.$notifications.notify({
              message: '<h4>' + response.data.data + '</h4>',
              icon: 'ti-bell',
              horizontalAlign: 'right',
              verticalAlign: 'top',
              type: 'warning'
            })
            this.execProcess = false
            this.defaultViewDescritivo = this.msgExam
            this.defaultView = 'yes'
          }
        })
        .catch(error => {
          console.log(error)
        })
    },
    /**
     * TODO: Limpa todas as variaveis que contenham valores que são apresentados na pagina
     */
    resetValues() {
      this.chartData = {
        data: {
          labels: [],
          datasets: []
        }
      }
      this.dataCharsExists = false
      this.hideShowItem = -1
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
          EventBus.elementControl = document.getElementsByClassName(self.classEvent)
          switch (cmd) {
            // evento do 'OK'
            case 'ok_btn':
              EventBus.elementControl[EventBus.currentActiveRightComp].classList.add('on-shadow')
              EventBus.elementControl[EventBus.currentActiveRightComp].click()
              self.defaultView = 'no'
              self.defaultViewDescritivo = ''
              if (!self.posSensorSelected >= 0) {
                document.getElementsByClassName('btnLocation')[0].scrollIntoView(false)
              }
              break
            // evento para sair para a sidebar ou para a lista anterior
            case 'exit':
              // iniicializa a variavel para selecionar a lsta do user
              self.classEvent = 'control-remote-sensors'
              // se existir um user selecionado é porque se está na lista dos equipamentos
              if (self.posSensorSelected >= 0) {
                // Constroi a lista com os elementos da class dos users
                EventBus.elementControl = document.getElementsByClassName(self.classEvent)
                // Atualiza para elemento anteriormente ativo
                EventBus.currentActiveRightComp = self.posSensorSelected
                // limpa a variavel para saber que se voltar a carregar para sair e voltar para a barra lateral.
                self.posSensorSelected = -1
                let elem = EventBus.elementControl[EventBus.currentActiveRightComp]
                elem.focus()
                elem.classList.add('btn-fill')
              } else {
                // remove o preenchimento
                EventBus.elementControl[EventBus.currentActiveRightComp].classList.remove('btn-fill')
                EventBus.elementControl[EventBus.currentActiveRightComp].classList.remove('on-shadow')
                EventBus.elementControl[EventBus.currentActiveRightComp].blur()
                // atribui para que passe a ser novamento a primenra vez que entra nesta view
                EventBus.firstRightEvent = true
                // define como o elemento ativo seja o '0'
                EventBus.currentActiveRightComp = 0
                // define o elemento ativo coomo sendo a barra lateral
                EventBus.currentComponent = EventBus.sidebarName
                self.defaultView = 'yes'
                self.defaultViewDescritivo = self.msgExit
                return
              }
              // desloca a div para o inicio
              document.getElementsByClassName('btnSensors')[0].scrollIntoView(false)
              // limpa a lisa dos botões disponiveis para o user
              self.btnLocation = []
              self.resetValues()
              self.defaultView = 'yes'
              self.defaultViewDescritivo = self.msgUser
              console.log('if exit', cmd, EventBus.currentActiveRightComp)
              break
            case 'right': // tecla para a direita
              EventBus.elementControl[EventBus.currentActiveRightComp].classList.remove('on-shadow')
              if (self.posSensorSelected >= 0) {
                document.getElementsByClassName('btnLocation')[0].scrollIntoView(false)
              } else {
                document.getElementsByClassName('btnSensors')[0].scrollIntoView(false)
              }
              EventBus.moveLeftRightInView(1)
              if (self.posSensorSelected >= 0) {
              } else {
                self.defaultView = 'yes'
                self.defaultViewDescritivo = self.msgUser
              }
              break
            case 'left': // tecla para a esquerda
              EventBus.elementControl[EventBus.currentActiveRightComp].classList.remove('on-shadow')
              if (EventBus.currentActiveRightComp === 0 && cmd === 'left') {
                // estamos na lista dos exames
                if (self.posSensorSelected >= 0) {
                  // iniicializa a variavel para selecionar a lsta do user
                  self.classEvent = 'control-remote-sensors'
                  // Constroi a lista com os elementos da class dos users
                  EventBus.elementControl = document.getElementsByClassName(self.classEvent)
                  // Atualiza para elemento anteriormente ativo
                  EventBus.currentActiveRightComp = self.posSensorSelected
                  // limpa a variavel para saber que se voltar a carregar
                  self.posSensorSelected = -1
                  // desloca a div para o inicio
                  if (self.posSensorSelected >= 0) {
                    document.getElementsByClassName('btnLocation')[0].scrollIntoView(false)
                  } else {
                    document.getElementsByClassName('btnSensors')[0].scrollIntoView(false)
                    self.defaultView = 'yes'
                    self.defaultViewDescritivo = self.msgUser
                  }
                  // limpa a lisa dos botões disponiveis para o user
                  self.btnLocation = []
                  self.resetValues()

                  // estamos na lista dos users
                } else {
                  EventBus.moveLeftRightInView(-1)
                  self.defaultView = 'yes'
                  self.defaultViewDescritivo = self.msgExit
                }
              } else {
                EventBus.moveLeftRightInView(-1)
              }
              break
            default:
              break
          }
        }
      })
    }
  },
  watch: {
    defaultView: function(value) {
      if (value === 'yes') {
        this.resetValues()
      }
    }
  },
  created() {
    this.controlEventsBus()
  },
  beforeCreate() {
    this.$http
      .get('/api/sensor/getDistictAll')
      .then(response => {
        let data = response.data.data
        for (var index in data) {
          this.sensorList.push({
            name: data[index],
            type: data[index],
            id: index
          })
        }
      })
      .catch(error => {
        console.log(error)
      })
  },
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
  border-color: #f7931d;
  background-color: white;
  animation: blinker 3s linear infinite;
}

.ajustinfo div, .ajustinfo div p, .ajustinfo p {
  background-color: transparent;
}

@keyframes blinker {
  0% {
    background-color: white;
  }
  50% {
    background-color: #f05a28;
  }
}
#loader-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;
  background-color: #000000;
  opacity: 0.5;
  filter: alpha(opacity=50); /* For IE8 and earlier */
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
.clear-margin {
  margin: 0 !important;
}
.clear-padding > div {
  padding: 0 !important;
}
.clear-padding {
  border-radius: 20px !important;
}
.btnSensors .btn-fill, .btnLocation .btn-fill {
  box-shadow: 3px 3px 10px black;
}
.on-shadow {
  box-shadow: 3px 3px 10px black inset;
}
body {
  overflow-x: hidden;
}
.img-fit {
  width: 100%;
  height: auto;
}
.text-div-wrap {
  white-space: pre-line;
}
.btn-selected {
  color: black !important;
  text-decoration: line-through !important;
  font-weight: bold !important;
}
</style>
