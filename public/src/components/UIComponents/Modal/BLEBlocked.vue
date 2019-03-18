<template>
  <modal
    name='bleblocked'
    :classes="['size-100', this.params.class]"
    :transition='transition'
    @before-open='beforeOpened'
    @before-close='beforeClosed'
    @opened="$emit('opened', $event)"
    @closed="$emit('closed', $event)">
    <div class="background-opacity modelBLE">
      <div class="content">
        <div class="row font-setting">
          <div class="col-xs-12 font-positioning"><h4>{{cardStyle.type}}</h4></div>
        </div>
      </div>
    </div>
  </modal>
</template>
<script>
import CardStyle from 'components/UIComponents/Modal/CardStyle.vue'

export default {
  name: 'BLEBlocked',
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
    CardStyle
  },
  data() {
    return {
      cardStyle: {
        type: this.$t('modal.bleblocked.message'),
        title: 'Aviso'
      },
      params: {}
    }
  },
  methods: {
  }
}
</script>
<style>
.modelBLE {
  height: 100% !important;
}

.font-positioning {
  font-size: 40px !important;
  padding-left: 30% !important;
  background: rgba(255, 255, 255, 0.466);
}
.font-setting {
    padding-top: 25%;
    padding-left: 25%;
    padding-right: 25%;
    color: black;

}
</style>
