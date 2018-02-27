<template>
  <div></div>
</template>
<script>
  export default {
    name: 'chartdiv',
    data () {
      return {
        chart: '',
        options: {
          label: this.labelChart,
          value: Math.round(this.valueChart * 100) / 100,
          min: 0,
          max: this.chartmax,
          decimals: 0,
          symbol: this.symbol,
          gaugeWidthScale: 1,
          pointer: true,
          pointerOptions: {
            toplength: 10,
            bottomlength: 30,
            bottomwidth: 2
          },
          counter: true,
          relativeGaugeSize: true,
          formatNumber: true
        }
      }
    },
    props: ['chartid', 'valueChart', 'labelChart', 'chartmax', 'symbol'],
    mounted () {
      this.$nextTick(() => {
        this.chart = new JustGage({id: this.chartid, defaults: this.options})
      })
    }
  }
</script>
<style>

</style>
