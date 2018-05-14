import Sidebar from './SideBar.vue'

const SidebarStore = {
  showSidebar: false,
  sidebarLinks: [
    {
      name: 'sidebar.diagnosis.title',
      icon: 'ti-heart',
      path: '/vitabox/exames',
      text: 'sidebar.diagnosis.text'
    },
    {
      name: 'sidebar.diagnosisHistory.title',
      icon: 'ti-pie-chart',
      path: '/vitabox/exameshistorico',
      text: 'sidebar.diagnosisHistory.text'
    },
    {
      name: 'sidebar.ambienteHistory.title',
      icon: 'ti-rss-alt',
      path: '/vitabox/ambientehistorico',
      text: 'sidebar.ambienteHistory.text'
    },
    {
      name: 'sidebar.home.title',
      icon: 'ti-home',
      path: '/vitabox/home',
      text: 'sidebar.home.text'
    },
    {
      name: 'sidebar.warning.title',
      icon: 'ti-bell',
      path: '/vitabox/warnings',
      text: 'sidebar.warning.text'
    },
    {
      name: 'sidebar.warning2.title',
      icon: 'ti-bell',
      path: '/vitabox/warnings2',
      text: 'sidebar.warning2.text'
    },
    {
      name: 'sidebar.showData.title',
      icon: 'ti-bell',
      path: '/vitabox/show-data',
      text: 'sidebar.showData.text'
    },
    {
      name: 'sidebar.showData2.title',
      icon: 'ti-bell',
      path: '/vitabox/show-data2',
      text: 'sidebar.showData2.text'
    },
    {
      name: 'sidebar.historyEnvironmentSensor2.title',
      icon: 'ti-stats-up',
      path: '/vitabox/historicosensoresambientaisv2',
      text: 'sidebar.historyEnvironmentSensor2.text'
    },
    {
      name: 'sidebar.video.title',
      icon: 'ti-bell',
      path: '/vitabox/vid-only',
      text: 'sidebar.video.text'
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
