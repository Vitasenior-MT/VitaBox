import MarqueeMsg from './MarqueeMsg.vue'

var MarqueeMsgPlugin = {
  install(Vue) {
    // console.log("Teste")

    this.event = new Vue()

    Vue.prototype.$marqueemsg = {
      show(text, params) {
        MarqueeMsgPlugin.event.$emit('displaymarqueemsg', text, params)
      },
      hide() {
        MarqueeMsgPlugin.event.$emit('stopdisplaymarqueemsg')
      }
    }
    Vue.component('v-marquee-msg', MarqueeMsg)
  }
}
export default MarqueeMsgPlugin
