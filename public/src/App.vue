<template>
  <div :class="{'nav-open': $sidebar.showSidebar}">
    <router-view></router-view>
    <v-dialog/>
    <v-notifications/>
    <v-welcome/>
    <v-settings/>
    <v-wifi-settings/>
    <v-procedure/>
    <v-alert/>
    <v-marquee-msg/>
    <v-bleblocked/>
    <v-videocall/>
  </div>
</template>

<script>
export default {
  data() {
    return {
    }
  },
  mounted() {}
}
</script>

<style lang="scss">
</style>
