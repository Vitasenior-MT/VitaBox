<template>
  <div class="row clear-margin" v-show="defaultView">
    <div class="col-lg-12 btn btn-round btn-fill">
      <div class="row">
        <div class="col-md-12">
          <h4 class="text-center">
            {{defaultViewDescritivo}}
          </h4>
        </div>
      </div>
      <div class="row">
        <div class="col-md-12">
          <img src='static/img/logo_A.png' alt=''>
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
      this.defaultView = true
    },
    hide() {
      this.defaultView = false
    },
    setMsg(msg) {
      this.defaultViewDescritivo = msg
    }
  }
}
</script>
<style>
.clear-margin {
  margin: 0 !important;
}
</style>
