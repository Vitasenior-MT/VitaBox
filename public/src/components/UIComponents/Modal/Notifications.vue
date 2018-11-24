<template>
  <modal
    name="notifications"
    :classes="['v--modal', 'vue-dialog', this.params.class]"
    :width="width"
    :height="width"
    :pivot-y="0.3"
    :adaptive="true"
    :clickToClose="clickToClose"
    :transition="transition"
    @before-open="beforeOpened"
    @before-close="beforeClosed"
    @opened="$emit('opened', $event)"
    @closed="$emit('closed', $event)">
    <div class="background-opacity">
      <div class="row vue-welcome">
        <div class="col-md-12 vue-height-out">
          <div class="dialog-content">
            <h2 class="dialog-c-title"><i class="fas fa-tasks"></i>{{ $t('modal.notifications.title') }}</h2>
          </div>
          <div class="col-md-12 card-layout-out">
            <div v-for="(item, i) in items" v-bind:key='item.key'>
              <div class="col-md-8 card-layout-in">
                <notification-card>
                  <div class="icon-big text-center" slot="header">
                    <i class="fas fa-tachometer-alt"></i>
                    <!-- <hr> -->
                  </div>
                  <div class="numbers" slot="content">
                  <p>info {{ i }}</p>
                  </div>
                </notification-card>
              </div>
            </div>
          </div>
          <div>
            <h4>Pressione [OK] para alterar o estado. <br> Pressione [EXIT] para sair.</h4>
          </div>
        </div>
      </div>
    </div>
  </modal>
</template>
<script>
import { EventBus } from '../../../event-bus.js'
export default {
  name: 'VueJsDialog',
  props: {
    width: {
      type: [Number, String],
      default: 800
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
      items: [
        {
          title: this.$t('modal.settings.mode.title'),
          type: 'mode',
          default: true,
          labels: {checked: this.$t('modal.settings.mode.checked'), unchecked: this.$t('modal.settings.mode.unchecked')},
          color: {checked: '#f7931d', unchecked: '#f05a28'},
          values: ['advanced', 'basic']
        },
        {
          title: this.$t('modal.settings.sound.title'),
          type: 'sound',
          default: true,
          labels: {checked: this.$t('modal.settings.sound.checked'), unchecked: this.$t('modal.settings.sound.unchecked')},
          color: {checked: '#f7931d', unchecked: '#f05a28'},
          values: ['on', 'off']
        },
        {
          title: this.$t('modal.settings.language.title'),
          type: 'language',
          default: true,
          labels: {checked: this.$t('modal.settings.language.checked'), unchecked: this.$t('modal.settings.language.unchecked')},
          color: {checked: '#f7931d', unchecked: '#f05a28'},
          values: ['pt', 'en']
        }
      ],
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
  mounted() {
  },
  methods: {
    beforeOpened(event) {
      EventBus.firstRightEventModal = true
      EventBus.currentActiveRightCompModal = 0
      window.addEventListener('keyup', this.onKeyUp)
      this.params = event.params || {}
      this.$emit('before-opened', event)
    },
    beforeClosed(event) {
      window.removeEventListener('keyup', this.onKeyUp)
      this.params = {}
      this.$emit('before-closed', event)
      EventBus.$off('move-components-modal')
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
        const buttonIndex = this.buttons.length === 1 ? 0 : this.buttons.findIndex(button => button.default)
        if (buttonIndex !== -1) {
          this.click(buttonIndex, event, 'keypress')
        }
      }
    }
  }
}
</script>
<style>
</style>
