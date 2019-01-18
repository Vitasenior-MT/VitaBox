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
    rotationEventsBus() {
      EventBus.$on('rotation', function(data) {
        console.log(data)
        this.dataAlert = {
          icon: '<img src="static/img/vitabox/alert3.svg" width="100" height="100">',
          titleCard: '<h2><b>Alerta</b></h2>',
          content: (_ => {
            let txtHtml = "<b class='text-b-ajust'>Perigo na divisão " + data.location + ".</b><br>"
            txtHtml += "<b class='text-b-ajust'>Niveis elevados. <img src='static/img/vitabox/" + data.warning_type + ".svg' width='70' height='70'></b><br>"
            for (let i = 1; i < 3; i++) {
              txtHtml += "<b class='text-b-ajust'>" + this.$t('modal.procedure.' + data.warning_type + '.' + i) + "</b><br>"
            }
            return txtHtml
          })()
        }
      })
    },
    beforeOpened(event) {
      this.rotationEventsBus()
      console.log(event)
      this.dataAlert = {
        icon: '<img src="static/img/vitabox/alert3.svg" width="100" height="100">',
        titleCard: '<h2><b>Alerta</b></h2>',
        content: (_ => {
          let txtHtml = "<b class='text-b-ajust'>Perigo na divisão " + event.params.location + ".</b><br>"
          txtHtml += "<b class='text-b-ajust'>Niveis elevados. <img src='static/img/vitabox/" + event.params.warning_type + ".svg' width='70' height='70'></b><br>"
          for (let i = 1; i < 3; i++) {
            txtHtml += "<b class='text-b-ajust'>" + this.$t('modal.procedure.' + event.params.warning_type + '.' + i) + "</b><br>"
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
