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
            <button class="btn" type="button" v-on:click="postSettings">Send Vitabox Settings</button>
          </div>
          <div class="col-md-4 row">
            <button class="btn" type="button" v-on:click="postSensorData">Send Sensor Data</button>
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
    };
  },
  methods: {
    postSettings() {
      this.$http
        .post("/api/postSettings")
        .then(response => {
          console.log(response);
          this.data = response;
        })
        .catch(error => {
          console.log("----> ", error);
          this.data = error;
        });
    },
    postSensorData() {
      this.$http
        .post("/api/postSensorData")
        .then(response => {
          this.data = response;
          console.log(response);
        })
        .catch(error => {
          this.data = error;
          console.log(error);
        });
    },
    getToken() {
      this.$http
        .post("/api/requestToken")
        .then(response => {
          console.log(response);
          this.data = response;
        })
        .catch(error => {
          this.data = error;
          console.log(error);
        });
    },
    getBoards() {
      console.log(this.token);
      this.$http
        .get("/api/getBoards")
        .then(response => {
          console.log(response);
          this.data = response;
        })
        .catch(error => {
          this.data = error;
          console.log(error);
        });
    },
    getPatients() {
      this.$http
        .get("/api/getPatients")
        .then(response => {
          console.log(response);
          this.data = response;
        })
        .catch(error => {
          this.data = error;
          console.log(error);
        });
    },
    getSettings() {
      this.$http
        .get("/api/getSettings")
        .then(response => {
          console.log(response);
          this.data = response;
        })
        .catch(error => {
          this.data = error;
          console.log(error);
        });
    }
  },
  beforeCreate() {}
};
</script>
<style>

</style>
