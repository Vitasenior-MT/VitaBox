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

      <div class="col-xs-12">
      <div>
        <select class="control-remote">
          <option >option1</option>
          <option >option2</option>
          <option >option3</option>
          <option >option4</option>
          <option >option5</option>
        </select>
      </div>
      <div class="row"></div>
        <chart-card :chart-data="usersChart.data" :chart-options="usersChart.options">
          <h4 class="title" slot="title">Users behavior</h4>
          <span slot="subTitle"> 24 Hours performance</span>
          <span slot="footer">
            <i class="ti-reload"></i> Updated 3 minutes ago</span>
          <div slot="legend">
            <i class="fa fa-circle text-info"></i> Open
            <i class="fa fa-circle text-danger"></i> Click
            <i class="fa fa-circle text-warning"></i> Click Second Time
          </div>
        </chart-card>
      </div>

    </div>

  </div>
</template>
<script>
import UserInfo from 'components/UIComponents/Cards/UserInfo.vue'
import ChartCard from 'components/UIComponents/Cards/ChartCard.vue'
import { EventBus } from '../../../event-bus.js'
export default {
  components: {
    UserInfo,
    ChartCard
  },
  data() {
    return {
      statsCards: [],
      usersChart: {
        data: {
          labels: [
            '9:00AM',
            '12:00AM',
            '3:00PM',
            '6:00PM',
            '9:00PM',
            '12:00PM',
            '3:00AM',
            '6:00AM'
          ],
          series: [
            [287, 385, 490, 562, 594, 626, 698, 895, 952],
            [67, 152, 193, 240, 387, 435, 535, 642, 744],
            [23, 113, 67, 108, 190, 239, 307, 410, 410]
          ]
        },
        options: {
          low: 0,
          high: 1000,
          showArea: true,
          height: '245px',
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
      elementControl: []
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
    showDropdown: function(element) {
      var event;
      event = document.createEvent('MouseEvents');
      event.initMouseEvent('mousedown', true, true, window);
      element.dispatchEvent(event);
    },
    expand: function(obj) {
      obj.size = 5
    },
    unexpand: function(obj) {
      obj.size = 1
    },
    controlEventsBus() {
      var self = this
      EventBus.$on('move-components', function(cmd) {
        if (cmd === 'ok_btn') {
          console.log("'Ok btn")
          // self.expand(self.elementControl[EventBus.currentActiveRightComp])
          self.elementControl[EventBus.currentActiveRightComp].size = 3
          // self.unexpand(self.elementControl[EventBus.currentActiveRightComp])
        } else if (cmd === 'up') {
          /*
          let elem = self.elementControl[EventBus.currentActiveRightComp]
          let content = document.getElementsByClassName(
            'container-data-sensors'
          )[0]
          let numberCol = parseInt(content.clientWidth / elem.clientWidth)
          let movepos = EventBus.currentActiveRightComp - numberCol
          if (movepos < 0) {
            movepos += self.elementControl.length - 1
            if (movepos === self.elementControl.length - 1 - numberCol) {
              movepos += numberCol
            }
          }
          self.elementControl[EventBus.currentActiveRightComp].classList.remove(
            'btn-fill'
          )
          EventBus.currentActiveRightComp = movepos
          elem = self.elementControl[EventBus.currentActiveRightComp]
          elem.focus()
          elem.classList.add('btn-fill')
          EventBus.scrollScreen(elem)
          */
        } else if (cmd === 'down') {
          /*
          let elem = self.elementControl[EventBus.currentActiveRightComp]
          let content = document.getElementsByClassName(
            'container-data-sensors'
          )[0]
          let numberCol = parseInt(content.clientWidth / elem.clientWidth)
          let movepos = EventBus.currentActiveRightComp + numberCol
          if (movepos > self.elementControl.length - 1) {
            movepos -= self.elementControl.length - 1
            if (movepos === numberCol) {
              movepos = 0
            }
          }
          self.elementControl[EventBus.currentActiveRightComp].classList.remove(
            'btn-fill'
          )
          EventBus.currentActiveRightComp = movepos
          elem = self.elementControl[EventBus.currentActiveRightComp]
          elem.focus()
          elem.classList.add('btn-fill')
          EventBus.scrollScreen(elem)
          */
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
  beforeCreate() {
    this.$http
      .get('/api/getPatientsData')
      .then(response => {
        let data = response.body.data
        for (var index in data) {
          this.statsCards.push({
            type: 'warning',
            icon: 'ti-server',
            name: data[index].name,
            gender: data[index].gender,
            birthdate: this.dateFormat(data[index].birthdate),
            age: this.getAge(data[index].birthdate),
            footerIcon: 'ti-reload'
          })
        }
        console.log(response)
      })
      .catch(error => {
        console.log(error)
      })
  },
  created() {
    this.elementControl = document.getElementsByClassName('control-remote')
    this.controlEventsBus()
  }
}
</script>
<style>
</style>
