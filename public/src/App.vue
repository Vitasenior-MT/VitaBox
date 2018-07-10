<template>
  <div :class="{'nav-open': $sidebar.showSidebar}">
    <router-view></router-view>
    <v-dialog/>
    <v-settings/>
    <v-alert/>
    <v-marquee-msg/>
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
