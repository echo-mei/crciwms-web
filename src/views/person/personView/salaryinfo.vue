<style lang="scss" scoped>
.info {
  padding: 20px;
  width: 100%;
  height: 100%;
  box-sizing: border-box;

  .common_table_container {
    width: 100%;
    height: 100%;
    border: 1px solid #eee;
    position: relative;
  }
}
</style>


<template>
  <div class="info">
    <Table
      ref="table"
      :columnList="columns"
      :listUrl="listUrl"
      :sendData="paramsData"
      :isShowSetting="isShowSetting"
      :isShowCheckbox="isShowCheckbox"
      :isShowEdit="isShowEdit"
      :propMaxHeight="propMaxHeight"
    ></Table>
  </div>
</template>

<script>
import utils from "@/assets/js/utils.js";
import requestApi from "@/assets/js/requestApi.js";
const Table = () => import("@/components/table/Table.vue");

export default {
  data() {
    return {
      // 列表配置start
      propMaxHeight: window.innerHeight - 250, //表格的最大高度,默认600
      // 表头列数据
      columns: [
        {
          name: "序号",
          width: 0.05,
          initFormat: (row, index) => {
            return ++index;
          }
        },
        {
          name: "架子队",
          attr: "unitName",
          width: 0.1
        },
        {
          name: "工作班组",
          attr: "deptName",
          width: 0.1
        },
        {
          name: "劳务公司",
          attr: "companyName",
          width: 0.1
        },
        {
          name: "发放年月",
          attr: "createdDate",
          width: 0.1,
          initFormat: (row, index) => {
            return row.createdDate.substr(0,7);
          }
        },
        {
          name: "应发工资",
          attr: "payableWages",
          width: 0.1
        },
        {
          name: "实发工资",
          attr: "paidWages",
          width: 0.1
        },
        {
          name: "未发工资",
          attr: "unpaidWages",
          width: 0.1
        },
        {
          name: "出勤工日",
          attr: "workDays",
          width: 0.1
        },
        {
          name: "银行卡号",
          attr: "bankNo",
          width: 0.1
        }
      ],
      // 传递参数
      paramsData: {
        personOid: this.sendData.personOid,
        wageStatus:2
      },
      isShowCheckbox: false, // 是否展示复选框
      isShowSetting: false, // 是否展示设置字段显示的按钮
      isShowEdit: false, // 是否展示编辑按钮
      listUrl: requestApi.salaryListByPersonOid // Table的列表数据请求的地址
      // 列表配置end
    };
  },
  props: ["sendData"],
  created() {
  },
  components: {
    Table
  },
  mounted() {},
  methods: {}
};
</script>
