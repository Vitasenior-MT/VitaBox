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
            <h3><div class='logo-img'>
                <img src='static/img/logo2_B.gif' alt=''>
            </div>
          VitaSénior - VitaBox</h3>
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
            <h3 style="margin: 0; padding: 0;"><i :class='link.icon'></i>
            {{ $t(link.name) }}
            </h3>
          </a>
        </router-link>
      </ul>
      <moving-arrow :move-y='arrowMovePx'>
      </moving-arrow>
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
      linkHeight: 66, // 72
      activeLinkIndex: 0,
      windowWidth: 0,
      isWindows: false,
      hasAutoHeight: false,
      interval: null
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
          EventBus.soundTTS(self.$t(self.sidebarLinks[index].text))
          self.$router.push({ path: self.sidebarLinks[index].path })
          EventBus.correntRightComponent = self.sidebarLinks[index].path
        }
      })
    }
  },
  beforeDestroy() {
    clearInterval(this.interval)
    EventBus.$off('move-components')
  },
  beforeCreate() {
    var self = this
    this.$http
      .get('/api/settings/get')
      .then(response => {
        if (response.body.data) {
          var appSettings = JSON.parse(response.body.data.app_settings)
          EventBus.settingsData = appSettings
          EventBus.$emit('mode', appSettings['mode'].default)
          EventBus.flg_sound = appSettings['sound'].default
          EventBus.currentLanguage = appSettings['language'].value
          self.$store.dispatch('setLangNew', EventBus.currentLanguage)
        } else {
          console.log('Receive error', response)
        }
      })
      .catch(error => {
        console.log(error)
      })
  },
  mounted() {
    this.findActiveLink()
  },
  watch: {
    $route: function(newRoute, oldRoute) {
      this.findActiveLink()
    }
  },
  created() {
    var self = this
    this.controlSideBar()
    EventBus.$on('changeTab', function() {
      let path = '/vitabox/warnings'
      if (self.$route.path !== path) {
        for (var index in self.sidebarLinks) {
          if (self.sidebarLinks[index].path === path) {
            self.activeLinkIndex = index
            self.$router.push({ path: self.sidebarLinks[index].path })
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
    EventBus.$on('mode', function(manualChange) {
      if (manualChange !== undefined) {
        self.sidebarStore.mode.advanced = manualChange
      } else {
        self.sidebarStore.mode.advanced = !self.sidebarStore.mode.advanced
      }
      self.sidebarStore.mode.auto = !self.sidebarStore.mode.advanced
      self.sidebarStore.sidebarLinks = self.sidebarStore.mode.advanced ? self.sidebarStore.sidebarLinksMode.advanced : self.sidebarStore.sidebarLinksMode.basic
      self.$notifications.notify({
        message: '<h4>' + (self.sidebarStore.mode.advanced ? self.$t("dictionary.advanced.title") : self.$t("dictionary.basic.title")) + '</h4>',
        icon: 'ti-bell',
        horizontalAlign: 'right',
        verticalAlign: 'top',
        type: 'info'
      })
      if (self.$route.path !== '/vitabox/bemvindo') {
        for (var index in self.sidebarLinks) {
          if (self.sidebarLinks[index].path === '/vitabox/bemvindo') {
            self.activeLinkIndex = index
            self.$router.push({ path: self.sidebarLinks[index].path })
            EventBus.setSidebar()
            return
          }
        }
      }
    })
    EventBus.$on('changeTab', function(path) {
      if (self.$route.path !== path) {
        for (var index in self.sidebarLinks) {
          if (self.sidebarLinks[index].path === path) {
            self.activeLinkIndex = index
            self.$router.push({ path: self.sidebarLinks[index].path })
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
</style>
