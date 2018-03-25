<template>
  <div class='col-sm-12 row'>
    <div class='col-sm-4' v-for='warningCard in warningCards' :key='warningCard.id'>
      <warning-card :data='warningCard'></warning-card>
    </div>
  </div>
</template>
<script>
import WarningCard from "components/UIComponents/Cards/WarningCard2.vue"
export default {
  components: {
    WarningCard
  },
  sockets: {
    vitaWarning: function(data) {
      console.log("Receive alert on Tab: ", data)
      this.updateSensor(data)
    }
  },
  data() {
    return {
      warningCards: []
    }
  },
  methods: {
    dateFormat(data) {
      let date = new Date(data)
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
      )
    },
    updateSensor(data) {
      if (this.warningCards) {
        for (var index in this.warningCards) {
          if (data.location === this.warningCards[index].headerText) {
            if (data.warning_type === this.warningCards[index].sensor) {
              this.warningCards[index].avg = data.avg.toFixed()
              this.warningCards[index].avgLastUpdate = data.avgLastUpdate
              this.warningCards[index].threshold = data.threshold
              this.warningCards[index].footerText = this.dateFormat(
                data.avgLastUpdate
              )
              this.warningCards[index].critLvl = data.critLevel
              break
            }
          }
        }
      } else {
        this.$http
        .get("/api/sensor/allCriticalSensors/2")
        .then(response => {
          for (var index in response.data.data) {
            let data = response.data.data[index]
            this.warningCards.push({
              headerText: data.location,
              footerText: this.dateFormat(data.avgLastUpdate),
              footerIcon: "ti-reload",
              sensor: data.sensortype,
              avg: data.avg.toFixed(),
              avgLastUpdate: data.avgLastUpdate,
              threshold: data.threshold,
              critLvl: data.critLevel
            })
          }
        })
        .catch(error => {
          console.log(error)
        })
      }
    }
  },
  beforeCreate() {
    this.$http
        .get("/api/sensor/allCriticalSensors/2")
        .then(response => {
          for (var index in response.data.data) {
            let data = response.data.data[index]
            this.warningCards.push({
              headerText: data.location,
              footerText: this.dateFormat(data.avgLastUpdate),
              footerIcon: "ti-reload",
              sensor: data.sensortype,
              avg: data.avg.toFixed(),
              avgLastUpdate: data.avgLastUpdate,
              threshold: data.threshold,
              critLvl: data.critLevel
            })
          }
        })
        .catch(error => {
          console.log(error)
        })
  }
}
</script>
<style>

</style>
