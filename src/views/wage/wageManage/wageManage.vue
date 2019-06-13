<style lang="scss" scoped>
@import "./wageManage.scss";
</style>

<template>
  <div class="wageManage clearfix">
    <div class="content-box">
      <div class="search-box">
        <Form :model="sendData" :label-width="100" inline ref="queryForm">
          <FormItem label="姓名" prop="name">
            <Input placeholder="请输入姓名" v-model="sendData.name" clearable></Input>
          </FormItem>
          <FormItem label="身份证号" prop="idNo">
            <Input placeholder="请输入身份证号" v-model="sendData.idNo" clearable></Input>
          </FormItem>
          <FormItem label="工资状态" prop="wageStatus">
            <Select v-model="sendData.wageStatus" placeholder="请选择工资状态" clearable>
              <Option
                v-for="item in wageStatusList"
                :value="item.value"
                :key="item.value"
              >{{ item.label }}</Option>
            </Select>
          </FormItem>
          <FormItem label="所属劳务公司" prop="companyOid">
            <Select v-model="sendData.companyOid" placeholder="请选择所属劳务公司" clearable>
              <Option
                v-for="item in companyList"
                :value="item.companyOid"
                :key="item.companyOid"
              >{{ item.companyName }}</Option>
            </Select>
          </FormItem>
          <FormItem label="架子队" prop="unitOid">
            <Select v-model="sendData.unitOid" placeholder="请选择所属架子队" clearable>
              <Option
                v-for="item in orgList"
                :value="item.unitOid"
                :key="item.unitOid"
              >{{ item.unitName }}</Option>
            </Select>
          </FormItem>

          <FormItem>
            <Button type="primary" @click="handleSubmit('queryForm')">查询</Button>
            <Button @click="handleReset('queryForm')" style="margin-left:10px;">重置</Button>
          </FormItem>
        </Form>
      </div>
      <div class="setting clearfix">
        <div class="left fl">
          <Button size="small" @click="deleteWage" class="icon-btn middle-btn">
            <Icon type="ivu-icon i-icon icon-shanchuhover" size="18"/>
            <span>删除</span>
          </Button>
        </div>
        <div class="left fr" v-if="isShowGoBack">
          <Button size="small" @click="goBack" class="icon-btn middle-btn">
            <Icon type="ivu-icon i-icon icon-fanhuishangji" size="18"/>
            <span>返回上级</span>
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
import { wageStatusList } from "@/assets/js/commonJSON.js";
import { listCompany } from "@/api/company.js";
import { deleteWage } from "@/api/wage.js";
import { getOrgTreeList } from "@/api/org.js";

import { } from "jquery";
export default {
  data() {
    return {
      // Page页面所需要的数据
      totalRows: 0,
      selectData: {},
      ids: [], // 选中的ids
      isShowModal: false, // 新增编辑模态框
      isShowUpload: false, // 上传附件模态框
      // 列表配置start
      propMaxHeight: window.innerHeight - 330, //表格的最大高度,默认600
      // 表头列数据
      columns: [
        {
          name: "姓名",
          attr: "name",
          width: 0.1,
        },
        {
          name: "身份证号",
          attr: "idNo",
          width: 0.1
        },
        {
          name: "工作班组",
          attr: "deptName",
          width: 0.1
        },
        {
          name: "出勤工日",
          attr: "workDays",
          width: 0.1,
        },
        {
          name: "应发工资",
          attr: "payableWages",
          width: 0.1
        },
        {
          name: "实发工资",
          attr: "paidWages",
          width: 0.1,
        },
        {
          name: "未发工资",
          attr: "unpaidWages",
          width: 0.1,
        },
        {
          name: "工资状态",
          attr: "wageStatus",
          width: 0.1,
          initFormat: (row, index) => {
            const status = this.wageStatusList.filter(item => {
              return item.value === row.wageStatus;
            })
            const label = status.length ? status[0].label : "未知状态";
            return label;
          }
        },
        {
          name: "所属架子队",
          attr: "unitName",
          width: 0.1,
        },
        {
          name: "所属劳务公司",
          attr: "companyName",
          width: 0.1,
        }
      ],
      // 传递参数
      sendData: {
        wageStatus: "",
        planOid: "",
        companyOid: "",
        name: "",
        unitOid: ""
      },
      isShowCheckbox: true, // 是否展示复选框
      isShowSetting: false, // 是否展示设置字段显示的按钮
      isShowEdit: false, // 是否展示编辑按钮
      listUrl: requestApi.listWageBase, // Table的列表数据请求的地址
      // 列表配置end
      wageStatusList: wageStatusList,
      companyList: [], // 劳务公司列表
      orgList: [], // 工作班组
    };
  },

  components: {
    Table,
  },
  computed: {
    isShowGoBack() {
      return this.$route.params.id !== "all";
    }
  },
  created() {
    this.initOrgList();
    this.initCompanyList();
    this.sendData.planOid = this.$route.params.id === "all" ? "" : this.$route.params.id;
    this.sendData.wageStatus = this.$route.params.id === "all" ? "1" : "";
    this.sendData.parentSendData = this.$route.params.sendData || {};
    console.log(12312312,this.$route.params,);



    // this.sendData.unitOid = this.$route.params.id;
  },
  mounted() {
    window.onresize = () => {
      this.propMaxHeight = window.innerHeight - 330;
    };
  },

  methods: {
    initCompanyList() {
      listCompany().then(res => {
        this.companyList = res.result.list;
      })
    },
    initOrgList() {
      getOrgTreeList().then(res => {
        if (res.result) {
          this.orgList = res.result.filter(item => {
            return item.unitType === "3";
          })
        }
      })
    },
    onFirstData(data) {
      console.log(data);
    },

    /**
     * 单选复选框选中数据
     */
    onSelectRows(rows) {
      this.selectCount = rows.length;
      this.wagePlanSentData = rows;
      this.selectData = rows[0] || {}; //当前需要编辑的row，数组，默认只需要第一个
      this.ids = []; // 每次获得都需要清空一下上次选择的删除数据
      rows.forEach((v, i) => {
        this.ids.push(v.wageOid);
      });
    },

    // 返回上一级
    goBack() {
      this.$router.push({
        name: "2100",
        params: {
          parentSendData: this.sendData.parentSendData
        }

      })
    },
    deleteWage() {
      const type = utils.validateIds(this, this.ids);
      if (!type) return false;
      const data = this.ids.join(",");
      this.$Modal.confirm({
        title: "确认删除吗？",
        cancelText: "取消",
        onOk: () => {
          deleteWage(data).then(res => {
            this.$refs.table.queryData();
            if (res)
              this.$Message.success(res.result);
              this.ids = [];
          }),
            err => {
              this.$Message.error(err);
            };
        }
      });
    },
    //查询
    handleSubmit(name) {
      this.$refs.table.queryData(this.sendData);
    },
    //重置
    handleReset(name) {
      this.$refs[name].resetFields();
      this.$refs.table.queryData(this.sendData);
    },


  },

};
</script>
