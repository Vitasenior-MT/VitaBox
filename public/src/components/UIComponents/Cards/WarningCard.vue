<template>
  <div class="card btn control-remote">
    <div class="content">
      <div class="text-center positioning">
        <b class="font-size-27">{{data.headerText}}</b>
      </div>
      <div class="row">
        <div class="margin-25">
          <circle-data :sensortype="data.sensor">
          </circle-data>
        </div>
      </div>
      <div class="footer row">
        <hr/>
        <div class="col-sm-12">
          <i :class="data.footerIcon"></i> {{data.footerText}}
        </div>
        <p class="col-sm-6">{{ $t("dictionary.avarage.title") }}: {{data.avg}}</p>
        <p class="col-sm-6">{{ $t("dictionary.limit.title") }}: {{data.threshold}}</p>
      </div>
    </div>
  </div>
</template>
<script>
import CircleData from "components/UIComponents/Cards/CircleComp.vue";
export default {
  components: {
    CircleData
  },
  data() {
    return {};
  },
  props: ["data"],
  name: "warning-card",
  mounted() {}
};
</script>
<style>
.margin-25 {
  margin: 0 0 0 25%;
}

.positioning {
  margin-bottom: 5px;
}
</style>
