<template>
  <modal
    name='dialog'
    :classes="['size-100', this.params.class]"
    :transition='transition'
    @before-open='beforeOpened'
    @before-close='beforeClosed'
    @opened="$emit('opened', $event)"
    @closed="$emit('closed', $event)">
    <card-style>
      <div class='icon-big text-center' :class='`icon-${cardStyle.type}`' slot='header'>
        <img src='static/img/vitabox/warning.svg' class='size-img'>
      </div>
      <div class='center font-size-b' slot='content'>
        <b>{{cardStyle.title}}</b>
      </div>
    </card-style>
  </modal>
</template>
<script>
import CardStyle from 'components/UIComponents/Modal/CardStyle.vue'

export default {
  name: 'Dialog',
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
  data () {
    return {
      cardStyle: {
        type: 'warning',
        title: 'Aviso'
      },
      params: {}
    }
  }
}
</script>
<style>
.vue-dialog div {
  box-sizing: border-box;
}

.vue-dialog .dialog-flex {
  width: 100%;
  height: 100%;
}

.vue-dialog .dialog-content {
  flex: 1 0 auto;
  width: 100%;
  padding: 15px;
  font-size: 14px;
}

.vue-dialog .dialog-c-title {
  font-weight: 600;
  padding-bottom: 15px;
}

.vue-dialog .dialog-c-text {
}

.vue-dialog-font {
  padding-left: 3%;
}

.vue-dialog-margin {
  margin: 5px 0 0 0;
}

.vue-dialog-text {
  color: black;
  text-align: center;
  font-size: 16px;
}

.center {
  text-align: center;
  min-height: 150px;
  line-height: 150px;
}

/* If the text has multiple lines, add the following: */
.center b {
  line-height: 1.5;
  display: inline-block;
  vertical-align: middle;
  color: red;
  font-size: 45px;
}

.background-opacity {
  background-color: rgba(255, 255, 255, 0.5) !important;
  height: 100%;
}

.size-100 {
  width: 100%;
  height: 100%;
}

.size-img {
  width: 40%;
  height: 50%;
}

.font-size-b b {
  font-size: 70px !important;
}
</style>
