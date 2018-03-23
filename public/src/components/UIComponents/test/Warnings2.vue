<template>
  <div class="card">
    <div class="content">
      <div class="text-center positioning">
        <b class="font-size-27">{{data.name}}</b>
      </div>
      <div class="row">
        <div class="col-sm-12">
          <p>Gender: {{data.gender}}</p>
          <p>Age: {{data.age}}</p>
        </div>
      </div>
      <div class="footer row">
        <hr/>
        <div class="col-sm-12">
          <i :class="data.footerIcon"></i> {{data.birthdate}}
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: ["data"],
  name: "user-info"
};
</script>
<style>

</style>
