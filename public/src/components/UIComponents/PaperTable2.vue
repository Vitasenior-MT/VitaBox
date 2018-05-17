<template>
  <div>
    <div class="header">
      <slot name="header">
        <h4 class="title">{{title}}</h4>
        <p class="category">{{subTitle}}</p>
      </slot>
    </div>
    <div class="content table-responsive table-full-width">
      <table class="table" :class="tableClass">
        <thead>
          <th class="text-center" v-for="column in columns" :key="column.id">
            {{column}}
          </th>
        </thead>
        <tbody>
          <tr v-for="item in data" :key="item.id">
            <td class="text-center">
              <span v-if="item.sensor == 'temp'">
                <img src='static/img/vitabox/temp.svg' width='40' height='40'>
              </span>
              <span v-else>
                <h5>{{item.measure}}</h5>
              </span>
            </td>
            <td class="text-center">
              <ChartGauge :id="item.idchar + '-val-' + item.id"
                :chartid="item.idchar + '-val-' + item.id"
                  :typechartdonut="false"
                  :valueChart="item.avg"
                  :labelChart="''"
                  :chartmax="item.threshold"
                  :symbol="''">
                </ChartGauge>
            </td>
            <td class="text-center">
              <ChartGauge :id="item.idchar + '-max-' + item.id"
                :chartid="item.idchar + '-max-' + item.id"
                  :typechartdonut="false"
                  :valueChart="item.avg"
                  :labelChart="''"
                  :chartmax="item.threshold"
                  :symbol="''">
                </ChartGauge>
            </td>
            <td class="text-center">
              <h5>{{item.avgLastUpdate}}</h5>
            </td>

            <!--
            <td class="text-center" v-for="column in columns" v-if="hasValue(item, column)"  :key="column.id">
              Item - {{item}} <br> Column - {{column}}
              <span v-if="itemValue(item, 'Sensor') == 'temp'">
                <img src='static/img/vitabox/temp.svg' width='40' height='40'>
              </span>
              <span v-else-if="isNaN(itemValue(item, column) * 1)">
                <h5>{{itemValue(item, column)}}</h5>
              </span>
              <span v-else>
                <ChartGauge :id="itemValue(item, 'idchar') + '-' + column"
                  :chartid="itemValue(item, 'idchar') + '-' + column"
                    :typechartdonut="false"
                    :valueChart="itemValue(item, column)"
                    :labelChart="''"
                    :chartmax="itemValue(item, column)"
                    :symbol="''">
                    </ChartGauge>
              </span>
            </td> -->
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script>
  import ChartGauge from 'components/UIComponents/Charts/chartGaugeItem1.vue'
  export default {
    components: {
      ChartGauge
    },
    data() {
      return {
        charid: ''
      }
    },
    props: {
      columns: Array,
      data: Array,
      type: {
        type: String, // striped | hover
        default: 'striped'
      },
      title: {
        type: String,
        default: ''
      },
      subTitle: {
        type: String,
        default: ''

      }
    },
    computed: {
      tableClass() {
        return `table-${this.type}`
      }
    },
    methods: {
      hasValue(item, column) {
        return item[column.toLowerCase()] !== 'undefined'
      },
      itemValue(item, column) {
        return item[column.toLowerCase()]
      }
    }
  }

</script>
<style>
</style>
