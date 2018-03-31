import Sidebar from './SideBar.vue'

const SidebarStore = {
  showSidebar: false,
  sidebarLinks: [
    {
      name: 'Home',
      icon: 'ti-home',
      path: '/vitabox/home'
    },
    {
      name: 'History',
      icon: 'ti-home',
      path: '/vitabox/history'
    },
    {
      name: 'Wizard',
      icon: 'ti-home',
      path: '/vitabox/wizard'
    },
    {
      name: 'Warnings',
      icon: 'ti-bell',
      path: '/vitabox/warnings'
    },
    {
      name: 'Warnings2',
      icon: 'ti-bell',
      path: '/vitabox/warnings2'
    },
    {
      name: 'ShowData',
      icon: 'ti-bell',
      path: '/vitabox/show-data'
    },
    {
      name: 'Hist. Sensores Ambientais',
      icon: 'ti-home',
      path: '/vitabox/history2'
    },
    {
      name: 'VidOnly',
      icon: 'ti-bell',
      path: '/vitabox/vid-only'
    }
  ],
  displaySidebar(value) {
    this.showSidebar = value
  }
}

const SidebarPlugin = {

  install(Vue) {
    Vue.mixin({
      data() {
        return {
          sidebarStore: SidebarStore
        }
      }
    })

    Object.defineProperty(Vue.prototype, '$sidebar', {
      get() {
        return this.$root.sidebarStore
      }
    })
    Vue.component('side-bar', Sidebar)
  }
}

export default SidebarPlugin
