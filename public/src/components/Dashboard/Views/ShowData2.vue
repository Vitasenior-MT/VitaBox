<template>
  <div>
    <div class="row container-data-sensors">
      <div class="col-lg-6" v-for="warningCard in CardsSensors" :key="warningCard.board_id">
        <CardWarning3 :key="warningCard.id + '-all'" :warningCard="warningCard">
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
          for (let index2 in this.CardsSensors[index].sensors) {
            if (this.CardsSensors[index].sensors[index2].sensortype === data.sensortype) {
              this.CardsSensors[index].sensors[index2].idchar = 'id-' + data.board_id + '-' + data.sensortype
              this.CardsSensors[index].sensors[index2].avg = Math.round(data.avg * 100) / 100
              this.CardsSensors[index].sensors[index2].avglastupdate = this.dateFormat(data.avgLastUpdate)
              this.CardsSensors[index].sensors[index2].sensor = data.sensortype
              this.CardsSensors[index].sensors[index2].threshold_max_possible = data.threshold_max_possible
            }
          }
        }
      }
    }
  },
  data() {
    return {
      msg: 'Sem sensores.',
      CardsSensors: [],
      elementControl: [],
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
        self.elementControl = document.getElementsByClassName('control-remote')
        if (EventBus.elementControl.length === 0) {
          self.$refs.DefaultView.setMsg(self.msg)
          self.$refs.DefaultView.show()
          EventBus.currentActiveRightComp = 0
          EventBus.firstRightEvent = true
          EventBus.elementControl = []
          EventBus.currentComponent = EventBus.sidebarName
          return
        }
        self.$refs.DefaultView.hide()
        switch (cmd) {
          case 'ok_btn':
            self.elementControl[EventBus.currentActiveRightComp].click()
            console.log("'Ok btn")
            break
          case 'up':
            self.elem = self.elementControl[EventBus.currentActiveRightComp]
            self.content = document.getElementsByClassName('container-data-sensors')[0]
            self.numberCol = parseInt((self.content.clientWidth / self.elem.clientWidth))
            self.movepos = EventBus.currentActiveRightComp - self.numberCol
            if (self.movepos < 0) {
              self.movepos += (self.elementControl.length - 1)
              if (self.movepos === (self.elementControl.length - 1) - self.numberCol) {
                self.movepos += self.numberCol
              }
            }
            self.elementControl[EventBus.currentActiveRightComp].classList.remove('btn-fill')
            EventBus.currentActiveRightComp = self.movepos
            self.elem = self.elementControl[EventBus.currentActiveRightComp]
            self.elem.focus()
            self.elem.classList.add('btn-fill')
            EventBus.scrollScreen(self.elem)
            break
          case 'down':
            self.elem = self.elementControl[EventBus.currentActiveRightComp]
            self.content = document.getElementsByClassName('container-data-sensors')[0]
            self.numberCol = parseInt((self.content.clientWidth / self.elem.clientWidth))
            self.movepos = EventBus.currentActiveRightComp + self.numberCol
            if (self.movepos > (self.elementControl.length - 1)) {
              self.movepos -= (self.elementControl.length - 1)
              if (self.movepos === self.numberCol) {
                self.movepos = 0
              }
            }
            self.elementControl[EventBus.currentActiveRightComp].classList.remove('btn-fill')
            EventBus.currentActiveRightComp = self.movepos
            self.elem = self.elementControl[EventBus.currentActiveRightComp]
            self.elem.focus()
            self.elem.classList.add('btn-fill')
            EventBus.scrollScreen(self.elem)
            break
          case 1:
          case -1:
            if (EventBus.firstRightEvent) {
              cmd = 0
              EventBus.firstRightEvent = false
            }
            self.elementControl[EventBus.currentActiveRightComp].classList.remove('btn-fill')
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
            console.log(cmd, EventBus.currentActiveRightComp)
            self.elem = self.elementControl[EventBus.currentActiveRightComp]
            self.elem.focus()
            self.elem.classList.add('btn-fill')
            EventBus.scrollScreen(self.elem)
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
      .get('/api/sensor/getSensorsByLocation')
      .then(response => {
        if (response.data.status === true) {
          var datasensores = response.data.data
          for (var index in datasensores) {
            this.CardsSensors.push({
              board_id: datasensores[index].values[0].board_id,
              location: datasensores[index]._id,
              sensors: []
            })
            for (let i in datasensores[index].values) {
              this.CardsSensors[index].sensors.push({
                idchar: 'id-' + datasensores[index].values[i].board_id + '-' + datasensores[index].values[i].sensortype,
                avg: Math.round(datasensores[index].values[i].avg * 100) / 100,
                avgLastUpdate: this.dateFormat(datasensores[index].values[i].avgLastUpdate
                ),
                sensor: datasensores[index].values[i].sensortype,
                measure: datasensores[index].values[i].measure,
                threshold: (datasensores[index].values[i].threshold_max_possible === undefined ? 100 : datasensores[index].values[i].threshold_max_possible)
              })
            }
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
    // console.log('Remotes', this.elementControl)
  }
}
</script>
<style>
</style>
