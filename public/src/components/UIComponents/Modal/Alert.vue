<template>
  <modal
    name='alert'
    :classes="['size-100', this.params.class]"
    :transition='transition'
    @before-open='beforeOpened'
    @before-close='beforeClosed'
    @opened="$emit('opened', $event)"
    @closed="$emit('closed', $event)">
    <card-style>
      <div class='icon-big vue-alert-img' :class='`icon-${cardStyle.type}`' slot='header'>
        <img src='static/img/vitabox/warning.svg' class='size-img'>
      </div>
      <div class='center font-size-a' slot='content01'>
      </div>
      <div class='center font-size-b' slot='content02'>
        <b>{{cardStyle.title}}</b>
      </div>
    </card-style>
  </modal>
</template>
<script>
import CardStyle from 'components/UIComponents/Modal/CardStyle.vue'

export default {
  name: 'Alert',
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
        type: 'warning',
        title: 'Aviso'
      },
      params: {}
    }
  }
}
</script>
<style>
.vue-alert div {
  box-sizing: border-box;
}

.vue-alert .alert-flex {
  width: 100%;
  height: 100%;
}

.vue-alert .alert-content {
  flex: 1 0 auto;
  width: 100%;
  padding: 15px;
  font-size: 14px;
}

.vue-alert .alert-c-title {
  font-weight: 600;
  padding-bottom: 15px;
}

.vue-alert .alert-c-text {
}

.vue-alert-font {
  padding-left: 3%;
}

.vue-alert-margin {
  margin: 5px 0 0 0;
}

.vue-alert-img {
  text-align: right;
  margin-right: 2%;
}

.center {
  text-align: right;
  min-height: 150px;
  line-height: 150px;
}

/* If the text has multiple lines, add the following: */
.center b {
  line-height: 1.5;
  display: inline-block;
  vertical-align: middle;
  margin-right: 10%;
  color: red;
  font-size: 45px;
}

.background-opacity {
  background-color: rgba(255, 255, 255, 0.3) !important;
  height: 100%;
}

.size-100 {
  width: 100%;
  height: 100%;
}

.size-img {
  width: 30%;
}

.font-size-b b {
  font-size: 70px !important;
}
.font-size-a b {
  font-size: 30px !important;
}
</style>
