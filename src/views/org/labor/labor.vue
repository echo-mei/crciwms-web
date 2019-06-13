<style lang='scss'>
@import "./labor.scss";
</style>

<template>
  <div class="labor clearfix">
    <div class="content-box" :class="{'content-style2' : this.treeStyle === 'style2' }">
      <div class="search-box">
        <Form :model="sendData" :label-width="150" inline ref="queryForm" @submit.native.prevent>
          <FormItem label="所属劳务公司" prop="companyName">
            <Input placeholder="请输入所属劳务公司" v-model="sendData.companyName" clearable/>
          </FormItem>
          <FormItem label="统一社会信息代码" prop="corporationCode">
            <Input placeholder="请输入统一社会信息代码" v-model="sendData.corporationCode" clearable/>
          </FormItem>
          <FormItem>
            <Button type="primary" @click="handleSubmit">查询</Button>
            <Button @click="handleReset" style="margin-left:10px;">重置</Button>
          </FormItem>
        </Form>
      </div>
      <div class="setting clearfix">
        <div class="left fl">
          <Button size="small" @click="addCompany" class="icon-btn middle-btn">
            <Icon custom="i-icon icon-add" size="18"/>
            <span>新增</span>
          </Button>
          <!-- <Button size="small" @click="modifyCompany" class="icon-btn middle-btn">
            <Icon custom="i-icon icon-xiugaishuxing" size="18"/>
            <span>修改</span>
          </Button>
          <Button size="small" @click="deleteCompany" class="icon-btn">
            <Icon custom="i-icon icon-shanchuhover" size="18"/>
            <span>删除</span>
          </Button>
          <Button size="small" @click="viewCompany" class="icon-btn middle-btn">
            <Icon custom="i-icon icon-kejian" size="18"/>
            <span>查看</span>
          </Button> -->
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
    <LaborForm
      ref="laborForm"
      :modformValidate="modifyData"
      :viewformValidate="viewData"
      @refreshTable="refreshTable"
      :cpropMaxHeight="cpropMaxHeight"
    />
  </div>
</template>

<script>
const Table = () => import("@/components/table/Table.vue");
const Tree = () => import("@/components/tree/Tree.vue");
const LaborForm = () => import("./laborForm.vue");
import utils from "@/assets/js/utils.js";
import requestApi from "@/assets/js/requestApi.js";
import {} from "jquery";
export default {
  data() {
    return {
      modifyData: {
        companyName: "",
        corporationCode: "",
        responsePerson: "",
        registerPalce: "",
        registerCapital: "",
        establishedDate: "",
        contacts: "",
        mobilePhone: "",
        zipcode: "",
        phone: "",
        email: "",
        address:""
      },
      viewData: {},
      formModalList: [],
      type: 0,
      loading: true,
      // Page页面所需要的数据
      totalRows: 0,
      selectCount: 0,
      ids: [], // 选中的ids
      isShowModal: false,

      // 列表配置start
      propMaxHeight: window.innerHeight - 333, //表格的最大高度,默认600
      cpropMaxHeight: window.innerHeight - 280,
      // 表头列数据
      columns: [
        {
          name: "操作",
          width:0.1,
          attr: [
            {
              name: "修改",
              attr: "edit",
              initFormat: (row, index) => {
                return '<i title="编辑" class="ivu-icon i-icon icon-xiugaishuxing edit"></i>';
              },
              initRender(row, index) {
                return true;
              },
              initEvent: (row, index) => {
                this.$axios
                  .get(requestApi.getCompany + "/" + row.companyOid)
                  .then(({ result }) => {
                    this.modifyData = result;
                    this.$nextTick(() => {
                      this.$refs.laborForm.openModmodal();
                    });
                  });
              }
            },
            {
              name: "删除",
              attr: "delete",
              initFormat: (row, index) => {
                return '<i title="删除" class="ivu-icon i-icon icon-shanchuhover delete"></i>';
              },
              initRender: (row, index) => {
                return true;
              },
              initEvent: (row, index) => {
                this.$Modal.confirm({
                  title: "提醒",
                  content: "确认删除？",
                  onOk: () => {
                    this.$axios
                      .delete(
                        requestApi.deleteCompany +
                          "/" +
                          row.companyOid
                      )
                      .then(({ flag }) => {
                        if (flag) {
                          this.$Message.success("删除成功!");
                          this.$refs.table.queryData();
                        } else {
                          // this.$Message.error("删除失败!");
                        }
                      });
                  }
                });
              }
            },
            {
              name: "查看",
              attr: "view",
              initFormat: (row, index) => {
                return '<i title="查看" class="ivu-icon i-icon icon-kejian"></i>';
              },
              initRender(row, index) {
                return true;
              },
              initEvent: (row, index) => {
                this.$axios
                  .get(
                    requestApi.getCompany +
                      "/" +
                      row.companyOid
                  )
                  .then(({ result }) => {
                    this.viewData = result;
                    for (var i in this.viewData) {
                      if (
                        $.trim(this.viewData[i]) === "" ||
                        this.viewData[i] === null
                      ) {
                        this.viewData[i] = "--";
                      }
                    }
                    this.$nextTick(() => {
                      this.$refs.laborForm.openViewmodal();
                    });
                  });
              }
            }
          ]
        },
        {
          name: "劳务公司名称",
          attr: "companyName",
          width: 0.1
        },
        {
          name: "统一社会信用代码",
          attr: "corporationCode",
          width: 0.1
        },
        {
          name: "法定代表人",
          attr: "responsePerson",
          width: 0.1
        },
        {
          name: "注册地址",
          attr: "registerPalce",
          width: 0.1
        },
        {
          name: "注册资本(万)",
          attr: "registerCapital",
          width: 0.1
        },
        {
          name: "成立日期",
          attr: "establishedDate",
          width: 0.1
        },
        {
          name: "联系人",
          attr: "contacts",
          width: 0.1
        },
        {
          name: "固定电话",
          attr: "mobilePhone",
          width: 0.1
        }
      ],
      // 传递参数
      sendData: {
        companyName: "",
        corporationCode: ""
      },
      isShowCheckbox: false, // 是否展示复选框
      isShowSetting: false, // 是否展示设置字段显示的按钮
      isShowEdit: false, // 是否展示编辑按钮
      listUrl: requestApi.listCompanyInfo, // Table的列表数据请求的地址
      // 列表配置end

      inOutModalTitle: "", //模态框的默认title
      departMentSentData: {}, // 用于编辑子组件的参数传递
      treeStyle: "style1" //组织机构的风格，默认展开
    };
  },
  components: {
    Table,
    Tree,
    LaborForm
  },
  computed: {},
  mounted() {
    window.onresize = () => {
      this.propMaxHeight = window.innerHeight - 333;
      this.cpropMaxHeight = window.innerHeight - 280;
    };
  },

  methods: {


    //查询
    handleSubmit() {
      this.$refs.table.queryData();
    },
    //重置
    handleReset() {
      this.$refs.queryForm.resetFields();
      this.$refs.table.queryData();
    },
    //新增公司
    addCompany() {
      this.$refs.laborForm.openAddmodal();
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
    }
  }
};
</script>
