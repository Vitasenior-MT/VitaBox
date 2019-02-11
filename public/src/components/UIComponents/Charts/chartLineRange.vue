<template>
  <div class="row clear-padding">
    <div id="chartLegend" class="col-md-12 text-center">
    </div>
    <canvas :id="lineChartId"></canvas>
  </div>
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
          }],
          yRangeBegin: 0,
          yRangeEnd: 0,
          colorRange: '#00ff00'
        },
        options: {
          responsive: true,
          // maintainAspectRatio: false,
          legendCallback: function(chart) {
            if (chart.data.datasets.length > 0) {
              let htmlStr = ""
              let dataSets = chart.data.datasets
              htmlStr = '<h4 style="margin: 14px;">'
              for (let index = 0; index < dataSets.length; index++) {
                htmlStr += '' +
                  '<span class="badge" style="background-color: ' + dataSets[0].borderColor + '"><b>&nbsp;</b></span>&nbsp;&nbsp;' +
                  '<span><b>' + dataSets[0].label + "</b>" + " (Valor Máximo: " + Math.max.apply(null, dataSets[0].data) + ")" + " (Valor Minimo: " + Math.min.apply(null, dataSets[0].data) + ")" + '</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'
              }
              htmlStr += '' +
                '<span class="badge" style="background-color:"' + chart.data.colorRange + '"><b>&nbsp;</b></span>&nbsp;&nbsp;' +
                '<span>Intervalo de Conforto</span>' +
              '</h4>' // #3cb44b
              return htmlStr;
            }
            return ''
          },
          title: {
            display: false,
            text: this.chartTitle,
            fontSize: 18
          },
          legend: {
            position: 'top',
            display: false,
            labels: {
              fontSize: 18,
              padding: 20,
              generateLabels: function(chart) {
                var data = chart.data;
                return Chart.helpers.isArray(data.datasets) ? data.datasets.map(function(dataset, i) {
                  return {
                    text: dataset.label + " (Valor Máximo: " + Chart.helpers.max(dataset.data).toLocaleString() + ")" + " (Valor Minimo: " + Chart.helpers.min(dataset.data).toLocaleString() + ")",
                    fillStyle: (!Chart.helpers.isArray(dataset.backgroundColor) ? dataset.backgroundColor : dataset.backgroundColor[0]),
                    hidden: !chart.isDatasetVisible(i),
                    lineCap: dataset.borderCapStyle,
                    lineDash: dataset.borderDash,
                    lineDashOffset: dataset.borderDashOffset,
                    lineJoin: dataset.borderJoinStyle,
                    lineWidth: dataset.borderWidth,
                    strokeStyle: dataset.borderColor,
                    pointStyle: dataset.pointStyle,

                    // Below is extra data used for toggling the datasets
                    datasetIndex: i
                  };
                }, this) : [];
              }
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
                fontSize: 18,
                stepSize: 2 /* ,
                min: 0,
                max: 100,
                suggestedMax: 100,
                suggestedMin: 0,
                beginAtZero: true */
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
      var ctx = document.getElementById(_el);
      var lineSuperDraw = Chart.controllers.line.prototype.draw;
      Chart.helpers.extend(Chart.controllers.line.prototype, {
        draw: function() {
          let chart = this.chart;
          let ctx = chart.chart.ctx;
          let yRangeBegin = chart.config.data.yRangeBegin;
          let yRangeEnd = chart.config.data.yRangeEnd;
          let colorRange = chart.config.data.colorRange
          let xaxis = chart.scales['x-axis-0'];
          let yaxis = chart.scales['y-axis-0'];
          let yRangeBeginPixel = yaxis.getPixelForValue(yRangeBegin);
          let yRangeEndPixel = yaxis.getPixelForValue(yRangeEnd);
          let minValRange = Math.min(yRangeBeginPixel, yRangeEndPixel)
          let maxValRange = Math.max(yRangeBeginPixel, yRangeEndPixel)
          ctx.save();
          for (var yPixel = minValRange; yPixel <= maxValRange; ++yPixel) {
            ctx.beginPath();
            ctx.moveTo(xaxis.left, yPixel);
            ctx.strokeStyle = colorRange;
            ctx.lineTo(xaxis.right, yPixel);
            ctx.stroke();
          }
          ctx.restore();
          lineSuperDraw.apply(this, arguments);
        }
      });
      this.configChart.data.labels = this.dataChart.labels
      this.configChart.data.datasets = this.dataChart.datasets
      this.configChart.data.yRangeBegin = this.dataChart.yRangeBegin
      this.configChart.data.yRangeEnd = this.dataChart.yRangeEnd
      if (this.dataChart.colorRange) {
        this.configChart.data.colorRange = this.dataChart.colorRange
      }
      if (this.dataChart.min) {
        this.configChart.options.scales.yAxes[0].ticks.min = this.dataChart.min - this.configChart.options.scales.yAxes[0].ticks.stepSize
      }
      if (this.dataChart.max) {
        this.configChart.options.scales.yAxes[0].ticks.max = this.dataChart.max + this.configChart.options.scales.yAxes[0].ticks.stepSize
      }
      this.lineChart = new Chart(ctx, this.configChart)
      this.lineChart.data.colorRange = this.configChart.data.colorRange
      document.getElementById("chartLegend").innerHTML = this.lineChart.generateLegend()
    }
  },
  mounted() {
    this.initGraphLine(this.lineChartId)
  },
  beforeDestroy() {
    if (this.lineChart) {
      this.lineChart.destroy()
      this.lineChart.data = {}
    }
    this.labelsPos = 0
    this.clearChart = false
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
