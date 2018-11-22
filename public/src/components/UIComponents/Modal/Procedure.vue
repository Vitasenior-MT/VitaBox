<template>
  <modal
    name='procedure'
    :classes="['size-100', this.params.class]"
    :transition='transition'
    @before-open='beforeOpened'
    @before-close='beforeClosed'
    @opened="$emit('opened', $event)"
    @closed="$emit('closed', $event)">
    <div class="modelProcedure v--modal vue-dialog">
      <div class="content">
        <div class="row">
          <div class="col-md-12 vue-height-out">
            <div class='col-md-2'>
            </div>
            <div class='col-md-10 center2 font-size-b modelProcedureComponent'>
              <b>{{ $t('modal.procedure.'+ this.data +'.0') }}</b>
              <b>{{ $t('modal.procedure.'+ this.data +'.1') }}</b>
              <b>{{ $t('modal.procedure.'+ this.data +'.2') }}</b>
            </div>
          </div>
        </div>
      </div>
    </div>
  </modal>
</template>
<script>

export default {
  name: 'Procedure',
  props: {
    width: {
      type: [Number, String],
      default: 400
    },
    clickToClose: {
      type: Boolean,
      default: true
    },
    transition: {
      type: String,
      default: 'fade'
    }
  },
  components: {},
  data() {
    return {
      params: {},
      data: {},
      verify: []
    }
  },
  methods: {
    beforeOpened(event) {
      this.verify[event.params.warning_type] = event.params.warning_type
      if (this.verify[event.params.warning_type] === 'co') {
        this.data = event.params.warning_type
      } else if (this.verify[event.params.warning_type] === 'co2') {
        this.data = event.params.warning_type
      } else if (this.verify[event.params.warning_type] === 'temp') {
        this.data = event.params.warning_type
      } else if (this.verify[event.params.warning_type] === 'humi') {
        this.data = event.params.warning_type
      }
    }
  }
}
</script>
<style>
.modelProcedure {
  background-color: rgba(0,0,0,0.5);
  width: 100%;
  height: 50%;
  bottom: 0;
  position: fixed;
  left: 0;
}
.modelProcedureComponent {
  background-color: darkgray;
  margin-top: 5%;
}
.center2 b {
  line-height: 1.5;
  display: inline-block;
  vertical-align: middle;
  color: black;
  font-size: 45px;
}
</style>
