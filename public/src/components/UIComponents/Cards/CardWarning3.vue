<template>
  <div class='card'>
    <div class='content'>
        <div class='row'>
          <div class="col-md-12">
            <div class="card card-plain">
              <paper-table type="hover" :title="warningCard.location" :sub-title="''" :data="warningCard.sensors" :columns="this.columns">
              </paper-table>
            </div>
          </div>
        </div>
      <div class='footer'>
    </div>
      </div>
  </div>
</template>
<script>
import PaperTable from 'components/UIComponents/PaperTable2.vue'
export default {
  components: {
    PaperTable
  },
  name: 'Warning',
  data() {
    return {
      columns: ['SensorType', 'Avg', 'Threshold', 'AvgLastUpdate']
    }
  },
  props: {
    warningCard: {
      type: Object,
      required: true
    }
  },
  mounted() {}
}
</script>
<style>
</style>
