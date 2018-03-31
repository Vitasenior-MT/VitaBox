<template>
  <div>

    <!--Stats cards-->
    <div class="row">
      <div class="col-lg-3 col-sm-6" v-for="stats in statsCards" :key='stats.id'>
        <user-info :data="stats" ><user-info>
      </div>
    </div>

    <!--Charts-->

      <div class="row">
    <div class="row">
      <div class="col-xs-12">
        <div class="col-md-3">
          <div class="form-group">
            <label for="selectOptPlace" class="col-3 col-form-label">Selecione uma Divisão</label>
            <select v-model="selected" class="custom-select form-control btn-info control-remote" id="selectOptPlace" @click="getSensorFromPlace()">
            </select>
          </div>
        </div>
        <div class="col-md-3 showSelect2">
          <div class="form-group">
            <label for="selectOptSensors" class="col-3 col-form-label">Selecione um Sensor</label>
            <select v-model="selectedSensor" class="custom-select form-control btn-info control-remote" id="selectOptSensors" @click="getSensorValues()">
            </select>
          </div>
        </div>
      </div>
      </div>
    <div class="row showSelect2">
        <chart-card ref="chartCalls" :chart-data="sensorsChart.data" :chart-options="sensorsChart.options">
          <h4 class="title" slot="title">Local <b class="titleLocal"></b> </h4>
          <span slot="subTitle">Sensor <b class="subtituloLocal"></b> </span>
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
      places: [],
      sensors: [],
      elementControl: [],
      dropOpen: false,
      allOptions: [],
      optSelect: -1
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
    expand: function(obj) {
      let sizeDrop = obj.length
      obj.size = sizeDrop > 5 ? 5 : sizeDrop
    },
    unexpand: function(obj) {
      obj.size = 1
    },
    getSensorFromPlace: function(place, sensor) {
      let opt = ''
      let routeServer = ''
      if (place && sensor) {
        routeServer = '/api/sensors/' + place + '/' + sensor
        if (place.trim() === '' || sensor.trim() === '') {
          return
        }
      } else {
        opt = this.elementControl[EventBus.currentActiveRightComp].options[this.optSelect]
        routeServer = '/api/sensors/' + opt.text + '/all'
        place = opt.text
        sensor = 'all'
        if (opt.text.trim() === '') {
          return
        }
      }
      let setVisible = document.getElementsByClassName('showSelect2')
      for (let index = 0; index < setVisible.length; index++) {
        setVisible[index].style.visibility = 'visible'
      }
      document.getElementsByClassName('titleLocal')[0].innerHTML = place
      document.getElementsByClassName('subtituloLocal')[0].innerHTML = sensor
      this.$http
      .get(routeServer)
      .then(res => {
        if (res.data.status === true) {
          var select2 = ''
          if (opt !== '') {
            this.sensors = []
            select2 = document.getElementById('selectOptSensors')
            select2.innerHTML = ''
            let option = document.createElement('option')
            option.value = '-1'
            option.text = 'all'
            select2.add(option);
          }
          this.sensorsChart.data.series = []
          this.sensorsChart.data.labels = []
          let sensorOpt = res.data.data[0].values
          for (let index = 0; index < sensorOpt.length; index++) {
            if (opt !== '') {
              let option = document.createElement('option')
              option.value = sensorOpt[index].sensortype
              option.text = sensorOpt[index].sensortype
              select2.add(option);
            }
            for (let index2 = 0; index2 < sensorOpt[index].value.length; index2++) {
              if (index2 === 0) {
                this.sensorsChart.data.series[index] = []
                this.sensorsChart.data.labels = []
              }
              this.sensorsChart.data.series[index].push(sensorOpt[index].value[index2].value)
              this.sensorsChart.data.labels.push(this.dateFormat2(sensorOpt[index].value[index2].time))
            }
          }
          this.$refs.chartCalls.initChart()
        } else {
          console.log('Receive error')
        }
      })
      .catch(error => {
        console.log(error)
      })
    },
    getSensorValues: function() {
      let optT1 = this.findSeledtedItem(this.elementControl[EventBus.currentActiveRightComp - 1].options).option.text
      let opt = this.elementControl[EventBus.currentActiveRightComp].options[this.optSelect]
      this.getSensorFromPlace(optT1, opt.text)
    },
    findSeledtedItem: function(options) {
      let numItem = { pos: 0, option: null }
      for (let index = 0; index < options.length; index++) {
        if (options[index].selected === true) {
          numItem = {
            pos: index,
            option: options[index]
          }
          return numItem
        }
      }
      return numItem
    },
    controlEventsBus() {
      var self = this
      EventBus.$on('move-components', function(cmd) {
        self.elementControl = document.getElementsByClassName('control-remote')
        switch (cmd) {
          case 'ok_btn':
            console.log("'Ok btn")
            if (self.dropOpen) {
              self.unexpand(self.elementControl[EventBus.currentActiveRightComp])
              self.elementControl[EventBus.currentActiveRightComp].options[self.optSelect].click()
            } else {
              self.expand(self.elementControl[EventBus.currentActiveRightComp])
            }
            self.dropOpen = !self.dropOpen
            break
          case 'up':
            if (self.dropOpen) {
              self.allOptions = self.elementControl[EventBus.currentActiveRightComp].options
              self.optSelect = self.findSeledtedItem(self.allOptions).pos
              self.optSelect--
              if (self.optSelect < 0) {
                self.optSelect = 0
              }
              self.allOptions[self.optSelect].selected = true
            }
            break
          case 'down':
            if (self.dropOpen) {
              self.allOptions = self.elementControl[EventBus.currentActiveRightComp].options
              self.optSelect = self.findSeledtedItem(self.allOptions).pos
              self.optSelect++
              if (self.optSelect >= self.allOptions.length - 1) {
                self.optSelect = self.allOptions.length - 1
              }
              self.allOptions[self.optSelect].selected = true
            }
            break
          case 1:
          case -1:
            if (self.dropOpen) {
              self.elementControl[EventBus.currentActiveRightComp].options[self.optSelect].click()
              self.unexpand(self.elementControl[EventBus.currentActiveRightComp])
              self.dropOpen = false
            }
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
              console.log('if exit', cmd, EventBus.currentActiveRightComp)
              self.dropOpen = false
              self.allOptions = []
              self.optSelect = -1
              return
            }
            self.elem = self.elementControl[EventBus.currentActiveRightComp]
            self.elem.focus()
            self.elem.classList.add('btn-fill')
            EventBus.scrollScreen(self.elem)
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
          var select1 = document.getElementById('selectOptPlace')
          select1.innerHTML = ""
          let option = document.createElement('option')
          option.value = '-1'
          option.text = ' '
          select1.add(option);
          for (var i in res.data.data) {
            let option = document.createElement('option')
            option.value = res.data.data[i]._id
            option.text = res.data.data[i].location
            select1.add(option);
          }
          this.controlEventsBus()
        } else {
          console.log('Receive error')
        }
      })
      .catch(error => {
        console.log(error)
      })
  }
}
</script>
<style>
.showSelect2 {
  visibility: hidden;
}
</style>
