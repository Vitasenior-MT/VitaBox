<template>
  <div></div>
</template>
<script>
export default {
  props: ["data"],
  name: "wizard-remote",
  sockets: {
    controllForm(controll) {
      if (controll === "left") {
        if (this.data.isLastStep) {
          alert("Done");
        } else {
          this.data.nextTab();
        }
      }
      if (controll === "right") {
        this.data.prevTab();
      }
    }
  }
};
</script>
<style>

</style>
