<template>
  <div class='card btn btn-info control-remote'>
    <div class='content'>
      <div class='row'>
        <div class='col-lg-2'>
          <span v-if="warningCard.sensor == 'temp'">
            <img src='static/img/vitabox/temp.svg' width='40' height='40'>
          </span>
        </div>
        <div class='col-lg-10'>
          <div class='numbers'>
            <p>{{warningCard.measure}}</p>
            {{warningCard.location}}
          </div>
         <b></b>
        </div>
      </div>
      <div class='content'>
        <div class='row'>
          <div class='col-xs-12'>
            <ChartGauge :id="warningCard.idmedia"
            :chartid="warningCard.idmedia"
              :typechartdonut="false"
              :valueChart="warningCard.avg"
              :labelChart="''"
              :chartmax="warningCard.threshold"
              :symbol="warningCard.symbol">
              </ChartGauge>
            </div>
          </div>
      </div>
      <div class='footer'>
        <hr/>
        <div class='row'>
          <div class='col-lg-9'>
            <i :class='warningCard.footerIcon'> {{warningCard.dateupdate}}</i>
          </div>
          <div class='col-lg-3'>
            <ChartGauge :id="warningCard.idlimite"
              :typechartdonut="true"
              :chartid="warningCard.idlimite"
              :valueChart="warningCard.threshold"
              :labelChart="''"
              :chartmax="warningCard.threshold"
              :symbol="warningCard.symbol">
            </ChartGauge>
          </div>
        </div>
    </div>
  </div>
</template>
<script>
import ChartGauge from 'components/UIComponents/Charts/chartGaugeItem1.vue'
export default {
  components: {
    ChartGauge
  },
  name: 'Warning',
  data() {
    return {
      warningCard: {}
    }
  },
  props: {
    warningCard: {
      type: Object,
      required: true
    }
  },
  mounted() {}
}
</script>
<style>
</style>
