
<style lang="scss">
.home {
  padding: 20px;
  height: calc(100vh - 60px);
  overflow: auto;
  .count-style {
    font-size: 50px;
  }
  .has-permission {
    cursor: pointer;
  }
  .row-wrap {
    display: flex;
    width: 100%;
    height: 37%;
    min-height: 230px;
    overflow: hidden;
    .home-col {
      float: left;
      width: 36%;
      height: 100%;
      padding-left: 20px;
      box-sizing: border-box;
      &:first-of-type {
        width: 28%;
        flex: 0 0 28%;
        padding-left:0; 
      }

      .col-content {
        background: #fff;
        border-radius: 6px;
        height: 100%;

        &.col-content-total {
          .col-header {
            display: flex;
            align-items: center;
            height: 90px;
            color: #fff;
            background: url("../../assets/img/bgzc.png") center no-repeat;
            background-size: cover;
            line-height: normal;

            .col-header-text {
              margin-left: 20px;
              display: inline-block;
              vertical-align: middle;
            }
          }
          .col-main {
            height: calc(100% - 90px);
          }
        }
      }
    }
  }
  .row-wrap2 {
    width: 100%;
    height: calc(63% - 20px);
    min-height: 380px;
    margin-top: 20px;
    background: #fff;
    border-radius: 6px;
  }
  .col-header {
    width: 100%;
    height: 60px;
    background: #fafafa;
    color: #000;
    border-top-left-radius: 6px;
    border-top-right-radius: 6px;
    text-align: left;
    padding: 0 20px;
    font-size: 18px;
    line-height: 60px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    .tip {
      font-size: 16px;
      margin-left: 10px;
    }
  }
  .col-main {
    width: 100%;
    display: flex;
    height: calc(100% - 60px);
    justify-content: flex-start;
    flex-wrap: wrap;

    .col-main-item-wrap {
      flex: 0 0 50%;
      width: 50%;
      height: 50%;
      font-size: 18px;
      color: #1a1a1a;
      display: flex;
      align-items: center;

      .col-main-item {
        text-align: left;
        margin-left: 20%;
        cursor: pointer;

        .title {
          font-weight: normal;
        }
        .num {
          color: #ef720d;
        }
        .unit {
          font-size: 14px;
          color: #666666;
        }
      }
    }
  }
  .num {
    font-size: 24px;
    font-weight: bold;
  }
  @media all and (max-height: 1080px) {
  }
  @media all and (max-height: 900px) {
  }
  @media all and (max-height: 800px) {
    .col-header {
      height: 50px;
      line-height: 50px;
    }
    .col-content-total {
      .col-header {
        height: 70px !important;
      }
      .col-main {
        height: calc(100% - 70px) !important;
      }
    }
  }
}
</style>
<template>
  <div class="home">
    <div class="row-wrap">
      <div class="home-col">
        <div class="col-content col-content-total">
          <div class="col-header">
            <Icon custom="i-icon icon-users" size="36"/>
            <div class="col-header-text">
              <p>当前进场</p>
              <p>
                <span class="num">{{onCount}}</span>人
              </p>
            </div>
          </div>
          <div class="col-main">
            <div class="col-main-item-wrap" v-for="(infor, i) in inforCardData" :key="`infor-${i}`">
              <div class="col-main-item" @click="goDetail(infor)">
                <h3 class="title">{{infor.title}}</h3>
                <p>
                  <span class="num">{{infor.count}}</span>
                  <span class="unit">{{infor.unit}}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="home-col">
        <div class="col-content">
          <div class="col-header">进场退场人员统计</div>
          <div class="col-main">
            <chart-pie
              style="width:100%;height: 100%;"
              :value="isHerePieData"
              :color="isHereColor"
              ref="isHere"
            ></chart-pie>
          </div>
        </div>
      </div>
      <div class="home-col">
        <div class="col-content">
          <div class="col-header">
            进场人员年龄统计
            <span class="tip">(平均年龄{{avgAge}}岁)</span>
          </div>
          <div class="col-main">
            <chart-pie
              style="width:100%;height: 100%;"
              :value="agePieData"
              :color="ageColor"
              ref="age"
            ></chart-pie>
          </div>
        </div>
      </div>
    </div>

    <div class="row-wrap2">
      <div class="col-header">{{unitName}}进场退场人员统计</div>
      <div class="col-main">
        <chart-bar
          style="width:100%;height: 100%;"
          :value="barData.value"
          :color="barColor"
          :hoverColor="barHoverColor"
          :name="barData.name"
          ref="bar"
        />
      </div>
    </div>
  </div>
</template>

<script>
import CountTo from "@/components/count-to";
import InforCard from "./info-card";
import overView from "./overView";
import { ChartPie, ChartBar } from "./charts";
import {
  getNotContractCount,
  getNotImageCount,
  getPersonStatisticsInfo,
  getWaitPaidWageCount,
  getAppealInfoTotal
} from "@/api/home";
import { log } from "util";
export default {
  name: "home",
  components: {
    InforCard,
    CountTo,
    ChartPie,
    ChartBar,
    overView
  },
  data() {
    return {
      unitName: "",
      onCount: 0,
      inforCardData: [
        {
          title: "证照不全",
          icon: "_zhengjian",
          count: 0,
          color: "#2d8cf0",
          rightColor: "#e1f0ff",
          type: "1100",
          data: ["1", "1"],
          unit: "人"
        },
        {
          title: "合同不全",
          icon: "_hetong",
          count: 0,
          color: "#19be6b",
          rightColor: "#e0faec",
          type: "1100",
          data: ["2", "1"],
          unit: "人"
        },
        {
          title: "工资待发放",
          icon: "_gongzi",
          count: 0,
          color: "#ed3f14",
          rightColor: "#ffe4e0",
          type: "wageManage",
          data: ["Y"],
          unit: "笔"
        },
        {
          title: "申诉处理",
          icon: "_tousu",
          count: 0,
          color: "#ff9900",
          rightColor: "#fff1e0",
          type: "3300",
          data: ["1"],
          unit: "笔"
        }
      ],
      isHerePieData: [
        // 进场，退场
        { value: 0, name: "进场" },
        { value: 0, name: "退场" }
      ],
      isHereColor: ["#83b2f2", "#dfe1e4"],
      agePieData: [
        // 进场人员年龄统计数据
        { value: 0, name: "25岁及以下" },
        { value: 0, name: "26-35" },
        { value: 0, name: "36-45" },
        { value: 0, name: "46-55" },
        { value: 0, name: "55岁以上" }
      ],
      ageColor: ["#f8e367", "#e18197", "#8abe6e", "#6e7fbe", "#39c8c8"],
      avgAge: 20,

      barData: {
        value: [],
        name: {
          onCount: "进场人数",
          outCount: "退场人数"
        }
      },
      barColor: ["#83b2f2", "#dfe1e4"],
      barHoverColor: ["#1c59d6", "#979797"]
    };
  },
  mounted() {
    //
  },
  computed: {
    userInfo() {
      return this.$store.state.user.userInfo;
    }
  },
  created() {
    this.initNum();
  },
  methods: {
    initNum() {
      // inforCardData[0]  证照不全
      // inforCardData[1]  合同不全
      // inforCardData[2]  工资待发放
      // inforCardData[3]  申诉受理
      // isHerePieData[0]  在场
      // isHerePieData[1]  不在场
      getNotImageCount().then(res => {
        if (res) this.inforCardData[0].count = res.result;
      });
      getNotContractCount().then(res => {
        if (res) this.inforCardData[1].count = res.result;
      });
      getAppealInfoTotal().then(res => {
        if (res) this.inforCardData[3].count = res.result;
      });
      getWaitPaidWageCount(this.userInfo.userType).then(res => {
        if (res) this.inforCardData[2].count = res.result;
      });
      getPersonStatisticsInfo().then(res => {
        if (res) {
          // 机构名称
          this.unitName = res.result.unitName;
          //获取进场总数
          this.onCount = res.result.onCount;
          // 进场离场数据获取
          this.isHerePieData[0].value = res.result.onCount || 0;
          this.isHerePieData[1].value = res.result.outCount || 0;
          // 进场人员年龄统计
          this.avgAge = res.result.avgAge;
          this.agePieData[0].value = res.result.age1;
          this.agePieData[1].value = res.result.age2;
          this.agePieData[2].value = res.result.age3;
          this.agePieData[3].value = res.result.age4;
          this.agePieData[4].value = res.result.age5;
          if (
            res.result.personStatisticsDTOs &&
            res.result.personStatisticsDTOs.length !== 0
          ) {
            // 后台返回的key是英文字符，展示在图标上要用中文字符，根据name去匹配一次字符 ，把中文字符加在data里面
            let list = res.result.personStatisticsDTOs;
            list.forEach((item, index) => {
              let attr = [];
              attr.push(item.unitName);
              Object.keys(this.barData.name).forEach(key => {
                if (item.hasOwnProperty(key)) {
                  attr.push(item[key]);
                }
              });
              this.barData.value.push(attr);
            });
          }
          if (this.userInfo.userType === "02") {
            this.barData.title = "架子队农民工人数汇总";
          }
          this.$nextTick(() => {
            this.$refs.isHere.initData();
            this.$refs.age.initData();
            this.$refs.bar.initData();
          });
        }
      });
    },
    goDetail(infor) {
      if (infor.count === 0) return false;
      if (infor.type === "1100") {
        // 只有架子队能直接进去维护人员信息，项目部和项目分部的都不响应跳转
        // admin userType 06 架子队 02 项目部 03
        if (this.userInfo.userType === "02") {
          this.$router.push({
            name: infor.type,
            params: {
              notCompletedFlag: infor.data[0],
              personStatus: infor.data[1]
            }
          });
        } else {
          return false;
        }
      } else if (infor.type === "wageManage") {
        if (this.userInfo.userType === "02") {
          //架子队用户跳架子队工资管理
          this.$router.push({
            name: "2100",
            params: {
              notCompletedFlag: infor.data[0]
            }
          });
        }
        if (this.userInfo.userType === "03") {
          //项目部项目分部用户跳项目部工资管理
          this.$router.push({
            name: "2200",
            params: {
              notCompletedFlag: infor.data[0]
            }
          });
        }
      } else {
        this.$router.push({
          name: infor.type,
          params: {
            status: infor.data[0]
          }
        });
      }
    }
  }
};
</script>

