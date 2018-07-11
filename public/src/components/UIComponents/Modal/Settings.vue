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
      <div class="dialog-c-title" v-html="'Settings'"></div>
    </div>
    <div class="padding" v-for="(item, i) in items" v-bind:key='item.key'>
      <span>{{items[i].title}}</span>
      <toggle-button 
      @change="updateItem($event.value, items[i], i)"
      :key="i"
      :sync="true"
      :value="items[i].default"
      :labels="items[i].labels"
      :color="items[i].color"
      :width="80"/>
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
      items: [
        {
          title: 'Modo',
          type: 'mode',
          default: true,
          labels: {checked: 'Avançado', unchecked: 'Básico'},
          color: {checked: '#7DCE94', unchecked: '#82C7EB'},
          values: ['advanced', 'basic']
        },
        {
          title: 'Som',
          type: 'sound',
          default: true,
          labels: {checked: 'Ligado', unchecked: 'Desligado'},
          color: {checked: '#7DCE94', unchecked: '#82C7EB'},
          values: ['on', 'off']
        },
        {
          title: 'linguagem',
          type: 'language',
          default: true,
          labels: {checked: 'pt', unchecked: 'en'},
          color: {checked: '#7DCE94', unchecked: '#82C7EB'},
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
  mounted () {
    var i = 0
    /* setInterval(() => {
      this.updateItem(!this.items[i].default, this.items[i], i)
    }, 10000) */
  },
  methods: {
    updateItem(toggle, type, i) {
      switch (type.type) {
        case 'mode':
          EventBus.$emit('mode')
          this.items[i].default = toggle
          console.log(this.items[i])
          break
        case 'sound':
          EventBus.removeAudio(toggle ? type.values[0] : type.values[1])
          break
        case 'language':
          this.$store.dispatch('setLangNew', toggle ? type.values[0] : type.values[1])
          break
        default:
          break
      }
    },
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
  flex: 1 0 auto;
  width: 100%;
  padding: 15px;
  font-size: 14px;
}

.background-opacity {
  background-color: rgba(255, 255, 255, 0.6) !important;
  height: 100%;
}
</style>
