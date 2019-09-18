<style lang="scss" scoped>
@import "./index.scss";
</style>

<template>
  <div class="wageManage clearfix">
    <div class="content-box">
      <div class="search-box">
        <Form :model="sendData" :label-width="130" inline ref="queryForm">
          <FormItem label="姓名" prop="name">
            <Input placeholder="请输入姓名" v-model="sendData.name" clearable></Input>
          </FormItem>
          <FormItem label="性别" prop="sexCode">
            <Select clearable v-model="sendData.sexCode">
              <Option value="1">男</Option>
              <Option value="2">女</Option>
            </Select>
          </FormItem>
          <FormItem label="民族" prop="nationCode">
            <Select clearable v-model="sendData.nationCode" filterable>
              <Option
                v-for="item in nationList"
                :value="item.dicItemCode"
                :key="item.dicItemCode"
              >{{ item.dicItemName }}</Option>
            </Select>
          </FormItem>
          <FormItem label="年龄范围">
            <Row>
              <Col span="11">
                <Input v-model="sendData.minAge" placeholder="最小年龄" number clearable></Input>
              </Col>
              <Col span="2" style="text-align: center">~</Col>
              <Col span="11">
                <Input v-model="sendData.maxAge" placeholder="最大年龄" number clearable></Input>
              </Col>
            </Row>
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
            <Select v-model="sendData.unitOid" placeholder="请选择所属架子队" clearable filterable>
              <Option
                v-for="item in unitList"
                :value="item.unitOid"
                :key="item.unitOid"
              >{{ item.unitName }}</Option>
            </Select>
          </FormItem>
          <FormItem label="工作班组" prop="deptOid">
            <Select v-model="sendData.deptOid" placeholder="请选择所属工作班组" clearable filterable>
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
          <FormItem label="在场状态" prop="personStatus">
            <Select clearable v-model="sendData.personStatus">
              <Option value="1">已进场</Option>
              <Option value="2">已退场</Option>
            </Select>
          </FormItem>
          <FormItem label="证照合同不全标识" prop="notCompletedFlag">
            <Select clearable v-model="sendData.notCompletedFlag">
              <Option value="1">证照不全</Option>
              <Option value="2">合同不全</Option>
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
          <Button size="small" @click="exportPerson" class="icon-btn middle-btn">
            <Icon type="ivu-icon i-icon icon-daochu1" size="18"/>
            <span>导出人员名册</span>
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
import { listCompany } from "@/api/company.js";
import { getOrgTreeList } from "@/api/org.js";
import { getDicItemList, exportPersons } from "@/api/person";
import { saveAs } from "file-saver";
import { mapMutations } from "vuex";

import {} from "jquery";
export default {
  data() {
    return {
      companyList: [], // 劳务公司列表
      depList: [], // 工作班组
      unitList: [], // 架子队列表
      parentUnitList: [], // 项目部列表
      nationList: [], //民族列表
      // Page页面所需要的数据
      totalRows: 0,
      selectData: {},
      ids: [], // 选中的ids
      isShowModal: false, // 新增编辑模态框
      isShowUpload: false, // 上传附件模态框
      // 列表配置start
      propMaxHeight: window.innerHeight - 420, //表格的最大高度,默认600
      // 表头列数据
      columns: [
        {
          name: "操作",
          attr: [
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
                this.setPersonSearchData([
                  {
                    id: 1,
                    type: "baseinfo",
                    name: "基本信息",
                    icon: "md-document",
                    canEdit: false
                  }
                ]);
                this.$router.push({
                  path: `/person/${row.personOid}`
                });
                // this.$router.push({
                //   path: `/person/${row.personOid}`,
                //   query: {
                //     showMenuList: JSON.stringify([
                //       {
                //         id: 1,
                //         type: "baseinfo",
                //         name: "基本信息",
                //         icon: "md-document",
                //         canEdit: false
                //       }
                //     ])
                //   }
                // });
              }
            }
          ],
          isheadSearchFlag: false,
          width: 0.05,
          textAlign: "center" // 默认是“center”，可以设置左中右3个属性
        },
        {
          name: "姓名",
          attr: "name",
          width: 0.1
        },
        {
          name: "性别",
          attr: "sexCode",
          width: 0.1,
          initFormat: (row, index) => {
            switch (row.sexCode) {
              case "1":
                return "男";
                break;
              case "2":
                return "女";
                break;
            }
          }
        },
        {
          name: "身份证号",
          attr: "idNo",
          width: 0.1
        },
        {
          name: "手机号",
          attr: "phone",
          width: 0.1
        },
        {
          name: "民族",
          attr: "nationCode",
          width: 0.1,
          initFormat: (row, index) => {
            const nation = this.nationList.find(
              item => item.dicItemCode == row.nationCode
            );
            return nation ? nation.dicItemName : "--";
          }
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
          name: "劳务公司",
          attr: "companyName",
          width: 0.1
        },
        {
          name: "在场状态",
          attr: "personStatus",
          width: 0.1,
          initFormat: (row, index) => {
            switch (row.personStatus) {
              case "1":
                return "已进场";
                break;
              case "2":
                return "<span style='color:red;'>已退场</span>";
                break;
            }
          }
        }
      ],
      // 传递参数
      sendData: {
        name: "",
        sexCode: "",
        nationCode: "",
        minAge: "",
        maxAge: "",
        parentUnitOid: "",
        unitOid: "",
        deptOid: "",
        companyOid: "",
        personStatus: ""
      },
      isShowCheckbox: false, // 是否展示复选框
      isShowSetting: false, // 是否展示设置字段显示的按钮
      isShowEdit: false, // 是否展示编辑按钮
      listUrl: requestApi.personList, // Table的列表数据请求的地址
      // 列表配置end
      ruleCustom: {
        minAge: [
          {
            message: "仅能输入数字！",
            trigger: "blur"
          }
        ],
        maxAge: [
          {
            message: "仅能输入数字！",
            trigger: "blur"
          }
        ]
      }
    };
  },

  components: {
    Table
  },
  computed: {},
  created() {
    this.sendData.planOid = this.$route.params.id;
    this.initCompanyList();
    this.initOrgList();
    this.initNationList();
  },
  mounted() {
    window.onresize = () => {
      this.propMaxHeight = window.innerHeight - 420;
    };
  },
  methods: {
    ...mapMutations([
      // `mapMutations` 也支持载荷：
      "setPersonSearchData" // 将 `this.incrementBy(amount)` 映射为 `this.$store.commit('incrementBy', amount)`
    ]),
    initCompanyList() {
      listCompany().then(res => {
        this.companyList = res.result.list;
      });
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
          });
        }
      });
    },
    initNationList() {
      // 获取民族数据
      getDicItemList("JDRS0003").then(res => {
        this.nationList = res.result;
      }),
        err => {
          this.$Message.error(err);
        };
    },
    onFirstData(data) {
      console.log(data);
    },
    exportPerson() {
      exportPersons(this.sendData).then(res => {
        if (res["message"]) {
          this.$Message.error({
            content: res["message"],
            duration: 2
          });
        } else {
          saveAs(res, "personsExcel.xls");
        }
      });
    },
    //查询
    handleSubmit(name) {
      let reg = /^\d+$/;

      if (
        (this.sendData.minAge && !reg.test(this.sendData.minAge)) ||
        (this.sendData.maxAge && !reg.test(this.sendData.maxAge))
      ) {
        this.$Message.error({
          content: "年龄范围仅能输入数字",
          duration: 2
        });
      } else if (this.sendData.minAge > this.sendData.maxAge) {
        this.$Message.error({
          content: "年龄范围输入错误，最小年龄不能大于最大年龄",
          duration: 2
        });
      } else {
        this.$refs.table.queryData(this.sendData);
      }
    },
    //重置
    handleReset(name) {
      this.sendData.minAge = "";
      this.sendData.maxAge = "";
      this.$refs[name].resetFields();
      this.$refs.table.queryData(this.sendData);
    }
  }
};
</script>
