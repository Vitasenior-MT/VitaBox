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
            <button class="btn" type="button" v-on:click="postSensorData">Send Sensor Data</button>
          </div>
          <div class="col-md-4 row">
            <button class="btn" type="button" v-on:click="getBoards">Get Boards</button>
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
      data: {
        debug: true
      }
    };
  },
  sockets: {
    responceToken(result) {
      this.data = result;
    }
  },
  methods: {
    postSensorData(){
      this.$socket.emit('post_sensor_data', null);
    },
    getToken() {
      this.$socket.emit('request_token', null);
    },
    getBoards() {
      this.$socket.emit('get_boards', null);
    }
  },
  beforeCreate() {}
};
</script>
<style>

</style>
