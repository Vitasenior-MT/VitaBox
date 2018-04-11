import { app } from '../main'
import * as types from './mutation-types'

export const state = {
  lang: 'pt'
}

export const mutations = {
  [types.SET_LANG](state, payload) {
    app.$i18n.locale = payload
  }
}

export const actions = {
  setLang({ commit }, payload) {
    commit(types.SET_LANG, payload)
  },
  async setLangNew({ commit }, payload) {
    const res = import(`../lang/${payload}.json`)
    if (payload in app.$i18n.messages) {
      commit(types.SET_LANG, payload)
    } else {
      try {
        const res = await import(`../lang/${payload}.json`)
        app.$i18n.setLocaleMessage(payload, res.data)
        commit(types.SET_LANG, payload)
      } catch (e) {
        console.log(e)
      }
    }
  }
}
