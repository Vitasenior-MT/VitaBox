<template>
  <div class="row">
    <div class="row">
      <div class="col-xs-12">
        <h3>Selecione uma Divisão:</h3>
        <button v-for="place in places" :key='place.id' class="btn btn-info btn-lg space10 control-remote" type="button" v-on:click="getSensorFromPlace">{{place.local}}</button>
      </div>
    </div>
    <div class="row" v-if="placeselected">
      &nbsp;&nbsp;
    </div>
    <div class="row" v-if="placeselected">
      <div class="col-xs-12">
        <h4>Selecione um Sensor:</h4>
        <div v-for="sensor in sensors" :key='sensor.id' class="col-xs-2">
          <button class="btn btn-success btn-block control-remote" type="button" v-on:click="getSensorValues">{{sensor.sensorName}}</button>
        </div>
      </div>
    </div>
    <div class="row" v-if="placeselected">
      <chart-card ref="chartCalls" :chart-data="sensorsChart.data" :chart-options="sensorsChart.options">
        <h4 class="title" slot="title">Local <b>{{placeSelect}}</b> </h4>
        <span slot="subTitle">Sensor <b>{{sensorSelect}}</b> </span>
        <!--
        <span slot="footer">
          <i class="ti-reload"></i> Updated 3 minutes ago</span>
        <div slot="legend">
          <i class="fa fa-circle text-info"></i> Open
          <i class="fa fa-circle text-danger"></i> Click
          <i class="fa fa-circle text-warning"></i> Click Second Time
        </div>
        -->
      </chart-card>
    </div>
</div>
</template>
<script>
import ChartCard from 'components/UIComponents/Cards/ChartCard.vue'
import { EventBus } from '../../../event-bus.js'
export default {
  components: {
    ChartCard
  },
  data() {
    return {
      statsCards: [],
      sensorsChart: {
        data: {
          labels: [],
          series: []
        },
        options: {
          low: 0,
          high: 400,
          showArea: false,
          height: '300px',
          axisX: {
            showGrid: false
          },
          lineSmooth: this.$Chartist.Interpolation.simple({
            divisor: 3
          }),
          showLine: true,
          showPoint: false
        }
      },
      placeselected: false, // variavel de controlo para mostrar o gráfico após a seleção de uma localização
      places: [],           // Array com os várias localizações dos sensores
      placeSelect: '',      // local selecionado
      sensors: [],          // array com a lista de sensores referentes à localização selecionada
      sensorSelect: ''     // sensor selecionado
    }
  },
  methods: {
    /**
     * TODO: Formata a data recebida por parametro
     */
    dateFormat(data) {
      let date = new Date(data)
      return (
        (date.getMonth() + 1 < 10
          ? '0' + (date.getMonth() + 1)
          : date.getMonth() + 1) +
        '/' +
        (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) +
        '/' +
        date.getFullYear() +
        ' ' +
        (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) +
        ':' +
        (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) +
        ':' +
        (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds())
      )
    },
    /**
     * TODO: Formata a data recebida por parametro só a hora minutos e segundos
     */
    dateFormat2(data) {
      let date = new Date(data)
      return (
        (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) +
        ':' +
        (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) +
        ':' +
        (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds())
      )
    },
    /**
     * TODO: Metodo que efectua um ajax request utilizado a localização e o sensor
     * se a query for iniciada a partir da localização recebe os sensores todos
     */
    getSensorFromPlace: function(place, sensor) {
      let routeServer = ''
      if (place && sensor) {
        routeServer = '/api/sensors/' + this.placeSelect + '/' + this.sensorSelect
      } else {
        console.log("btn1", this.places[EventBus.currentActiveRightComp], EventBus.elementControl[EventBus.currentActiveRightComp])
        this.placeSelect = this.places[EventBus.currentActiveRightComp].local
        this.sensorSelect = 'all'
        this.placeselected = true
        this.sensors = []
        place = ''
        sensor = ''
        routeServer = '/api/sensors/' + this.placeSelect + '/' + this.sensorSelect
      }
      // mostra a mensagem de notificação no ecrã
      this.$notifications.notify({
        message: 'Está a visuaizar o(s) sensor(es) "<b>' + this.sensorSelect + '</b>" da divisão "<b>' + this.placeSelect + '</b>".',
        icon: 'ti-bell',
        horizontalAlign: 'right',
        verticalAlign: 'top',
        type: 'success'
      })
      // efectua o ajax request
      this.$http
      .get(routeServer)
      .then(res => {
        if (res.data.status === true) {
          this.sensorsChart.data.series = []
          this.sensorsChart.data.labels = []
          let sensorOpt = res.data.data[0].values
          for (let index = 0; index < sensorOpt.length; index++) {
            // só carrega os sensores se o pedido for iniciaod de uma localização
            if (place.trim() === '' || sensor.trim() === '') {
              this.sensors.push({
                sensorName: sensorOpt[index].sensortype,
                id: index
              })
            }
            // constrroi os arrays com os valores da series do gráfico
            for (let index2 = 0; index2 < sensorOpt[index].value.length; index2++) {
              if (index2 === 0) {
                this.sensorsChart.data.series[index] = []
                this.sensorsChart.data.labels = []
              }
              this.sensorsChart.data.series[index].push(sensorOpt[index].value[index2].value)
              this.sensorsChart.data.labels.push(this.dateFormat2(sensorOpt[index].value[index2].time))
            }
          }
          // actualiza o gráfico
          this.$refs.chartCalls.initChart()
        } else {
          console.log('Receive error')
        }
      })
      .catch(error => {
        console.log(error)
      })
    },
    // evento iniciado apartir de um sensor
    getSensorValues: function() {
      // console.log('sensor', this.sensors[EventBus.currentActiveRightComp - this.places.length].sensorName)
      this.sensorSelect = this.sensors[EventBus.currentActiveRightComp - this.places.length].sensorName
      this.getSensorFromPlace(this.placeSelect, this.sensorSelect)
    },
    /**
     * TODO: Metodo para controlar os eventos do comando remoto quando esta é a view ativa no momento
     */
    controlEventsBus() {
      var self = this
      EventBus.$on('move-components', function(cmd) {
        EventBus.elementControl = document.getElementsByClassName('control-remote')
        switch (cmd) {
          // evento do 'OK'
          case 'ok_btn':
            try {
              console.log("'Ok btn")
              EventBus.elementControl[EventBus.currentActiveRightComp].click()
            } catch (e) {
              console.log("Try catch error", e.toString())
            }
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
          case 'up': // tecla para ciima

            break
          case 'down': // tecla para baixo

            break
          case 'right': // tecla para a direita
            EventBus.moveLeftRightInView(1)
            // notifica o utilizador dos eventos disponiveis no elemento activo
            self.$notifications.notify({
              message: 'Precione em "<b>Ok</b>" para visualizar o gráfico dos sensores da divisão. <br>Ou<br>Utilize as cetas para a direita ou para esquerda "<b class="ti-split-h"></b>" para navegar nas odivisões e sensores diponiveis.',
              icon: 'ti-bell',
              horizontalAlign: 'right',
              verticalAlign: 'top',
              type: 'success'
            })
            break
          case 'left': // tecla para a esquerda
            EventBus.moveLeftRightInView(-1)
            // notifica o utilizador dos eventos disponiveis no elemento activo
            self.$notifications.notify({
              message: 'Precione em "<b>Ok</b>" para visualizar o gráfico dos sensores da divisão. <br>Ou<br>Utilize as cetas para a direita ou para esquerda "<b class="ti-split-h"></b>" para navegar nas odivisões e sensores diponiveis.',
              icon: 'ti-bell',
              horizontalAlign: 'right',
              verticalAlign: 'top',
              type: 'success'
            })
            break
          default:
            console.log("No key available")
            EventBus.currentActiveRightComp = 0
            break
        }
      })
    }
  },
  beforeCreate() {},
  created() {
    this.$http
      .get('/api/sensors/places/all')
      .then(res => {
        if (res.data.status === true) {
          this.places = []
          for (var i in res.data.data) {
            this.places.push({
              local: res.data.data[i].location,
              id: res.data.data[i]._id
            })
          }
          this.$notifications.notify({
            message: 'Precione para a direita "<b class="ti-arrow-right"></b>" no seu coamndo para selecionar uma devisão. <br>Ou<br>Utilize as cetas para cima e para baixo "<b class="ti-split-v"></b>" para navegar para as outars opções.',
            icon: 'ti-bell',
            horizontalAlign: 'left',
            verticalAlign: 'top',
            type: 'success'
          })
          this.controlEventsBus()
        } else {
          console.log('Receive error')
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
.space10 {
    margin-right: 10px;
}
</style>
