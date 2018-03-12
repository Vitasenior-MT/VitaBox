<template>
  <div class='col-sm-12 row'>
    <div class='col-sm-4' v-for='warningCard in warningCards' :key='warningCard.id'>
      <warning-card :data='warningCard'></warning-card>
    </div>
  </div>
</template>
<script>
import WarningCard from "components/UIComponents/Cards/WarningCard2.vue";
export default {
  components: {
    WarningCard
  },
  sockets: {
    vitaWarning: function(data) {
      console.log("Receive alert on Tab: ", data);
      this.updateSensor(data);
    }
  },
  data() {
    return {
      warningCards: []
    };
  },
  methods: {
    findCritLvl: function(avg, threshold) {
      if (avg >= threshold) {
        return 2;
      } else if (avg >= threshold - threshold * 0.1) {
        return 1;
      } else if (avg < threshold - threshold * 0.1) {
        return 0;
      } else {
        return -1;
      }
    },
    dateFormat(data) {
      let date = new Date(data);
      return (
        (date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1) +
        "/" +
        (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) +
        "/" +
        date.getFullYear() +
        " " +
        (date.getHours() < 10 ? "0" + date.getHours() : date.getHours()) +
        ":" +
        (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()) +
        ":" +
        (date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds())
      );
    },
    updateSensor(data) {
      for (var index in this.warningCards) {
        if (data.location === this.warningCards[index].headerText) {
          if (data.warning_type === this.warningCards[index].sensor) {
            this.warningCards[index].avg = data.avg.toFixed();
            this.warningCards[index].avgLastUpdate = data.avgLastUpdate;
            this.warningCards[index].threshold = data.threshold;
            this.warningCards[index].footerText = this.dateFormat(
              data.avgLastUpdate
            );
            this.warningCards[index].critLvl = this.findCritLvl(
              data.avg,
              data.threshold
            );
            break;
          }
        }
      }
    }
  },
  beforeCreate() {
    this.$http
      .get("/api/sensor/allCriticalSensors/2")
      .then(response => {
        for (var index in response.data.data) {
          let data = response.data.data[index];
          this.warningCards.push({
            headerText: data.location,
            footerText: this.dateFormat(data.avgLastUpdate),
            footerIcon: "ti-reload",
            sensor: data.sensortype,
            avg: data.avg.toFixed(),
            avgLastUpdate: data.avgLastUpdate,
            threshold: data.threshold,
            critLvl: this.findCritLvl(data.avg, data.threshold)
          });
        }
      })
      .catch(error => {
        console.log(error);
      });
  }
};
</script>
<style>

</style>
