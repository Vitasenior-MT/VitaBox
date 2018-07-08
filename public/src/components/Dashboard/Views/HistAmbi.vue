<template>
  <div class="row">
    <div class="row btnSensors">
      <div class="col-md-2" v-for="sensor in sensorList"  :key='sensor.id'>
        <div class="card clear-padding">
          <div class="content">
            <button v-tooltip.bottom="$t('tooltips.ambienteHistory.sensor.title')" class="btn btn-block btn-info control-remote-sensors" type="button" :data-type="sensor.type" v-on:click="getAllDataSensor()">
                <h5 class="text-div-wrap"><b class="fab fa-galactic-senate"></b> {{ sensor.name }}</h5>
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
              v-tooltip.bottom="$t('tooltips.ambienteHistory.history.title')"
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
    <default-form ref="DefaultView"></default-form>
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
    <loading ref="loading"></loading>
  </div>
</template>
<script>
import { EventBus } from '../../../event-bus.js'
import ChartLine from 'components/UIComponents/Charts/chartLine.vue'
import Loading from 'components/UIComponents/Forms/load.vue'
import DefaultForm from 'components/UIComponents/Forms/defaultform.vue'
export default {
  components: {
    ChartLine,
    Loading,
    DefaultForm
  },
  data() {
    return {
      msgSensor: 'histambi.msgSensor',
      msgExit: 'histambi.msgExit',
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
          EventBus.elementControl[EventBus.currentActiveRightComp].setAttribute('data-select', 'true')
        } else {
          EventBus.elementControl[EventBus.currentActiveRightComp].classList.remove("btn-selected")
          EventBus.elementControl[EventBus.currentActiveRightComp].setAttribute('data-select', 'false')
        }
        this.hideShowItem = dataIdBtn
        document.getElementsByClassName('show-charts-history')[0].scrollIntoView(false)
      }, 10);
    },
    getAllDataSensor() {
      this.$refs.loading.show()
      this.resetValues()
      this.sensorType = EventBus.elementControl[EventBus.currentActiveRightComp].dataset.type
      this.$http
        .get('/api/rawsensor/getdata/' + this.sensorType)
        .then(response => {
          if (response.data.status === true) {
            this.posSensorSelected = EventBus.currentActiveRightComp
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
                    if (i === 0) {
                      arrTime.push(EventBus.smallDateFormat(dataArray[index].time[i]))
                    } else {
                      if (EventBus.sameDay(dataArray[index].time[i - 1], dataArray[index].time[i])) {
                        arrTime.push(EventBus.onlyTimeFormat(dataArray[index].time[i]))
                      } else {
                        arrTime.push(EventBus.smallDateFormat(dataArray[index].time[i]))
                      }
                    }
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
              this.$refs.loading.hide()
              this.$refs.DefaultView.hide()
              EventBus.currentActiveRightComp = 0
              // ativa o novo elemento adiconando a class que simboliza o elemento activo
              let elem = EventBus.elementControl[EventBus.currentActiveRightComp]
              elem.focus()
              elem.classList.add('btn-fill')
              elem.scrollIntoView(false)
              document.getElementsByClassName('show-charts-history')[0].scrollIntoView(false)
            }, 10)
          } else {
            this.posSensorSelected = -1
            this.$refs.loading.hide()
            this.$refs.DefaultView.setMsg(this.msgExam)
            this.$refs.DefaultView.show()
            this.$notifications.notify({
              message: '<h4>' + response.data.data + '</h4>',
              icon: 'ti-bell',
              horizontalAlign: 'right',
              verticalAlign: 'top',
              type: 'warning'
            })
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
              self.$refs.DefaultView.hide()
              if (self.posSensorSelected < 0) {
                document.getElementsByClassName('btnLocation')[0].scrollIntoView(false)
                self.$refs.DefaultView.setMsg(self.msgExam)
                self.$refs.DefaultView.show()
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
                self.$refs.DefaultView.setMsg(self.msgExit)
                self.$refs.DefaultView.show()
                EventBus.setSidebar()
              }
              // desloca a div para o inicio
              document.getElementsByClassName('btnSensors')[0].scrollIntoView(false)
              // limpa a lisa dos botões disponiveis para o user
              self.btnLocation = []
              self.resetValues()
              self.$refs.DefaultView.setMsg(self.msgSensor)
              self.$refs.DefaultView.show()
              console.log('if exit', cmd, EventBus.currentActiveRightComp)
              break
            case 'right': // tecla para a direita
            case 'left': // tecla para a esquerda
              EventBus.elementControl[EventBus.currentActiveRightComp].classList.remove('on-shadow')
              if (self.posSensorSelected >= 0) {
                document.getElementsByClassName('btnLocation')[0].scrollIntoView(false)
              } else {
                document.getElementsByClassName('btnSensors')[0].scrollIntoView(false)
              }
              EventBus.moveLeftRightInView(cmd === 'left' ? -1 : 1)
              if (self.posSensorSelected >= 0) {
              } else {
                self.$refs.DefaultView.setMsg(self.msgSensor)
                self.$refs.DefaultView.show()
              }
              break

            default:
              break
          }
        }
      })
    }
  },
  created() {
    this.controlEventsBus()
  },
  mounted() {
    this.$refs.DefaultView.setMsg(this.msgExit)
    this.$refs.DefaultView.show()
  },
  beforeCreate() {
    this.$http
      .get('/api/sensor/getDistictAll')
      .then(response => {
        let data = response.data.data
        for (var index in data) {
          this.sensorList.push({
            name: data[index].measure,
            type: data[index].sensortype,
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
