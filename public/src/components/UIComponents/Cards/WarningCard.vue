<template>
  <div class="card">
    <div class="content">
      <div class="header">
        <slot name="header"></slot>
      </div>
      <hr/>
      <div class="row">
        <div>
          <slot name="content"></slot>
        </div>
      </div>
      <div class="footer">
        <hr/>
        <slot name="footer"></slot>
      </div>
    </div>
  
  </div>
</template>
<script>
export default {
  name: "warning-card"
};
</script>
<style>
</style>
