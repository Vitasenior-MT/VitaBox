<template>
  <div class="row">
    <div class="row btnUsers">
      <div class="col-md-3" v-for="patient in patientsList"  :key='patient.id'>
        <div class="card">
          <div class="content">
            <button v-tooltip.bottom="'Pecione em [OK] para selecionar o user.'" class="btn btn-block btn-info control-remote-patient" type="button" :data-id="patient.id" v-on:click="bleGetListExam(this)">
                <h4><b class="ti-user"> {{ patient.name }}</b></h4>
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="row btnsExams">
      <div class="col-md-2" v-for="btn in btnExams"  :key='btn.id'>
        <div class="card">
          <div class="content">
            <button v-tooltip.bottom="'Pecione em [OK] para iniciar.'" class="btn btn-block control-remote" type="button" :data-type="btn.type" v-on:click="bleExecExam">
              <h2><b :class="btn.icon"></b></h2>
              <h5>{{ btn.nome }}</h5>
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="row bloodpressure" v-show="examEvent == 'bloodpressure'">
      <div class="col-md-12">
        <div class="col-md-8">
          <div class="card">
            <div class="header">
                <h4 class="title">Modo de Utilização</h4>
                <p class="category"></p>
            </div>
            <div class="content">
              <ol>
                <table class="table table-Striped">
                  <thead>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <h4>
                          <li>Coloque a bracelete no braço.</li>
                          <li>Ajuste a bracelete conforme mostrado na imagem.</li>
                          <li>No comando precione em <i class="ti-new-window"></i> para iniciar.</li>
                        </h4>
                      </td>
                      <td><img src='static/img/bloodpressure.png' alt=""></td>
                    </tr>
                    <tr>
                      <td>
                        <h4>
                          <li>Percione no botão <b class="ti-power-off"></b> do equipamento para ligar e iniciar o processo.</li>
                          <li>A luz indicadora de equipamento ligado pisca.</li>
                          <li>Após o equpamento ser detectado a luz deixa de piscar ficando sempre ligada.</li>
                          <li>Aguarde até o processo terminar.</li>
                          <li>Após todos os dadps aparecerem na televisão e uma correta execução o equipamento desliga-se automáticamente.</li>
                        </h4>
                      </td>
                      <td>
                        <img src='static/img/bloodpressure.gif' alt="">
                      </td>
                    </tr>
                  </tbody>
                </table>
              </ol>
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
    <div class="row bodyscale" v-show="examEvent == 'bodyscale'">
      <div class="col-md-12">
        <div class="col-md-8">
          <div class="card">
            <div class="header">
                <h4 class="title">Modo de Utilização</h4>
                <p class="category"></p>
            </div>
            <div class="content">
              <ol>
                <table class="table table-Striped">
                  <thead>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <h4>
                          <li>Coloque o equipamento numa superficie sólida, plana, de fácil aceesso, e livre de tapetes para que seja possivel efetuar uma correta execução.</li>
                          <li>No comando precione em <i class="ti-new-window"></i> para iniciar.</li>
                          <li>Suba para cima do equipamento.</li>
                          <li>O equipamento liga-se automáticamente.</li>
                          <li>Quando o valor obtido estabilizar o mesmo irá piscar.</li>
                          <li>Após a correta recolha dos dados o equipamento desliga-se automáticamente.</li>
                        </h4>
                      </td>
                      <td>
                        <img src='static/img/bodyscale.png' alt="">
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <h4></h4>
                      </td>
                      <td>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </ol>
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
      </div>
    </div>
    <div class="row bloodglucose" v-show="examEvent == 'bloodglucose'">
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
    <div class="row bodytemperature" v-show="examEvent == 'bodytemperature'">
      <div class="col-md-12">
        <div class="col-md-8">
          <div class="card">
            <div class="header">
              <h4 class="title">Modo de Utilização</h4>
              <p class="category"></p>
            </div>
            <div class="content">
              <ol>
                <table class="table table-Striped">
                  <thead>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <h4>
                          <li>No comando precione em <i class="ti-new-window"></i> para iniciar.</li>
                          <li>Coloque o equipamento de acordo com a imagem ao lado.</li>
                        </h4>
                      </td>
                      <td><img src='static/img/bodytemp.png' alt=""></td>
                    </tr>
                    <tr>
                      <td>
                        <h4>
                          <li>Percione no botão até que o equipamento ligue.</li>
                          <li>Quando o equipamento estiver ligado uma luz indicadora pisca.</li>
                          <li>Após a deteção do equipamento a luz indicadora apaga-se.</li>
                          <li>Aguarde até que todos os valores apareçam na televisão.</li>
                          <li>Após a conclusão do processo a luz indicadora volta a piscar.</li>
                          <li>Pode retirar o equipamento e desliga-lo.</li>
                          <li>Precione novamente no botão <b class="ti-power-off"></b> até que o equipamento se deslique.</li>
                          <li>É importante que o equipamento seja desligado de forma a economizar a bateria.</li>
                        </h4>
                      </td>
                      <td>
                        <img src='static/img/bodytemp.gif' alt="">
                      </td>
                    </tr>
                  </tbody>
                </table>
            </ol>
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
    <div class="row bodypulse" v-show="examEvent == 'bodypulse'">
      <div class="col-md-12">
        <div class="col-md-8">
          <div class="card">
            <div class="header">
                <h4 class="title">Modo de Utilização</h4>
                <p class="category"></p>
            </div>
            <div class="content">
              <ol>
                <table class="table table-Striped">
                  <thead>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <h4>
                          <li>No comando precione em <i class="ti-new-window"></i> para iniciar.</li>
                          <li>Coloque o equipamento no dedo conforme apresentado na imagem.</li>
                        </h4>
                      </td>
                      <td><img src='static/img/pulse.png' alt=""></td>
                    </tr>
                    <tr>
                      <td>
                        <h4>
                          <li>Percione no botão <b class="ti-power-off"></b> do equipamento para ligar.</li>
                          <li>Aguarde até que todos os valores apareçam na televisão.</li>
                          <li>Quando todos os valores aparecerem, o processo encontra-se concluido.</li>
                          <li>Pode retirar o equipamento do dedo e o mesmo desliga-se automáticamente.</li>
                        </h4>
                      </td>
                        <td><img src='static/img/pulse.gif' alt=""></td>
                    </tr>
                  </tbody>
                </table>
              </ol>
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
    <div id="loader-wrapper" v-show="execProcess">
      <div v-show="examEvent == 'bloodpressure'" id="loader-chart">
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
      <div v-show="examEvent != 'bloodpressure'" id="loader">
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
      classEvent: 'control-remote-patient',
      posPatientSelected: -1,
      patientsList: [],
      patientId: '',
      btnExams: [],
        // definição do ojecto para medir a pressão arterial
      dataPressArt: {
        id: 'pressArterial-Chart',
        val: 0,
        max: 100,
        pulso: 0,
        pressmax: 0,
        pressmin: 0
      },
      dataBodyScale: {
        // definiºão do objecto para os dados da balança
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
      bloodglucoseClass: [],
      btns: [
        {
          nome: 'Pressão Arterial',
          type: 'bloodpressure',
          icon: 'ti-heart-broken'
        },
        {
          nome: 'Temperatura',
          type: 'bodytemperature',
          icon: 'fas fa-thermometer-half'
        },
        {
          nome: 'Pulsometro',
          type: 'bodypulse',
          icon: 'ti-heart-broken'
        },
        {
          nome: 'Pesar',
          type: 'bodyscale',
          icon: 'ti-dashboard'
        },
        {
          nome: 'Glicemia',
          type: 'bloodglucose',
          icon: 'fas fa-chart-bar'
        }
      ]
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
        // console.log('Receive error', data)
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
        // console.log('Receive error', data)
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
        // console.log('Receive error', data)
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
        // console.log('Receive error', data)
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
        // console.log('bleExecFim', data)
        var val = data.data.split('/')
        this.dataPressArt = {
          val: 0,
          pressmax: val[1].replace(/\D/g, '') * 1,
          pressmin: val[2].replace(/\D/g, '') * 1,
          pulso: val[3].replace(/\D/g, '') * 1
        }
        this.bloodpressureClass.push('ajustinfo')
      } else {
        // console.log('Receive error', data)
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
      // console.log('error', data)
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
    bleGetListExam(btnPatient) {
      this.patientId = EventBus.elementControl[EventBus.currentActiveRightComp].dataset.id
      this.posPatientSelected = EventBus.currentActiveRightComp
      let self = this
      // console.log('Teste ok list', this.patientId)
      this.$http
        .get('/api/patient/exames/' + this.patientId)
        .then(response => {
          if (response.data.status === true) {
            let devacesArray = response.data.data[0].device_list
            for (let index = 0; index < devacesArray.length; index++) {
              let btnopt = ''
              switch (devacesArray[index].device_type) {
                case 'bloodpressure':
                  btnopt = this.btns[0]
                  break
                case 'bodytemperature':
                  btnopt = this.btns[1]
                  break
                case 'bodypulse':
                  btnopt = this.btns[2]
                  break
                case 'bodyscale':
                  btnopt = this.btns[3]
                  break
                case 'bloodglucose':
                  btnopt = this.btns[4]
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
              EventBus.elementControl = document.getElementsByClassName(
                this.classEvent
              )
              EventBus.currentActiveRightComp = 0
              // ativa o novo elemento adiconando a class que simboliza o elemento activo
              let elem = EventBus.elementControl[EventBus.currentActiveRightComp]
              elem.focus()
              elem.classList.add('btn-fill')
              // EventBus.scrollScreen(elem)
              elem.scrollIntoView(false)
              self.examEvent = EventBus.elementControl[EventBus.currentActiveRightComp].dataset.type
            }, 10)
          } else {
            console.log('erro', response.data)
          }
        })
        .catch(error => {
          console.log(error)
        })
    },
    bleExecExam() {
      this.execProcess = true
      console.log("Exame event", this.examEvent)
      this.resetValues()
      this.$http
        .get('/api/ble/' + this.examEvent.toLowerCase() + '/' + this.patientId)
        .then(response => {
          if (response.data.status === true) {
            document.getElementsByClassName(this.examEvent)[0].scrollIntoView(false)
            this.$notifications.notify({
              message: '<h4>' + response.data.data + '</h4>',
              icon: 'ti-check',
              horizontalAlign: 'right',
              verticalAlign: 'top',
              type: 'success'
            })
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
    getAge(dateString) {
      var today = new Date()
      var birthDate = new Date(dateString)
      var age = today.getFullYear() - birthDate.getFullYear()
      var m = today.getMonth() - birthDate.getMonth()
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--
      }
      return age
    },
    /**
     * TODO: Limpa todas as variaveis que contenham valores que são apresentados na pagina
     */
    resetValues() {
      this.bodytemperatureClass = []
      this.bodypulseClass = []
      this.bloodpressureClass = []
      this.bodyscaleClass = []
      this.bloodglucoseClass = []
      this.dataBodyScale = {
        weight: 0,
        bodyfat: 0,
        bonemass: 0,
        musclemass: 0,
        visceralfat: 0,
        water: 0,
        calories: 0
      }
      this.dataPressArt = {
        val: 0,
        pressmax: 0,
        pressmin: 0,
        pulso: 0
      }
      this.battery = 0
      this.tempCorp = 0
      this.spoVal = 0
      this.pulseVal = 0
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
              EventBus.elementControl[EventBus.currentActiveRightComp].click()
              if (!self.posPatientSelected >= 0) {
                document.getElementsByClassName('btnsExams')[0].scrollIntoView(false)
              }
              break
            // evento para sair para a sidebar ou para a lista anterior
            case 'exit':
              // iniicializa a variavel para selecionar a lsta do user
              self.classEvent = 'control-remote-patient'
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
                EventBus.elementControl[EventBus.currentActiveRightComp].blur()
                // atribui para que passe a ser novamento a primenra vez que entra nesta view
                EventBus.firstRightEvent = true
                // define como o elemento ativo seja o '0'
                EventBus.currentActiveRightComp = 0
                // define o elemento ativo coomo sendo a barra lateral
                EventBus.currentComponent = EventBus.sidebarName
                return
              }
              // apaga a opção de exame selecionada
              self.examEvent = ''
              // desloca a div para o inicio
              document.getElementsByClassName('btnUsers')[0].scrollIntoView(false)
              // limpa a lisa dos botões disponiveis para o user
              self.btnExams = []
              self.resetValues()
              console.log('if exit', cmd, EventBus.currentActiveRightComp)
              break
            case 'right': // tecla para a direita
              if (self.posPatientSelected >= 0) {
                document.getElementsByClassName('btnsExams')[0].scrollIntoView(false)
              } else {
                document.getElementsByClassName('btnUsers')[0].scrollIntoView(false)
              }
              EventBus.moveLeftRightInView(1)
              if (self.posPatientSelected >= 0) {
                self.examEvent = EventBus.elementControl[EventBus.currentActiveRightComp].dataset.type
              }
              break
            case 'left': // tecla para a esquerda
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
                  // Seleciona o elemento ativo da lista dos users
                  let elem = EventBus.elementControl[EventBus.currentActiveRightComp]
                  elem.focus()
                  elem.classList.add('btn-fill')
                  // apaga a opção de exame selecionada
                  self.examEvent = ''
                  // desloca a div para o inicio
                  if (self.posPatientSelected >= 0) {
                    document.getElementsByClassName('btnsExams')[0].scrollIntoView(false)
                  } else {
                    document.getElementsByClassName('btnUsers')[0].scrollIntoView(false)
                  }
                  // limpa a lisa dos botões disponiveis para o user
                  self.btnExams = []
                  self.resetValues()

                  // estamos na lista dos users
                } else {
                  EventBus.moveLeftRightInView(-1)
                }
              } else {
                EventBus.moveLeftRightInView(-1)
              }
              if (self.posPatientSelected >= 0) {
                self.examEvent = EventBus.elementControl[EventBus.currentActiveRightComp].dataset.type
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
            id: data[index].id,
            gender: data[index].gender === 'male' ? 'Masculino' : data[index].gender === 'female' ? 'Feminino' : data[index].gender,
            // birthdate: this.dateFormat(data[index].birthdate),
            age: this.getAge(data[index].birthdate)
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
  border-color: black;
  animation: blinker 3s linear infinite;
}
@keyframes blinker {
  0% {
    background-color: white;
  }
  50% {
    background-color: #f7931d;
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
</style>
