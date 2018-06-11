import Vue from 'vue'
import VueRouter from 'vue-router'
import VueSocketio from 'vue-socket.io'
import i18n from './lang/lang'
import store from './store'
import resource from 'vue-resource'
import Tooltip from 'vue-directive-tooltip'
import 'vue-directive-tooltip/css/index.css'
import fontawesome from '@fortawesome/fontawesome'
import faFreeRegular from '@fortawesome/fontawesome-free-regular'
import faFreeSolid from '@fortawesome/fontawesome-free-solid'

// Plugins
import GlobalComponents from './globalComponents'
import GlobalDirectives from './globalDirectives'
import Notifications from './components/UIComponents/NotificationPlugin'
import SideBar from './components/UIComponents/SidebarPlugin'
import VModal from './components/UIComponents/Modal'
import VMarqueeMsg from 'components/UIComponents/Forms'
import VueFormWizard from 'vue-form-wizard'
import 'vue-form-wizard/dist/vue-form-wizard.min.css'
import App from './App'

// router setup
import routes from './routes/routes'

// library imports
import Chartist from 'chartist'
import { EventBus } from './event-bus.js';
import 'bootstrap/dist/css/bootstrap.css'
import './assets/sass/paper-dashboard.scss'
import 'es6-promise/auto'

// plugin setup
Vue.use(VueRouter)
Vue.use(GlobalComponents)
Vue.use(GlobalDirectives)
Vue.use(Notifications)
Vue.use(SideBar)
Vue.use(VModal, { dialog: true })
Vue.use(Tooltip)
Vue.use(VMarqueeMsg)
Vue.use(VueFormWizard)
Vue.use(resource)
Vue.use(VueSocketio, location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : ''))

fontawesome.library.add(faFreeSolid)
fontawesome.library.add(faFreeRegular)
fontawesome.dom.i2svg()

// configure router
var router = new VueRouter({
  routes, // short for routes: routes
  linkActiveClass: 'active'
})

// global library setup
Object.defineProperty(Vue.prototype, '$Chartist', {
  get() {
    return this.$root.Chartist
  }
})

/* eslint-disable no-new */
export const app = new Vue({
  el: '#app',
  store,
  i18n,
  render: h => h(App),
  router,
  data: {
    Chartist: Chartist,
    interval: null,
    show: true
  },
  mounted() {
  },
  beforeCreate() {
  },
  sockets: {
    connect: (val) => {
      if (val) {
        console.log('socket connected -> val: ', val)
      } else {
        console.log('socket connected')
      }
    },
    ttsPath(path) {
      if (!this.sidebarStore.mode.auto) {
        var self = this
        let audioOld = document.getElementById('audioElem')
        if (audioOld) {
          audioOld.remove()
        }
        let audio = document.createElement('audio')
        audio.id = 'audioElem'
        audio.style.display = 'none'
        audio.src = './static/.temp/' + path
        audio.autoplay = true
        audio.onended = function() {
          audio.remove()
          self.$socket.emit('ttsDelete')
        };
        document.body.appendChild(audio)
      } else {
        EventBus.audioBasicMode('./static/.temp/' + path)
      }
    },
    hdmistatus: function(data) {
      console.log('Receive hdmistatus', data)
    },
    vitaWarning: function(data) {
      let self = this
      this.$modal.show('alert', data)
      this.$marqueemsg.show('Mensagem', 'Pressiosne me [OK] para desbloquear.')
      this.$socket.emit('ttsText', 'Aviso!')
      EventBus.$emit('changeTab')
      clearInterval(interval)
      interval = setInterval( () => {
        if (self.show) {
          self.$modal.show('alert', data)
          self.show = false
        } else {
          self.$modal.hide('alert')
          self.show = true
        }
      }, 3000)
    },
    informationVita: function(data) {
      console.log('marquee', data)
    },
    unblock: function() {
      this.$marqueemsg.hide()
    },
    blocked: function() {
      this.$notifications.notify({
        message: '<h4>' + this.$t("remote.title") + '</h4>',
        icon: 'ti-bell',
        horizontalAlign: 'right',
        verticalAlign: 'top',
        type: 'warning'
      })
      this.$socket.emit('ttsText', this.$t("remote.text"))
    },
    cmd: function(cmd) {
      switch (cmd) {
        case 'up':
          if (EventBus.currentComponent === EventBus.sidebarName) {
            EventBus.$emit('move-sidebar', -1)
          } else {
            if (EventBus.currentComponent !== EventBus.sidebarName) {
              console.log("Not sidebar")
              EventBus.$emit('move-components', 'up')
            }
          }
          break;
        case 'down':
          if (EventBus.currentComponent === EventBus.sidebarName) {
            EventBus.$emit('move-sidebar', 1)
          } else {
            if (EventBus.currentComponent !== EventBus.sidebarName) {
              console.log("Not sidebar")
              EventBus.$emit('move-components', 'down')
            }
          }
          break;
        case 'right':
          EventBus.currentComponent = EventBus.correntRightComponent
          EventBus.$emit('move-components', cmd)
          break;
        case 'left':
          if (EventBus.currentActiveRightComp === 0) {
            EventBus.currentComponent = EventBus.sidebarName
            if (!EventBus.firstRightEvent) {
              EventBus.$emit('move-components', cmd)
            }
          } else {
            EventBus.$emit('move-components', cmd)
          }
          break;
        case 'ok_btn':
        case 'exit':
          if (EventBus.currentComponent !== EventBus.sidebarName) {
            EventBus.$emit('move-components', cmd)
          }
          break;
        case 'mode':
          EventBus.$emit('mode')
          break;
        case 'menu':
          console.log('Testes')
          break;
        default:
          console.log("No event key", cmd)
          break;
      }
    }
  }
})

window.store = store
window['vue'] = app

// var self = this;
window.addEventListener('keypress', function(e) {
  e = e || window.event;
  var charCode = e.keyCode || e.which;
  // console.log("Key:", charCode);
  var sendCmd = "";
  if (charCode === 119) { // 'w'
    sendCmd = '1';
  } else if (charCode === 115) { // 's'
    sendCmd = '2';
  } else if (charCode === 97) { // 'a'
    sendCmd = '3';
  } else if (charCode === 100) { // 'd'
    sendCmd = '4';
  } else if (charCode === 122) { // 'z'
    sendCmd = '0';
  } else if (charCode === 120) { // 'x'
    sendCmd = 'd';
  } else if (charCode === 113) { // 'q'
    sendCmd = '29';
  } else if (charCode === 99) { // 'c'
    sendCmd = '25';
  }
  if (sendCmd !== "") {
    app.$socket.emit('keypress', sendCmd);
    sendCmd = "";
  }
});
