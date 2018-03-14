<template>
  <div class="row">
    <div class="col-md-12">
      <div class="card col-md-12">
        <div class="header">
          <h4 class="title">Teste consulta de valores</h4>
        </div>
        <div class="content col-md-12">
          <div class="col-md-4 row">
            <button class="btn" type="button" v-on:click="getToken">Request Token</button>
          </div>
          <div class="col-md-4 row">
            <button class="btn" type="button" v-on:click="getTokenDB">Get Token from DB</button>
          </div>
          <div class="col-md-4 row">
            <button class="btn" type="button" v-on:click="postSettings">Send Vitabox Settings</button>
          </div>
          <div class="col-md-4 row">
            <button class="btn" type="button" v-on:click="postSensorData">Send Sensor Data</button>
          </div>
          <div class="col-md-4 row">
            <button class="btn" type="button" v-on:click="postSensorDataError">Send Sensor Data With Error</button>
          </div>
          <div class="col-md-4 row">
            <button class="btn" type="button" v-on:click="getBoards">Get Boards</button>
          </div>
          <div class="col-md-4 row">
            <button class="btn" type="button" v-on:click="getPatients">Get Patients</button>
          </div>
          <div class="col-md-4 row">
            <button class="btn" type="button" v-on:click="getSettings">Get Settings</button>
          </div>
          <div class="row">
            <div class="col-sm-12">
              <pre>{{ data | json }}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      token: null,
      data: {
        debug: true
      }
    }
  },
  methods: {
    postSettings() {
      this.$http
        .get('/api/getsettingsData')
        .then(response => {
          this.$http
            .put(
              'http://192.168.161.117:8080/settings/vitabox',
            {
              settings: response.body.data
            },
            {
              headers: {
                'Accept-Version': '1.0.0',
                'Content-Type': 'application/json',
                Authorization: this.token
              }
            }
            )
            .then(result => {
              this.data = result
            })
            .catch(error => {
              this.data = error
              console.log(error)
            })
        })
        .catch(error => {
          console.log('----> ', error)
          this.data = error
        })
    },
    postSensorData() {
      this.$http
        .get('/api/getSensorData')
        .then(response => {
          let records = response.body.data
          console.log(response.body)
          console.log(response.body.data)
          console.log(records)
          for (var index in records) {
            records[index].board_id = '68112b4b-3227-46da-9612-a2f1bc4664ba'
            if (records[index].sensor_id === 'temp') {
              records[index].sensor_id = 'f7f661cf-5e51-4d09-a22d-60941a9c011b'
            } else {
              records[index].sensor_id = 'b8ca04f6-c644-4b05-9dbb-b05f99397679'
            }
          }
          this.$http
            .post(
              'http://192.168.161.117:8080/record',
              { records: records },
            {
              headers: {
                'Accept-Version': '1.0.0',
                'Content-Type': 'application/json',
                Authorization: this.token
              }
            }
            )
            .then(response => {
              this.data = response
            })
            .catch(error => {
              this.data = error
              console.log(error)
            })
          this.data = records
          console.log(records)
        })
        .catch(error => {
          this.data = error
          console.log(error)
        })
    },
    postSensorDataError() {
      this.$http
        .get('/api/getSensorData')
        .then(response => {
          let records = response.body.data
          console.log(response.body)
          console.log(response.body.data)
          console.log(records)
          for (var index in records) {
            records[index].board_id = '68112b4b-3227-46da-9612-a2f1bc4664ba'
            if (records[index].sensor_id === 'temp') {
              records[index].sensor_id = 'f7f661cf-5e51-4d09-a22d-60941a9c011b'
            } else {
              records[index].sensor_id = ''
            }
          }
          this.$http
            .post(
              'http://192.168.161.117:8080/record',
              { records: records },
            {
              headers: {
                'Accept-Version': '1.0.0',
                'Content-Type': 'application/json',
                Authorization: this.token
              }
            }
            )
            .then(response => {
              this.data = response
            })
            .catch(error => {
              this.data = error
              console.log(error)
            })
          this.data = records
          console.log(records)
        })
        .catch(error => {
          this.data = error
          console.log(error)
        })
    },
    getTokenDB() {
      this.$http
        .get('/api/token')
        .then(response => {
          this.data = response
          this.token = response.body.data[0].token
        })
        .catch(error => {
          this.data = error
          console.log(error)
        })
    },
    getToken() {
      this.$http
        .post(
          'http://192.168.161.117:8080/vitabox/9b1bdd00-0d07-4a70-b5b2-dbd5c7ace394/connect',
          { password: 'passvita' },
        {
          headers: {
            'Accept-Version': '1.0.0',
            'Content-Type': 'application/json'
          }
        }
        )
        .then(response => {
          this.data = response
          this.$http
            .post('/api/token', { token: response.body.token })
            .then(response => {
              this.data = response
            })
            .catch(error => {
              this.data = error
              console.log(error)
            })
          this.token = response.body.token
        })
        .catch(error => {
          this.data = error
          console.log(error)
        })
    },
    getBoards() {
      console.log(this.token)
      this.$http
        .get(
          'http://192.168.161.117:8080/vitabox/9b1bdd00-0d07-4a70-b5b2-dbd5c7ace394/board',
        {
          headers: {
            'Accept-Version': '1.0.0',
            'Content-Type': 'application/json',
            Authorization: this.token
          }
        }
        )
        .then(response => {
          console.log(response)
          this.$http
            .post('/api/board', { data: response.body.boards })
            .then(result => {
              this.data = response
              console.log(response)
            })
            .catch(error => {
              this.data = error
              console.log(error)
            })
          this.data = response
        })
        .catch(error => {
          this.data = error
          console.log(error)
        })
    },
    getPatients() {
      this.$http
        .get(
          'http://192.168.161.117:8080/vitabox/9b1bdd00-0d07-4a70-b5b2-dbd5c7ace394/patient',
        {
          headers: {
            'Accept-Version': '1.0.0',
            'Content-Type': 'application/json',
            Authorization: this.token
          }
        }
        )
        .then(response => {
          this.data = response
        })
        .catch(error => {
          this.data = error
          console.log(error)
        })
    },
    getSettings() {
      this.$http
        .get('http://192.168.161.151:8080/settings/vitabox', {
          headers: {
            'Accept-Version': '1.0.0',
            'Content-Type': 'application/json',
            Authorization: this.token
          }
        })
        .then(response => {
          this.data = response
        })
        .catch(error => {
          this.data = error
          console.log(error)
        })
    }
  },
  beforeCreate() {}
}
</script>
<style>
</style>
