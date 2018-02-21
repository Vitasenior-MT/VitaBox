<template>
  <div class="col-md-12 warning-card-grid-two-column">
    <div class="warning-card-margin" v-for="warningCard in warningCards" :key="warningCard.id">
      <warning-card>
        <div class="row" slot="header">
          <div class="col-xs-5">
            <div class="col-xs-5">
              <img src="static/img/vitabox/temp.svg" width="40" height="40">
            </div>
            <div class="col-xs-5 big-text">
             <b>{{warningCard.sensor}}</b>
            </div>
          </div>
          <b class="col-xs-5 big-text">{{warningCard.headerText}}</b>
        </div>
        <div class="warning-card-padding" slot="content">
          <div v-if="warningCard.red" class="row padding-8-per">
            <div class="warning-card-critical circle-avg col-xs-5">
              <div class="column">
                <p class="circle-avg-text">{{warningCard.avg}}º</p>
                <p class="circle-avg-text-under">Media</p>
              </div>
            </div>
            <div class="circle-limit col-xs-4">
              <p class="circle-limit-text">{{warningCard.threshold}}º</p>
              <p class="circle-limit-text-under">Limite</p>
            </div>
          </div>
          <div v-else-if="warningCard.yellow" class="row padding-8-per">
            <div class="warning-card-warning circle-avg col-xs-5">
              <div class="column">
                <p class="circle-avg-text">{{warningCard.avg}}º</p>
                <p class="circle-avg-text-under">Media</p>
              </div>
            </div>
            <div class="circle-limit col-xs-4">
              <p class="circle-limit-text">{{warningCard.threshold}}º</p>
              <p class="circle-limit-text-under">Limite</p>
            </div>
          </div>
          <div v-else-if="warningCard.green" class="row padding-8-per">
            <div class="warning-card-good circle-avg col-xs-5">
              <div class="column">
                <p class="circle-avg-text">{{warningCard.avg}}º</p>
                <p class="circle-avg-text-under">Media</p>
              </div>
            </div>
            <div class="circle-limit col-xs-4">
              <p class="circle-limit-text">{{warningCard.threshold}}º</p>
              <p class="circle-limit-text-under">Limite</p>
            </div>
          </div>
        </div>
        <div slot="footer">
          <i :class="warningCard.footerIcon"></i> {{warningCard.footerText}}
        </div>
      </warning-card>
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
      setInterval: null
    };
  },
  ready: function() {
    window.unload = this.leaving;
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
.v-overlay-left {
  position: fixed;
  box-sizing: border-box;
  left: 0;
  top: 0;
  width: 260px;
  height: 100vh;
  background: rgba(0, 0, 0, 0.2);
  z-index: 999;
  opacity: 1;
}

.v-overlay-top {
  position: fixed;
  box-sizing: border-box;
  left: 0;
  top: 0;
  width: 100%;
  height: 75px;
  background: rgba(0, 0, 0, 0.2);
  z-index: 999;
  opacity: 1;
}

.v-overlay-bottom {
  position: fixed;
  box-sizing: border-box;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 89px;
  background: rgba(0, 0, 0, 0.2);
  z-index: 999;
  opacity: 1;
}

.warning-card-grid-two-column {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
}

.warning-card-margin {
  margin: 0 5px 0 0;
}

.warning-card-padding {
  padding: 0 3% 0 3%;
}

.warning-card-critical {
  border: 15px solid red;
}

.warning-card-warning {
  border: 15px solid orangered;
}

.warning-card-good {
  border: 15px solid green;
}

.big-text {
  font-size: 27px;
  text-align: center;
}

.circle-avg {
  padding-right: 38% !important;
  width: 40%;
  border-radius: 50%;
}

.circle-avg-text {
  font-size: 70px;
}

.circle-avg-text-under {
  font-size: 20px;
  margin: -23px 0 0 25px;
}

.circle-limit {
  width: 23%;
  border-radius: 50%;
  border: 10px solid black;
}

.circle-limit-text {
  font-size: 35px;
}

.circle-limit-text-under {
  font-size: 12px;
  margin: -10px 0 4px 8px;
}

.padding-8-per {
  padding-left: 8%;
}
</style>
