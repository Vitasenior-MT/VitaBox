<template>
<div class="row">
    <div :class="'col-md-' + (12 / dataCharts.sizeArr)" v-for="chartData in this.dataCharts.dataSets" :key="chartData.id">
      <div class="card">
        <div class="content" style="height: 200px;">
           <chart-line
            :id="'lineChart-' + chartData.title"
            :lineChartId="'lineChart-' + chartData.title"
            :chartTitle="chartData.title"
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
    return {
      classSlice: 12
    }
  },
  props: ['dataCharts'],
  mounted() {},
  created() {},
  beforeCreate() {}
}
</script>
<style>
</style>
