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
    'dataChart'
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
          title: {
            display: true,
            text: this.chartTitle,
            fontSize: 18
          },
          min: 0,
          max: 150,
          legend: {
            position: 'top',
            display: true,
            labels: {
              fontSize: 18,
              padding: 20
            }
          },
          tooltips: {
            enabled: true
          },
          scales: {
            yAxes: [{
              ticks: {
                fontSize: 18
              }
            }],
            xAxes: [{
              ticks: {
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
      var ctx = document.getElementById(_el).getContext('2d')
      console.log("Data Sets", this.dataChart)
      this.configChart.data = this.dataChart.data
      this.lineChart = new Chart(ctx, this.configChart)
      // this.lineChart.data.datasets = this.dataChart
      this.lineChart.update()
    }
  },
  mounted() {
    this.initGraphLine(this.lineChartId)
  },
  watch: {
    dataChart: function(value) {
      console.log('chartline', value)
    }
  }
}
</script>

<style>
</style>
