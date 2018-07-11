<template>
  <modal
    name="settings"
    height="auto"
    :classes="['v--modal', 'vue-dialog', 'vue-settings', this.params.class]"
    :width="width"
    :pivot-y="0.3"
    :adaptive="true"
    :clickToClose="clickToClose"
    :transition="transition"
    @before-open="beforeOpened"
    @before-close="beforeClosed"
    @opened="$emit('opened', $event)"
    @closed="$emit('closed', $event)">
    <div class="dialog-content">
      <div
        class="dialog-c-title"
        v-if="params.title"
        v-html="params.title || ''"></div>
      <div
        class="dialog-c-text"
        v-html="params.text || ''"></div>
    </div>
    <div class="padding">
      <span>Som</span>
      <toggle-button :value="true"
      :labels="{checked: 'ON', unchecked: 'OFF'}"
      :color="{checked: '#7DCE94', unchecked: '#82C7EB'}"
      :width="80"/>
    </div>
    <div class="padding">
      <span>Mode</span>
      <toggle-button :value="true"
      :labels="{checked: 'Advanced', unchecked: 'Basic'}"
      :color="{checked: '#7DCE94', unchecked: '#82C7EB'}"
      :width="80"/>
    </div>
  </modal>
</template>
<script>
export default {
  name: 'VueJsDialog',
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
  data() {
    return {
      params: {},
      defaultButtons: [{ title: 'CLOSE' }]
    }
  },
  computed: {
    buttons() {
      return this.params.buttons || this.defaultButtons
    },
    /**
      * Returns FLEX style with correct width for arbitrary number of
      * buttons.
      */
    buttonStyle() {
      return {
        flex: `1 1 ${100 / this.buttons.length}%`
      }
    }
  },
  methods: {
    beforeOpened(event) {
      window.addEventListener('keyup', this.onKeyUp)
      this.params = event.params || {}
      this.$emit('before-opened', event)
    },
    beforeClosed(event) {
      window.removeEventListener('keyup', this.onKeyUp)
      this.params = {}
      this.$emit('before-closed', event)
    },
    click(i, event, source = 'click') {
      const button = this.buttons[i]
      if (button && typeof button.handler === 'function') {
        button.handler(i, event, { source })
      } else {
        this.$modal.hide('dialog')
      }
    },
    onKeyUp(event) {
      if (event.which === 13 && this.buttons.length > 0) {
        const buttonIndex =
          this.buttons.length === 1
            ? 0
            : this.buttons.findIndex(button => button.default)
        if (buttonIndex !== -1) {
          this.click(buttonIndex, event, 'keypress')
        }
      }
    }
  }
}
</script>
<style>
.vue-settings {
  max-width: 40%;
  margin-left: 40%;
  margin-top: 20%;
}
</style>
