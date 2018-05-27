<template>
  <div>
    <div class="row container-data-sensors">
      <div class="col-lg-12" v-for="warningCard in CardsSensors" :key="warningCard.board_id">
        <CardWarning3 :key="warningCard.board_id + '-all'" :warningCard="warningCard">
        </CardWarning3>
      </div>
    </div>
    <default-form ref="DefaultView"></default-form>
  </div>
</template>
<script>
import CardWarning3 from 'components/UIComponents/Cards/CardWarning3.vue'
import { EventBus } from '../../../event-bus.js'
import DefaultForm from 'components/UIComponents/Forms/defaultform.vue'
export default {
  components: {
    CardWarning3,
    DefaultForm
  },
  sockets: {
    avgSensorUpdate: function(data) {
      for (let index in this.CardsSensors) {
        if (this.CardsSensors[index].board_id === data.board_id) {
          if (this.CardsSensors[index].sensortype === data.sensortype) {
            this.CardsSensors[index].idchar = 'id-' + data.board_id + '-' + data.sensortype
            this.CardsSensors[index].avg = Math.round(data.avg * 100) / 100
            this.CardsSensors[index].avglastupdate = this.dateFormat(data.avgLastUpdate)
            this.CardsSensors[index].sensortype = data.sensortype
            this.CardsSensors[index].threshold = data.threshold_max_possible
          }
        }
      }
    }
  },
  data() {
    return {
      msg: 'showData.msgSensor',
      CardsSensors: [],
      elem: '',
      content: '',
      numberCol: '',
      movepos: ''
    }
  },
  methods: {
    dateFormat(data) {
      let date = new Date(data)
      return (
        (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) +
        '/' +
        (date.getMonth() + 1 < 10
          ? '0' + (date.getMonth() + 1)
          : date.getMonth() + 1) +
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
    sortArrayByLength(arr, ascYN) {
      arr.sort(function(a, b) {
        // sort array by length of text
        if (ascYN) {
          return a.sensors.length - b.sensors.length // ASC -> a - b
        } else {
          return b.sensors.length - a.sensors.length // DESC -> b - a
        }
      })
    },
    controlEventsBus() {
      var self = this
      if (self.CardsSensors.length > 0) {
        self.$refs.DefaultView.hide()
      }
      EventBus.$on('move-components', function(cmd) {
        EventBus.elementControl = document.getElementsByClassName('control-remote')
        if (EventBus.elementControl.length === 0) {
          EventBus.setSidebar()
        }
        self.$refs.DefaultView.hide()
        switch (cmd) {
          // evento do 'OK'
          case 'ok_btn':
            EventBus.elementControl[EventBus.currentActiveRightComp].click()
            console.log("'Ok btn")
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
          case 'up':
            self.elem = EventBus.elementControl[EventBus.currentActiveRightComp]
            self.content = document.getElementsByClassName('container-data-sensors')[0]
            self.numberCol = parseInt((self.content.clientWidth / self.elem.clientWidth))
            self.movepos = EventBus.currentActiveRightComp - self.numberCol
            if (self.movepos < 0) {
              self.movepos += (EventBus.elementControl.length - 1)
              if (self.movepos === (EventBus.elementControl.length - 1) - self.numberCol) {
                self.movepos += self.numberCol
              }
            }
            EventBus.elementControl[EventBus.currentActiveRightComp].classList.remove('btn-fill')
            EventBus.currentActiveRightComp = self.movepos
            self.elem = EventBus.elementControl[EventBus.currentActiveRightComp]
            self.elem.focus()
            self.elem.classList.add('btn-fill')
            EventBus.scrollScreen(self.elem)
            break
          case 'down':
            self.elem = EventBus.elementControl[EventBus.currentActiveRightComp]
            self.content = document.getElementsByClassName('container-data-sensors')[0]
            self.numberCol = parseInt((self.content.clientWidth / self.elem.clientWidth))
            self.movepos = EventBus.currentActiveRightComp + self.numberCol
            if (self.movepos > (EventBus.elementControl.length - 1)) {
              self.movepos -= (EventBus.elementControl.length - 1)
              if (self.movepos === self.numberCol) {
                self.movepos = 0
              }
            }
            EventBus.elementControl[EventBus.currentActiveRightComp].classList.remove('btn-fill')
            EventBus.currentActiveRightComp = self.movepos
            self.elem = EventBus.elementControl[EventBus.currentActiveRightComp]
            self.elem.focus()
            self.elem.classList.add('btn-fill')
            EventBus.scrollScreen(self.elem)
            break
          case 'right': // tecla para a direita
            EventBus.moveLeftRightInView(1)
            break
          case 'left': // tecla para a esquerda
            EventBus.moveLeftRightInView(-1)
            break
          default:
            console.log("No key available")
            EventBus.currentActiveRightComp = 0
            break;
        }
      })
    }
  },
  mounted() {
    if (this.CardsSensors.length === 0) {
      this.$refs.DefaultView.setMsg(this.msg)
      this.$refs.DefaultView.show()
    }
  },
  created() {
    this.$http
      .get('/api/sensor/getAllSensorsByLocation')
      .then(response => {
        if (response.data.status === true) {
          var datasensores = response.data.data
          for (var index in datasensores) {
            this.CardsSensors.push({
              board_id: datasensores[index].board_id,
              location: datasensores[index].location,
              sensors: [{
                idchar: 'id-' + datasensores[index].board_id + '-' + datasensores[index].sensortype,
                avg: Math.round(datasensores[index].avg * 100) / 100,
                avgLastUpdate: this.dateFormat(datasensores[index].avgLastUpdate
                ),
                sensor: datasensores[index].sensortype,
                measure: datasensores[index].measure,
                threshold: (datasensores[index].threshold_max_possible === undefined ? 100 : datasensores[index].threshold_max_possible)
              }]
            })
          }
          this.sortArrayByLength(this.CardsSensors, true)
          this.controlEventsBus()
        } else {
          console.log('Receive error', response.data)
        }
      })
      .catch(error => {
        console.log(error)
      })
  },
  beforeDestroy() {
    EventBus.$off('move-components')
  },
  beforeCreate() {
    // console.log('Remotes', EventBus.elementControl)
  }
}
</script>
<style>
</style>
