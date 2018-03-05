<template>
  <div :class="circleType + ' col-xs-' + space + ' ' + warning" class="img-properties">
    <img src="static/img/vitabox/temp.svg">
  </div>
</template>
<script>
export default {
  props: ["space", "value", "type", "warning", "circleType"],
  name: "circle-data"
};
</script>
<style>
.img-properties img {
  width: 70%;
  height: 70%;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-left: -35%;
  margin-top: -35%;
}

.circle-avg {
  position: relative;
  width: 50% !important;
  height: 0;
  padding-bottom: 30%;
  border-radius: 50%;
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
