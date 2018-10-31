<template>
  <modal
    name="welcome"
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
      <div class="row vue-welcome control-modal">
        <div class="col-md-12 vue-height-out">
          <div class="col-md-12 dialog-content">
            <h2 class="dialog-c-title"><i class="fas fa-tasks"></i> {{ $t('modal.welcome.title') }}</h2>
          </div>
          <div class="col-md-12 card-layout-out vue-height-in">
            <div class="row size-100">
              <div class="col-md-6 size-100">
                <iframe class="iframe-size" v-show="districtToGet!=null && localityToGet!=null" scrolling="no"
                :src="'//farmaciasdeservico.net/widget/?localidade='+districtToGet+'%7C'+localityToGet+'&cor_fundo=%23FFFFFF&cor_titulo=%23000000&cor_texto=%23333333&margem=10&v=1'"
                frameborder="0" target="_top"></iframe>
              </div>
              <div class="col-md-6">
                <div class="dialog-content">
                  Info Here!
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-12">
            <h4>Pressione [OK] para sair.</h4>
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
      params: {},
      districtToGet: '',
      localityToGet: '',
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
      this.$http
          .get('/api/connectServer/getDistrict')
          .then(responce => {
            this.districtToGet = responce.data.data.district.toLowerCase()
            .replace(/[éèêÉÈÊ]/g, "e")
            .replace(/[úùûÚÙÛ]/g, "u")
            .replace(/[áàãâAÁÀÃÂ]/g, "a")
            .replace(/[çÇ]/g, "c")
            .replace(/[íìîÍÌÎ]/g, "i")
            .replace(/[ñÑ]/g, "n")
            .replace(/[úùûÚÙÛ]/g, "u")
            .replace(/[óòõôÓÒÔÕ]/g, "o")
            .replace(/[ ]/g, "_")
            this.localityToGet = responce.data.data.locality.toLowerCase()
            .replace(/[éèêÉÈÊ]/g, "e")
            .replace(/[úùûÚÙÛ]/g, "u")
            .replace(/[áàãâAÁÀÃÂ]/g, "a")
            .replace(/[çÇ]/g, "c")
            .replace(/[íìîÍÌÎ]/g, "i")
            .replace(/[ñÑ]/g, "n")
            .replace(/[úùûÚÙÛ]/g, "u")
            .replace(/[óòõôÓÒÔÕ]/g, "o")
            .replace(/[ ]/g, "_")
          })
          .catch(error => {
            console.log(error)
          })
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
.iframe-size {
  width: 50%;
  height: 90%;
}
.size-100 {
  height: 100%;
}
</style>
