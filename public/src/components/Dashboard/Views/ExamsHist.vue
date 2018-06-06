<template>
  <div class="row">
    <div class="row btnUsers">
      <div class="col-md-3" v-for="patient in patientsList"  :key='patient.id'>
        <div class="card clear-padding">
          <div class="content">
            <button v-tooltip.bottom="'Pessione em [OK] para selecionar o utilizador.'" class="btn btn-block btn-info control-remote-patient" type="button" :data-id="patient.id" v-on:click="bleGetListExam(this)">
                <h5 class="text-div-wrap"><b class="ti-user"> {{ patient.name }}</b></h5>
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
              <p class="text-div-wrap">{{ btn.nome }}</p>
            </button>
          </div>
        </div>
      </div>
    </div>
    <default-form ref="DefaultView"></default-form>
    <div class="row clear-margin show-charts-history" v-if="dataCharsExists">
      <div class="col-md-12 btn btn-round btn-fill">
        <div class="row">
          <div class="col-md-12" style="padding-bottom: 10px;">
            <h3 style="display:inline;"><u>{{this.chartsBarAllData.nameExam}}</u> &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;</h3>
            <h5 style="display:inline;">Ultima execução: &nbsp; <i class="ti-calendar"></i> &nbsp; {{this.chartsBarAllData.lastUpdate}}</h5>
          </div>
        </div>
        <card-chart-history-bar :dataCharts="chartsBarAllData.dataCharts"></card-chart-history-bar>
        <hr style="margin: 0px;">
        <div class="row">
          <div class="col-md-12" style="padding-bottom: 10px;">
            <h3 style="margin: 0px;">
              Histórico - Últimos {{ lastHistRecords }} dados recolhidos.
            </h3>
          </div>
        </div>
        <card-chart-history-line :dataCharts="chartsLineAllData" ></card-chart-history-line>
      </div>
    </div>
    <loading ref="loading"></loading>
  </div>
</template>
<script>
import { EventBus } from '../../../event-bus.js'
import CardChartHistoryBar from 'components/UIComponents/Cards/CardHistoryBarChart.vue'
import CardChartHistoryLine from 'components/UIComponents/Cards/CardHistoryLineChart.vue'
import Loading from 'components/UIComponents/Forms/load.vue'
import DefaultForm from 'components/UIComponents/Forms/defaultform.vue'
export default {
  components: {
    CardChartHistoryBar,
    CardChartHistoryLine,
    Loading,
    DefaultForm
  },
  data() {
    return {
      msgUser: 'examshist.msgUser',
      msgExam: 'examshist.msgExam',
      msgExit: 'examshist.msgExit',
      lastHistRecords: 10,
      dataCharsExists: false,
      chartsBarAllData: {},
      chartsLineAllData: {
        sizeArr: 1,
        charts: []
      },
      classEvent: 'control-remote-patient',
      posPatientSelected: -1,
      patientsList: [],
      patientId: '',
      btnExams: [],
      examMac: '',
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
          nome: 'Batimento Cardíaco',
          type: 'bodypulse',
          icon: 'ti-heart-broken',
          id: 'bodypulse-2',
          macAddr: ''
        },
        {
          nome: 'Peso',
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
            this.btnExams = []
            for (let index = 0; index < devacesArray.length; index++) {
              let btnopt = ''
              switch (devacesArray[index].device) {
                case 'bloodpressure':
                  this.btns[0].macAddr = devacesArray[index].mac_addr
                  this.btns[0].nome = devacesArray[index].name
                  btnopt = this.btns[0]
                  break
                case 'bodytemperature':
                  this.btns[1].macAddr = devacesArray[index].mac_addr
                  this.btns[1].nome = devacesArray[index].name
                  btnopt = this.btns[1]
                  break
                case 'bodypulse':
                  this.btns[2].macAddr = devacesArray[index].mac_addr
                  this.btns[2].nome = devacesArray[index].name
                  btnopt = this.btns[2]
                  break
                case 'bodyscale':
                  this.btns[3].macAddr = devacesArray[index].mac_addr
                  this.btns[3].nome = devacesArray[index].name
                  btnopt = this.btns[3]
                  break
                case 'bloodglucose':
                  this.btns[4].macAddr = devacesArray[index].mac_addr
                  this.btns[4].nome = devacesArray[index].name
                  btnopt = this.btns[4]
                  break
                case 'bandfitness':
                  this.btns[5].macAddr = devacesArray[index].mac_addr
                  this.btns[5].nome = devacesArray[index].name
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
              // ativa o novo elemento adiconando a class que indica o elemento activo
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
      this.$refs.DefaultView.setMsg(this.msgExam)
      this.$refs.DefaultView.show()
      this.$refs.loading.show()
      let dataTypeExam = EventBus.elementControl[EventBus.currentActiveRightComp].dataset.type
      let examMac = EventBus.elementControl[EventBus.currentActiveRightComp].dataset.addrmac
      let examNameDes = EventBus.elementControl[EventBus.currentActiveRightComp].dataset.examname
      let countArrPos = -1
      this.$http
        .get('/api/sensorsble/' + this.patientId + '-' + examMac + '/' + this.lastHistRecords)
        .then(response => {
          if (response.data.status === true) {
            let dataIterat = response.data.data
            this.chartsLineAllData = {
              sizeArr: 1,
              charts: []
            }
            this.chartsBarAllData = {
              lastUpdate: EventBus.dateFormat(dataIterat[0].value[dataIterat[0].value.length - 1].time),
              nameExam: examNameDes,
              dataCharts: []
            };
            var controlVarA = false
            var controlVarB = false
            for (let index = 0; index < dataIterat.length; index++) {
              this.chartsBarAllData.dataCharts.push({
                key: 'chartBar-' + index,
                dataBar: {
                  x: dataIterat[index].measure,
                  y: dataIterat[index].value[dataIterat[0].value.length - 1].value
                }
              });
              let chartIDLabel = "y-axis-0"
              let color = EventBus.getRandomColor()
              let laabeldataArr = this.getAllDataAndLabels(dataIterat[index].value)
              // console.log("dataTypeExam", dataTypeExam, dataIterat[index].measure)
              switch (dataTypeExam) {
                case 'bloodpressure':
                  switch (dataIterat[index].tag) {
                    case 'systolic':
                    case 'diastolic':
                      if (!controlVarA) {
                        controlVarA = true
                        countArrPos++
                        this.chartsLineAllData.charts.push({
                          data: {
                            labels: laabeldataArr[1],
                            poschart: countArrPos,
                            datasets: []
                          }
                        })
                      }
                      break
                    case 'pulse':
                      countArrPos++
                      this.chartsLineAllData.charts.push({
                        data: {
                          labels: laabeldataArr[1],
                          poschart: countArrPos,
                          datasets: []
                        }
                      })
                      break
                    default:
                      break
                  }
                  break
                case 'bandfitness':
                  switch (dataIterat[index].tag) {
                    case 'heartrate':
                    case 'callories':
                      if (!controlVarA) {
                        controlVarA = true
                        countArrPos++
                        chartIDLabel = "y-axis-1"
                        this.chartsLineAllData.charts.push({
                          data: {
                            labels: laabeldataArr[1],
                            secoundScale: {
                              position: "right",
                              id: "y-axis-0",
                              type: 'linear',
                              ticks: {
                                fontSize: 18
                              }
                            },
                            poschart: countArrPos,
                            datasets: []
                          }
                        })
                      }
                      break
                    case 'meters':
                    case 'steps':
                      if (!controlVarB) {
                        controlVarB = true
                        countArrPos++
                        chartIDLabel = "y-axis-1"
                        this.chartsLineAllData.charts.push({
                          data: {
                            labels: laabeldataArr[1],
                            secoundScale: {
                              position: "right",
                              id: "y-axis-0",
                              type: 'linear',
                              ticks: {
                                fontSize: 18
                              }
                            },
                            poschart: countArrPos,
                            datasets: []
                          }
                        })
                      }
                      break
                    default:
                      break
                  }
                  break
                case 'bodytemperature':
                case 'bodypulse':
                case 'bodyscale':
                  countArrPos++
                  this.chartsLineAllData.charts.push({
                    data: {
                      labels: laabeldataArr[1],
                      poschart: countArrPos,
                      datasets: []
                    }
                  })
                  break
                default:
                  break;
              }
              this.chartsLineAllData.charts[countArrPos].data.datasets.push({
                label: dataIterat[index].measure,
                borderColor: color,
                yAxisID: chartIDLabel,
                pointBackgroundColor: color,
                backgroundColor: 'rgba(0, 0, 0, 0)',
                data: laabeldataArr[0]
              })
            }

            this.chartsLineAllData.sizeArr = this.chartsLineAllData.charts.length > 3 ? 3 : this.chartsLineAllData.charts.length
            this.dataCharsExists = true
            this.$refs.loading.hide()
            this.$refs.DefaultView.hide()
            setTimeout(() => {
              document.getElementsByClassName('show-charts-history')[0].scrollIntoView(false)
            }, 500);
          } else {
            this.$notifications.notify({
              message: '<h4>' + response.data.data + '</h4>',
              icon: 'ti-bell',
              horizontalAlign: 'right',
              verticalAlign: 'top',
              type: 'warning'
            })
            this.$refs.loading.hide()
            this.$refs.DefaultView.setMsg(this.msgExam)
            this.$refs.DefaultView.show()
          }
        })
        .catch(error => {
          console.log('----> ', error)
          this.data = error
        })
    },
    getAllDataAndLabels(array) {
      let labelArr = []
      let dataArr = []
      for (let i = 0; i < array.length; i++) {
        labelArr.push(EventBus.smallDateFormat(array[i].time))
        dataArr.push(array[i].value);
      }
      return [dataArr, labelArr]
    },
    /**
     * TODO: Limpa todas as variaveis que contenham valores que são apresentados na pagina
     */
    resetValues() {
      if (this.dataCharsExists) {
        this.dataCharsExists = false
        this.chartsBarAllData.dataCharts = []
        this.chartsBarAllData = {}
        this.chartsLineAllData = {
          sizeArr: 1,
          charts: []
        }
      }
    },
    componentsRotation() {
      var self = this
      EventBus.startRotation('control-remote-patient', this.sidebarStore.mode.auto, 0, 0, 5, true, (end) => {
        if (self.posPatientSelected > -1) {
          if (end) {
            // inicializa a variavel para selecionar a lista do user
            self.classEvent = 'control-remote-patient'
            self.dataCharsExists = false
            self.$refs.DefaultView.setMsg(self.msgUser)
            self.$refs.DefaultView.show()
            self.resetValues()
            // Constroi a lista com os elementos da class dos users
            EventBus.elementControl = document.getElementsByClassName(self.classEvent)
            // Atualiza para elemento anteriormente ativo
            EventBus.currentActiveRightComp = self.posPatientSelected
            // limpa a variavel para saber que se voltar a carregar para sair e voltar para a barra lateral.
            self.posPatientSelected = -1
            // desloca a div para o inicio
            document.getElementsByClassName('btnUsers')[0].scrollIntoView(false)
            // limpa a lisa dos botões disponiveis para o user
            self.btnExams = []
            self.resetValues()
          }
        }
        let elem = EventBus.elementControl[EventBus.currentActiveRightComp]
        elem.focus()
        elem.click()
        elem.classList.add('btn-fill')
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
        if (!self.$refs.loading.getLoadingState()) {
          EventBus.elementControl = document.getElementsByClassName(self.classEvent)
          if (EventBus.elementControl.length === 0) {
            EventBus.setSidebar()
          }
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
                self.$refs.DefaultView.setMsg(self.msgExam)
                self.$refs.DefaultView.show()
              }
              break
            // evento para sair para a sidebar ou para a lista anterior
            case 'exit':
              // iniicializa a variavel para selecionar a lsta do user
              self.classEvent = 'control-remote-patient'
              self.dataCharsExists = false
              self.$refs.DefaultView.setMsg(self.msgUser)
              self.$refs.DefaultView.show()
              self.resetValues()

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
                self.$refs.DefaultView.setMsg(self.msgExit)
                self.$refs.DefaultView.show()
                EventBus.setSidebar()
              }
              // desloca a div para o inicio
              document.getElementsByClassName('btnUsers')[0].scrollIntoView(false)
              // limpa a lisa dos botões disponiveis para o user
              self.btnExams = []
              self.resetValues()
              clearInterval(EventBus.interval)
              console.log('if exit', cmd, EventBus.currentActiveRightComp)
              break
            case 'right': // tecla para a direita
              EventBus.elementControl[EventBus.currentActiveRightComp].classList.remove('on-shadow')
              if (self.posPatientSelected >= 0) {
                document.getElementsByClassName('btnsExams')[0].scrollIntoView(false)
                self.$refs.DefaultView.setMsg(self.msgExam)
                self.$refs.DefaultView.show()
                self.resetValues()
              } else {
                document.getElementsByClassName('btnUsers')[0].scrollIntoView(false)
                self.dataCharsExists = false
                self.$refs.DefaultView.setMsg(self.msgUser)
                self.$refs.DefaultView.show()
                self.resetValues()
              }
              EventBus.moveLeftRightInView(1)
              if (self.posPatientSelected >= 0) {
                // self.examEvent = EventBus.elementControl[EventBus.currentActiveRightComp].dataset.type
              } else {
                self.$refs.DefaultView.setMsg(self.msgUser)
                self.$refs.DefaultView.show()
                self.resetValues()
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
                    self.$refs.DefaultView.setMsg(self.msgExam)
                    self.$refs.DefaultView.show()
                  } else {
                    document.getElementsByClassName('btnUsers')[0].scrollIntoView(false)
                    self.dataCharsExists = false
                    self.$refs.DefaultView.setMsg(self.msgUser)
                    self.$refs.DefaultView.show()
                  }
                  // limpa a lisa dos botões disponiveis para o user
                  self.btnExams = []
                  self.resetValues()
                  // estamos na lista dos users
                } else {
                  EventBus.moveLeftRightInView(-1)
                  self.$refs.DefaultView.setMsg(self.msgExit)
                  self.$refs.DefaultView.show()
                  self.resetValues()
                  return
                }
              } else {
                EventBus.moveLeftRightInView(-1)
                self.$refs.DefaultView.setMsg(self.msgExam)
                self.$refs.DefaultView.show()
                self.resetValues()
              }
              if (self.posPatientSelected >= 0) {
                self.$refs.DefaultView.show()
              } else {
                self.$refs.DefaultView.setMsg(self.msgUser)
                self.$refs.DefaultView.show()
                self.resetValues()
              }
              break
            default:
              break
          }
        }
      })
    }
  },
  mounted() {
    this.$refs.DefaultView.setMsg(this.msgExit)
    this.$refs.DefaultView.show()
  },
  created() {
    // Consulta o DOM HTML por todos os elemento pertencentes à class 'control-remote'
    this.controlEventsBus()
  },
  beforeCreate() {
    this.$http
      .get('/api/patient/getAll')
      .then(response => {
        this.componentsRotation()
        let data = response.data.data
        for (var index in data) {
          this.patientsList.push({
            name: data[index].name,
            id: data[index].id
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
.clear-margin {
  margin: 0 !important;
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
.text-div-wrap {
  white-space: pre-line;
}
</style>
