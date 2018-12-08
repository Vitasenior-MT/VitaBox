<template>
  <div class="row clear-margin">
    <div class="col-lg-7" style="padding: 0;">
      <div class="col-lg-12 btn btn-round btn-fill clear-margin">
        <div class="row">
          <div class="col-md-12" v-show="date !== 0">
            <h3 class="date">{{ date }}</h3>
          </div>
          <div class="col-md-12 text-center" v-if="tempoResult === ''">
            <h4>A carregar o tempo. Aguarde.&nbsp;
            <img src='static/img/load5_B.gif' alt='' width='70' height='70'></h4>
          </div>
          <div class="col-md-12 table-tempo" v-show="tempoResult !== ''">
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-lg-12">&nbsp;</div>
      </div>
      <default-form v-if="items.length <= 0" ref="ViewNotifivacoes"></default-form>
      <div v-if="items.length > 0" class="col-lg-12 btn btn-round btn-fill clear-margin">
        <div class="col-md-12" v-for="item in items.slice().reverse()" v-bind:key='item.key'>
          <!-- <card-notificatio-farmacy :objCard="item"></card-notificatio-farmacy> -->
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
    <div class="col-lg-5 clear-margin">
      <div class="row btn btn-round btn-fill clear-margin" v-if="!farmaciasOk">
        <div class="col-lg-12 text-center">
          <h4>{{ $t('home.farmacy.0') }} Aguarde.&nbsp;
          <img src='static/img/load5_B.gif' alt='' width='70' height='70'></h4>
        </div>
      </div>
      <div class="row btn btn-round btn-fill clear-margin" v-show="farmaciasOk">
        <div class="col-lg-12">
          <h4 class="h-ajust text-left">
            {{ $t('home.farmacy.0') }}<br>
            {{ $t('home.farmacy.1') }}{{districtToGet}}<br>
            {{ $t('home.farmacy.2') }}{{localityToGet}}</h4>
        </div>
        <div class="col-md-12 col-ajust" v-for="farmacia in farmacias" :key='farmacia.id'>
          <card-notificatio-farmacy :objCard="farmacia"></card-notificatio-farmacy>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { EventBus } from '../../../event-bus.js'
import DefaultForm from 'components/UIComponents/Forms/defaultform.vue'
import CardNotificatioFarmacy from 'components/UIComponents/Cards/CardNotifiFarmacy.vue'
export default {
  components: {
    DefaultForm,
    CardNotificatioFarmacy
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
    getFarmacy() {
      this.$http
      .get('/api/connectServer/getFarmaciasServico')
      .then(response => {
        if (response.data.status === true) {
          let farmacyData = response.data.data.farmacias
          this.districtToGet = response.data.data.district
          this.localityToGet = response.data.data.locality

          for (let farmacy in farmacyData) {
            let farm = farmacyData[farmacy]
            this.farmacias.push({
              icon: '<img src="static/img/vitabox/farmacy.svg" width="40" height="40">',
              titleCard: 'home.farmacy.farmacy',
              content: (() => {
                let txtHtml = ''
                for (let index = 0; index < farm.length; index++) {
                  if (index === 0) {
                    txtHtml += '<b>' + farm[index] + '</b>'
                  } else if (farm[index].toLowerCase().indexOf('tel.') !== -1) {
                    txtHtml += '<br>' + farm[index].toLowerCase().replace('tel.', '<i class="fas fa-phone-square"></i> ')
                  } else {
                    txtHtml += '<br>' + farm[index]
                  }
                }
                return txtHtml
              })()
            })
          }
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
          document.getElementsByClassName("table-tempo")[0].innerHTML = this.tempoResult.replace("PrecipitaÃ§Ã£o", "Precipitação");
          document.getElementsByClassName("table-tempo")[0].getElementsByTagName("table")[0].deleteRow(0)
          document.getElementsByClassName("table-tempo")[0].getElementsByTagName("table")[0].deleteRow(1)
          document.getElementsByClassName("table-tempo")[0].getElementsByTagName("table")[0].deleteRow(1)
          document.getElementsByClassName("table-tempo")[0].getElementsByTagName("table")[0].getElementsByTagName("tr")[0].deleteCell(2);
          document.getElementById("wsp_rowtable_wsp_rowtable_more_info_block").remove();
          let elemetsToDel = document.getElementsByClassName("degreeF")
          while (elemetsToDel[0]) {
            elemetsToDel[0].parentNode.removeChild(elemetsToDel[0])
          }
          let elemetsToDel2 = document.getElementsByClassName("wind_speed_miles")
          while (elemetsToDel2[0]) {
            elemetsToDel2[0].parentNode.removeChild(elemetsToDel2[0])
          }
          document.getElementsByClassName("table-tempo")[0].children[0].children[0].children[0].children[1].children[0].children[1].remove()
        } else {
          this.$notifications.notify({
            message: '<h4>Falha ao tentar adquirir o tempo atual, concelho ' + response.data.data.district + ', do distrito ' + response.data.data.locality + '.</h4>',
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
        // EventBus.elementControl = document.getElementsByClassName('notifications')
        EventBus.elementControl = document.getElementsByClassName('control-remote')
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
            // console.log("'Ok btn")
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
            // console.log('if exit', cmd, EventBus.currentActiveRightComp)
            break
          case 'up':
            EventBus.moveLeftRightInElemts(-1, 'btn-fill')
            break;
          case 'down':
          case 'right':
            EventBus.moveLeftRightInElemts(1, 'btn-fill')
            // self.audioPlayer(EventBus.elementControl[EventBus.currentActiveRightComp].dataset)
            break
          case 'left':
            if (cmd === 'left' && EventBus.currentActiveRightComp - 1 < 0) {
              return EventBus.$emit('move-components', 'exit')
            }
            EventBus.moveLeftRightInElemts(-1, 'btn-fill')
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
    if (this.$refs.ViewNotifivacoes) {
      this.$refs.ViewNotifivacoes.setMsg('dictionary.notifications')
      this.$refs.ViewNotifivacoes.show()
    }
  },
  created() {
    this.controlEventsBus()
    this.getFarmacy()
    this.getTempo()
    console.log('DAta:')
    console.log(EventBus.notificationList)
    this.items = EventBus.notificationList
    console.log(this.items)
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
.table-tempo table tbody tr td div {
  font-size: 20px;
}
</style>
