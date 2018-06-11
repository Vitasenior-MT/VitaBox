<template>
  <div></div>
</template>
<script>
export default {
  name: 'chartdiv',
  data() {
    return {
      chart: null,
      valueChart: Math.round(this.valueChart * 100) / 100,
      options: {
        label: this.labelChart,
        value: Math.round(this.valueChart * 100) / 100,
        min: 0,
        max: this.chartmaxP,
        decimals: 0,
        symbol: this.symbol,
        gaugeWidthScale: 1,
        gaugeWidthScale2: 1,
        valueFontColor: '#000000',
        pointer: true,
        labelFontColor: 'black',
        donut: this.typechartdonut,
        pointerOptions: {
          toplength: 10,
          bottomlength: 20,
          bottomwidth: 2
        },
        counter: true,
        relativeGaugeSize: true,
        formatNumber: true
      },
      sectors: [{
        color: "#FF4500",
        lo: this.chartminP,
        hi: (this.chartminA - 0.001)
      }, {
        color: "#ADFF2F",
        lo: this.chartminA,
        hi: (this.chartmaxA - 0.001)
      }, {
        color: "#FF4500",
        lo: this.chartmaxA,
        hi: (this.chartmaxP)
      }]
    }
  },
  props: [
    'chartid',
    'valueChart',
    'labelChart',
    'chartmaxP',
    'chartmaxA',
    'chartminP',
    'chartminA',
    'symbol',
    'typechartdonut'
  ],
  methods: {
    initGraph: function(_el) {
      this.chart = new JustGage2({ id: _el,
        defaults: this.options,
        customSectors: this.sectors })
    }
  },
  mounted: function() {
    this.initGraph(this.chartid)
  },
  watch: {
    valueChart: function(_el) {
      // console.log('Update Char', this.chartid, _el)
      this.chart.refresh(_el)
    }
  }
}
</script>
<style>
</style>
