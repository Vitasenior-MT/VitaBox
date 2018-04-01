<template>
  <div class="row">
    <div class="card col-md-12">
        <div class="header">
          <h4 class="title">Teste consulta de valores</h4>
        </div>
        <div class="content col-md-12">
          <div class="row">
            <button class="btn control-remote" type="button" v-on:click="medirpressaoarterial">Medir Pressão Arterial &nbsp;&nbsp;&nbsp;<b class="ti-heart"></b> </button>
          </div>
          <div class="row">
            &nbsp;
          </div>
          <div class="row" v-if="testepressartrial">
            <div class="col-sm-8">
                <h4>Modo de Utilização</h4>
                <h5>
                Coloque a bracelete no braço.
                <br>
                Aperte a bracelete em volta do braço de maneira que fique justa.
                <br>
                <img src='static/img/bloodpressure.png'>
                <br>
                Percione no botão para ligar <b class="ti-power-off"></b>.
                <br>
                <img src='static/img/bloodpressure.gif'>
                </h5>
                <h4>Aguarde...</h4>
            </div>
            <div class="col-sm-4">
                <div class="col-sm-12">
                  <ChartGauge :id="dataPressArt.id"
                      :typechartdonut="false"
                      :chartid="dataPressArt.id"
                      :valueChart="dataPressArt.val"
                      :labelChart="''"
                      :chartmax="dataPressArt.max"
                      :symbol="''">
                  </ChartGauge>
                <br>
                  <h3>Resultado:</h3>
                  <div class="alert alert-info">
                      <table class="table table-Striped">
                        <thead>
                        </thead>
                        <tbody>
                            <tr>
                              <td align="right"><h4><b class="ti-stats-up"></b> Máxima :</h4></td>
                              <td><h4>{{dataPressArt.pressmax}}</h4></td>
                            </tr>
                            <tr>
                              <td align="right"><h4><b class="ti-stats-down"></b> Minima:</td>
                              <td><h4>{{dataPressArt.pressmin}}</h4></td>
                            </tr>
                            <tr>
                              <td align="right"><h4><b class="ti-heart-broken"></b> Pulso Minimo:</td>
                              <td><h4>{{dataPressArt.pulso}}</h4></td>
                            </tr>
                        </tbody>
                      </table>
                  </div>
                </div>
            </div>
          </div>
        </div>
        <div class="footer">
          <div class="col-md-12 alert alert-info">
            {{logmsg}}
          </div>
        </div>
    </div>
  </div>
</template>
<script>
import { EventBus } from '../../../event-bus.js'
import ChartGauge from 'components/UIComponents/Charts/chartGaugeItem1.vue'
export default {
  components: {
    ChartGauge
  },
  data() {
    return {
      elementControl: [],
      dataPressArt: {
        id: 'pressArterial',
        val: 0,
        max: 100,
        pulso: 0,
        pressmax: 0,
        pressmin: 0
      },
      logmsg: '',
      testepressartrial: false
    }
  },
  sockets: {
    bleMsg: function(data) {
      console.log('BleMsg', data)
      if (data.satus === true) {
        this.logmsg = data.data
      } else {
        console.log('Receive error', data)
        this.$notifications.notify({
          message: 'Erro recebido.<br>' + data.data,
          icon: 'ti-bell',
          horizontalAlign: 'left',
          verticalAlign: 'top',
          type: 'danger'
        })
      }
    },
    bleExec: function(data) {
      if (data.satus === true) {
        var val = data.data
        console.log('bleExec', data, val.replace(/\D/g, ''))
        if (val.length < 5) {
          this.dataPressArt.val = val.replace(/\D/g, '')
        }
      } else {
        console.log('Receive error', data)
        this.$notifications.notify({
          message: 'Erro recebido.<br>' + data.data,
          icon: 'ti-bell',
          horizontalAlign: 'left',
          verticalAlign: 'top',
          type: 'danger'
        })
      }
    },
    bleExecFim: function(data) {
      if (data.satus === true) {
        console.log('bleExecFim', data)
        var val = data.data.split('/')
        this.dataPressArt.val = 0
        this.dataPressArt.pressmax = val[1].replace(/\D/g, '') * 1
        this.dataPressArt.pressmin = val[2].replace(/\D/g, '') * 1
        this.dataPressArt.pulso = val[3].replace(/\D/g, '') * 1
      } else {
        console.log('Receive error', data)
        this.$notifications.notify({
          message: 'Erro recebido.<br>' + data.data,
          icon: 'ti-bell',
          horizontalAlign: 'left',
          verticalAlign: 'top',
          type: 'danger'
        })
      }
    },
    bleError: function(data) {
      console.log('bleError', data)
      this.$notifications.notify({
        message: 'Erro recebido.<br>' + data.data,
        icon: 'ti-bell',
        horizontalAlign: 'left',
        verticalAlign: 'top',
        type: 'danger'
      })
    }
  },
  methods: {
    medirpressaoarterial() {
      this.testepressartrial = true
      this.$http
        .get('/api/ble/pressaoarterial')
        .then(response => {
          console.log(response)
        })
        .catch(error => {
          console.log('----> ', error)
          this.data = error
        })
    },
    controlEventsBus() {
      var self = this
      EventBus.$on('move-components', function(cmd) {
        if (cmd === 'ok_btn') {
          console.log("'Ok btn")
          self.elementControl[EventBus.currentActiveRightComp].click()
        } else {
          if (EventBus.firstRightEvent) {
            cmd = 0
            EventBus.firstRightEvent = false
          }
          self.elementControl[EventBus.currentActiveRightComp].classList.remove(
            'btn-fill'
          )
          EventBus.currentActiveRightComp += cmd
          if (EventBus.currentActiveRightComp >= self.elementControl.length) {
            EventBus.currentActiveRightComp = 0
          }
          if (EventBus.currentActiveRightComp <= -1 && cmd === -1) {
            self.elementControl[0].blur()
            EventBus.firstRightEvent = true
            EventBus.currentActiveRightComp = 0
            console.log('if', cmd, EventBus.currentActiveRightComp)
            return
          }
          // self.elementControl[EventBus.currentActiveRightComp].focus()
          let elem = self.elementControl[EventBus.currentActiveRightComp]
          elem.focus()
          elem.classList.add('btn-fill')
          EventBus.scrollScreen(elem)
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
