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
      warningCards: [],
      setInterval: null
    };
  },
  methods: {
    sortArr: function(sortKey) {
      let green = this.sliceArr(sortKey, 0);
      let orange = this.sliceArr(sortKey, 1);
      let red = this.sliceArr(sortKey, 2);
      green = this.sortBy(green, "footerText");
      orange = this.sortBy(orange, "footerText");
      red = this.sortBy(red, "footerText");
      red.push.apply(red, orange);
      red.push.apply(red, green);
      this.warningCards = red;
    },
    sortBy: function(sortKey, property) {
      return sortKey.sort(function(a, b) {
        let timeA = new Date(Date.parse(a[property]) / 1000).getTime();
        let timeB = new Date(Date.parse(b[property]) / 1000).getTime();
        if (timeA < timeB) {
          return -1;
        } else if (timeA >= timeB) {
          return 1;
        } else {
          return 0;
        }
      });
    },
    sliceArr: function(sortKey, property) {
      let arr = [];
      for (var i = sortKey.length - 1; i >= 0; --i) {
        if (sortKey[i].critLvl === property) {
          arr.push(sortKey[i]);
        }
      }
      return arr;
    },
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
          this.warningCards.push({
                headerText: place[index].name,
                data: []
              });
          console.log(place[index]);
          this.$http
            .get("/api/sensor/" + place[index].name + "/allInfo")
            .then(data => {
              let sensor = data.data.data.data;
              console.log('sensor');
              console.log(sensor);
              for (var i in sensor) {
                this.warningCards[index].data.push({
                  headerText: sensor[i].location,
                  footerText: this.dateFormat(sensor[i].avgLastUpdate),
                  footerIcon: "ti-reload",
                  sensor: sensor[i].sensortype,
                  avg: sensor[i].avg.toFixed(),
                  threshold: sensor[i].threshold,
                  critLvl: sensor[i].critLevel
                });
              }
              console.log(data.body.data);
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
