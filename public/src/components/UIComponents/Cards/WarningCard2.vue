<template>
  <div class="card">
    <div class="content">
      <div class="text-center positioning">
        <b class="font-size-27">{{data.headerText}}</b>
      </div>
      <div class="row">
        <div class="margin-25">
          <circle-data :warning="this.dataCrit">
          </circle-data>
        </div>
      </div>
      <div class="footer row">
        <hr/>
        <div class="col-sm-12">
          <i :class="data.footerIcon"></i> {{data.footerText}}
        </div>
        <p class="col-sm-6">Media: {{data.avg}}</p>
        <p class="col-sm-6">Limite: {{data.threshold}}</p>
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
    return {
      dataCrit: ""
    };
  },
  props: ["data"],
  name: "warning-card",
  mounted() {
    this.dataCrit =
      new Date(this.data.avgLastUpdate).getTime() >= new Date() - 100000000
        ? "newWarning-1"
        : "warning-card-2";
  }
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
