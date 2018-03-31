<template>
  <form-wizard @on-complete="onComplete">
     <tab-content title="Personal details" icon="ti-user">
       My first tab content
     </tab-content>
     <tab-content title="Additional Info" icon="ti-settings">
       My second tab content
     </tab-content>
     <tab-content title="Last step" icon="ti-check">
        <div class="row">
          <div class="col-lg-3 col-sm-6" v-for="stats in statsCards" :key='stats.id'>
            <user-info :data="stats" ><user-info>
          </div>
        </div>
     </tab-content>

    <template slot="footer" slot-scope="props">
      <wizard-remote :data="props"></wizard-remote>
    </template>
 </form-wizard>
</template>
<script>
import UserInfo from "components/UIComponents/Cards/UserInfo.vue";
import ChartCard from "components/UIComponents/Cards/ChartCard.vue";
// import { FormWizard, TabContent } from "vue-form-wizard";
import "vue-form-wizard/dist/vue-form-wizard.min.css";
import WizardRemote from "components/UIComponents/WizardRemote.vue";
export default {
  components: {
    UserInfo,
    ChartCard,
    WizardRemote
  },
  data() {
    return {
      statsCards: [],
      usersChart: {
        data: {
          labels: [
            "9:00AM",
            "12:00AM",
            "3:00PM",
            "6:00PM",
            "9:00PM",
            "12:00PM",
            "3:00AM",
            "6:00AM"
          ],
          series: [
            [287, 385, 490, 562, 594, 626, 698, 895, 952],
            [67, 152, 193, 240, 387, 435, 535, 642, 744],
            [23, 113, 67, 108, 190, 239, 307, 410, 410]
          ]
        },
        options: {
          low: 0,
          high: 1000,
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
      }
    };
  },
  methods: {
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
  }
};
</script>
<style>

</style>
