<template>
  <div class="card">
    <div class="content">
      <div class="row">
        <div class="col-xs-5">
          <b class="col-xs-5 text-center font-size-27">{{data.sensor}}</b>
        </div>
        <b class="col-xs-5 text-center font-size-27">{{data.headerText}}</b>
      </div>
      <hr/>
      <div class="row">
        <div class="margin-5">
          <circle-data
          :space="5" :type="'Media'" :value="this.data.avg" :circleType="'circle-avg'"
          :warning="'warning-card-' + this.data.critLvl">
          </circle-data>
        </div>
      </div>
      <div class="footer">
        <hr/>
        <i :class="data.footerIcon"></i> {{data.footerText}}
      </div>
    </div>
  </div>
</template>
<script>
import CircleData from "components/UIComponents/Cards/CircleData2.vue";
export default {
  components: {
    CircleData
  },
  data() {
    return {};
  },
  props: ["data"],
  name: "warning-card"
};
</script>
<style>
.margin-5 {
  margin: 0 0 0 25%;
}

.font-size-27 {
  font-size: 27px;
}
</style>
