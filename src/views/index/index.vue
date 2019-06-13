<style lang="scss" scoped>
@import "./index.scss";
</style>
<style lang="scss">
/*消除iview默认样式*/
.notifiy {
  .ivu-badge {
    .ivu-badge-dot {
      box-shadow: none;
    }
  }
}
</style>

<template>
  <div class="index">
    <div>
      <div class="header clearfix">
        <div class="logo">
          <img :src="require('@/assets/img/logo.png')" alt="LOGO"  @click="goDetail('home')">
          <Tooltip :content="version" class="text">
            <span  @click="goDetail('home')">农民工实名制工资管理系统</span>
          </Tooltip>
        </div>
        <div class="menu-box">
          <Menu
            ref="menu"
            mode="horizontal"
            :theme="theme"
            :active-name="activeName"
            v-if="menuList && menuList.length !== 0"
            @on-select="selectMenu"
          >
            <template v-for="item in menuList">
              <router-link
                :to="{name: item.id}"
                class="navTitle_wrap"
                :key="item.id"
                v-if="item.children.length === 0"
              >
                <MenuItem :name="item.id">{{ item.entry.menuName || "" }}</MenuItem>
              </router-link>
              <span v-if="item.children.length !== 0" :key="item.id">
                <MenuItem :name="item.id">{{ item.entry.menuName || "" }}</MenuItem>
              </span>
            </template>
          </Menu>
        </div>
        <div span="2" class="user-box" @click.stop="isShowSeeting = !isShowSeeting">
          <!-- <span class="notifiy">
            <Badge dot :offset="[0, 7]">
              <Icon custom="i-icon icon-tixing" size="26"></Icon>
            </Badge>
          </span>-->
          <div class="user-info-wrap">
            <span class="user-info-detail">{{ userInfo.personName || "暂无信息"}}</span>
            <span class="user-info-detail">{{ userInfo.unitName }}</span>
          </div>
          <span class="avatar">
            <Icon type="md-person" size="28"/>
          </span>
          <!--点击展开用户的设置信息-->
          <div class="user_seeting" v-if="isShowSeeting" @click.stop.prevent>
            <div class="arrow"></div>
            <div class="user_seeting_operate">
              <div class="title">
                <div class="user_seeting_account">
                  <span class="user_name">{{ userInfo.personName || "暂无信息"}}</span>
                  <div class>{{ userInfo.unitName }}</div>
                  <!-- <div class="user_role">{{ userInfo.userType }}</div> -->
                </div>
              </div>
              <div class="seeting_list" @click="passUpdate">
                <span>
                  <Icon custom="ivu-icon i-icon icon-xiugaimima" size="20"/>修改密码
                </span>
              </div>
            </div>
            <div class="log-out" @click="logout">
              <span>
                <Icon custom="ivu-icon i-icon icon-power14" size="24" style="font-weight:600;"/>
              </span>
            </div>
          </div>
        </div>
      </div>

      <Row class="subMenu" v-if="subMenuList.length">
        <Col span="4">
          <span style="opacity:0">彩蛋</span>
        </Col>
        <Col span="16">
          <div class="nav">
            <span
              v-for="(item,index) in subMenuList"
              :key="item.entry.menuId"
              :class="{'active' : isActive(item)}"
            >
              <router-link
                :to="{name: item.id}"
                class="navTitle_wrap"
                :key="item.id"
              >{{ item.entry.menuName}}</router-link>
            </span>
          </div>
        </Col>
        <Col span="4"></Col>
      </Row>
      <!-- <keep-alive include="personList"> -->
      <router-view></router-view>
      <!-- </keep-alive> -->
    </div>

    <!-- 全局加载提示-->
    <div id="showLoading" class="showLoading">
      <div class="loading-content">
        <span class="loading-icon"></span>
        <div class="loading-text">正在处理中...</div>
      </div>
    </div>
    <!-- 密码修改 -->
    <IndexPass ref="IndexPass" :userInfo="userInfo" @clogout="clogout"/>
  </div>
</template>
<script>
import utils from "@/assets/js/utils.js";
import requestApi from "@/assets/js/requestApi.js";
import { getVersionNumber } from "@/api/user.js";
import { mapActions } from "vuex";
import IndexPass from "./indexPass";
export default {
  data() {
    return {
      theme: "primary", //菜单样式
      subMenuList: [],
      activeName: "", //默认显示第一个菜单
      showPop: false,
      // 个人设置
      isShowSeeting: false,
      version: "" // 当前系统版本号
    };
  },
  components: {
    IndexPass
  },
  created() {
    this.initMenu();
    this.getVersionNumber();
    document.title = "农民工实名制管理系统";
  },
  mounted() {
    this.hashChangeByIE();
    // 点击任意地方关闭用户设置
    document.onclick = e => {
      this.isShowSeeting = false;
    };
  },
  computed: {
    userInfo() {
      return this.$store.state.user.userInfo;
    },
    menuList() {
      return this.$store.state.app.menuList;
    }
  },
  methods: {
    getVersionNumber() {
      getVersionNumber().then(res => {
        if (res) this.version = res.result;
      });
    },
    passUpdate() {
      this.$refs.IndexPass.openPassModal();
    },
    isActive(item) {
      if (this.$route.name === item.id) {
        return true;
      } else if (this.$route.meta.defaultActive === item.id) {
        return true;
      } else {
        return false;
      }
    },
    ...mapActions(["handleLogOut", "handleMenuList"]),
    /**
     * vue-route的bug，IE下，会出现hash跳转，但页面不跳转的情况，这里需要额外跳转一次；
     */
    hashChangeByIE() {
      if (utils.myBrowser() === "IE") {
        window.addEventListener(
          "hashchange",
          () => {
            const currentPath = window.location.hash.slice(1);
            if (this.$route.path !== currentPath) {
              this.$router.push(currentPath);
            }
          },
          false
        );
      }
    },
    initMenu() {
      this.handleMenuList().then(res => {
        this.$nextTick(() => {
          const route = this.$route;
          this.activeName = route.meta.parentMenuId
            ? route.meta.parentMenuId
            : route.name;
          this.$refs.menu.updateActiveName();
          this.getSubMenuList();
        });
      });
    },
    goDetail(type) {
      switch (type) {
        case "help":
          this.$router.push({
            name: "help"
          });
          this.hidePop();
          break;
        case "account":
          this.$router.push({
            name: "accountSetting"
          });
          this.hidePop();
          break;
        case "home":
          this.$router.push({
            name: "home"
          });
          this.hidePop();
          break;

        default:
          break;
      }
    },
    logout() {
      this.$Modal.confirm({
        title: "确认要退出吗？",
        onOk: () => {
          this.handleLogOut().then(() => {
            this.$router.push({
              name: "login"
            });
          });
        }
      });
    },
    clogout() {
      this.handleLogOut().then(() => {
        this.$router.push({
          name: "login"
        });
      });
    },
    getSubMenuList(name) {
      if (!this.menuList.length) return false;
      const route = this.$route;
      const currentRoute = name ? name : route.meta.parentMenuId;
      this.subMenuList = [];
      this.menuList.map(item => {
        if (item.id === currentRoute) {
          return (this.subMenuList = item.children);
        }
      });
      if (this.subMenuList.length) {
        let currentPage = this.subMenuList[0].id;
        this.subMenuList.filter(item => {
          if (item.id === this.$route.name) return (currentPage = item.id);
        });

        this.$router.push({ name: currentPage });
      }
    },

    getHeadImageUrl(personId) {
      return utils.getHeadImageUrl(requestApi.getPhoto, personId);
    },

    getDefaultHeadImageUrl(e) {
      e.target.src = require("@/assets/img/user.png");
    },
    selectMenu(name) {
      this.getSubMenuList(name);
      this.hidePop();
    },
    hidePop() {
      this.showPop = false;
    }
  },
  watch: {
    $route(to, from) {
      this.activeName = to.meta ? to.meta.parentMenuId : this.$route.name;
      this.getSubMenuList();
    }
  }
};
</script>
