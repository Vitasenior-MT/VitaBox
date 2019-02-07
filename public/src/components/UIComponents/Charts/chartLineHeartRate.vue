<template>
  <canvas height="40px"></canvas>
</template>
<script>
import Chart from 'chart.js'

export default {
  name: 'ChartLine',
  props: [
    'lineChartId',
    'dataChart',
    'dataChartAvg',
    'nameLineA',
    'nameLineB'
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
            label: this.nameLineA,
            borderColor: '#CDD452',
            pointBackgroundColor: '#CDD452',
            backgroundColor: 'rgba(0, 0, 0, 0)',
            data: []
          }, {
            label: this.nameLineB,
            borderColor: '#f05a28',
            pointBackgroundColor: '#f05a28',
            backgroundColor: 'rgba(0, 0, 0, 0)',
            data: []
          }]
        },
        options: {
          responsive: true,
          min: 0,
          max: 150,
          legend: {
            position: 'right',
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
              ticks: {
                fontSize: 18
              }
            }],
            xAxes: [{
              ticks: {
                fontSize: 18
              }
            }]
          },
          animation: {
            onComplete: function() {
              var ctx = this.chart.ctx;
              ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontFamily, 'normal', Chart.defaults.global.defaultFontFamily);
              ctx.fillStyle = "black";
              ctx.textAlign = 'center';
              ctx.textBaseline = 'bottom';

              this.data.datasets.forEach(function(dataset) {
                for (var i = 0; i < dataset.data.length; i++) {
                  for (var key in dataset._meta) {
                    var model = dataset._meta[key].data[i]._model;
                    ctx.fillText(dataset.data[i], model.x, model.y - 5);
                  }
                }
              });
            }
          }
        }
      }
    }
  },
  methods: {
    initGraphLine: function(_el) {
      var ctx = document.getElementById(_el).getContext('2d')
      this.lineChart = new Chart(ctx, this.configChart)
    }
  },
  mounted() {
    this.initGraphLine(this.lineChartId)
  },
  watch: {
    dataChart: function(value) {
      // console.log('chartline', value)
      if (this.clearChart) {
        this.lineChart.data.datasets[0].data = []
        this.lineChart.data.datasets[0].data.push(null)
        this.lineChart.data.datasets[1].data = []
        this.lineChart.data.labels = []
        this.labelsPos = 0
        this.clearChart = false
      }
      this.lineChart.data.datasets[0].data.push(value[value.length - 1])
      this.lineChart.data.labels.push(this.labelsPos++)
      this.lineChart.update()
    },
    dataChartAvg: function(value) {
      console.log('avg', value)
      this.lineChart.data.datasets[1].data.push(null)
      for (let index = 1; index < this.labelsPos; index++) {
        this.lineChart.data.datasets[1].data.push(value)
      }
      this.clearChart = true
      this.lineChart.update()
    }
  }
}
</script>

<style>
</style>
