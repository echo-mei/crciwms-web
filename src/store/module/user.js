import {
  login,
  logout,
} from "@/api/user";
import utils from "@/assets/js/utils.js";

export default {
  state: {
    userInfo: {},
    authorization: ""
  },
  mutations: {
    setUserInfo(state, userInfo) {
      state.userInfo = userInfo;
    },
    setToken(state, authorization) {
      state.authorization = authorization;
    },

  },
  getters: {
    getUserInfo(state) {
      return state.userInfo;
    },
    getToken(state) {
      return state.authorization;
    },

  },
  actions: {
    // 登录
    handleLogin({
      commit
    }, params) {
      return new Promise((resolve, reject) => {
        login(params)
          .then(res => {
            const data = res.result;
            commit("setToken", data.authorization);
            commit("setUserInfo", data);
            utils.removeItem("TOKEN_KEY");
            utils.setItem("TOKEN_KEY", data.authorization);
            // utils.setItem("USER", data);
            resolve();
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    // 退出登录
    handleLogOut({
      state,
      commit
    }) {

      return new Promise((resolve, reject) => {
        // logout(state.token).then(() => {
        //     commit("setToken", "");
        //     commit("setUserInfo", {});
        //     commit("setMenu", {});
        //     resolve();
        //   })
        //   .catch(err => {
        //     reject(err);
        //   });
        commit("setToken", "");
        commit("setUserInfo", {});
        utils.removeItem("TOKEN_KEY");
        utils.removeItem("vuex");
        resolve();
      });
    },

  }
};
