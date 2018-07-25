<template>
  <div :class='sidebarClasses'
  :data-background-color='backgroundColor'
  :data-active-color='activeColor'>
    <!--
            Tip 1: you can change the color of the sidebar's background using: data-background-color='white | black | darkblue'
            Tip 2: you can change the color of the active button using the data-active-color='primary | info | success | warning | danger'
        -->
    <!-- -->
    <div class='sidebar-wrapper' id='style-3'>
      <div class='logo'>
        <a href='#' class='simple-text'>
            <div class='logo-img'>
                <img src='static/img/logo2_B.gif' alt=''>
            </div>
          VitaSénior - VitaBox
        </a>
      </div>
      <slot>

      </slot>
      <ul :class='navClasses'>
        <!--By default vue-router adds an active class to each route link. This way the links are colored when clicked-->
        <router-link v-for='(link,index) in sidebarLinks'
        :to='link.path' tag='li'
        :ref='link.name'
        :key='link.name + index'>
          <a>
            <i :class='link.icon'></i>
            <p>{{ $t(link.name) }}
            </p>
          </a>
        </router-link>
      </ul>
      <moving-arrow :move-y='arrowMovePx'>
      </moving-arrow>
      <div class="img-help">
        <img class="ajust-img" src="static/img/tv_remote3.png" alt="">
        <div v-show="showHelp" class="img-help-info green"><img class="ajust-img" src="static/img/id.svg" alt=""></div>
      </div>
    </div>
  </div>
</template>
<script>
import MovingArrow from './MovingArrow.vue'
import { EventBus } from '../../../event-bus.js'
export default {
  props: {
    type: {
      type: String,
      default: 'sidebar',
      validator: value => {
        let acceptedValues = ['sidebar', 'navbar']
        return acceptedValues.indexOf(value) !== -1
      }
    },
    backgroundColor: {
      type: String,
      default: 'black',
      validator: value => {
        let acceptedValues = ['white', 'black', 'darkblue']
        return acceptedValues.indexOf(value) !== -1
      }
    },
    activeColor: {
      type: String,
      default: 'success',
      validator: value => {
        let acceptedValues = ['primary', 'info', 'success', 'warning', 'danger']
        return acceptedValues.indexOf(value) !== -1
      }
    },
    sidebarLinks: {
      type: Array,
      default: () => []
    }
  },
  components: {
    MovingArrow
  },
  computed: {
    sidebarClasses() {
      if (this.type === 'sidebar') {
        return 'sidebar'
      } else {
        return 'collapse navbar-collapse off-canvas-sidebar'
      }
    },
    navClasses() {
      if (this.type === 'sidebar') {
        return 'nav'
      } else {
        return 'nav navbar-nav'
      }
    },
    /**
     * Styles to animate the arrow near the current active sidebar link
     * @returns {{transform: string}}
     */
    arrowMovePx() {
      return this.linkHeight * this.activeLinkIndex
    }
  },
  data() {
    return {
      linkHeight: 60,
      activeLinkIndex: 0,
      windowWidth: 0,
      isWindows: false,
      hasAutoHeight: false,
      interval: null,
      showHelp: false,
      keyHelpTimer: null
    }
  },
  methods: {
    findActiveLink() {
      this.sidebarLinks.find((element, index) => {
        let found = element.path === this.$route.path
        if (found) {
          this.activeLinkIndex = index
        }
        return found
      })
    },
    controlSideBar() {
      var self = this
      EventBus.$on('move-sidebar', function(cmd) {
        if (cmd === "ok_btn") {
          EventBus.currentComponent = EventBus.correntRightComponent
          EventBus.$emit('move-components', 'right')
        } else {
          let index = self.activeLinkIndex + cmd
          if (index < 0) {
            index = self.sidebarLinks.length - 1
          }
          if (index > self.sidebarLinks.length - 1) {
            index = 0
          }
          self.$socket.emit('ttsText', self.$t(self.sidebarLinks[index].text))
          self.$router.push({ path: self.sidebarLinks[index].path })
          EventBus.correntRightComponent = self.sidebarLinks[index].path
        }
      })
    },
    controlKeyHelp() {
      var self = this
      EventBus.$on('key-help', function(key) {
        self.showHelp = false
        clearTimeout(self.keyHelpTimer)
        let keyReleased = document.getElementsByClassName('img-help-info')[0]
        keyReleased.className = ""
        keyReleased.classList.add('img-help-info')
        keyReleased.classList.add(key)
        self.showHelp = true
        self.keyHelpTimer = setTimeout(() => {
          self.showHelp = false
        }, 500);
      })
    }
  },
  beforeDestroy() {
    clearInterval(this.interval)
    EventBus.$off('move-components')
  },
  mounted() {
    this.findActiveLink()
    let elem = document.getElementsByClassName('img-help')[0]
    elem.style.width = document.getElementsByClassName("sidebar")[0].offsetWidth + 'px'
  },
  watch: {
    $route: function(newRoute, oldRoute) {
      this.findActiveLink()
    }
  },
  created() {
    var self = this
    this.controlSideBar()
    this.controlKeyHelp()
    EventBus.$on('changeTab', function() {
      let path = '/vitabox/warnings'
      if (self.$route.path !== path) {
        let sideBar = self.sidebarLinks
        for (var index in sideBar) {
          if (sideBar[index].path === path) {
            self.activeLinkIndex = index
            self.$router.push({ path: sideBar[index].path })
            // atribui para que passe a seer novamento a primenra vez que entra nesta view
            EventBus.firstRightEvent = true
            // define como o elemento ativo seja o '0'
            EventBus.currentActiveRightComp = 0
            // define o elemento ativo coomo sendo a barra lateral
            EventBus.currentComponent = EventBus.sidebarName
            return
          }
        }
      }
    })
    EventBus.$on('mode', function() {
      self.sidebarStore.mode.advanced = !self.sidebarStore.mode.advanced
      self.sidebarStore.mode.auto = !self.sidebarStore.mode.auto
      self.sidebarLinks = self.sidebarStore.mode.advanced ? self.sidebarStore.sidebarLinksMode.advanced : self.sidebarStore.sidebarLinksMode.basic
      self.$notifications.notify({
        message: '<h4>' + (self.sidebarStore.mode.advanced ? self.$t("dictionary.advanced.title") : self.$t("dictionary.basic.title")) + '</h4>',
        icon: 'ti-bell',
        horizontalAlign: 'right',
        verticalAlign: 'top',
        type: 'info'
      })
      /* if (self.sidebarStore.mode.auto) {
        clearInterval(self.interval)
        self.interval = setInterval(() => {
          console.log('Auto On ')
          let index = self.activeLinkIndex + 1
          if (index < 0) {
            index = self.sidebarLinks.length - 1
          }
          if (index > self.sidebarLinks.length - 1) {
            index = 0
          }
          // this.$socket.emit('ttsText', self.$t(self.sidebarLinks[index].text))
          self.$router.push({ path: self.sidebarLinks[index].path })
          EventBus.correntRightComponent = self.sidebarLinks[index].path
        }, EventBus.timeCalculator(0, 0, 50))
      } else {
        clearInterval(self.interval)
        console.log('Auto Off ')
      } */
      if (self.$route.path !== '/vitabox/exames') {
        let sideBar = self.sidebarLinks
        for (var index in sideBar) {
          if (sideBar[index].path === '/vitabox/exames') {
            self.activeLinkIndex = index
            self.$router.push({ path: sideBar[index].path })
            EventBus.setSidebar()
            return
          }
        }
      }
    })
  }
}
</script>
<style>
.logo-img {
  background-color:white;
}
.logo-img > img {
  max-width: 37px !important;
}
.sidebar-wrapper .active a {
  border-left: 5px solid #f7931d;
}

.img-help {
  width: 100%;
  bottom: 0;
  left: 0;
  position: fixed;
}
.ajust-img {
  width: 100%;
  height: auto;
}
.img-help-info {
  position: absolute;
  background-color: beige;
  border-radius: 30px;
  width: 18%;
  height: 11%;
}

.red {
    top: 9%;
    left: 8%;
}

.settings {
    top: 9%;
    left: 29%;
}

.yellow {
    top: 9%;
    left: 52%;
}

.blue {
    top: 9%;
    left: 74%;
}

.ok_btn {
    top: 47%;
    left: 40%;
}

.left {
    top: 47%;
    left: 20%;
}

.right {
    top: 47%;
    left: 62%;
}

.up {
    top: 30%;
    left: 40%;
}

.down {
    top: 62%;
    left: 41%;
}

.exit {
    top: 69%;
    left: 11%;
}

.one {
    top: 85%;
    left: 13%;
}

.two {
    top: 85%;
    left: 41%;
}
</style>
