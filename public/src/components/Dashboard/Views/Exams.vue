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
      elementControl: [],     // Array com os elemento perencentes à class 'remote-control'
      dataPressArt: {         // definição do ojecto para medir a pressão arterial
        id: 'pressArterial',
        val: 0,
        max: 100,
        pulso: 0,
        pressmax: 0,
        pressmin: 0
      },
      logmsg: '',
      testepressartrial: false  // frag para mostral os elemento destinados a visualização da medição da pressão arterial
    }
  },
  sockets: {
    /**
     * TODO: Recebe do socket as mensagens
    */
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
          message: 'Erro recebido.<br>' + data.data,
          icon: 'ti-bell',
          horizontalAlign: 'left',
          verticalAlign: 'top',
          type: 'danger'
        })
      }
    },
    /**
     * TODO: Recebe do socket os dados finais da medição
     */
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
    /**
     * TODO: Recebe do socket os erros na execução do processo de medição da pressão arterial
     */
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
    /**
     * TODO: Metodo para iniciar o processo de mediação da pressão arterial
     */
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
    /**
     * TODO: Metodo para controlar os eventos do comando remoto quando esta é a view ativa no momento
     */
    controlEventsBus() {
      var self = this
      /**
       * TODO: Monitorização dos eventos do controlo remoto
       */
      EventBus.$on('move-components', function(cmd) {
        switch (cmd) {
          // evento do 'OK'
          case 'ok_btn':
            console.log("'Ok btn")
            self.elementControl[EventBus.currentActiveRightComp].click()
            break;
          case 1:   // tecla para a direita
          case -1:  // tecla para a esquerda
            // primeira vez que se entra nesta view
            if (EventBus.firstRightEvent) {
              cmd = 0
              EventBus.firstRightEvent = false
            }
            // remove a class que sinboliza o elemento ativo
            self.elementControl[EventBus.currentActiveRightComp].classList.remove(
              'btn-fill'
            )
            // Actualiza a variavel de controlo do elemento activo
            EventBus.currentActiveRightComp += cmd
            // verifica se chegou ao fim do array se sim volta ao principio
            if (EventBus.currentActiveRightComp >= self.elementControl.length) {
              EventBus.currentActiveRightComp = 0
            }
            // verifica se estou na posição '0' e se foi carregado para a esquerda
            // se sim é para sair desta view e ativar a sidebar
            if (EventBus.currentActiveRightComp <= -1 && cmd === -1) {
              self.elementControl[0].blur()
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
            break;
        }
      })
    }
  },
  created() {
    // Consulta o DOM HTML por todos os elemento pertencentes à class 'control-remote'
    this.elementControl = document.getElementsByClassName('control-remote')
    this.controlEventsBus()
    console.log('Remotes', this.elementControl)
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
</style>
