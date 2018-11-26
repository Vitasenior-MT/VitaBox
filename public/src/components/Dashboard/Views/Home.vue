<template>
  <div class="row clear-margin">
    <div class="row" v-show="date !== 0">
      <div class="col-lg-12 btn btn-round btn-fill clear-margin">
        <div class="row">
          <div class="col-md-12">
            <div class="col-md-6">
              <h3 class="date">{{ date }}</h3>
            </div>
            <div class="col-md-6 table-tempo" v-show="tempoResult !== ''">
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-lg-12">&nbsp;</div>
    </div>
    <div class="row">
      <div class="col-lg-4" v-show="farmaciasOk">
        <div class="row btn btn-round btn-fill clear-margin">
          <div class="col-lg-12">
            <h4 class="h-ajust text-left">{{ $t('home.farmacy.0') }}<br>{{ $t('home.farmacy.1') }}{{districtToGet}}<br>{{ $t('home.farmacy.2') }}{{localityToGet}}</h4>
          </div>
          <div class="col-md-12 col-ajust" v-for="farmacia in farmacias" :key='farmacia.id'>
            <div class='card btn btn-info control-remote col-lg-12'>
              <div class='content'>
                <div class='row'>
                  <div class='col-lg-2'>
                    <span>
                      <img src="static/img/vitabox/farmacy.svg" width='40' height='40'>
                    </span>
                  </div>
                  <div class='col-lg-10'>
                    <div class='numbers'>
                      {{ $t('home.farmacy.farmacy') }}
                    </div>
                    <b></b>
                  </div>
                </div>
                <div class='content text-left'>
                  <p v-for="(f, index) in farmacia" :key='f.id'>
                    <span v-if="index === 0">
                      <b>{{f}}</b>
                    </span>
                    <span v-else-if="f.toLowerCase().indexOf('tel.') !== -1" v-html="replaceString(f)">
                    </span>
                    <span v-else>
                      {{f}}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-lg-8 btn btn-round btn-fill clear-margin">
        <div class="row dialog-content">
          <p>{{ $t('dictionary.notifications') }}</p>
           <div class="col-md-12">
            <img src='static/img/logo_B.png' alt=''>
          </div>
        </div>
        <div v-for="item in items.slice().reverse()" v-bind:key='item.key'>
          <div class="col-md-12 card-layout-in">
            <notification-card>
              <div class="numbers" slot="content">
                <div v-show="item.type === 'notification'">
                  <div class="row">
                    <p class="col-md-6">{{ $t('dictionary.from') }} {{ item.message.from }}</p>
                    <p class="col-md-6" v-show="item.message.to">{{ $t('dictionary.to') }} {{ item.message.to }}</p>
                  </div>
                  <p>{{ $t('dictionary.message') }} {{ item.message.message }}</p>
                </div>
                <div class="row" v-show="item.type === 'schedule'">
                  <p class="col-md-6"> {{ item.date }}</p>
                  <p class="col-md-6">{{ $t('dictionary.message') }} {{ item.message.message }}</p>
                </div>
              </div>
          </notification-card>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { EventBus } from '../../../event-bus.js'
import DefaultForm from 'components/UIComponents/Forms/defaultform.vue'
export default {
  components: {
    DefaultForm
  },
  data() {
    return {
      msg: 'warning.msgSensor',
      warningCards: [],
      elem: '',
      content: '',
      numberCol: '',
      movepos: '',
      timeout: null,
      districtToGet: null,
      localityToGet: null,
      items: [],
      timerID: 0,
      time: 0,
      date: 0,
      tempoResult: "",
      farmaciasOk: false,
      farmacias: []
    }
  },
  methods: {
    audioPlayer(dataset) {
      EventBus.soundTTS(this.$t('showdata.info', {sensortype: dataset.reading, location: dataset.location, avg: dataset.avg}))
    },
    onload() {
      console.log('entrou?')
    },
    updateTime() {
      this.date = this.$t('dictionary.week.' + new Date().getDay()).toLowerCase().charAt(0).toUpperCase() + this.$t('dictionary.week.' + new Date().getDay()).toLowerCase().substring(1) + " " + EventBus.dateFormat(new Date())
    },
    replaceString(str) {
      return str.toLowerCase().replace('tel.', '<i class="fas fa-phone-square"></i> ')
    },
    getFarmacy() {
      this.$http
      .get('/api/connectServer/getFarmaciasServico')
      .then(response => {
        if (response.data.status === true) {
          this.farmacias = response.data.data.farmacias
          this.districtToGet = response.data.data.district
          this.localityToGet = response.data.data.locality
          this.farmaciasOk = true
        } else {
          this.$notifications.notify({
            message: '<h4>Falha ao tentar adquirir as Farmácias de serviço do concelho ' & response.data.data.district & ', do distrito ' & response.data.data.locality & '.</h4>',
            icon: 'ti-bell',
            horizontalAlign: 'right',
            verticalAlign: 'top',
            type: 'warning'
          })
        }
      })
      .catch(error => {
        console.log(error)
        this.$notifications.notify({
          message: '<h4>Falha ao tentar adquirir as Farmácias de serviço.</h4>',
          icon: 'ti-bell',
          horizontalAlign: 'right',
          verticalAlign: 'top',
          type: 'warning'
        })
      })
    },
    getTempo() {
      this.$http
      .get('/api/connectServer/getTempo')
      .then(response => {
        // console.log(response.data.data)
        if (response.data.status === true) {
          this.tempoResult = response.data.data
          document.getElementsByClassName("table-tempo")[0].innerHTML = this.tempoResult;
          document.getElementsByClassName("table-tempo")[0].getElementsByTagName("table")[0].deleteRow(0)
          document.getElementsByClassName("table-tempo")[0].getElementsByTagName("table")[0].deleteRow(1)
          document.getElementsByClassName("table-tempo")[0].getElementsByTagName("table")[0].deleteRow(1)
          document.getElementsByClassName("table-tempo")[0].getElementsByTagName("table")[0].getElementsByTagName("tr")[0].deleteCell(2);
          document.getElementById("wsp_rowtable_wsp_rowtable_more_info_block").remove();
        } else {
          this.$notifications.notify({
            message: '<h4>Falha ao tentar adquirir o tempo atual concelho ' & response.data.data.district & ', do distrito ' & response.data.data.locality & '.</h4>',
            icon: 'ti-bell',
            horizontalAlign: 'right',
            verticalAlign: 'top',
            type: 'warning'
          })
        }
      })
      .catch(error => {
        console.log(error)
        this.$notifications.notify({
          message: '<h4>Falha ao tentar adquirir o tempo.</h4>',
          icon: 'ti-bell',
          horizontalAlign: 'right',
          verticalAlign: 'top',
          type: 'warning'
        })
      })
    },
    controlEventsBus() {
      EventBus.$on('move-components', function(cmd) {
        EventBus.elementControl = document.getElementsByClassName('notifications')
        if (EventBus.elementControl.length === 0) {
          EventBus.currentActiveRightComp = 0
          EventBus.firstRightEvent = true
          EventBus.elementControl = []
          EventBus.currentComponent = EventBus.sidebarName
          return
        }
        switch (cmd) {
          // evento do 'OK'
          case 'ok_btn':
            console.log("'Ok btn")
            EventBus.elementControl[EventBus.currentActiveRightComp].click()
            break
            // evento para sair para a sidebar
          case 'exit':
            EventBus.removeAudio()
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
          case 'down':
          case 'right':
            EventBus.moveLeftRightInView(1)
            // self.audioPlayer(EventBus.elementControl[EventBus.currentActiveRightComp].dataset)
            break
          case 'left':
            if (cmd === 'left' && EventBus.currentActiveRightComp - 1 < 0) {
              return EventBus.$emit('move-components', 'exit')
            }
            EventBus.moveLeftRightInView(-1)
            // self.audioPlayer(EventBus.elementControl[EventBus.currentActiveRightComp].dataset)
            break
          default:
            console.log("No key available")
            EventBus.currentActiveRightComp = 0
            break;
        }
      })
    }
  },
  beforeCreate() {
    var self = this
    EventBus.$on('notification', function(data) {
      self.items = EventBus.notificationList
    })
  },
  mounted() {
  },
  created() {
    this.controlEventsBus()
    this.getFarmacy()
    this.getTempo()
    this.items = EventBus.notificationList
    this.timerID = setInterval(() => {
      this.updateTime()
    }, 1000)
  },
  beforeDestroy() {
    clearInterval(this.timerID)
    EventBus.$off('move-components')
  }
}
</script>
<style>
.col-ajust {
  padding-right: 1px !important;
  padding-left: 1px !important;
}
.col-ajust .card {
  margin-bottom: 1px !important;
}
.col-ajust .btn {
  padding: 1px 5px !important;
}
.col-ajust .card .content {
  padding: 1px 1px 1px 1px !important;
}
.col-ajust .card .content p {
  margin: 0px !important;
  font-size: 18px !important;
}
.h-ajust {
  margin: 0px 0px 5px 0px !important;
}
</style>
