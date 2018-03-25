<template>
  <div :class="circleType + ' col-xs-' + space + ' ' + warning">
    <p :class="circleType + (type === 'Media' ? (value > 100 ? '-' + 50 : '-' + 70) : '') + '-text'">{{value}}</p>
    <p :class="circleType + '-text-under'">{{type}}</p>
  </div>
</template>
<script>
export default {
  props: ['space', 'value', 'type', 'warning', 'circleType'],
  name: 'show-data-circle'
}
</script>
<style>

</style>
