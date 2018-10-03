<template>
  <div class='card btn btn-info control-modal col-lg-3'>
    <div class='content'>
      <div class='row'>
        <div class='col-lg-2'>
        </div>
        <div class='col-lg-4'>
          <div class='numbers'>
            <p>{{data.ssid}}</p>
          </div>
         <b></b>
        </div>
      </div>
      <div class='content'>
      </div>
      <div class='footer text-center'>
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
