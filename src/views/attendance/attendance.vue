<style lang='scss'>
@import "./attendance.scss";
</style>

<template>
  <div class="attendance clearfix">
    <Split v-model="split" class="split-line" :min="minSplit" max="600px">
      <div slot="left" class="demo-split-pane">
        <Tree
          ref="tree"
          class="tree-box left"
          :defaultKey="userInfo.unitOid"
          :disabledType="4"
          @on-change-style="onChangeStyle"
          @on-node-click="onNodeClick"
          @on-first-data="onFirstData"
          @on-current-data="onCurrentData"
          :class="{'style2' : this.treeStyle === 'style2' }"
        ></Tree>
      </div>
      <div slot="right" class="demo-split-pane">
        <div class="content-box" :class="{'content-style2' : this.treeStyle === 'style2' }">
          <div class="search-box">
            <Form
              :model="sendData"
              :label-width="150"
              inline
              ref="queryForm"
              @submit.native.prevent
            >
              <FormItem label="姓名" prop="name">
                <Input placeholder="请输入姓名" v-model="sendData.name" clearable/>
              </FormItem>
              <FormItem label="架子队" prop="unitOid">
                <Select
                  v-model="sendData.unitOid"
                  placeholder="请选择所属架子队"
                  :disabled="sendData.unitOid!==''"
                  filterable
                  clearable
                >
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
                    v-for="item in companysList"
                    :value="item.value"
                    :key="item.value"
                  >{{ item.label }}</Option>
                </Select>
              </FormItem>
              <!-- <FormItem label="考勤时间范围" prop="attenceDate">
                <DatePicker
                  type="date"
                  placeholder="请选择出勤日期"
                  format="yyyy-MM-dd"
                  v-model="sendData.attenceDate"
                  :editable="isEditable"
                  @on-change="sendData.attenceDate=$event"
                  @on-open-change="initDatePick"
                ></DatePicker>
              </FormItem>-->
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
              <Button size="small" @click="AttendImport" class="icon-btn">
                <Icon custom="i-icon icon-add" size="18"/>
                <span>考勤信息导入</span>
              </Button>
              <Button size="small" @click="downloadExcel" class="icon-btn middle-btn">
                <Icon custom="i-icon icon-download-cloud" size="18"/>
                <span>考勤模板下载</span>
              </Button>
              <Button size="small" @click="uploadScann" class="icon-btn">
                <!-- <Icon type="ios-cloud-upload-outline" size="18"/> -->
                <Icon custom="i-icon  icon-upload-cloud" size="18"/>
                <span>考勤扫描件上传</span>
              </Button>
              <Button size="small" @click="viewAnnex" class="icon-btn middle-btn">
                <Icon custom="i-icon icon-kejian" size="18"/>
                <span>考勤附件查看</span>
              </Button>
              <Button size="small" @click="attSummary" class="icon-btn">
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
    </Split>
    <AttendenceForm
      ref="attend"
      :shelfteam="shelfteam"
      @refreshTable="refreshTable"
      :companysList="companysList"
      :cpropMaxHeight="cpropMaxHeight"
      :attendContentHeight="attendContentHeight"
    />
  </div>
</template>

<script>
const Table = () => import("@/components/table/Table.vue");
const Tree = () => import("@/components/tree/Tree.vue");
import utils from "@/assets/js/utils.js";
import requestApi from "@/assets/js/requestApi.js";
import { } from "jquery";
import AttendenceForm from "./attendanceForm.vue";
import { request } from "http";
export default {
  data() {
    return {
      split: 0.2,
      transferDate: "",
      isEditable: false,
      formModalList: [],
      // Page页面所需要的数据
      totalRows: 0,
      selectCount: 0,
      shelfteam: [],
      companysList: [],
      // 列表配置start
      propMaxHeight: window.innerHeight - 375, //表格的最大高度,默认600
      cpropMaxHeight: 200,
      attendContentHeight: window.innerHeight - 400,
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
        // attenceDate: "",
        workTimes: "",
        companyOid: "",
        startDate: "",
        endDate: ""
      },
      isShowCheckbox: false, // 是否展示复选框
      isShowSetting: false, // 是否展示设置字段显示的按钮
      isShowEdit: false, // 是否展示编辑按钮
      listUrl: requestApi.getlistAttenceInfo, // Table的列表数据请求的地址
      treeStyle: "style1"
      // 列表配置end
    };
  },
  components: {
    Table,
    AttendenceForm,
    Tree
  },
  computed: {
    userInfo() {
      return this.$store.state.user.userInfo;
    },
    minSplit() {
      return this.treeStyle === "style2" ? "80px" : "200px";
    }
  },
  mounted() {
    window.onresize = () => {
      this.propMaxHeight = window.innerHeight - 375;
      // this.cpropMaxHeight = window.innerHeight - 600;
      this.attendContentHeight = window.innerHeight - 400;
    };
    //获取架子队列表
    this.$axios.get(requestApi.getListAuthTree).then(({ result }) => {
      result.forEach(v => {
        if (v.unitType == "3") {
          this.shelfteam.push({
            value: v.unitOid,
            label: v.unitName
          });
        }
      });
    });
    //获取劳务公司列表
    this.$axios.get(requestApi.listCompanyInfo).then(({ result }) => {
      result.list.forEach(v => {
        this.companysList.push({
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
    // //获取所属班组列表
    // getDeptInfo(unitOid) {
    //   this.steamNames = [];
    //   this.$axios.get(requestApi.getOrg + "/" + unitOid).then(({ result }) => {
    //     result.forEach(v => {
    //       //判断是否是班组信息
    //       if (v.unitType == "4") {
    //         //获取所属班组类型列表
    //         this.steamNames.push({
    //           value: v.unitOid,
    //           label: v.unitName
    //         });
    //       }
    //     });
    //   });
    // },
    onCurrentData(data) {
      this.sendData.unitOid = data.unitOid;
      // this.getDeptInfo(data.unitOid);
      this.$nextTick(() => {
        if (this.$refs.table) {
          this.$refs.table.queryData();
        }
      })
    },
    onChangeStyle(style) {
      this.treeStyle = style;
      this.split = style === "style2" ? 80 / window.innerWidth : 0.2;// 分割线
    },
    onNodeClick(data) {
      if (data.unitType === "3") {
        this.$refs.queryForm.resetFields();
        this.sendData.unitOid = data.unitOid;
        // this.getDeptInfo(data.unitOid);


        this.$refs.table.queryData();
      }
    },
    ///
    attSummary() {
      this.$router.push({
        name: "4600"
      });
    },
    //上传扫描件
    uploadScann() {
      this.$refs.attend.openScannModal();
    },
    //下载考勤模板
    downloadExcel() {
      this.$Message.info("正在下载，请稍候...");
      let url = window.location.origin + "/" + "attendance.xls";
      utils.downFile(url);
    },
    //导入考勤记录
    AttendImport() {
      this.$refs.attend.openImportModal();
    },
    //下载考勤扫描件
    viewAnnex() {
      this.$refs.attend.openAnnexModal();
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

    onFirstData(data) { },

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
