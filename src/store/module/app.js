import {
  getMenu,
} from "@/api/user";
import utils from "@/assets/js/utils.js";

export default {
  state: {
    menuList: [],
  },
  mutations: {
    setMenuList(state, menuList) {
      state.menuList = menuList;
    }
  },
  getters: {
    getMenuList(state) {
      return state.getMenuList;
    },

  },
  actions: {
    // 获取菜单
    handleMenuList({
      commit
    }) {
      return new Promise((resolve, reject) => {
        getMenu()
          .then(res => {
            const data = res.result;
            commit("setMenuList", data);
            resolve();
          })
          .catch(err => {
            reject(err);
          });
      });
    },


  }
};
