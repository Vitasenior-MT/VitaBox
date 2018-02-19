<template>
  <modal 
    name="dialog"
    height="auto"
    :classes="['vue-dialog', this.params.class]"
    :width="width"
    :pivot-y="0.3"
    :adaptive="true"
    :clickToClose="clickToClose"
    :transition="transition"
    @before-open="beforeOpened"
    @before-close="beforeClosed"
    @opened="$emit('opened', $event)"
    @closed="$emit('closed', $event)">
    <card-style>
      <div class="icon-big text-center" :class="`icon-${cardStyle.type}`" slot="header">
        <icon name="warning" :scale="20"></icon>
      </div>
      <div class="center" slot="content">
        <p>{{cardStyle.title}}</p>
      </div>
    </card-style>
  </modal>
</template>
<script>
import CardStyle from "components/UIComponents/Modal/CardStyle.vue";
import Dialog from "./index";

export default {
  name: "Dialog",
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
      default: "fade"
    }
  },
  components: {
    CardStyle
  },
  data() {
    return {
      cardStyle: {
        type: "warning",
        icon: "ti-server",
        title: "Warning!!!",
        multiMessage: [],
        messageModel: [],
        headerText: "Updated now",
        headerIcon: "ti-reload",
        footerText: "Updated now",
        footerIcon: "ti-reload"
      },
      params: {}
    };
  },
  beforeMount() {
    Dialog.event.$on("sendData", data => {
      console.log("inside of the dialog: ---> ", data);
      //this.cardStyle.multiMessage = data.multiMessage;
      //this.cardStyle.messageModel = data.messageModel;
    });
  }
};
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
  min-height: 64px;
  line-height: 64px;
}

/* If the text has multiple lines, add the following: */
.center p {
  line-height: 1.5;
  display: inline-block;
  vertical-align: middle;
}
</style>
