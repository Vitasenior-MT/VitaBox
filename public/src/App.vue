<template>
  <div :class="{'nav-open': $sidebar.showSidebar}">
    <router-view></router-view>
    <v-dialog/>
  </div>
</template>

<script>
export default {
  sockets: {
    vitaWarning: function(data) {
      console.log("Receive alert", data);
      this.$modal.show("dialog", data);
    },
    hideModal() {
      this.$modal.hide("dialog");
    }
  }
};
</script>

<style lang="scss"></style>
