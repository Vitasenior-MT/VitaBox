<template>
  <canvas></canvas>
</template>
<script>
import Chart from 'chart.js'

export default {
  name: 'ChartBar',
  props: ['barChartId', 'dataChart'],
  data() {
    return {
      labelsPos: 0,
      clearChart: false,
      barChart: null,
      configChart: {
        type: 'bar',
        data: {
          // Data to be represented on x-axis
          labels: [],
          datasets: [{
            label: '',
            backgroundColor: '#CDD452',
            pointBackgroundColor: '#CDD452',
            borderWidth: 1,
            pointBorderColor: '#CDD452',
            // Data to be represented on y-axis
            data: []
          }]
        },
        options: {
          hover: {
            "animationDuration": 0
          },
          animation: {
            duration: 1,
            onComplete: function() {
              var chartInstance = this.chart
              var ctx = chartInstance.ctx

              ctx.font = Chart.helpers.fontString(16, 'bold', Chart.defaults.global.defaultFontFamily)
              ctx.textAlign = 'center'
              ctx.textBaseline = 'bottom'

              this.data.datasets.forEach(function(dataset, i) {
                var meta = chartInstance.controller.getDatasetMeta(i);
                meta.data.forEach(function(bar, index) {
                  var data = dataset.data[index];
                  ctx.fillText(data, bar._model.x, bar._model.y - 5);
                });
              });
            }
          },
          tooltips: {
            enabled: false
          },
          scales: {
            yAxes: [
              {
                ticks: {
                  beginAtZero: true,
                  fontSize: 18
                },
                gridLines: {
                  display: true
                }
              }
            ],
            xAxes: [
              {
                ticks: {
                  fontSize: 18
                },
                gridLines: {
                  display: false
                }
              }
            ]
          },
          legend: {
            display: false
          },
          responsive: true,
          maintainAspectRatio: false
        }
      }
    }
  },
  methods: {
    initGraphLine: function(_el) {
      var ctx = document.getElementById(_el).getContext('2d')
      this.configChart.data.labels = []
      this.configChart.data.datasets[0].data = []
      this.barChart = new Chart(ctx, this.configChart)
      this.barChart.data.labels.push(this.dataChart.x)
      this.barChart.data.datasets[0].data.push(this.dataChart.y)
      this.barChart.update()
    }
  },
  mounted() {
    this.initGraphLine(this.barChartId)
  },
  beforeDestroy() {},
  watch: {}
}
</script>

<style>
</style>
