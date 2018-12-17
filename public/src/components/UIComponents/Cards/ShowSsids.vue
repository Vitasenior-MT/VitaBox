<template>
  <div class="card clear-padding">
    <div class="content">
      <button
        class="btn btn-info control-modal-wifi min-height"
        type="button">
        <h5 class="text-div-wrap">{{data.ssid}}</h5>
      </button>
    </div>
  </div>
</template>
<script>
export default {
  components: {
  },
  name: 'ssid',
  data() {
    return {
      data: {}
    }
  },
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  mounted() {}
}
</script>
<style>
</style>
