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
              <span>
                <img :src="'static/img/vitabox/'+item.sensor+'.svg'" width='40' height='40'>
              </span>
            </td>
            <td class="text-center">
              <ChartGauge :id="item.idchar + '-val-' + item.id"
                :chartid="item.idchar + '-val-' + item.id"
                  :typechartdonut="false"
                  :valueChart="item.avg"
                  :labelChart="''"
                  :chartmax="item.threshold_max_possible"
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
