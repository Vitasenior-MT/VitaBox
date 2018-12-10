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
      <card-alert :objCard="dataAlert"></card-alert>
      <!-- <div class="content">
        <div class="vue-height-out">
          <div class="row">
            <div class='col-md-12 center2 font-size-b modelProcedureComponent btn btn-round btn-fill'>
              <b>{{ $t('modal.procedure.'+ this.data +'.0') }}</b><br>
              <b>{{ $t('modal.procedure.'+ this.data +'.1') }}</b><br>
              <b>{{ $t('modal.procedure.'+ this.data +'.2') }}</b><br>
            </div>
          </div>
        </div>
      </div> -->
    </div>
  </modal>
</template>
<script>
import CardAlert from 'components/UIComponents/Cards/CardNotifiFarmacy.vue'
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
  components: {
    CardAlert
  },
  data() {
    return {
      params: {},
      data: '',
      verify: [],
      dataAlert: {}
    }
  },
  methods: {
    beforeOpened(event) {
      this.verify[event.params.warning_type] = event.params.warning_type
      if (this.verify[event.params.warning_type] === 'mono') {
        this.data = event.params.warning_type
      } else if (this.verify[event.params.warning_type] === 'diox') {
        this.data = event.params.warning_type
      } else if (this.verify[event.params.warning_type] === 'temp') {
        this.data = event.params.warning_type
      } else if (this.verify[event.params.warning_type] === 'humi') {
        this.data = event.params.warning_type
      }
      this.dataAlert = {
        icon: '<img src="static/img/vitabox/alert3.svg" width="100" height="100">',
        titleCard: '<h2><b>Alerta</b></h2>',
        content: (_ => {
          let txtHtml = "<b class='text-b-ajust'>Perigo na divisão " + event.params.location + ".</b><br>"
          txtHtml += "<b class='text-b-ajust'>Niveis elevados. <img src='static/img/vitabox/" + this.data + ".svg' width='70' height='70'></b><br>"
          for (let i = 1; i < 3; i++) {
            txtHtml += "<b class='text-b-ajust'>" + this.$t('modal.procedure.' + this.data + '.' + i) + "</b><br>"
          }
          return txtHtml
        })()
      }
    }
  }
}
</script>
<style>
.modelProcedure {
  /* background-color: rgba(0,0,0,0.5); */
  width: 100%;
  bottom: 8%;
  position: fixed;
  left: 0;
}
.modelProcedureComponent {
  background-color: white !important;
  margin-top: 5%;
}
.center2 b {
  line-height: 1.5;
  display: inline-block;
  vertical-align: middle;
  color: black;
  font-size: 40px;
}
.text-b-ajust {
  line-height: 0.8;
  display: inline-block;
  color: black;
  font-size: 4vw;
}
</style>
