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
    'defSecoundScale'
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
      this.lineChart = new Chart(ctx, this.configChart)
      this.lineChart.data = this.dataChart.data
      this.lineChart.update()
    }
  },
  mounted() {
    this.initGraphLine(this.lineChartId)
  },
  watch: {
    dataChart: function(value) {}
  }
}
</script>

<style>
</style>
