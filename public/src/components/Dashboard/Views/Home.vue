<template>
  <div class="row">
    <div class="col-md-12">
      <div class="card">
        <div class="header">
          <h4 class="title">Teste consulta de valores</h4>
        </div>
        <div class="content">
          <div class="row">
            <div class="col-md-3">
              <div class="form-group">
                <label for="selectOpt" class="col-3 col-form-label">Localização</label>
                  <select v-model="selected" @change="getSensorFromPlace()" class="custom-select form-control" id="selectOpt">
                    <option v-for="place in places" v-bind:value="place.value">
                      {{ place.local }}
                    </option>
                  </select>
                </div>
              </div>
              <div class="col-md-3">
                <div class="form-group">
                  <label for="selectOpt2" class="col-3 col-form-label">Sensor</label>
                    <select v-model="selectedSensor" @change="getSensorValues()" class="custom-select form-control" id="selectOpt2">
                      <option v-for="sensor in sensors" v-bind:value="sensor">
                        {{ sensor }}
                      </option>
                    </select>
                  </div>
                </div>
                <div class="col-md-12">
                  <hr>
                  <p>Data Time {{ datatime }}</p>
                  <hr>
                  <p>Data Values {{ datavalues }}</p>
                  <hr>
                </div>
            </div>
          </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    components: {},
    selected: {},
    selectedSensor: {},
    data () {
      return {
        places: [],
        sensors: [],
        datatime: [],
        datavalues: []
      }
    },
    computed: {},
    beforeCreate () {
      this.$http.get('/api/places/all')
      .then((response) => {
        if (response.data.status === true) {
          for (var i in response.data.data) {
            this.places.push({
              local: response.data.data[i].name,
              value: response.data.data[i]._id
            })
          }
        } else {
          console.log('Receive error')
        }
      })
      .catch((error) => {
        console.log(error)
      })
    },
    created () {},
    methods: {
      getSensorFromPlace () {
        this.selectedSensor = null
        this.datatime = []
        this.datavalues = []
        this.$http.get('/api/sensor/' + this.selected)
        .then((response) => {
          if (response.data.status === true) {
            this.sensors = response.data.data
          } else {
            console.log('Receive error')
          }
        })
        .catch((error) => {
          console.log(error)
        })
      },
      getSensorValues () {
        this.$http.get('/api/sensor/' + this.selected + '/' + this.selectedSensor)
        .then((response) => {
          if (response.data.status === true) {
            if (response.data.data) {
              this.datatime = response.data.data.time
              this.datavalues = response.data.data.value
            }
          } else {
            console.log('Receive error')
          }
        })
        .catch((error) => {
          console.log(error)
        })
      }
    }
  }
</script>
<style>

</style>
