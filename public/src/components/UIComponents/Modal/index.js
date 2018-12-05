import Modal from './Modal.vue'
import Dialog from './Dialog.vue'
import Alert from './Alert.vue'
import Procedure from './Procedure.vue'
import Settings from './Settings.vue'
import WifiSettings from './WifiSettings.vue'
import Notifications from './Notifications.vue'
import Welcome from './Welcome.vue'

const defaultComponentName = 'modal'

const Plugin = {
  install(Vue, options = {}) {
    /**
     * Makes sure that plugin can be insstalled only once
     */
    if (this.installed) {
      return
    }

    this.installed = true
    this.event = new Vue()
    /**
     * Plugin API
     */
    Vue.prototype.$modal = {
      show(name, params) {
        if (name === 'procedure') {
          Plugin.event.$emit('sendData', params)
        }
        Plugin.event.$emit('toggle', name, true, params)
      },
      hide(name, params) {
        Plugin.event.$emit('toggle', name, false, params)
      },
      toggle(name, params) {
        Plugin.event.$emit('toggle', name, undefined, params)
      }
    }
    /**
     * Sets custom component name (if provided)
     */
    const componentName = options.componentName || defaultComponentName
    // console.log('componentName:', componentName)
    Vue.component(componentName, Modal)
    Vue.component('v-alert', Alert)
    Vue.component('v-procedure', Procedure)
    Vue.component('v-settings', Settings)
    Vue.component('v-wifi-settings', WifiSettings)
    Vue.component('v-notifications', Notifications)
    Vue.component('v-welcome', Welcome)
    /**
     * Registration of <Dialog/> component
     */
    if (options.dialog) {
      Vue.component('v-dialog', Dialog)
    }
  }
}

export default Plugin
