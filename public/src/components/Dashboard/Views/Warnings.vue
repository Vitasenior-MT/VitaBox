<template>
  <div class="col-md-12 warning-card-grid-two-column">
    <div class="warning-card-margin" v-for="warningCard in warningCards" :key="warningCard.id">
      <warning-card>
        <div slot="header">
          <i :class="warningCard.headerIcon"></i> {{warningCard.headerText}}
        </div>
        <div v-if="warningCard.sensors.length > 0" class="warning-card-padding" slot="content" v-for="sensor in warningCard.sensors" :key="sensor.id">
          <h4>{{sensor.sensor}}</h4>
          <p v-if="sensor.avg >= sensor.threshold" class="warning-card-critical">Media: {{sensor.avg}} - Limite:{{sensor.threshold}}</p>
          <p v-else-if="sensor.avg >= (sensor.threshold - (sensor.threshold * 0.1))" class="warning-card-warning">Media: {{sensor.avg}} - Limite:{{sensor.threshold}}</p>
          <p v-else-if="sensor.avg < (sensor.threshold - (sensor.threshold * 0.1))" class="warning-card-good">Media: {{sensor.avg}} - Limite:{{sensor.threshold}}</p>
        </div>
        <div v-if="warningCard.sensors.length === 0" class="warning-card-padding" slot="content">
          <h4>Empty</h4>
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
    sortBy: function(arr, property) {
      console.log(arr, property);
      return arr.sort(function(a, b) {
        console.log("aaaaaaa ", a, b);
        if (a[property].toUpperCase() < b[property].toUpperCase()) {
          return -1;
        } else if (a[property].toUpperCase() > b[property].toUpperCase()) {
          return 1;
        } else {
          return 0;
        }
      });
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
    getSensorValues(sensortype, locationId, limit, index, i) {
      console.log(sensortype, locationId, limit);
      this.$http
        .get("/api/sensor/" + sensortype + "/" + locationId + "/" + limit)
        .then(response => {
          if (response.data.status === true) {
            let data = response.data.data;
            if (data) {
              console.log("avg--> ", response.data);
              this.warningCards[index].sensors[i].avg = data.avg;
              this.warningCards[index].sensors[i].threshold = data.threshold;
              this.warningCards[index].footerText = this.dateFormat();
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
    getSensorFromPlace(locationId, index) {
      this.$http
        .get("/api/sensor/" + locationId)
        .then(response => {
          if (response.data.status === true) {
            for (var i in response.data.data) {
              let data = response.data.data[i];
              this.warningCards[index].sensors.push({
                sensor: data,
                avg: "",
                threshold: ""
              });
              this.getSensorValues(data, locationId, 10, index, i);
            }
            console.log(this.warningCards[index].sensors);
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
        let warnings = this.warningCards[index];
        for (var i in warnings.sensors) {
          let data = warnings.sensors[i];
          this.getSensorValues(data.sensor, warnings.locationId, 10, index, i);
        }
      }
    },
    updateSensor(data) {
      for (var index in this.warningCards) {
        let warnings = this.warningCards[index];
        if (data.location === warnings.headerText) {
          for (var i in warnings.sensors) {
            let sensor = warnings.sensors[i];
            if (data.warning_type === sensor.sensor) {
              this.warningCards[index].sensors[i].avg = data.avg;
              this.warningCards[index].sensors[i].threshold = data.threshold;
              this.warningCards[index].footerText = this.dateFormat();
              this.sortBy(this.warningCards, "footerText");
              return;
            }
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
            let data = response.data.data[i];
            this.warningCards.push({
              locationId: data._id,
              message: data._id,
              headerText: data.name,
              headerIcon: "ti-reload",
              footerText: data.name,
              footerIcon: "ti-reload",
              sensors: []
            });
            this.getSensorFromPlace(data._id, i);
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
  grid-template-columns: 1fr 1fr;
}

.warning-card-margin {
  margin: 0 5px 0 0;
}

.warning-card-padding {
  padding: 0 3% 0 3%;
}

.warning-card-critical {
  background-color: red;
}

.warning-card-warning {
  background-color: orangered;
}

.warning-card-good {
  background-color: green;
}
</style>
