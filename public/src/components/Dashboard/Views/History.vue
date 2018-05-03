<template>
  <div>

    <!--Stats cards-->
    <div class="row">
      <div class="col-lg-3 col-sm-6" v-for="stats in statsCards" :key='stats.id'>
        <user-info :data="stats" ><user-info>
      </div>
    </div>

    <!--Charts-->
    <div class="row">

      <div class="col-xs-12" v-if="loaded">
        <chart-card :chart-data="usersChart.data" :chart-options="usersChart.options">
          <h4 class="title" slot="title">Users behavior</h4>
          <span slot="subTitle"> 24 Hours performance</span>
          <span slot="footer">
            <i class="ti-reload"></i> Updated 3 minutes ago</span>
          <div slot="legend">
            <i class="fa fa-circle text-info"></i> Open
            <i class="fa fa-circle text-danger"></i> Click
            <i class="fa fa-circle text-warning"></i> Click Second Time
          </div>
        </chart-card>
      </div>

    </div>

  </div>
</template>
<script>
import UserInfo from "components/UIComponents/Cards/UserInfo.vue";
import ChartCard from "components/UIComponents/Cards/ChartCard.vue";
export default {
  components: {
    UserInfo,
    ChartCard
  },
  data() {
    return {
      statsCards: [],
      usersChart: {
        data: {
          labels: [],
          series: []
        },
        options: {
          low: 0,
          high: 100,
          showArea: true,
          height: "245px",
          axisX: {
            showGrid: false
          },
          lineSmooth: this.$Chartist.Interpolation.simple({
            divisor: 3
          }),
          showLine: true,
          showPoint: false
        }
      },
      loaded: false
    };
  },
  methods: {
    dateFormat2(data) {
      let date = new Date(data);
      return (
        (date.getHours() < 10 ? "0" + date.getHours() : date.getHours()) +
        ":" +
        (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()) +
        ":" +
        (date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds())
      );
    },
    dateFormat(data) {
      let date = new Date(data);
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
      );
    },
    getAge(dateString) {
      var today = new Date();
      var birthDate = new Date(dateString);
      var age = today.getFullYear() - birthDate.getFullYear();
      var m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      return age;
    }
  },
  beforeCreate() {
    var self = this;
    this.$http
      .get("/api/getPatientsData")
      .then(response => {
        let data = response.body.data;
        for (var index in data) {
          this.statsCards.push({
            type: "warning",
            icon: "ti-server",
            name: data[index].name,
            gender: data[index].gender,
            birthdate: this.dateFormat(data[index].birthdate),
            age: this.getAge(data[index].birthdate),
            footerIcon: "ti-reload"
          });
        }
        console.log(response);
      })
      .catch(error => {
        console.log(error);
      });

    this.$http
      .get("/api/getSensorData")
      .then(response => {
        console.log(response);
        this.usersChart.data.series = [];
        this.usersChart.data.labels = [];
        response.body.data.forEach((element, index) => {
          let value = [];
          let time = [];
          element.value.forEach((values, i) => {
            value.push(values);
            time.push(this.dateFormat2(values.time));
            if (i === element.value.length - 1) {
              this.usersChart.data.series.push(value);
              this.usersChart.data.labels.push(time);
            }
          });
          if (index === response.body.data.length - 1) {
            this.loaded = true;
            console.log(this.usersChart.data);
          }
        });
      })
      .catch(error => {
        console.log(error);
      });
  }
};
</script>
<style>

</style>
