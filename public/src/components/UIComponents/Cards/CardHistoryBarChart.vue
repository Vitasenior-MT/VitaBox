<template>
  <div class="row">
    <div class="col-md-3" v-for="chartData in this.dataCharts" :key="chartData.id">
      <div class="card btn btn-block btn-success control-remote-results">
        <div class="content">
          <h1 style="margin: 0;"><span class="label label-info"><b>{{chartData.dataBar.y}}</b></span></h1>
          <div class="footer row">
            <div class="col-sm-12">
              <h4 class="text-div-wrap">{{chartData.dataBar.x}}</h4>
            </div>
          </div>
        </div>
        <!-- <div class="content" style="height: 170px;">
          <chart-bar-single
            :id="chartData.key"
            :barChartId="chartData.key"
            :dataChart="chartData.dataBar" >
          </chart-bar-single>
        </div> -->
      </div>
    </div>
  </div>
</template>
<script>
// import ChartBarSingle from 'components/UIComponents/Charts/chartBarSingle.vue'
export default {
  components: {
    // ChartBarSingle
  },
  name: 'CardHistory',
  data() {
    return {}
  },
  props: ['dataCharts'],
  mounted() {}
}
</script>
<style></style>
</style>
