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
      let self = this;
      this.$modal.show("dialog", data);
      setTimeout(function() {
        self.$modal.hide("dialog");
      }, 3000);
    },
    hideModal() {
      //this.$modal.hide("dialog");
    }
  }
};
</script>

<style lang="scss"></style>
