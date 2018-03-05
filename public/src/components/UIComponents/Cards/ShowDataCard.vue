<template>
  <div class="card">
    <div class="content">
      <div class="row">
        <div class="col-xs-5">
          <div class="col-xs-5">
            <img src="static/img/vitabox/temp.svg" width="40" height="40">
          </div>
        </div>
        <b class="col-xs-5 text-center font-size-27">{{data.headerText}}</b>
      </div>
      <hr/>
      <div class="row">
        <div v-for='sensor in data.data' :key='sensor.id'>
          <div class="col-sm-4 margin-5">
            <show-data-circle
            :space="5" :type="'Media'" :value="sensor.avg" :circleType="'circle-avg'"
            :warning="'warning-card-' + sensor.critLvl">
            </show-data-circle>
            <show-data-circle
            :space="4" :type="'Limite'" :value="sensor.threshold"
            :circleType="'circle-limit'" :warning="'N/A'">
            </show-data-circle>
          </div>
        </div>
      </div>
      <div class="footer">
        <hr/>
        {{data.headerText}}
      </div>
    </div>
  </div>
</template>
<script>
import ShowDataCircle from 'components/UIComponents/Cards/ShowDataCircle.vue'
export default {
  components: {
    ShowDataCircle
  },
  data () {
    return {}
  },
  props: ['data'],
  name: 'show-data-card'
}
</script>
<style>
</style>
