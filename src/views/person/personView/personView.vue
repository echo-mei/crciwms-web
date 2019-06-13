<style lang="scss" scoped>
@import "./personView.scss";
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
  <div class="personView">
    <div class="setting clearfix">
      <div class="left fr">
        <Button size="small" @click="goBack" class="icon-btn return">
          <Icon type="ivu-icon i-icon icon-fanhuishangji" size="18"/>
          <span>返回上级</span>
        </Button>
      </div>
    </div>

    <Layout>
      <Content>
        <template v-for="item in showMenuList">
          <template v-if="item.type === 'baseinfo'">
            <baseinfo v-if="leftCont == item.id" :sendData="sendData" :key="item.id"></baseinfo>
          </template>
          <template v-else-if="item.type === 'contractinfo'">
            <contractinfo v-if="leftCont == item.id" :sendData="sendData" :key="item.id"></contractinfo>
          </template>
          <template v-else-if="item.type === 'salaryinfo'">
            <salaryinfo v-if="leftCont == item.id" :sendData="sendData" :key="item.id"></salaryinfo>
          </template>
          <template v-else></template>
        </template>
      </Content>
      <Sider hide-trigger>
        <Menu :active-name="showMenuList[0].id" theme="light" width="auto" @on-select="getMenu">
          <MenuItem v-for="item in showMenuList" :name="item.id" :key="item.id">
            <Icon :type="item.icon"></Icon>
            <span>{{ item.name }}</span>
          </MenuItem>
        </Menu>
      </Sider>
    </Layout>
  </div>
</template>

<script>
const baseinfo = () => import("@/views/person/personView/baseinfo.vue");
const contractinfo = () => import("@/views/person/personView/contractinfo.vue");
const salaryinfo = () => import("@/views/person/personView/salaryinfo.vue");
import eventBus from "@/views/person/eventbus.js";
import utils from "@/assets/js/utils.js";
import requestApi from "@/assets/js/requestApi.js";
import {} from "jquery";
export default {
  data() {
    return {
      showMenuList: [
        {
          id: 1,
          type: "baseinfo",
          name: "基本信息",
          icon: "md-document",
          canEdit: true
        },
        {
          id: 2,
          type: "contractinfo",
          name: "合同信息",
          icon: "md-folder",
          canEdit: true
        },
        {
          id: 3,
          type: "salaryinfo",
          name: "工资信息",
          icon: "logo-yen",
          canEdit: true
        }
      ],
      leftCont: 0, // 左边内容展示： 默认显示人员基本信息
      personOid: "",
      selectMenu: {},
      sendData: {},
      parentSearchData: {}
    };
  },
  components: {
    baseinfo,
    contractinfo,
    salaryinfo
  },
  created() {
    // 获取路由传过来的参数
    this.personOid = this.$route.params.id;
    this.parentSearchData = this.$route.params.searchData;
    if (JSON.stringify(this.$route.query) != "{}") {
      const menuList = JSON.parse(this.$route.query["showMenuList"]);
      if (menuList) this.showMenuList = menuList;
    }
    this.selectMenu = this.showMenuList[0];
    this.leftCont = this.selectMenu.id; // 左边内容展示： 默认显示人员基本信息
    this.sendData = {
      personOid: this.personOid,
      canEdit: this.selectMenu.canEdit
    };
  },
  beforeDestroy() {
    //传递一个map，searchData是key，parentSearchData是value
    eventBus.$emit("searchData", this.parentSearchData);
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    getMenu(name) {
      this.selectMenu = this.showMenuList.find(item => item.id == name);
      this.leftCont = this.selectMenu.id;
    }
  }
};
</script>
