<template>
  <div class='card'>
    <div class='content'>
      <div class='row'>
        <div class='col-lg-2'>
          <img src='static/img/vitabox/temp.svg' width='40' height='40'>
        </div>
        <div class='col-lg-10'>
          <div class='numbers'>
            <p>{{warningCard.sensor}}</p>
            {{warningCard.location}}
          </div>
         <b></b>
        </div>
      </div>
      <div class='content'>
        <div class='row'>
          <div class='col-xs-6'>
            <ChartGauge :id="warningCard.idmedia"
            :chartid="warningCard.idmedia"
              :valueChart="warningCard.avg"
              :labelChart="'Média'"
              :chartmax="warningCard.threshold"
              :symbol="warningCard.symbol">
              </ChartGauge>
            </div>
            <div class='col-xs-6'>
              <ChartGauge :id="warningCard.idlimite"
              :chartid="warningCard.idlimite"
              :valueChart="warningCard.threshold"
              :labelChart="'Limite'"
              :chartmax="warningCard.threshold + 20"
              :symbol="warningCard.symbol">
              </ChartGauge>
            </div>
          </div>
      </div>
      <div class='footer'>
        <hr/>
        <i :class='warningCard.footerIcon'></i> {{warningCard.dateupdate}}
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
    data () {
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
    mounted () {
    }
  }
</script>
<style>

</style>
