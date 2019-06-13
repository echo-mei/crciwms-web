

<template>
  <div class="wageManage clearfix">
    <div class="content-box">
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
import { getOrgTreeList } from "@/api/org.js";

import { } from "jquery";
export default {
  data() {
    return {
      // Page页面所需要的数据
      totalRows: 0,

      // 列表配置start
      propMaxHeight: window.innerHeight - 560, //表格的最大高度,默认600
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

      },
      isShowCheckbox: false, // 是否展示复选框
      isShowSetting: false, // 是否展示设置字段显示的按钮
      isShowEdit: false, // 是否展示编辑按钮
      listUrl: requestApi.listWageBase, // Table的列表数据请求的地址
      // 列表配置end
      wageStatusList: wageStatusList,
      orgList: [], // 工作班组
    };
  },

  components: {
    Table,
  },
   props: ["sentData"],
  computed: {

  },
  created() {

    this.sendData.planOid = this.sentData.planOid;
  },
  mounted() {
    window.onresize = () => {
      this.propMaxHeight = window.innerHeight - 560;
    };
  },

  methods: {
    initCompanyList() {
      listCompany().then(res => {
        this.companyList = res.result.list;
      })
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

  },

};
</script>
