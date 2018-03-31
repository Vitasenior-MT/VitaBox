<template>
  <div class="row">
    <div class='col-sm-12 container-data-sensors'>
      <div class='col-sm-4' v-for='warningCard in warningCards' :key='warningCard.id'>
        <warning-card :data='warningCard'></warning-card>
      </div>
    </div>
  </div>
</template>
<script>
import WarningCard from 'components/UIComponents/Cards/WarningCard2.vue'
import { EventBus } from '../../../event-bus.js'
export default {
  components: {
    WarningCard
  },
  sockets: {
    vitaWarning: function(data) {
      console.log('Receive alert on Tab: ', data)
      this.updateSensor(data)
    }
  },
  data() {
    return {
      warningCards: [],
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
    updateSensor(data) {
      if (this.warningCards) {
        for (var index in this.warningCards) {
          if (data.location === this.warningCards[index].headerText) {
            if (data.warning_type === this.warningCards[index].sensor) {
              this.warningCards[index].avg = data.avg.toFixed()
              this.warningCards[index].avgLastUpdate = data.avgLastUpdate
              this.warningCards[index].threshold = data.threshold
              this.warningCards[index].footerText = this.dateFormat(
                data.avgLastUpdate
              )
              this.warningCards[index].critLvl = data.critLevel
              break
            }
          }
        }
      } else {
        this.$http
          .get('/api/sensor/allCriticalSensors/2')
          .then(response => {
            for (var index in response.data.data) {
              let data = response.data.data[index]
              this.warningCards.push({
                headerText: data.location,
                footerText: this.dateFormat(data.avgLastUpdate),
                footerIcon: 'ti-reload',
                sensor: data.sensortype,
                avg: data.avg.toFixed(),
                avgLastUpdate: data.avgLastUpdate,
                threshold: data.threshold,
                critLvl: data.critLevel
              })
            }
          })
          .catch(error => {
            console.log(error)
          })
      }
    },
    controlEventsBus() {
      var self = this
      EventBus.$on('move-components', function(cmd) {
        self.elementControl = document.getElementsByClassName('control-remote')
        switch (cmd) {
          case 'ok_btn':
            console.log("'Ok btn")
            self.elementControl[EventBus.currentActiveRightComp].click()
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
  created() {
    this.$http
        .get('/api/sensor/allCriticalSensors/2')
        .then(response => {
          for (var index in response.data.data) {
            let data = response.data.data[index]
            this.warningCards.push({
              headerText: data.location,
              footerText: this.dateFormat(data.avgLastUpdate),
              footerIcon: 'ti-reload',
              sensor: data.sensortype,
              avg: data.avg.toFixed(),
              avgLastUpdate: data.avgLastUpdate,
              threshold: data.threshold,
              critLvl: data.critLevel
            })
          }
          this.controlEventsBus()
        })
        .catch(error => {
          console.log(error)
        })
  },
  beforeDestroy() {
    EventBus.$off('move-components')
  },
  beforeCreate() {
    // console.log("Remotes", this.elementControl)
  }
}
</script>
<style>
</style>
