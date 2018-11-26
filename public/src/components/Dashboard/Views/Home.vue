<template>
  <div class="row">
    <div class="col-md-12 btn btn-round btn-fill vue-height-in">
      <div class="row size-80">
        <div class="col-md-6">
          <iframe class="iframe-size col-md-12" v-show="this.districtToGet && this.localityToGet" scrolling="no"
          :src="'//farmaciasdeservico.net/widget/?localidade='+this.districtToGet+'%7C'+this.localityToGet+'&cor_fundo=%23FFFFFF&cor_titulo=%23000000&cor_texto=%23333333&margem=10&v=1'"
          frameborder="0" target="_top" v-on:load="onload()"></iframe>
          <p v-show="!this.districtToGet && !this.localityToGet" class="iframe-size dialog-content col-md-12">{{ $t('home.noPharmacy') }}</p>
        </div>
        <div class="col-md-6">
          <div class="dialog-content col-md-12">
            <div id="clock">
              <p class="date">{{ date }}</p>
              <p class="time">{{ time }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="col-md-12 btn btn-round btn-fill notifications">
      <div class="dialog-content">
          <p>{{ $t('dictionary.notifications') }}</p>
      </div>
      <default-form v-show="!items" ref="DefaultView"></default-form>
      <div v-show="!items" v-for="item in items.slice().reverse()" v-bind:key='item.key'>
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
      this.time = this.zero(new Date().getHours(), 2) + ':' + this.zero(new Date().getMinutes(), 2) + ':' + this.zero(new Date().getSeconds(), 2);
      this.date = this.zero(new Date().getFullYear(), 4) + '-' + this.zero(new Date().getMonth() + 1, 2) + '-' + this.zero(new Date().getDate(), 2) + ' ' + this.$t('dictionary.week.' + new Date().getDay());
    },
    zero(num, digit) {
      var zero = '';
      for(var i = 0; i < digit; i++) {
          zero += '0';
      }
      return (zero + num).slice(-digit);
    },
    controlEventsBus() {
      var self = this
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
            //self.audioPlayer(EventBus.elementControl[EventBus.currentActiveRightComp].dataset)
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
    console.log('----> ', this.items)
    EventBus.$on('notification', function(data) {
      console.log('----> ', EventBus.notificationList)
      self.items = EventBus.notificationList
      if (self.items) {
        self.$refs.DefaultView.setMsg(self.$t('home.noNotification'))
        self.$refs.DefaultView.show()
      } else {
        self.$refs.DefaultView.hide()
      }
    })
    this.$http
    .get('/api/connectServer/getDistrict')
    .then(responce => {
      this.districtToGet = responce.data.data.district.toLowerCase()
      .replace(/[éèêÉÈÊ]/g, "e")
      .replace(/[úùûÚÙÛ]/g, "u")
      .replace(/[áàãâAÁÀÃÂ]/g, "a")
      .replace(/[çÇ]/g, "c")
      .replace(/[íìîÍÌÎ]/g, "i")
      .replace(/[ñÑ]/g, "n")
      .replace(/[úùûÚÙÛ]/g, "u")
      .replace(/[óòõôÓÒÔÕ]/g, "o")
      .replace(/[ ]/g, "_")
      this.localityToGet = responce.data.data.locality.toLowerCase()
      .replace(/[éèêÉÈÊ]/g, "e")
      .replace(/[úùûÚÙÛ]/g, "u")
      .replace(/[áàãâAÁÀÃÂ]/g, "a")
      .replace(/[çÇ]/g, "c")
      .replace(/[íìîÍÌÎ]/g, "i")
      .replace(/[ñÑ]/g, "n")
      .replace(/[úùûÚÙÛ]/g, "u")
      .replace(/[óòõôÓÒÔÕ]/g, "o")
      .replace(/[ ]/g, "_")
    })
    .catch(error => {
      console.log(error)
    })
  },
  mounted() {
    this.$refs.DefaultView.setMsg(this.$t('home.noNotification'))
    this.$refs.DefaultView.show()
  },
  created() {
    this.controlEventsBus()
    this.items = EventBus.notificationList
    this.timerID = setInterval(()=> {
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
.iframe-size {
  width: 40%;
  height: 290px;
}
.size-100 {
  height: 100%;
}
.size-80 {
  height: 80%;
}
</style>
