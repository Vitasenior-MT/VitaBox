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
        max: this.chartmax,
        decimals: 0,
        symbol: this.symbol,
        gaugeWidthScale: 1,
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
      }
    }
  },
  props: [
    'chartid',
    'valueChart',
    'labelChart',
    'chartmax',
    'symbol',
    'typechartdonut'
  ],
  methods: {
    initGraph: function(_el) {
      this.chart = new JustGage({ id: _el, defaults: this.options })
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
