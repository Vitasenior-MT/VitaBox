import Vue from 'vue'
import VueI18n from 'vue-i18n'

import pt from './pt.json'
import en from './en.json'

Vue.use(VueI18n)

const locale = 'pt'

const messages = {
  pt,
  en
}

const i18n = new VueI18n({
  locale,
  messages
})

export default i18n
