<style lang="scss" scoped>
@import "./index.scss";
</style>

<template>
  <div class="wageManage clearfix">
    <div class="content-box">
      <div class="search-box">
        <Form :model="sendData" :label-width="100" inline ref="queryForm">
          <FormItem label="姓名" prop="name">
            <Input placeholder="请输入姓名" v-model="sendData.name" clearable></Input>
          </FormItem>

          <FormItem label="发放批次" prop="batchOid">
            <Select v-model="sendData.batchOid" placeholder="请选择发放批次" clearable filterable>
              <Option
                v-for="item in batchList"
                :value="item.batchOid"
                :key="item.batchOid"
              >{{ item.batchName }}</Option>
            </Select>
          </FormItem>
          <FormItem label="发放计划" prop="planOid">
            <Select v-model="sendData.planOid" placeholder="请选择发放计划" clearable filterable>
              <Option
                v-for="item in planList"
                :value="item.planOid"
                :key="item.planOid"
              >{{ item.planName }}</Option>
            </Select>
          </FormItem>
          <FormItem label="项目分部" prop="parentUnitOid">
            <Select v-model="sendData.parentUnitOid" placeholder="请选择所属项目分部" clearable filterable>
              <Option
                v-for="item in parentUnitList"
                :value="item.unitOid"
                :key="item.unitOid"
              >{{ item.unitName }}</Option>
            </Select>
          </FormItem>
          <FormItem label="架子队" prop="unitOid">
            <Select v-model="sendData.unitOid" placeholder="请选择架子队" clearable filterable>
              <Option
                v-for="item in unitList"
                :value="item.unitOid"
                :key="item.unitOid"
              >{{ item.unitName }}</Option>
            </Select>
          </FormItem>
          <FormItem label="工作班组" prop="deptOid">
            <Select v-model="sendData.deptOid" placeholder="请选择工作班组" clearable filterable>
              <Option
                v-for="item in depList"
                :value="item.unitOid"
                :key="item.unitOid"
              >{{ item.unitName }}</Option>
            </Select>
          </FormItem>
          <FormItem label="所属劳务公司" prop="companyOid">
            <Select v-model="sendData.companyOid" placeholder="请选择所属劳务公司" clearable filterable>
              <Option
                v-for="item in companyList"
                :value="item.companyOid"
                :key="item.companyOid"
              >{{ item.companyName }}</Option>
            </Select>
          </FormItem>
          <FormItem label="发放状态" prop="wageStatus">
            <Select v-model="sendData.wageStatus" placeholder="请选择发放状态" clearable>
              <Option
                v-for="item in wageStatusList"
                :value="item.value"
                :key="item.value"
              >{{ item.label }}</Option>
            </Select>
          </FormItem>
          <FormItem class="form-btn">
            <Button type="primary" @click="handleSubmit('queryForm')">查询</Button>
            <Button @click="handleReset('queryForm')" style="margin-left:10px;">重置</Button>
          </FormItem>
        </Form>
      </div>
      <div class="setting clearfix">
        <div class="left fl">
          <Button size="small" @click="exportWageGeneralInfo" class="icon-btn middle-btn">
            <Icon type="ivu-icon i-icon icon-daochu1" size="18"/>
            <span>导出工资发放信息</span>
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
import { getOrgTreeList } from "@/api/org.js";
import { listCompany } from "@/api/company.js";
import { exportWageGeneralInfo, listWagePlanInfoAll, listWageBatchInfoAll } from "@/api/wage.js";

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
      propMaxHeight: window.innerHeight - 380, //表格的最大高度,默认600
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
          name: "班组",
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
          initFormat: (row, index) => {
            return row.unpaidWages.toString()
          }
        },
        {
          name: "发放状态",
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
          name: "所属劳务公司",
          attr: "companyName",
          width: 0.1,
        },
        {
          name: "发放批次",
          attr: "batchName",
          width: 0.1,
        },
        {
          name: "发放计划",
          attr: "planName",
          width: 0.1,
        }
      ],
      // 传递参数
      sendData: {
        unitOid: "",
        deptOid: "",
        parentUnitOid: "",
        companyOid: "",
        name: "",
        batchOid: "",
        planOid: "",
      },
      isShowCheckbox: false, // 是否展示复选框
      isShowSetting: false, // 是否展示设置字段显示的按钮
      isShowEdit: false, // 是否展示编辑按钮
      listUrl: requestApi.listWageGeneralInfo, // Table的列表数据请求的地址
      // 列表配置end
      wageStatusList: wageStatusList,
      companyList: [], // 劳务公司列表
      depList: [], // 工作班组
      unitList: [],// 架子队列表
      parentUnitList: [], // 项目部列表
      batchList: [], // 所有批次列表
      planList: [], // 所有计划列表

    };
  },

  components: {
    Table,
  },
  computed: {},
  created() {
    this.sendData.planOid = this.$route.params.id;
    this.initCompanyList();
    this.initOrgList();
    this.initBatchList();
    this.initPlanList();
  },
  mounted() {
    window.onresize = () => {
      this.propMaxHeight = window.innerHeight - 380;
    };
  },

  methods: {
    initCompanyList() {
      listCompany().then(res => {
        this.companyList = res.result.list;
      })
    },
    initBatchList() {
      listWageBatchInfoAll().then(res => {
        if (res)
          this.batchList = res.result;
      })
    },
    initPlanList() {
      listWagePlanInfoAll().then(res => {
        if (res)
          this.planList = res.result;
      })
    },
    initOrgList() {
      getOrgTreeList().then(res => {
        if (res.result) {
          this.depList = res.result.filter(item => {
            return item.unitType === "4";
          });
          this.unitList = res.result.filter(item => {
            return item.unitType === "3";
          });
          this.parentUnitList = res.result.filter(item => {
            return item.unitType === "2";
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
      this.$router.push({ name: "3200" })
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
          }),
            err => {
              this.$Message.error(err);
            };
        }
      });
    },
    exportWageGeneralInfo() {
      const params = this.$qs.stringify(this.sendData)
      const url = `${requestApi.exportWageGeneralInfo}`;
      this.downLoadFile(url, params);
    },
    // 下载文件
    downLoadFile(url, data) {
      this.$Message.info('正在下载，请稍候...')
      const token = utils.getItem("TOKEN_KEY");
      url = `${window.location.origin}/${url}?Authorization=${token}&${data}`;
      utils.downFile(url);
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
