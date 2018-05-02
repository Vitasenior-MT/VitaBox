<template>
  <canvas height="100px" ></canvas>
</template>
<script>
import Chart from 'chart.js'

export default {
  name: 'ChartLine',
  props: [
    'lineChartId',
    'dataChart',
    'dataChartAvg'
  ],
  data() {
    return {
      labelsPos: 0,
      lineChart: null,
      configChart: {
        type: 'line',
        data: {
          labels: [],
          datasets: [{
            label: 'Pulsação',
            borderColor: '#CDD452',
            pointBackgroundColor: '#CDD452',
            backgroundColor: 'rgba(0, 0, 0, 0)',
            data: []
          }, {
            label: 'Média das Leituras',
            borderColor: '#f05a28',
            pointBackgroundColor: '#f7931d',
            backgroundColor: 'rgba(0, 0, 0, 0)',
            data: []
          }]
        },
        options: {
          responsive: true,
          legend: {
            position: 'top',
            display: true
          },
          tooltips: {
            enabled: false
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
      console.log('chartline', value)
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
      this.lineChart.update()
    }
  }
}
</script>

<style>
</style>
