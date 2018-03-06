<template>
  <div class="card">
    <div class="content">
      <div class="row positioning">
        <b class="col-xs-12 text-center font-size-27">{{data.headerText}}</b>
      </div>
      <div class="row">
        <div class="col-sm-4" v-for='sensor in data.data' :key='sensor.id'>
          <div class="col-sm-12 positioning">
            <show-data-circle
            :space="5" :type="'Media'" :value="sensor.avg" :circleType="'circle-avg'"
            :warning="'warning-card-' + sensor.critLvl">
            </show-data-circle>
            <show-data-circle class="positioning"
            :space="4" :type="'Limite'" :value="sensor.threshold"
            :circleType="'circle-limit'" :warning="'N/A'">
            </show-data-circle>
            <div class="col-xs-5">
              <div class="pull-left">
                <img src="static/img/vitabox/temp.svg" width="40" height="40">
              </div>
              <b class="">{{sensor.sensor}}</b>
            </div>
          </div>
          <div class="text-center">
            <i :class="sensor.footerIcon"></i> {{sensor.footerText}}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import ShowDataCircle from "components/UIComponents/Cards/ShowDataCircle.vue";
export default {
  components: {
    ShowDataCircle
  },
  data() {
    return {};
  },
  props: ["data"],
  name: "show-data-card"
};
</script>
<style>

</style>
