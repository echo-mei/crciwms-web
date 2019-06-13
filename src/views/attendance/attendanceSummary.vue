<style lang='scss'>
@import "./attendanceSummary.scss";
</style>
<template>
  <Modal
    v-model="summaryModal"
    title="考勤信息汇总"
    width="1400"
    :mask-closable="false"
    @on-cancel="summaryHandleCancle"
  >
    <div class="attendanceSummary clearfix">
      <div class="content-box" :class="{'content-style2' : this.treeStyle === 'style2' }">
        <div class="search-box">
          <Form :model="sendData" :label-width="150" inline ref="queryForm" @submit.native.prevent>
            <FormItem label="姓名" prop="name">
              <Input placeholder="请输入姓名" v-model="sendData.name" clearable/>
            </FormItem>
            <FormItem label="考勤月份" prop="attenceDate">
              <DatePicker
                v-model="sendData.attenceDate"
                format="yyyy-MM"
                type="month"
                placeholder="请选择考勤月份"
                :clearable="false"
                :editable="false"
                @on-change="sendData.attenceDate=$event"
                @on-open-change="initDatePick"
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
            <FormItem>
              <Button type="primary" @click="handleSubmit">查询</Button>
              <Button @click="handleReset" style="margin-left:10px;">重置</Button>
            </FormItem>
          </Form>
        </div>
        <div class="setting clearfix">
          <div class="left fl">
            <Button size="small" @click="downLoadAttence" class="icon-btn middle-btn">
              <Icon type="ivu-icon i-icon icon-daochu1" size="18"/>
              <span>导出考勤名册</span>
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
              :propMaxHeight="spropMaxHeight"
            ></Table>
          </div>
        </div>
      </div>
    </div>
    <div slot="footer">
      <Button type="primary" style="width:90px" @click="summaryHandleCancle">关闭</Button>
    </div>
  </Modal>
</template>

<script>
const Table = () => import("@/components/table/Table.vue");
import utils from "@/assets/js/utils.js";
import requestApi from "@/assets/js/requestApi.js";
import {} from "jquery";
import { request } from "http";
export default {
  props: ["spropMaxHeight"],
  data() {
    return {
      attenceDate: "",
      summaryModal: false,
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
      propMaxHeight: window.innerHeight - 580, //表格的最大高度,默认600
      // 表头列数据
      columns: [
        // {
        //   name: "姓名",
        //   attr: "name",
        //   width: 0.1
        // },
        // {
        //   name: "身份证号",
        //   attr: "idNo",
        //   width: 0.1
        // },
        // {
        //   name: "出勤总时长(天)",
        //   attr: "workTimesToal",
        //   width: 0.1
        // }
      ],
      // 传递参数
      sendData: {
        name: "",
        unitOid: "",
        // parentUnitOid: "",
        // startDate: "",
        // endDate: "",
        companyOid: "",
        attenceDate: this.getPrevMonth()
      },
      unitNameList: [], //进退场班组
      division: [], //项目分部
      shelfteam: [], //架子队
      companyList: [], //所属班组
      isShowCheckbox: false, // 是否展示复选框
      isShowSetting: false, // 是否展示设置字段显示的按钮
      isShowEdit: false, // 是否展示编辑按钮
      listUrl: requestApi.getListSummary, // Table的列表数据请求的地址
      treeStyle: "style1"
      // 列表配置end
    };
  },
  components: {
    Table
  },
  created() {
    this.getMonthField();
  },
  computed: {},
  mounted() {
    this.sendData.attenceDate = utils.formatDate(
      this.sendData.attenceDate,
      "yyyy-MM"
    );
    window.onresize = () => {
      this.propMaxHeight = window.innerHeight - 580;
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
    //动态获取月份天数字段
    getMonthField() {
      var curDate = new Date();
      var curMonth = curDate.getMonth();
      curDate.setMonth(curMonth + 1);
      curDate.setDate(0);
      let days = curDate.getDate();
      this.sendData.attenceDate = utils.formatDate(
        this.sendData.attenceDate,
        "yyyy-MM"
      );
      this.columns = [];
      this.columns.push(
        {
          name: "姓名",
          attr: "name",
          width: 0.1
        },
        {
          name: "身份证",
          attr: "idNo",
          width: 0.1
        },
        {
          name: "出勤总时长(天)",
          attr: "workTimesToal",
          width: 0.1
        }
      );
      for (let i = 1; i < days+1; i++) {
        this.columns.push({
          name: `${i}号`,
          attr: i,
          width: 0.05
        });
      }
      console.log(this.columns);
      // this.$axios
      //   .get(requestApi.getListSummary, { params: this.sendData })
      //   .then(({ result }) => {
      //     this.columns=[];

      //     console.log(this.columns)
      //     this.$refs.table.queryData();
      //   });
    },
    //获取上一月
    getPrevMonth() {
      let date = new Date();
      let year = date.getFullYear();
      let month = date.getMonth();
      if (month == 0) {
        year = year - 1;
        month = 12;
      }
      if (month < 10) {
        month = `0${month}`;
      }
      return `${year}-${month}`;
    },
    //导出考勤名册
    downLoadAttence() {
      const params = this.$qs.stringify(this.sendData);
      let url = `${requestApi.downLoadAttence}`;
      const token = utils.getItem("TOKEN_KEY");
      url = `${window.location.origin}/${url}?Authorization=${token}&${params}`;
      this.$Message.success("正在下载中,请稍后...");
      utils.downFile(url);
    },
    //查询
    handleSubmit() {
      this.sendData.attenceDate = utils.formatDate(
        this.sendData.attenceDate,
        "yyyy-MM"
      );
      this.getMonthField();
      // this.$refs.table.queryData();
    },
    //重置
    handleReset() {
      this.$refs.queryForm.resetFields();
      this.sendData.attenceDate = utils.formatDate(
        this.sendData.attenceDate,
        "yyyy-MM"
      );
      this.getMonthField();
      //this.$refs.table.queryData();
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
    },
    openSummaryModal() {
      this.summaryModal = true;
    },
    summaryHandleCancle() {
      this.$refs.queryForm.resetFields();
      this.summaryModal = false;
    }
  }
};
</script>
