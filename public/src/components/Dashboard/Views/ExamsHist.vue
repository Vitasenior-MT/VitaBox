<template>
  <div class="row">
    <div class="row btnUsers">
      <div class="col-md-3" v-for="patient in patientsList"  :key='patient.id'>
        <div class="card clear-padding">
          <div class="content">
            <button v-tooltip.bottom="'Pessione em [OK] para selecionar o utilizador.'" class="btn btn-block btn-info control-remote-patient" type="button" :data-id="patient.id" v-on:click="bleGetListExam(this)">
                <h5><b class="ti-user"> {{ patient.name }}</b></h5>
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="row btnsExams">
      <div class="col-md-2" v-for="btn in btnExams"  :key='btn.id'>
        <div class="card clear-padding">
          <div class="content">
            <button
              v-tooltip.bottom="'Pessione em [OK] para visualizar o histórico.'"
              class="btn btn-block btn-success control-remote"
              type="button"
              :data-examname="btn.nome"
              :data-type="btn.type"
              :data-addrmac="btn.macAddr"
              v-on:click="bleGetHistoryExam">
              <h5><b :class="btn.icon"></b></h5>
              {{ btn.nome }}
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="row" v-show="defaultView == 'yes'">
      <div class="col-lg-12 btn btn-round btn-fill">
        <div class="row">
          <h4 class="text-center">
            Selecione o exame e pressione em <b>[OK]</b> para visualizar o histórico.
          </h4>
        </div>
        <div class="row">
          <img src='static/img/logo_A.gif' alt=''>
        </div>
      </div>
    </div>
    <div class="row show-charts-history" v-show="dataCharsExists">
      <div class="col-md-12 btn btn-round btn-fill">
        <div class="row">
          <div class="col-md-12">
            <h3 style="margin-button: 4px; margin-top: 0;"><u>{{this.chartsBarAllData.nameExam}}</u></h3>
          </div>
        </div>
        <card-chart-history-bar :dataCharts="chartsBarAllData.dataCharts"></card-chart-history-bar>
        <div class="row">
          <div class="col-md-12">
            <h5 style="margin: 0px;">
              Ultima execução: &nbsp; <i class="ti-calendar"></i> &nbsp; {{this.chartsBarAllData.lastUpdate}}
            </h5>
          </div>
        </div>
        <hr>
        <div class="row">
          <div class="col-md-12">
            <h3 style="margin: 0px;">
              Histórico
            </h3>
          </div>
        </div>
        <card-chart-history-line :dataCharts="chartsLineAllData" ></card-chart-history-line>
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
import CardChartHistoryBar from 'components/UIComponents/Cards/CardHistoryBarChart.vue'
import CardChartHistoryLine from 'components/UIComponents/Cards/CardHistoryLineChart.vue'
export default {
  components: {
    CardChartHistoryBar,
    CardChartHistoryLine
  },
  data() {
    return {
      defaultView: 'no',
      dataCharsExists: false,
      chartsBarAllData: {},
      chartsLineAllData: {
        sizeArr: 1,
        dataSets: []
      },
      classEvent: 'control-remote-patient',
      posPatientSelected: -1,
      patientsList: [],
      patientId: '',
      btnExams: [],
      examMac: '',
      execProcess: false,
      bodytemperatureClass: [],
      bodypulseClass: [],
      bandfitnessClass: [],
      bloodpressureClass: [],
      bodyscaleClass: [],
      bloodglucoseClass: [],
      btns: [
        {
          nome: 'Pressão Arterial',
          type: 'bloodpressure',
          icon: 'ti-heart-broken',
          id: 'bloodpressure-0',
          macAddr: ''
        },
        {
          nome: 'Temperatura',
          type: 'bodytemperature',
          icon: 'fas fa-thermometer-half',
          id: 'bodytemperature-1',
          macAddr: ''
        },
        {
          nome: 'Pulsometro',
          type: 'bodypulse',
          icon: 'ti-heart-broken',
          id: 'bodypulse-2',
          macAddr: ''
        },
        {
          nome: 'Pesar',
          type: 'bodyscale',
          icon: 'ti-dashboard',
          id: 'bodyscale-3',
          macAddr: ''
        },
        {
          nome: 'Glicemia',
          type: 'bloodglucose',
          icon: 'fas fa-chart-bar',
          id: 'bloodglucose-4',
          macAddr: ''
        },
        {
          nome: 'Banda Fitness',
          type: 'bandfitness',
          icon: 'far fa-compass',
          id: 'bandfitness-5',
          macAddr: ''
        }
      ]
    }
  },
  sockets: {},
  methods: {
    bleGetListExam(btnPatient) {
      this.patientId = EventBus.elementControl[EventBus.currentActiveRightComp].dataset.id
      this.posPatientSelected = EventBus.currentActiveRightComp
      this.$http
        .get('/api/patient/exames/' + this.patientId)
        .then(response => {
          if (response.data.status === true) {
            let devacesArray = response.data.data
            for (let index = 0; index < devacesArray.length; index++) {
              let btnopt = ''
              switch (devacesArray[index].device) {
                case 'bloodpressure':
                  this.btns[0].macAddr = devacesArray[index].mac_addr
                  btnopt = this.btns[0]
                  break
                case 'bodytemperature':
                  this.btns[1].macAddr = devacesArray[index].mac_addr
                  btnopt = this.btns[1]
                  break
                case 'bodypulse':
                  this.btns[2].macAddr = devacesArray[index].mac_addr
                  btnopt = this.btns[2]
                  break
                case 'bodyscale':
                  this.btns[3].macAddr = devacesArray[index].mac_addr
                  btnopt = this.btns[3]
                  break
                case 'bloodglucose':
                  this.btns[4].macAddr = devacesArray[index].mac_addr
                  btnopt = this.btns[4]
                  break
                case 'bandfitness':
                  this.btns[5].macAddr = devacesArray[index].mac_addr
                  btnopt = this.btns[5]
                  break
                default:
                  break
              }
              if (btnopt !== '') {
                this.btnExams.push(btnopt)
              }
            }
            this.classEvent = 'control-remote'
            setTimeout(() => {
              EventBus.elementControl = document.getElementsByClassName(this.classEvent)
              EventBus.currentActiveRightComp = 0
              // ativa o novo elemento adiconando a class que simboliza o elemento activo
              let elem = EventBus.elementControl[EventBus.currentActiveRightComp]
              elem.focus()
              elem.classList.add('btn-fill')
              // EventBus.scrollScreen(elem)
              elem.scrollIntoView(false)
            }, 10)
          } else {
            console.log('erro', response.data)
          }
        })
        .catch(error => {
          console.log(error)
        })
    },
    bleGetHistoryExam() {
      this.defaultView = 'yes'
      this.execProcess = true
      let examMac = EventBus.elementControl[EventBus.currentActiveRightComp].dataset.addrmac
      let examNameDes = EventBus.elementControl[EventBus.currentActiveRightComp].dataset.examname
      this.$http
        .get('/api/sensorsble/' + this.patientId + '-' + examMac)
        .then(response => {
          if (response.data.status === true) {
            let dataIerat = response.data.data.values
            this.chartsBarAllData = {
              lastUpdate: EventBus.dateFormat(dataIerat[0].value[dataIerat[0].value.length - 1].time),
              nameExam: examNameDes,
              dataCharts: []
            };

            for (let index = 0; index < dataIerat.length; index++) {
              this.chartsBarAllData.dataCharts.push({
                key: 'chartBar-' + index,
                dataBar: {
                  x: dataIerat[index].sensortype,
                  y: dataIerat[index].value[dataIerat[0].value.length - 1].value
                }
              });
              this.chartsLineAllData.dataSets.push({
                title: dataIerat[index].sensortype,
                label: [],
                data: []
              })
              for (let i = 0; i < dataIerat[index].value.length; i++) {
                this.chartsLineAllData.dataSets[index].label.push(EventBus.dateFormat(dataIerat[index].value[i].time))
                this.chartsLineAllData.dataSets[index].data.push(dataIerat[index].value[i].value);
              }
            }

            this.chartsLineAllData.sizeArr = this.chartsLineAllData.dataSets.length
            console.log("AAA", this.chartsLineAllData)
            this.dataCharsExists = true
            this.execProcess = false
            this.defaultView = 'no'
            document.getElementsByClassName('show-charts-history')[0].scrollIntoView(false)
          } else {
            this.$notifications.notify({
              message: '<h4>' + response.data.data + '</h4>',
              icon: 'ti-bell',
              horizontalAlign: 'right',
              verticalAlign: 'top',
              type: 'warning'
            })
            this.execProcess = false
            this.defaultView = 'yes'
          }
        })
        .catch(error => {
          console.log('----> ', error)
          this.data = error
        })
    },
    /**
     * TODO: Limpa todas as variaveis que contenham valores que são apresentados na pagina
     */
    resetValues() {
      this.bodytemperatureClass = []
      this.bodypulseClass = []
      this.bandfitnessClass = []
      this.bloodpressureClass = []
      this.bodyscaleClass = []
      this.bloodglucoseClass = []
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
              if (!self.posPatientSelected >= 0) {
                document.getElementsByClassName('btnsExams')[0].scrollIntoView(false)
              }
              let typeSel = EventBus.elementControl[EventBus.currentActiveRightComp].dataset.type
              if (!typeSel) {
                self.defaultView = 'yes'
              }
              break
            // evento para sair para a sidebar ou para a lista anterior
            case 'exit':
              // iniicializa a variavel para selecionar a lsta do user
              self.classEvent = 'control-remote-patient'
              self.dataCharsExists = false
              self.defaultView = 'no'

              // se existir um user selecionado é porque se está na lista dos equipamentos
              if (self.posPatientSelected >= 0) {
                // Constroi a lista com os elementos da class dos users
                EventBus.elementControl = document.getElementsByClassName(self.classEvent)
                // Atualiza para elemento anteriormente ativo
                EventBus.currentActiveRightComp = self.posPatientSelected
                // limpa a variavel para saber que se voltar a carregar para sair e voltar para a barra lateral.
                self.posPatientSelected = -1
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
                return
              }
              // desloca a div para o inicio
              document.getElementsByClassName('btnUsers')[0].scrollIntoView(false)
              // limpa a lisa dos botões disponiveis para o user
              self.btnExams = []
              self.resetValues()
              console.log('if exit', cmd, EventBus.currentActiveRightComp)
              break
            case 'right': // tecla para a direita
              EventBus.elementControl[EventBus.currentActiveRightComp].classList.remove('on-shadow')
              if (self.posPatientSelected >= 0) {
                document.getElementsByClassName('btnsExams')[0].scrollIntoView(false)
                self.defaultView = 'yes'
              } else {
                document.getElementsByClassName('btnUsers')[0].scrollIntoView(false)
                self.dataCharsExists = false
                self.defaultView = 'no'
              }
              EventBus.moveLeftRightInView(1)
              if (self.posPatientSelected >= 0) {
                // self.examEvent = EventBus.elementControl[EventBus.currentActiveRightComp].dataset.type
              } else {
                self.defaultView = 'no'
              }
              break
            case 'left': // tecla para a esquerda
              EventBus.elementControl[EventBus.currentActiveRightComp].classList.remove('on-shadow')
              if (EventBus.currentActiveRightComp === 0 && cmd === 'left') {
                // estamos na lista dos exames
                if (self.posPatientSelected >= 0) {
                  // iniicializa a variavel para selecionar a lsta do user
                  self.classEvent = 'control-remote-patient'
                  // Constroi a lista com os elementos da class dos users
                  EventBus.elementControl = document.getElementsByClassName(self.classEvent)
                  // Atualiza para elemento anteriormente ativo
                  EventBus.currentActiveRightComp = self.posPatientSelected
                  // limpa a variavel para saber que se voltar a carregar
                  self.posPatientSelected = -1
                  // desloca a div para o inicio
                  if (self.posPatientSelected >= 0) {
                    document.getElementsByClassName('btnsExams')[0].scrollIntoView(false)
                    self.defaultView = 'yes'
                  } else {
                    document.getElementsByClassName('btnUsers')[0].scrollIntoView(false)
                    self.dataCharsExists = false
                    self.defaultView = 'no'
                  }
                  // limpa a lisa dos botões disponiveis para o user
                  self.btnExams = []
                  self.resetValues()
                  // estamos na lista dos users
                } else {
                  EventBus.moveLeftRightInView(-1)
                  self.defaultView = 'no'
                }
              } else {
                EventBus.moveLeftRightInView(-1)
                self.defaultView = 'yes'
              }
              if (self.posPatientSelected >= 0) {
                // self.examEvent = EventBus.elementControl[EventBus.currentActiveRightComp].dataset.type
                self.defaultView = 'yes'
              } else {
                self.defaultView = 'no'
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
      console.log("change defaultView - ", value)
      if (value === 'yes' || (!this.dataCharsExists && value === 'no')) {
        this.dataCharsExists = false
        this.chartsBarAllData = {}
        this.chartsLineAllData = {
          sizeArr: 1,
          dataSets: []
        }
      }
    }
  },
  created() {
    // Consulta o DOM HTML por todos os elemento pertencentes à class 'control-remote'
    this.controlEventsBus()
  },
  beforeCreate() {
    this.$http
      .get('/api/patient/getAll')
      .then(response => {
        let data = response.data.data
        for (var index in data) {
          this.patientsList.push({
            name: data[index].name,
            id: data[index].id
          })
        }
        // console.log("users", response);
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
.clear-padding > div {
  padding: 0 !important;
}
.clear-padding {
  border-radius: 20px !important;
}
.btnUsers .btn-fill, .btnsExams .btn-fill {
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
</style>
