<style scoped>
.page_content {
  background: #fff;
  padding: 10px;
}
</style>

<template>
  <div class="page_content">
    <!--这里完整展示了Table组件的使用配置-->
    <Table
      refs="table"
      :columns="columns"
      :listUrl="listUrl"
      :sendData="sendData"
      :isShowSetting="isShowSetting"
      :isShowCheckbox="isShowCheckbox"
      :isShowEdit="isShowEdit"
      :isShowheadSearch="isShowheadSearch"
      @on-select="onSelect"
      @on-select-all="onSelectAll"
      @on-select-rows="onSelectRows"
      @on-select-cancel="onSelectCancel"
      @on-row-click="onRowClick"
      @on-row-dbclick="onRowDbclick"
      @on-row-edit="onRowEdit"
      @on-head-click="onHeadClick"
      @on-head-search="onheadSearch"
    ></Table>
  </div>
</template>

<script>
// 这里引入Table组件
const Table = () => import("@/components/common/table/Table.vue");

export default {
  data() {
    return {
      /**公用Table组件所需要的参数 */
      // 表头列数据
      columns: [
        {
          name: "姓名",
          attr: "uname",
          type: "input",
          isheadSearchFlag: false,
          width: 0.2,
          initEvent: (row, index) => {
            console.log("单击某个列字段的数据：", row, index);
          },
          initRender: (row, index) => {
            return true;
          },
          initFormat: (row, index) => {
            return row.uname + "- 格式化后的";
          },
          textAlign: "left" // 默认是“center”，可以设置左中右3个属性
        },
        {
          name: "所属客户",
          attr: "companyName",
          type: "datePicker",
          value: "",
          isheadSearchFlag: false,
          width: 0.1
        },
        {
          name: "联系方式",
          attr: "mobile",
          type: "select",
          isheadSearchFlag: false,
          width: 0.1
        },
        {
          name: "多个字段组合",
          attrGroup: "companyName,mobile", // 由多个字段组合的，配置 attrGroup 属性
          split: "-", //多个组合分割的符号，默认是 "/" (斜杠)
          width: 0.1,
          initRender: (row, index) => {
            return true;
          },
          initEvent: (row, index) => {
            console.log("字段组合带链接点击", row, index);
          },
          attr: [
            {
              name: "所属客户",
              attr: "companyName"
            },
            {
              name: "联系方式",
              attr: "mobile"
            }
          ]
        },
        {
          name: "职位",
          attr: "station",
          width: 0.3
        },
        {
          name: "切换状态",
          width: 0.2,
          attr: [
            {
              name: "状态切换",
              attr: "status",
              initFormat: (row, index) => {
                if (index % 2 == 0) {
                  return "启用";
                } else {
                  return "禁用";
                }
              },
              initRender: (row, index) => {
                return true;
              },
              initEvent: (row, index) => {
                console.log("点击了切换状态数据", row, index);
              }
            }
          ]
        },
        {
          name: "操作",
          width: 0.2,
          attr: [
            {
              name: "编辑",
              attr: "edit",
              initFormat: (row, index) => {
                return '<i class="ivu-icon ivu-icon-ios-build"></i>';
              },
              initRender(row, index) {
                return true;
              },
              initEvent: (row, index) => {
                console.log("点击了编辑", row, index);
              }
            },
            {
              name: "删除",
              attr: "delete",
              initEvent: (row, index) => {
                console.log("点击了删除", row, index);
              }
            }
          ]
        }
      ],
      // 传递参数
      sendData: {},
      isShowCheckbox: true, // 是否展示复选框
      isShowSetting: true, // 是否展示设置字段显示的按钮
      isShowEdit: true, // 是否展示编辑按钮
      isShowheadSearch: true, // 是否显示表头搜索
      listUrl: "requestApi.searchUserInfo" // Table的列表数据请求的地址
    };
  },
  components: {
    Table
  },
  created() {},
  methods: {
    /**
     * 复选框选中单行数据
     * 组件：@on-select="onSelect"
     */
    onSelect(row) {
      console.log("复选框选中单行数据", row);
    },
    /**
     * 复选框选中多行数据
     * 组件：@on-select-rows="onSelectRows"
     */
    onSelectRows(rows) {
      console.log("复选框选中多行数据", rows);
    },
    /**
     * 复选框全选中多行数据
     * 组件：@on-select-all="onSelectAll"
     */
    onSelectAll(rows, index) {
      console.log("复选框全选中多行数据", rows, index);
    },
    /**
     * 复选框取消的单行数据
     * 组件：@on-select-cancel="onSelectCancel"
     */
    onSelectCancel(row, index) {
      console.log("复选框取消的单行数据", row, index);
    },

    /**
     * 点击编辑按钮的行数据
     * 组件：@on-row-edit="onRowEdit"
     */
    onRowEdit(row, index, event) {
      console.log("点击编辑按钮的行数据", row, index, event);
    },
    /**
     * 单击表格行
     * 组件：@on-row-click="onRowClick"
     */
    onRowClick(row, index) {
      console.log("单击选中行的数据", row, index);
    },
    /**
     * 单击表格表头
     * 组件：@on-head-click="onHeadClick"
     */
    onHeadClick(col, index, event) {
      console.log("单击表头的数据", col);
    },

    /**
     * 双击表格行
     * 组件：@on-row-dbclick="onRowDbclick"
     */
    onRowDbclick(row, index) {
      console.log("双击选中行的数据", row, index);
    }
  }
};
</script>
