<template>
  <div class="col-sm-12 row">
    <div class="col-sm-4" v-for="warningCard in warningCards" :key="warningCard.id">
      <warning-card :data="warningCard" ></warning-card>
    </div>
  </div>
</template>
<script>
import WarningCard from "components/UIComponents/Cards/WarningCard.vue";
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
      warningCards: [],
      setInterval: null,
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
        if (a[property].toUpperCase() < b[property].toUpperCase()) {
          return -1;
        } else if (a[property].toUpperCase() > b[property].toUpperCase()) {
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
        date.getDate() +
        "/" +
        date.getMonth() +
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
    getSensorValues(sensortype, locationId, limit, index) {
      this.$http
        .get("/api/sensor/" + sensortype + "/" + locationId + "/" + limit)
        .then(response => {
          if (response.data.status === true) {
            let data = response.data.data;
            if (data) {
              this.warningCards[index].avg = data.avg;
              this.warningCards[index].threshold = data.threshold;
              this.warningCards[index].green =
                data.avg < data.threshold - data.threshold * 0.1;
              this.warningCards[index].yellow =
                data.avg >= data.threshold - data.threshold * 0.1;
              this.warningCards[index].red = data.avg >= data.threshold;
              if (this.warningCards[index].red) {
                this.warningCards[index].critLvl = 2;
                this.warningCards[index].footerText = this.dateFormat();
              } else if (this.warningCards[index].yellow) {
                this.warningCards[index].critLvl = 1;
                this.warningCards[index].footerText = this.dateFormat();
              } else if (this.warningCards[index].green) {
                this.warningCards[index].critLvl = 0;
                this.warningCards[index].footerText = this.dateFormat();
              } else {
                this.warningCards[index].critLvl = -1;
              }
            }
            //this.sortBy(this.warningCards, "footerText");
          } else {
            console.log("Receive error");
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    getSensorFromPlace(location) {
      console.log(location);
      this.$http
        .get("/api/sensor/" + location._id)
        .then(response => {
          if (response.data.status === true) {
            for (var i in response.data.data) {
              let data = response.data.data[i];
              this.warningCards.push({
                locationId: location._id,
                headerText: location.name,
                headerIcon: "ti-reload",
                footerText: location.name,
                footerIcon: "ti-reload",
                sensor: data,
                avg: "",
                threshold: "",
                green: "",
                yellow: "",
                red: "",
                critLvl: ""
              });
              this.getSensorValues(
                data,
                location._id,
                10,
                this.warningCards.length - 1
              );
            }
          } else {
            console.log("Receive error");
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    updateSensors() {
      for (var index in this.warningCards) {
        this.getSensorValues(
          this.warningCards[index].sensor,
          this.warningCards[index].locationId,
          10,
          index
        );
      }
    },
    updateSensor(data) {
      for (var index in this.warningCards) {
        if (data.location === this.warningCards[index].headerText) {
          if (data.warning_type === this.warningCards[index].sensor) {
            this.warningCards[index].avg = data.avg;
            this.warningCards[index].threshold = data.threshold;
            //TODO: alterar para a data da bd
            this.warningCards[index].footerText = this.dateFormat();
            this.sortArr(this.warningCards);
            return;
          }
        }
      }
    }
  },
  beforeCreate() {
    this.$http
      .get("/api/places/all")
      .then(response => {
        if (response.data.status === true) {
          for (var i in response.data.data) {
            this.getSensorFromPlace(response.data.data[i]);
          }
          clearInterval(this.setInterval);
          this.setInterval = setInterval(() => {
            this.updateSensors();
          }, 10000);
        } else {
          console.log("Receive error");
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
