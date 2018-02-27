<template>
  <div :class="circleType + ' col-xs-' + space + ' ' + warning">
    <p :class="circleType + (type === 'Media' ? (value > 100 ? '-' + 50 : '-' + 70) : '') + '-text'">{{value}}</p>
    <p :class="circleType + '-text-under'">{{type}}</p>
  </div>
</template>
<script>
export default {
  props: ["space", "value", "type", "warning", "circleType"],
  name: "circle-data"
};
</script>
<style>
.circle-avg {
  padding-right: 38% !important;
  width: 142px !important;
  height: 136px !important;
  border-radius: 50%;
}

.circle-avg-70-text {
  font-size: 70px;
}

.circle-avg-50-text {
  font-size: 50px;
  padding-top: 5px;
  margin-bottom: 0;
}

.circle-avg-text-under {
  font-size: 20px;
  margin: -30px 0 0 13px;
}

.circle-limit {
  width: 85px !important;
  height: 78px !important;
  border-radius: 50%;
  border: 10px solid black;
}

.circle-limit-text {
  font-size: 35px;
}

.circle-limit-text-under {
  font-size: 12px;
  margin: -18px 0 1px 0;
}

.warning-card-2 {
  animation: color-me-in 3s infinite;
}

.warning-card-1 {
  border: 15px solid orangered;
}

.warning-card-0 {
  border: 15px solid green;
}

@keyframes color-me-in {
  0% {
    border: 15px solid #cc0000;
    box-shadow: 0 0 10px 5px white;
  }
  /* Adding a step in the middle */
  50% {
    border: 15px solid #ff1a1a;
    box-shadow: 0 0 10px 5px #ff1a1a;
  }
  100% {
    border: 15px solid #cc0000;
    box-shadow: 0 0 10px 5px white;
  }
}
</style>
