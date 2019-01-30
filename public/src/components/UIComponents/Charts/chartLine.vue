<template>
  <canvas></canvas>
</template>
<script>
import Chart from 'chart.js'

export default {
  name: 'ChartLine',
  props: [
    'lineChartId',
    'chartTitle',
    'dataChart',
    'defSecoundScale',
    'callbackindex'
  ],
  data() {
    return {
      labelsPos: 0,
      clearChart: false,
      lineChart: null,
      configChart: {
        type: 'line',
        data: {
          labels: [],
          datasets: [{
            label: '',
            borderColor: '',
            pointBackgroundColor: '',
            backgroundColor: 'rgba(0, 0, 0, 0)',
            data: []
          }]
        },
        options: {
          responsive: true,
          // maintainAspectRatio: false,
          title: {
            display: false,
            text: this.chartTitle,
            fontSize: 18
          },
          legend: {
            position: 'top',
            display: true,
            labels: {
              fontSize: 18,
              padding: 20
            },
            onClick: function(e, legendItem, i, chart) {
              var index = i
              if (!i) {
                index = legendItem.datasetIndex;
              }
              var ci = null;
              if (this.chart) {
                ci = this.chart
              } else {
                ci = chart
              }
              var dataset = ci.data.datasets[index]
              var meta = dataset._meta[Object.keys(dataset._meta)[Object.keys(dataset._meta).length - 1]]

              // See controller.isDatasetVisible comment
              meta.hidden = meta.hidden === null ? !ci.data.datasets[index].hidden : null;

              // We hid a dataset ... rerender the chart
              ci.update();
            }
          },
          tooltips: {
            enabled: false
          },
          scales: {
            yAxes: [{
              position: "left",
              id: "y-axis-0",
              type: 'linear',
              ticks: {
                min: this.yTicks.min,           
                max: this.yTicks.max,
                fontSize: 18
              }
            }],
            xAxes: [{
              ticks: {
                maxRotation: 80,
                minRotation: 80,
                fontSize: 18
              }
            }]
          }
        }
      }
    }
  },
  methods: {
    initGraphLine: function(_el) {
      var canvas = document.getElementById(_el)
      var ctx = canvas.getContext('2d')
      if (this.defSecoundScale && this.defSecoundScale !== '' && this.defSecoundScale !== undefined) {
        this.configChart.options.scales.yAxes[0].id = "y-axis-1"
        this.configChart.options.scales.yAxes.push(this.defSecoundScale)
      }
      this.configChart.data = {}
      this.lineChart = new Chart(ctx, this.configChart)
      this.lineChart.data = this.dataChart.data
      this.lineChart.update()
    }
  },
  mounted() {
    this.initGraphLine(this.lineChartId)
  },
  beforeDestroy() {
    this.lineChart.destroy()
    this.labelsPos = 0
    this.clearChart = false
    this.lineChart.data = {}
    this.configChart.data = {}
    this.lineChart = null
  },
  watch: {
    callbackindex: function(value) {
      if (value >= 0) {
        this.lineChart.legend.options.onClick(null, null, value, this.lineChart)
      }
    }
  }
}
</script>

<style>
</style>
