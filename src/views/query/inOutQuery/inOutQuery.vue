<style lang='scss'>
@import "./inOutQuery.scss";
</style>

<template>
  <div class="inOutQuery clearfix">
    <div class="content-box" :class="{'content-style2' : this.treeStyle === 'style2' }">
      <div class="search-box">
        <Form :model="sendData" :label-width="150" inline ref="queryForm" @submit.native.prevent>
          <FormItem label="姓名" prop="name">
            <Input placeholder="请输入姓名" v-model="sendData.name" clearable/>
          </FormItem>
          <!-- <FormItem label="进退场类型" prop="transferType">
            <Select v-model="sendData.transferType" placeholder="请选择进退场类型" filterable clearable>
              <Option v-for="item in orgType" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </FormItem>-->
          <FormItem label="进场时间范围" prop="transferDate">
            <DatePicker
              v-model="transferDate"
              format="yyyy-MM-dd"
              type="daterange"
              placeholder="请选择起止日期"
              :editable="false"
              @on-change="changeTime"
              @on-open-change="initDatePick"
            ></DatePicker>
          </FormItem>
          <FormItem label="退场时间范围" prop="transferoutDate">
            <DatePicker
              v-model="transferoutDate"
              format="yyyy-MM-dd"
              type="daterange"
              placeholder="请选择起止日期"
              :editable="false"
              @on-change="outchangeTime"
              @on-open-change="initDatePick"
            ></DatePicker>
          </FormItem>
          <FormItem label="进退场班组" prop="deptOid">
            <Select v-model="sendData.deptOid" placeholder="请选择进退场班组" filterable clearable>
              <Option
                v-for="item in unitNameList"
                :value="item.value"
                :key="item.value"
              >{{ item.label }}</Option>
            </Select>
          </FormItem>
          <FormItem label="项目分部" prop="parentUnitOid">
            <Select v-model="sendData.parentUnitOid" placeholder="请选择所属项目分部" filterable clearable>
              <Option
                v-for="item in division"
                :value="item.value"
                :key="item.value"
              >{{ item.label }}</Option>
            </Select>
          </FormItem>
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
          <FormItem label="在场状态" prop="personStatus">
            <Select v-model="sendData.personStatus" placeholder="请选择在场状态" filterable clearable>
              <Option
                v-for="item in orgStatus"
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
          <Button size="small" @click="downLoadInout" class="icon-btn middle-btn">
            <Icon type="ivu-icon i-icon icon-daochu1" size="18"/>
            <span>导出进退场名册</span>
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
      transferoutDate: "",
      orgStatus: [
        {
          value: "1",
          label: "已进场"
        },
        {
          value: "2",
          label: "已退场"
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
      propMaxHeight: window.innerHeight -420, //表格的最大高度,默认600
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
          name: "进场时间",
          attr: "inAuthDate",
          width: 0.1
        },
        {
          name: "退场时间",
          attr: "outAuthDate",
          width: 0.1
        },
        {
          name: "班组",
          attr: "deptName",
          width: 0.1
        },
        {
          name: "项目分部",
          attr: "parentUnitName",
          width: 0.1
        },
        {
          name: "架子队",
          attr: "unitName",
          width: 0.1
        },
        {
          name: "所属劳务公司",
          attr: "companyName",
          width: 0.1
        },
        {
          name: "在场状态",
          attr: "personStatus",
          width: 0.1,
          initFormat: row => {
            if (row.personStatus == "1") {
              return "已进场";
            } else if (row.personStatus == "2") {
              return "<span style='color:red'>已退场</span>";
            } else {
              return "--";
            }
          }
        },
        {
          name: "退场原因",
          attr: "outReason",
          width: 0.1
        }
      ],
      // 传递参数
      sendData: {
        name: "",
        deptOid: "",
        unitOid: "",
        parentUnitOid: "",
        companyOid: "",
        inStartDate: "",
        inEndDate: "",
        outStartDate: "",
        outEndDate: "",
        personStatus:""
      },
      unitNameList: [], //进退场班组
      division: [], //项目分部
      shelfteam: [], //架子队
      companyList: [], //劳务公司
      isShowCheckbox: false, // 是否展示复选框
      isShowSetting: false, // 是否展示设置字段显示的按钮
      isShowEdit: false, // 是否展示编辑按钮
      listUrl: requestApi.getListTransfer, // Table的列表数据请求的地址
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
      this.propMaxHeight = window.innerHeight - 420;
    };
    //获取劳务公司
    this.$axios.get(requestApi.listCompanyInfo).then(({ result }) => {
      result.list.forEach(v => {
        this.companyList.push({
          value: v.companyOid,
          label: v.companyName
        });
      });
    });
    //获取进退场班组
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
  },

  methods: {
    //导出进退场名册
    downLoadInout() {
      const params = this.$qs.stringify(this.sendData);
      let url = `${requestApi.downLoadInout}`;
      const token = utils.getItem("TOKEN_KEY");
      url = `${window.location.origin}/${url}?Authorization=${token}&${params}`;
      this.$Message.info("正在下载中,请稍候...");
      utils.downFile(url);
    },
    //查询
    handleSubmit() {
      this.$refs.table.queryData();
    },
    //重置
    handleReset() {
      this.$refs.queryForm.resetFields();
      this.sendData.inStartDate = "";
      this.sendData.inEndDate = "";
      this.sendData.outStartDate = "";
      this.sendData.outEndDate = "";
      this.transferDate = "";
      this.transferoutDate = "";
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
        this.sendData.inStartDate = data[0];
        this.sendData.inEndDate = data[1];
      }
    },
    outchangeTime(data) {
      if (data.length) {
        this.sendData.outStartDate = data[0];
        this.sendData.outEndDate = data[1];
      }
    },
    initDatePick() {
      utils.initDate();
    }
  }
};
</script>
