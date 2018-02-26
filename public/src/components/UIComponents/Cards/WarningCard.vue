<template>
  <div class="card">
    <div class="content">
      <div class="row">
        <div class="col-xs-5">
          <div class="col-xs-5">
            <img src="static/img/vitabox/temp.svg" width="40" height="40">
          </div>
          <div class="col-xs-5 text-center font-padding">
            <b>{{data.sensor}}</b>
          </div>
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
          <circle-data 
          :space="4" :type="'Limite'" :value="this.data.threshold"
          :circleType="'circle-limit'" :warning="'N/A'">
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
import CircleData from "components/UIComponents/Cards/CircleData.vue";
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
  margin: 0 0 0 15%;
}

.font-size-27 {
  font-size: 27px;
}

.font-padding {
  font-size: 15px;
  padding-top: 10%;
}
</style>
