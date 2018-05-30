<template>
  <div :class="{'nav-open': $sidebar.showSidebar}">
    <router-view></router-view>
    <v-dialog/>
    <v-alert/>
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
