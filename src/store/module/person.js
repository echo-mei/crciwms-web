export default {
  state: {
    personSearchData: [],
  },
  mutations: {
    setPersonSearchData(state, personSearchData) {
      state.personSearchData = personSearchData;
    }
  },
  getters: {
    getPersonSearchData: state => {
      return state.personSearchData;
    }
  }
};
