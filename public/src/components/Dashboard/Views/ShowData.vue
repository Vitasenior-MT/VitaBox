<template>
  <div class='col-sm-12 row'>
    <div class='col-sm-12' v-for='warningCard in warningCards' :key='warningCard.id'>
      <show-data-card :data='warningCard'></show-data-card>
    </div>
  </div>
</template>
<script>
import ShowDataCard from "components/UIComponents/Cards/ShowDataCard.vue";
export default {
  components: {
    ShowDataCard
  },
  sockets: {
    updateAllSensors(data) {
      for (var index in this.warningCards) {
        this.warningCards[index].avg = data.avg.toFixed();
        this.warningCards[index].threshold = data.threshold;
        this.warningCards[index].footerText = this.dateFormat(
          data.avgLastUpdate
        );
        this.warningCards[index].critLvl = this.findCritLvl(
          data.avg,
          data.threshold
        );
      }
      this.sortArr(this.warningCards);
    }
  },
  data() {
    return {
      warningCards: []
    };
  },
  methods: {
    dateFormat() {
      let date = new Date();
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
    }
  },
  beforeCreate() {
    this.$http
      .get("/api/places/all")
      .then(responce => {
        let place = responce.body.data;
        for (var index in place) {
          this.$http
            .get("/api/sensor/" + place[index].name + "/allInfo")
            .then(sensors => {
              if (sensors.data.data) {
                this.warningCards.push({
                  headerText: place[index].name,
                  data: []
                });
                let sensor = sensors.data.data.sensor_location;
                for (var i in sensor) {
                  this.warningCards[this.warningCards.length - 1].data.push({
                    headerText: sensor[i].location,
                    footerText: this.dateFormat(sensor[i].avgLastUpdate),
                    footerIcon: "ti-reload",
                    sensor: sensor[i].sensortype,
                    avg: sensor[i].avg.toFixed(),
                    threshold: sensor[i].threshold,
                    critLvl: sensor[i].critLevel
                  });
                }
              }
            })
            .catch(error => {
              console.log(error);
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
