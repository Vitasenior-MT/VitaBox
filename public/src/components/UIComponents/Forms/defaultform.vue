<template>
  <div class="row clear-margin" v-show="defaultView">
    <div class="col-lg-12 btn btn-round btn-fill btn-block default-form">
      <div class="row">
        <div class="col-md-12">
          <h4 class="text-center" v-html="$t(defaultViewDescritivo)">
          </h4>
        </div>
      </div>
      <div class="row">&nbsp;</div>
      <div class="row">&nbsp;</div>
      <div class="row">
        <div class="col-md-12">
          <img src='static/img/logo_B.png' alt=''>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'loading',
  data() {
    return {
      defaultViewDescritivo: '',
      defaultView: false
    }
  },
  methods: {
    show() {
      this.divPosition()
      this.defaultView = true
    },
    hide() {
      this.defaultView = false
    },
    setMsg(msg) {
      this.divPosition()
      this.defaultViewDescritivo = msg
    },
    divPosition() {
      setTimeout(() => {
        var elemS = document.getElementsByClassName('sidebar')[0]
        let elemPosS = elemS.getBoundingClientRect()
        var elem = document.getElementsByClassName('default-form')[0]
        let elemPos = elem.getBoundingClientRect()
        elem.style.height = ((elemPosS.height - elemPos.top) * 0.97) + 'px'
      }, 100);
    }
  }
}
</script>
<style>
.clear-margin {
  margin: 0 !important;
}
</style>
