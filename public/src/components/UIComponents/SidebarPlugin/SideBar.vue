<template>
  <div :class="sidebarClasses"
  @keydown.a="sendKeyPressed"
  @keydown.z="sendKeyPressed"
  :data-background-color="backgroundColor"
  :data-active-color="activeColor">
    <!--
            Tip 1: you can change the color of the sidebar's background using: data-background-color="white | black | darkblue"
            Tip 2: you can change the color of the active button using the data-active-color="primary | info | success | warning | danger"
        -->
    <!-- -->
    <div class="sidebar-wrapper" id="style-3">
      <div class="logo">
        <a href="#" class="simple-text">
            <div class="logo-img">
                <img src="static/img/vue-logo.png" alt="">
            </div>
          VitaSénior - VitaBox
        </a>
      </div>
      <slot>

      </slot>
      <ul :class="navClasses">
        <!--By default vue-router adds an active class to each route link. This way the links are colored when clicked-->
        <router-link v-for="(link,index) in sidebarLinks" :to="link.path" tag="li" :ref="link.name" :key="link.name + index">
          <a>
            <i :class="link.icon"></i>

            <p>{{link.name}}
            </p>
          </a>
        </router-link>
      </ul>
      <moving-arrow :move-y="arrowMovePx">

      </moving-arrow>
    </div>
  </div>
</template>
<script>
  import MovingArrow from './MovingArrow.vue'
  export default {
    props: {
      type: {
        type: String,
        default: 'sidebar',
        validator: (value) => {
          let acceptedValues = ['sidebar', 'navbar']
          return acceptedValues.indexOf(value) !== -1
        }
      },
      backgroundColor: {
        type: String,
        default: 'black',
        validator: (value) => {
          let acceptedValues = ['white', 'black', 'darkblue']
          return acceptedValues.indexOf(value) !== -1
        }
      },
      activeColor: {
        type: String,
        default: 'success',
        validator: (value) => {
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
      sidebarClasses () {
        if (this.type === 'sidebar') {
          return 'sidebar'
        } else {
          return 'collapse navbar-collapse off-canvas-sidebar'
        }
      },
      navClasses () {
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
      arrowMovePx () {
        return this.linkHeight * this.activeLinkIndex
      }
    },
    data () {
      return {
        linkHeight: 60,
        activeLinkIndex: 0,

        windowWidth: 0,
        isWindows: false,
        hasAutoHeight: false
      }
    },
    methods: {
      findActiveLink () {
        this.sidebarLinks.find((element, index) => {
          let found = element.path === this.$route.path
          if (found) {
            this.activeLinkIndex = index
          }
          return found
        })
      },
      sendKeyPressed (e) {
        this.$socket.emit('keypress', e.which)
      }
    },
    mounted () {
      this.findActiveLink()
      this.$socket.on('keypress', (key) => {
        if (key === 65) {
          this.sidebarLinks[this.activeLinkIndex - 1] ? this.activeLinkIndex-- : this.activeLinkIndex = this.sidebarLinks.length - 1
          this.$router.push({
            path: this.sidebarLinks[this.activeLinkIndex].path
          })
        }
        if (key === 90) {
          this.sidebarLinks[this.activeLinkIndex + 1] ? this.activeLinkIndex++ : this.activeLinkIndex = 0
          this.$router.push({
            path: this.sidebarLinks[this.activeLinkIndex].path
          })
        }
      })
    },
    watch: {
      $route: function (newRoute, oldRoute) {
        this.findActiveLink()
      }
    },
    sockets: {
      connect: (val) => {
        if (val) {
          console.log('socket connected -> val: ', val)
        } else {
          console.log('socket connected')
        }
      }
    }
  }

</script>
<style>

</style>
