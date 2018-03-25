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
          this.data.prevTab();
        }
      }
      if (controll === "right") {
        this.data.nextTab();
      }
    }
  }
};
</script>
<style>

</style>
