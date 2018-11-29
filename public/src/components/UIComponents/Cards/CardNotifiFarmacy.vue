<template>
  <div class='card btn btn-info control-remote col-lg-12'>
    <div class='content'>
      <div class='row'>
        <div class='col-lg-2'>
          <span>
            <img v-if="objCard.img !== ''" :src="objCard.img" width='40' height='40'>
            <i v-if="objCard.icon !== ''" :class="'fab ' + objCard.icon"></i>
            <!-- <img src="static/img/vitabox/farmacy.svg" width='40' height='40'> -->
          </span>
        </div>
        <div class='col-lg-10'>
          <div class='numbers'>
            {{ $t(objCard.titleCard) }}
            <!-- {{ $t('home.farmacy.farmacy') }} -->
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
