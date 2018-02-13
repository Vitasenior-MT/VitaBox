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
      name: 'Dashboard',
      icon: 'ti-panel',
      path: '/vitabox/overview'
    },
    {
      name: 'User Profile',
      icon: 'ti-user',
      path: '/vitabox/stats'
    },
    {
      name: 'Table List',
      icon: 'ti-view-list-alt',
      path: '/vitabox/table-list'
    },
    {
      name: 'Typography',
      icon: 'ti-text',
      path: '/vitabox/typography'
    },
    {
      name: 'Icons',
      icon: 'ti-pencil-alt2',
      path: '/vitabox/icons'
    },
    {
      name: 'Maps',
      icon: 'ti-map',
      path: '/vitabox/maps'
    },
    {
      name: 'Notifications',
      icon: 'ti-bell',
      path: '/vitabox/notifications'
    }
  ],
  displaySidebar (value) {
    this.showSidebar = value
  }
}

const SidebarPlugin = {

  install (Vue) {
    Vue.mixin({
      data () {
        return {
          sidebarStore: SidebarStore
        }
      }
    })

    Object.defineProperty(Vue.prototype, '$sidebar', {
      get () {
        return this.$root.sidebarStore
      }
    })
    Vue.component('side-bar', Sidebar)
  }
}

export default SidebarPlugin
