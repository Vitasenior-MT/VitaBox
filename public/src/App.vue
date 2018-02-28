<template>
  <div :class="{'nav-open': $sidebar.showSidebar}">
    <router-view></router-view>
    <v-dialog/>
  </div>
</template>

<script>
export default {
  data () {
    return {
      timeout: false
    }
  },
  mounted () {
    this.$socket.on('vitaWarning', data => {
      let self = this
      this.$modal.show('dialog', data)
      speechVoices.cancel()
      speechVoices.speak('Aviso!')
      if (!this.timeout) {
        this.timeout = true
        setTimeout(() => {
          self.$modal.hide('dialog')
          this.timeout = false
        }, 3000)
      }
    })
  }
}
</script>

<style lang="scss"></style>
