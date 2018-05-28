<template>
<div class="row">
    <div :class="dataCharts.sizeArr == 1 ? 'col-md-offset-2 col-md-8' : 'col-md-' + (12 / dataCharts.sizeArr)" v-for="chartData in this.dataCharts.charts" :key="chartData.id">
      <div class="card">
        <div class="content">
           <chart-line
            :id="'lineChart-' + chartData.data.poschart"
            :lineChartId="'lineChart-' + chartData.data.poschart"
            :chartTitle="''"
            :defSecoundScale="chartData.data.secoundScale"
            :dataChart="chartData" >
          </chart-line>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import ChartLine from 'components/UIComponents/Charts/chartLine.vue'
export default {
  components: {
    ChartLine
  },
  name: 'CardLineHistory',
  data() {
    return {}
  },
  props: ['dataCharts'],
  mounted() {},
  created() {},
  beforeCreate() {},
  beforeDestroy() {
    this.dataCharts = []
  }
}
</script>
<style>
</style>
