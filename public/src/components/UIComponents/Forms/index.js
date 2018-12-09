import MarqueeMsg from './MarqueeMsg.vue'
var MarqueeMsgPlugin = {
  install(Vue) {
    this.event = new Vue()
    Vue.prototype.$marqueemsg = {
      show(text, params, options) {
        MarqueeMsgPlugin.event.$emit('displaymarqueemsg', text, params, options)
      },
      hide() {
        MarqueeMsgPlugin.event.$emit('stopdisplaymarqueemsg')
      }
    }
    Vue.component('v-marquee-msg', MarqueeMsg)
  }
}
export default MarqueeMsgPlugin
