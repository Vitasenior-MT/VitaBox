<template>
  <form-wizard @on-complete="onComplete">
     <tab-content title="Personal details"
                  icon="ti-user">
       My first tab content
     </tab-content>
     <tab-content title="Additional Info"
                  icon="ti-settings">
       My second tab content
     </tab-content>
     <tab-content title="Last step"
                  icon="ti-check">
       Yuhuuu! This seems pretty damn simple
     </tab-content>

    <template slot="footer" slot-scope="props">
      <wizard-remote :data="props"></wizard-remote>
    </template>
 </form-wizard>
</template>
<script>
import { FormWizard, TabContent } from "vue-form-wizard";
import "vue-form-wizard/dist/vue-form-wizard.min.css";
import WizardRemote from "components/UIComponents/WizardRemote.vue";
export default {
  components: {
    WizardRemote
  }
};
</script>
<style>

</style>
