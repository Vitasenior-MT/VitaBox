<template>
  <div>
    <div class="row container-data-sensors">
      <div class="col-lg-3 col-ajust" v-for="warningCard in warningCards" :key="warningCard.id">
        <card-warning :key="warningCard.id" :warningCard="warningCard"
        :data-avg="warningCard.avg"
        :data-sensortype="warningCard.measure + ' (' + warningCard.symbol + ')'"
        :data-reading="warningCard.to_read"
        :data-symbol="warningCard.symbol"
        :data-threshold="warningCard.threshold_max_possible"
        :data-location="warningCard.location"></card-warning>
      </div>
    </div>
    <default-form ref="DefaultView"></default-form>
  </div>
</template>
<script>
import CardWarning from 'components/UIComponents/Cards/ShowDataCard.vue'
import { EventBus } from '../../../event-bus.js'
import DefaultForm from 'components/UIComponents/Forms/defaultform.vue'
export default {
  components: {
    CardWarning,
    DefaultForm
  },
  sockets: {
    sensorUpdate: function(data) {
      if (this.warningCards.length > 0) {
        let card = EventBus.findOne(this.warningCards, data)
        if (card) {
          card.avg = data.avg.toFixed()
          card.avgLastUpdate = data.avgLastUpdate
          card.dateupdate = EventBus.dateFormat(data.avgLastUpdate)
        }
      } else {
        this.$http
          .get('/api/sensor/allCriticalSensors')
          .then(response => {
            var datasensores = response.data.data
            for (var index in datasensores) {
              this.warningCards.push({
                id: datasensores[index].board_id,
                idchart: 'chartid-' + index,
                avg: datasensores[index].avg.toFixed(),
                threshold_max_acceptable: datasensores[index].threshold_max_acceptable === undefined ? 100 : datasensores[index].threshold_max_acceptable,
                threshold_max_possible: datasensores[index].threshold_max_possible === undefined ? 100 : datasensores[index].threshold_max_possible,
                threshold_min_acceptable: datasensores[index].threshold_min_acceptable === undefined ? 100 : datasensores[index].threshold_min_acceptable,
                threshold_min_possible: datasensores[index].threshold_min_possible === undefined ? 100 : datasensores[index].threshold_min_possible,
                sensor: datasensores[index].sensortype,
                location: datasensores[index].location,
                measure: datasensores[index].measure,
                symbol: datasensores[index].unit,
                to_read: datasensores[index].to_read,
                dateupdate: EventBus.dateFormat(datasensores[index].avgLastUpdate),
                footerIcon: 'ti-reload'
              })
            }
            this.$refs.DefaultView.hide()
          })
          .catch(error => {
            console.log(error)
          })
      }
    }
  },
  data() {
    return {
      msg: 'warning.msgSensor',
      warningCards: [],
      elem: '',
      content: '',
      numberCol: '',
      movepos: '',
      locationList: []
    }
  },
  methods: {
    audioPlayer(dataset) {
      EventBus.soundTTS(this.$t('showdata.info', {sensortype: dataset.reading, location: dataset.location, avg: dataset.avg, symbol: dataset.symbol}))
    },
    getAllSensors() {
      this.$refs.loading.show()
      this.resetValues()
      this.division = EventBus.elementControl[EventBus.currentActiveRightComp].dataset.division
      this.$http
        .get('/api/sensor/getSensorsInfo/' + this.division)
        .then(response => {
          console.log(response)
          console.log(response.data.data)
        })
        .catch(error => {
          console.log(error)
        })
    },
    controlEventsBus() {
      var self = this
      if (self.warningCards.length > 0) {
        try {
          self.$refs.DefaultView.hide()
        } catch (e) {}
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
            // console.log("'Ok btn")
            EventBus.elementControl[EventBus.currentActiveRightComp].click()
            break
            // evento para sair para a sidebar
          case 'exit':
            EventBus.removeAudio()
            // remove o preenchimento
            // console.log("Elem num - ", EventBus.currentActiveRightComp)
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
            // console.log('if exit', cmd, EventBus.currentActiveRightComp)
            EventBus.setSidebar()
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
              self.audioPlayer(EventBus.elementControl[EventBus.currentActiveRightComp].dataset)
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
              self.audioPlayer(EventBus.elementControl[EventBus.currentActiveRightComp].dataset)
            } catch (e) {
              console.log('error move down', e.toStrig())
            }
            break
          case 'right': // tecla para a direita
            EventBus.moveLeftRightInElemts(1, 'btn-fill')
            self.audioPlayer(EventBus.elementControl[EventBus.currentActiveRightComp].dataset)
            break
          case 'left': // tecla para a esquerda
            if (cmd === 'left' && EventBus.currentActiveRightComp - 1 < 0) {
              return EventBus.$emit('move-components', 'exit')
            }
            EventBus.moveLeftRightInElemts(-1, 'btn-fill')
            self.audioPlayer(EventBus.elementControl[EventBus.currentActiveRightComp].dataset)
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
    EventBus.setSidebar()
    EventBus.$off('move-components')
  },
  beforeCreate() {
    this.$http
      .get('/api/sensor/getListOfLocations')
      .then(response => {
        this.locationList = response.data.data
      })
      .catch(error => {
        console.log(error)
      })
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
              id: datasensores[index].board_id,
              idchart: 'chartid-' + index,
              avg: datasensores[index].avg.toFixed(),
              threshold_max_acceptable: datasensores[index].threshold_max_acceptable === undefined ? 100 : datasensores[index].threshold_max_acceptable,
              threshold_max_possible: datasensores[index].threshold_max_possible === undefined ? 100 : datasensores[index].threshold_max_possible,
              threshold_min_acceptable: datasensores[index].threshold_min_acceptable === undefined ? 100 : datasensores[index].threshold_min_acceptable,
              threshold_min_possible: datasensores[index].threshold_min_possible === undefined ? 100 : datasensores[index].threshold_min_possible,
              sensor: datasensores[index].sensortype,
              location: datasensores[index].location,
              measure: datasensores[index].measure,
              to_read: datasensores[index].to_read,
              symbol: datasensores[index].unit,
              dateupdate: EventBus.dateFormat(datasensores[index].avgLastUpdate),
              footerIcon: 'ti-reload'
            })
            this.warningCards.sort((a, b) => a['id'].localeCompare(b['id']))
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
