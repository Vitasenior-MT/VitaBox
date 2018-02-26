<template>
  <div>
    <div class="row">
      <div class="col-lg-4 col-sm-6" v-for="warningCard in warningCards" :key="warningCard.id">
        <CardWarning :key="warningCard.id" :warningCard="warningCard">
        </CardWarning>
      </div>
    </div>
  </div>
</template>
<script>
import CardWarning from 'components/UIComponents/Cards/CardWarning2.vue'
export default {
  components: {
    CardWarning
  },
  sockets: {
    vitaWarning: (data) => {
      console.log('Receive alert on Tab: ', data)
      this.updateSensor(data)
    }
  },
  data () {
    return {
      warningCards: []
    }
  },
  ready: () => {
    window.unload = this.leaving
  },
  methods: {
    dateFormat (data) {
      let date = new Date(data)
      return (
        (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + '/' +
        ((date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)) + '/' +
        date.getFullYear() + ' ' +
        (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':' +
        (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':' +
        (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds())
      )
    }
  },
  beforeCreate () {
    this.$http.get('/api/sensor/allSensorsinfo')
      .then(response => {
        if (response.data.status === true) {
          console.log('Data', response.data.data)
          var datasensores = response.data.data
          for (var index in datasensores) {
            this.warningCards.push({
              idmedia: 'chartmedia-' + index,
              idlimite: 'chartlimite-' + index,
              avg: datasensores[index].avg,
              threshold: datasensores[index].threshold,
              sensor: datasensores[index].sensortype,
              location: datasensores[index].location,
              dateupdate: this.dateFormat(datasensores[index].avgLastUpdate),
              footerIcon: 'ti-reload',
              symbol: ''
            })
            switch (this.warningCards[index].sensor) {
              case 'temp':
                this.warningCards[index].symbol = 'º'
                break
              case 'monoxido':
              case 'co2':
              case 'humi':
                this.warningCards[index].symbol = '%'
                break
              default:
                this.warningCards[index].symbol = ''
            }
          }
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
