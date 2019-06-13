<style lang='scss'>
@import "./attendanceQuery.scss";
</style>
<template>
  <div class="attendanceQuery clearfix">
    <div class="content-box" :class="{'content-style2' : this.treeStyle === 'style2' }">
      <div class="search-box">
        <Form :model="sendData" :label-width="150" inline ref="queryForm" @submit.native.prevent>
          <FormItem label="姓名" prop="name">
            <Input placeholder="请输入姓名" v-model="sendData.name" clearable/>
          </FormItem>
          <FormItem label="考勤时间范围" prop="transferDate">
            <DatePicker
              v-model="transferDate"
              format="yyyy-MM-dd"
              type="daterange"
              placeholder="请选择起止日期"
              :editable="false"
              @on-change="changeTime"
              @on-open-change="initDatePick"
              transfer
            ></DatePicker>
          </FormItem>
          <!-- <FormItem label="项目分部" prop="parentUnitOid">
            <Select v-model="sendData.parentUnitOid" placeholder="请选择所属项目分部" filterable clearable>
              <Option
                v-for="item in division"
                :value="item.value"
                :key="item.value"
              >{{ item.label }}</Option>
            </Select>
          </FormItem>-->
          <FormItem label="架子队" prop="unitOid">
            <Select v-model="sendData.unitOid" placeholder="请选择所属架子队" filterable clearable>
              <Option
                v-for="item in shelfteam"
                :value="item.value"
                :key="item.value"
              >{{ item.label }}</Option>
            </Select>
          </FormItem>
          <FormItem label="所属劳务公司" prop="companyOid">
            <Select v-model="sendData.companyOid" placeholder="请选择所属劳务公司" filterable clearable>
              <Option
                v-for="item in companyList"
                :value="item.value"
                :key="item.value"
              >{{ item.label }}</Option>
            </Select>
          </FormItem>
          <FormItem label="出勤时长" prop="workTimes">
            <Input placeholder="请输入出勤时长" v-model="sendData.workTimes" clearable/>
          </FormItem>
          <FormItem>
            <Button type="primary" @click="handleSubmit">查询</Button>
            <Button @click="handleReset" style="margin-left:10px;">重置</Button>
          </FormItem>
        </Form>
      </div>
      <div class="setting clearfix">
        <div class="left fl">
          <Button size="small" @click="attSummary" class="icon-btn middle-btn">
            <Icon custom="i-icon icon-jiankong" size="18"/>
            <span>考勤汇总</span>
          </Button>
        </div>
      </div>
      <div class="box">
        <div class="table-box">
          <Table
            ref="table"
            :columnList="columns"
            :listUrl="listUrl"
            :sendData="sendData"
            :isShowSetting="isShowSetting"
            :isShowCheckbox="isShowCheckbox"
            :isShowEdit="isShowEdit"
            @on-select-rows="onSelectRows"
            :propMaxHeight="propMaxHeight"
          ></Table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const Table = () => import("@/components/table/Table.vue");
import utils from "@/assets/js/utils.js";
import requestApi from "@/assets/js/requestApi.js";
import {} from "jquery";
export default {
  data() {
    return {
      transferDate: "",
      orgStatus: [
        {
          value: "1",
          label: "在场"
        },
        {
          value: "2",
          label: "不在场"
        }
      ],
      orgType: [
        {
          value: "1",
          label: "进场"
        },
        {
          value: "2",
          label: "退场"
        }
      ],
      formModalList: [],
      // Page页面所需要的数据
      totalRows: 0,
      selectCount: 0,
      // 列表配置start
      propMaxHeight: window.innerHeight - 380, //表格的最大高度,默认600
      // 表头列数据
      columns: [
        {
          name: "姓名",
          attr: "name",
          width: 0.1
        },
        {
          name: "身份证号",
          attr: "idNo",
          width: 0.1
        },
        {
          name: "出勤日期",
          attr: "attenceDate",
          width: 0.1
        },
        {
          name: "出勤时长(天)",
          attr: "workTimes",
          width: 0.1
        },
        {
          name: "所属班组",
          attr: "deptName",
          width: 0.1
        },
        {
          name: "备注",
          attr: "remark",
          width: 0.1
        }
      ],
      // 传递参数
      sendData: {
        name: "",
        unitOid: "",
        // parentUnitOid: "",
        startDate: "",
        endDate: "",
        companyOid: "",
        workTimes: ""
      },
      unitNameList: [], //进退场班组
      division: [], //项目分部
      shelfteam: [], //架子队
      companyList: [], //所属班组
      isShowCheckbox: false, // 是否展示复选框
      isShowSetting: false, // 是否展示设置字段显示的按钮
      isShowEdit: false, // 是否展示编辑按钮
      listUrl: requestApi.getlistAttenceInfo, // Table的列表数据请求的地址
      treeStyle: "style1"
      // 列表配置end
    };
  },
  components: {
    Table
  },
  computed: {},
  mounted() {
    window.onresize = () => {
      this.propMaxHeight = window.innerHeight - 380;
    };
    //获取进退场班组,架子队，项目分部
    this.$axios.get(requestApi.getListAuthTree).then(({ result }) => {
      result.forEach(v => {
        if (v.unitType == "4") {
          this.unitNameList.push({
            value: v.unitOid,
            label: v.unitName
          });
        } else if (v.unitType == "3") {
          this.shelfteam.push({
            value: v.unitOid,
            label: v.unitName
          });
        } else if (v.unitType == "2") {
          this.division.push({
            value: v.unitOid,
            label: v.unitName
          });
        } else {
        }
      });
    });
    //获取劳务公司
    this.$axios.get(requestApi.listCompanyInfo).then(({ result }) => {
      result.list.forEach(v => {
        this.companyList.push({
          value: v.companyOid,
          label: v.companyName
        });
      });
    });
  },

  methods: {
    /**
     * 获取本月的第一天
     */
    getCurrentMonthFirstDay() {
      let date = new Date();
      date.setDate(1);
      let year = date.getFullYear(),
        month = date.getMonth() + 1,
        day = date.getDate();
      if (month < 10) {
        month = `0${month}`;
      }
      if (day < 10) {
        day = `0${day}`;
      }
      return `${year}-${month}-${day}`;
    },
    /**
     * 获取本月当天
     */
    getCurrentDay() {
      let date = new Date();
      let year = date.getFullYear(),
        month = date.getMonth() + 1,
        day = date.getDate();
      if (month < 10) {
        month = `0${month}`;
      }
      if (day < 10) {
        day = `0${day}`;
      }
      return `${year}-${month}-${day}`;
    },

    attSummary() {
      this.$router.push({
        name: "4600"
      });
    },
    //查询
    handleSubmit() {
      this.$refs.table.queryData();
    },
    //重置
    handleReset() {
      this.$refs.queryForm.resetFields();
      this.sendData.startDate = "";
      this.sendData.endDate = "";
      this.transferDate = "";
      this.$refs.table.queryData();
    },
    onFirstData(data) {},

    /**
     * 单选复选框选中数据
     */
    onSelectRows(rows) {
      this.formModalList = rows;
    },
    refreshTable() {
      this.$refs.table.queryData();
    },
    changeTime(data) {
      if (data.length) {
        this.sendData.startDate = data[0];
        this.sendData.endDate = data[1];
      }
    },
    initDatePick() {
      utils.initDate();
    }
  }
};
</script>
