<template>
  <div>
    <div class="row container-data-sensors">
      <div class="col-lg-4" v-for="warningCard in warningCards" :key="warningCard.id">
        <card-warning :key="warningCard.id" :warningCard="warningCard"></card-warning>
      </div>
    </div>
    <default-form ref="DefaultView"></default-form>
  </div>
</template>
<script>
import CardWarning from 'components/UIComponents/Cards/CardWarning4.vue'
import { EventBus } from '../../../event-bus.js'
import DefaultForm from 'components/UIComponents/Forms/defaultform.vue'
export default {
  components: {
    CardWarning,
    DefaultForm
  },
  sockets: {
    vitaWarning: data => {
      console.log('Receive alert on Tab: ', data)
      // this.updateSensor(data);
    }
  },
  data() {
    return {
      msg: 'Sem sensores.',
      warningCards: [],
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
    updateSensor(data) {
      for (var index in data) {
        if (data.location === this.warningCards[index].headerText) {
          if (data.warning_type === this.warningCards[index].sensor) {
            this.warningCards[index].idchart = 'chartid-' + index
            this.warningCards[index].avg = data[index].avg
            this.warningCards[index].threshold = data[index].threshold
            this.warningCards[index].sensor = data[index].sensortype
            this.warningCards[index].measure = data[index].measure
            this.warningCards[index].location = data[index].location
            this.warningCards[index].dateupdate = this.dateFormat(
              data[index].avgLastUpdate
            )
            this.warningCards[index].footerIcon = 'ti-reload'
            this.warningCards[index].symbol = ''
            switch (this.warningCards[index].sensor) {
              case 'temp':
                this.warningCards[index].symbol = 'º'
                break
              case 'monoxido':
              case 'co2':
              case 'humi':
                this.warningCards[index].symbol = '%'
                break
              default:
                this.warningCards[index].symbol = ''
            }
            break
          }
        }
      }
      for (var index2 in this.warningCards) {
        if (data.location === this.warningCards[index2].headerText) {
          if (data.warning_type === this.warningCards[index2].sensor) {
            this.warningCards[index2].avg = data.avg.toFixed()
            this.warningCards[index2].avgLastUpdate = data.avgLastUpdate
            this.warningCards[index2].threshold = data.threshold
            this.warningCards[index2].footerText = this.dateFormat(
              data.avgLastUpdate
            )
            this.warningCards[index2].critLvl = data.critLevel
            break
          }
        }
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
          EventBus.setSidebar()
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
  beforeDestroy() {
    EventBus.$off('move-components')
  },
  beforeCreate() {
  },
  mounted() {
    if (this.warningCards.length === 0) {
      this.$refs.DefaultView.setMsg(this.msg)
      this.$refs.DefaultView.show()
    }
  },
  created() {
    this.$http
      .get('/api/sensor/allSensorsInfo')
      .then(response => {
        if (response.data.status === true) {
          var datasensores = response.data.data
          for (var index in datasensores) {
            this.warningCards.push({
              idchart: 'chartid-' + index,
              avg: datasensores[index].avg,
              threshold_max_acceptable: datasensores[index].threshold_max_acceptable === undefined ? 100 : datasensores[index].threshold_max_acceptable,
              threshold_max_possible: datasensores[index].threshold_max_possible === undefined ? 100 : datasensores[index].threshold_max_possible,
              threshold_min_acceptable: datasensores[index].threshold_min_acceptable === undefined ? 100 : datasensores[index].threshold_min_acceptable,
              threshold_min_possible: datasensores[index].threshold_min_possible === undefined ? 100 : datasensores[index].threshold_min_possible,
              sensor: datasensores[index].sensortype,
              location: datasensores[index].location,
              measure: datasensores[index].measure,
              dateupdate: this.dateFormat(datasensores[index].avgLastUpdate),
              footerIcon: 'ti-reload',
              symbol: ''
            })
            switch (this.warningCards[index].sensor) {
              case 'temp':
                this.warningCards[index].symbol = 'º'
                break
              case 'monoxido':
              case 'co2':
              case 'humi':
                this.warningCards[index].symbol = '%'
                break
              default:
                this.warningCards[index].symbol = ''
            }
          }
          this.controlEventsBus()
        } else {
          console.log('Receive error', response.data)
        }
      })
      .catch(error => {
        console.log(error)
      })
  }
}
</script>
<style>
</style>
