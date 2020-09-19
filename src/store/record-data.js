const state = {
  records: { },
    count: 1
  }

const mutations = {
    writeRecords(state) {
      // console.log("payload");
      state.count++
      log
      // commit('signOut', payload)
    },
}

const actions = { }

const getters = { 
  records: (state) => {
    return records
},
}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
}