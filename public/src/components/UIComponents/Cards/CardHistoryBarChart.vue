<template>
  <div class="row">
    <div class="col-md-2" v-for="chartData in this.dataCharts" :key="chartData.id">
      <div class="card">
        <div class="content" style="height: 170px;">
          <chart-bar-single
            :id="chartData.key"
            :barChartId="chartData.key"
            :dataChart="chartData.dataBar" >
          </chart-bar-single>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import ChartBarSingle from 'components/UIComponents/Charts/chartBarSingle.vue'
export default {
  components: {
    ChartBarSingle
  },
  name: 'CardHistory',
  data() {
    return {}
  },
  props: ['dataCharts'],
  mounted() {}
}
</script>
<style>
</style>
