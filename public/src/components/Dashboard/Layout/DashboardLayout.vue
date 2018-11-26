<template>
  <div class="wrapper">
    <side-bar type="sidebar" :sidebar-links="$sidebar.sidebarLinks">

    </side-bar>
    <notifications>

    </notifications>
    <div class="img-help">
      <img class="ajust-img" src="static/img/tv_remote3.png" alt="">
      <div v-show="showHelp" class="img-help-info green"><img style="width: 100%; height: auto;" src="static/img/id.svg" alt=""></div>
    </div>
    <div class="main-panel" id="app" style="background-color: #212120">
    <!-- <div class="main-panel" id="app"> -->
      <!-- <top-navbar></top-navbar> -->

      <dashboard-content @click.native="toggleSidebar">

      </dashboard-content>


      <!-- <content-footer></content-footer> -->
    </div>
  </div>
</template>
<script>
  import { EventBus } from '../../../event-bus.js'
  import TopNavbar from './TopNavbar.vue'
  import ContentFooter from './ContentFooter.vue'
  import DashboardContent from './Content.vue'
  export default {
    components: {
      TopNavbar,
      ContentFooter,
      DashboardContent,
      EventBus
    },
    data() {
      return {
        showHelp: false,
        keyHelpTimer: null
      }
    },
    methods: {
      toggleSidebar() {
        if (this.$sidebar.showSidebar) {
          this.$sidebar.displaySidebar(false)
        }
      },
      controlKeyHelp() {
        var self = this
        EventBus.$on('key-help', function(key) {
          self.showHelp = false
          clearTimeout(self.keyHelpTimer)
          let keyReleased = document.getElementsByClassName('img-help-info')[0]
          keyReleased.className = ""
          keyReleased.classList.add('img-help-info')
          keyReleased.classList.add(key + '-help')
          self.showHelp = true
          self.keyHelpTimer = setTimeout(() => {
            self.showHelp = false
          }, 500);
        })
      }
    },
    mounted() {
      let elem = document.getElementsByClassName('img-help')[0]
      elem.style.width = document.getElementsByClassName("sidebar")[0].offsetWidth + 'px'
    },
    created() {
      this.controlKeyHelp()
    }
  }
</script>
<style lang="scss">
.img-help {
  width: 100%;
  bottom: 0;
  left: 0;
  position: fixed;
  z-index: 2000;
}
.ajust-img {
  width: 42%;
  height: auto;
}
.img-help-info {
  position: absolute;
  background-color: beige;
  border-radius: 30px;
  width: 9%;
  height: 12%;
}

.red-help {
    top: 9%;
    left: 2.5%;
}

.settings-help {
    top: 9%;
    left: 11.5%;
}

.yellow-help {
    top: 9%;
    left: 21%;
}

.blue-help {
    top: 9%;
    left: 30%;
}

.ok_btn-help {
    top: 45%;
    left: 16.5%;
}

.left-help {
    top: 44%;
    left: 8%;
}

.right-help {
    top: 44%;
    left: 25%;
}

.up-help {
    top: 29%;
    left: 17%;
}

.down-help {
    top: 61%;
    left: 17%;
}

.exit-help {
    top: 68%;
    left: 4.5%;
}

.one-help {
    top: 84%;
    left: 4.5%;
}

.two-help {
    top: 84%;
    left: 16.5%;
}
</style>
