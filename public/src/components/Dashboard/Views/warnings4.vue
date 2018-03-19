<template>
  <div>
    <div class="row">
      <div class="col-lg-6" v-for="warningCard in CardsSensors" :key="warningCard.id">
        <CardWarning3 :key="warningCard.id + '-all'" :warningCard="warningCard">
        </CardWarning3>
      </div>
    </div>
  </div>
</template>
<script>
import CardWarning3 from 'components/UIComponents/Cards/CardWarning3.vue'
export default {
  components: {
    CardWarning3
  },
  sockets: {
    avgSensorUpdate: function(data) {
      for (let index in this.CardsSensors) {
        if (this.CardsSensors[index].id === data.idSensor) {
          for (let index2 in this.CardsSensors[index].sensors) {
            if (this.CardsSensors[index].sensors[index2].sensortype === data.sensortype
            ) {
              this.CardsSensors[index].sensors[index2].avg = data.avg
              this.CardsSensors[index].sensors[index2].avglastupdate = this.dateFormat(data.avglastupdate)
              this.CardsSensors[index].sensors[index2].threshold = data.threshold
            }
          }
        }
      }
    }
  },
  data() {
    return {
      CardsSensors: []
    }
  },
  ready: () => {
    window.unload = this.leaving
  },
  methods: {
    dateFormat(data) {
      let date = new Date(data)
      return (
        (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) +
        '/' +
        (date.getMonth() + 1 < 10
          ? '0' + (date.getMonth() + 1)
          : date.getMonth() + 1) +
        '/' +
        date.getFullYear() +
        ' ' +
        (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) +
        ':' +
        (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) +
        ':' +
        (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds())
      )
    },
    sortArrayByLength(arr, ascYN) {
      arr.sort(function(a, b) {
        // sort array by length of text
        if (ascYN) {
          return a.sensors.length - b.sensors.length // ASC -> a - b
        } else {
          return b.sensors.length - a.sensors.length // DESC -> b - a
        }
      })
    }
  },
  beforeCreate() {
    this.$http
      .get('/api/sensor/allPlaceSensorsInfo')
      .then(response => {
        if (response.data.status === true) {
          var datasensores = response.data.data
          for (var index in datasensores) {
            this.CardsSensors.push({
              id: datasensores[index].id,
              location: datasensores[index].location,
              sensors: []
            })
            for (let i in datasensores[index].values) {
              this.CardsSensors[index].sensors.push({
                idchar: 'id-' + datasensores[index].id + '-' + datasensores[index].values[i].sensortype,
                avg: Math.round(datasensores[index].values[i].avg * 100) / 100,
                avglastupdate: this.dateFormat(datasensores[index].values[i].avgLastUpdate
                ),
                sensortype: datasensores[index].values[i].sensortype,
                threshold: datasensores[index].values[i].threshold
              })
            }
          }
          this.sortArrayByLength(this.CardsSensors, true)
        } else {
          console.log('Receive error', response.data)
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
