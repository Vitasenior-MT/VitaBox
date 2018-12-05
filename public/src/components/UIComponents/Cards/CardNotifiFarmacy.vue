<template>
  <div class='card btn btn-info control-remote col-lg-12'>
    <div class='content'>
      <div class='row'>
        <div class='col-lg-2'>
          <span v-html="objCard.icon">
          </span>
        </div>
        <div class='col-lg-10'>
          <div class='numbers'>
            {{ $t(objCard.titleCard) }}
          </div>
          <b></b>
        </div>
      </div>
      <div class='content text-left'>
        <p  class="text-div-wrap" v-html="objCard.content"></p>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  components: {
  },
  name: 'CardNotificatioFarmacy',
  data() {
    return {
    }
  },
  props: [
    'objCard'
  ],
  mounted() {}
}
</script>
<style>
</style>
