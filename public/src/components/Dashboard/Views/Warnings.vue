<template>
  <div class="row">
    <div class='col-sm-12 container-data-sensors'>
      <div class='col-sm-4' v-for='warningCard in warningCards' :key='warningCard.id'>
        <warning-card :data='warningCard'></warning-card>
      </div>
    </div>
    <default-form ref="DefaultView"></default-form>
  </div>
</template>
<script>
import WarningCard from 'components/UIComponents/Cards/WarningCard2.vue'
import { EventBus } from '../../../event-bus.js'
import DefaultForm from 'components/UIComponents/Forms/defaultform.vue'
export default {
  components: {
    WarningCard,
    DefaultForm
  },
  sockets: {
    vitaWarning: function(data) {
      var self = this
      this.updateSensor(data)
      clearTimeout(this.timeout);
      this.timeout = setTimeout(()=>{
        self.warningCards = []
        self.$refs.DefaultView.setMsg(this.msg)
        self.$refs.DefaultView.show()
      }, this.timeCalculator(0, 5, 0))
    }
  },
  data() {
    return {
      msg: this.$t("warnings.nosensors.title"),
      warningCards: [],
      elem: '',
      content: '',
      numberCol: '',
      movepos: '',
      timeout: null,
    }
  },
  methods: {
    timeCalculator: function (h, m, s) {
      let time = 0;
      if (h > 0) {
        time = time + (h * 60 * 60 * 1000)
      }
      if (m > 0) {
        time = time + (m * 60 * 1000)
      }
      if (s > 0) {
        time = time + (s * 1000)
      }
      return time
    },
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
      if (this.warningCards.length > 0) {
        for (var index in this.warningCards) {
          if (data.location === this.warningCards[index].headerText) {
            if (data.warning_type === this.warningCards[index].sensor) {
              this.warningCards[index].avg = data.avg.toFixed()
              this.warningCards[index].avgLastUpdate = data.avgLastUpdate
              this.warningCards[index].threshold = data.threshold_max_possible
              this.warningCards[index].footerText = this.dateFormat(data.avgLastUpdate)
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
                threshold: data.threshold_max_possible,
                critLvl: data.critLevel
              })
            }
            this.$refs.DefaultView.hide()
          })
          .catch(error => {
            console.log(error)
          })
      }
    },
    controlEventsBus() {
      var self = this
      if (self.warningCards.length > 0) {
        self.$refs.DefaultView.hide()
      }
      EventBus.$on('move-components', function(cmd) {
        EventBus.elementControl = document.getElementsByClassName('control-remote')
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
          // evento do 'OK'
          case 'ok_btn':
            console.log("'Ok btn")
            EventBus.elementControl[EventBus.currentActiveRightComp].click()
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
            try {
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
            } catch (e) {
              console.log('error move up', e.toStrig())
            }
            break
          case 'down':
            try {
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
            } catch (e) {
              console.log('error move down', e.toStrig())
            }
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
    if (this.warningCards.length === 0) {
      this.$refs.DefaultView.setMsg(this.msg)
      this.$refs.DefaultView.show()
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
              threshold: data.threshold_max_possible,
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
  }
}
</script>
<style>
</style>
