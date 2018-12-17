<template>
  <div class='card btn btn-info btn-block control-modal-wifi'>
    <div class='content'>
      <div class='row'>
        <div class='col-lg-12 text-center'>
          <p class="text-div-wrap">{{data.ssid}}</p>
        </div>
      </div>
      <div class='content'>
      </div>
      <div class='footer text-center'>
      </div>
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
