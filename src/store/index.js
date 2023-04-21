import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        theme: 'chalk',
        pid: undefined,
        provinceName: "",
        pidList: []
    },
    mutations: {
        CHANGETHEME(state) {
            state.theme = state.theme === 'chalk' ? 'vintage' : 'chalk'
        },
        SETPID(state, value) {
            if (value >= 0)

                state.provinceName = state.pidList[value].label
            else
                state.provinceName = undefined
            state.pid = value

        },
        SETPIDLIST(state, value) {
            state.pidList = value
        }

    },
    actions: {

    },

})