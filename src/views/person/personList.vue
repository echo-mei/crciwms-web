<style lang="scss" scoped>
@import "./personList.scss";
</style>
<style lang="scss">
/*消除iview默认样式*/
.notifiy {
  .ivu-badge {
    .ivu-badge-dot {
      box-shadow: none;
    }
  }
}
</style>

<template>
  <div class="personList clearfix">
    <Split v-model="split" class="split-line" :min="minSplit" max="600px">
      <div slot="left" class="demo-split-pane">
        <Tree
          ref="tree"
          class="tree-box left"
          :defaultKey="firstUnitOid"
          @on-change-style="onChangeStyle"
          @on-node-click="onNodeClick"
          @on-first-data="onFirstData"
          :class="{'style2' : this.treeStyle === 'style2' }"
        ></Tree>
      </div>
      <div slot="right" class="demo-split-pane">
        <div class="content-box" :class="{'content-style2' : this.treeStyle === 'style2' }">
          <div class="search-box">
            <Form ref="queryForm" key="searchForm" :model="sendData" :label-width="130" inline>
              <FormItem label="姓名" prop="name">
                <Input clearable placeholder="请输入姓名" v-model="sendData.name"/>
              </FormItem>
              <FormItem label="架子队">
                <Select clearable v-model="sendData.unitOid" :disabled="sendData.unitOid != ''">
                  <Option
                    v-for="item in unitList"
                    :value="item.unitOid"
                    :key="item.unitOid"
                  >{{ item.unitName }}</Option>
                </Select>
              </FormItem>
              <FormItem label="工作班组" prop="deptOid">
                <Select clearable v-model="sendData.deptOid" filterable>
                  <Option value>--请选择--</Option>
                  <Option
                    v-for="item in deptList"
                    :value="item.unitOid"
                    :key="item.unitOid"
                  >{{ item.unitName }}</Option>
                </Select>
              </FormItem>
              <FormItem label="劳务公司" prop="companyOid">
                <Select clearable v-model="sendData.companyOid" filterable>
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
              <div style="display:inline-block;">
                <Button type="primary" @click="handleSubmit('queryForm')">查询</Button>
                <Button @click="handleReset('queryForm')" style="margin-left:10px;">重置</Button>
              </div>
            </Form>
          </div>
          <div class="setting clearfix">
            <div class="left fl">
              <Button size="small" class="icon-btn" @click="addPerson">
                <Icon custom="i-icon icon-add" size="18"/>
                <span>新增</span>
              </Button>
              <Button size="small" class="icon-btn" @click="transferPerson">
                <Icon custom="i-icon icon-daoru" size="18"/>
                <span>调入</span>
              </Button>
              <Button size="small" class="icon-btn" @click="deletePerson">
                <Icon custom="i-icon icon-shanchuhover" size="18"/>
                <span>删除</span>
              </Button>
              <Button size="small" class="icon-btn" @click="uploadExcel">
                <Icon custom="i-icon  icon-upload-cloud" size="18"/>

                <span>批量导入</span>
              </Button>
              <Button size="small" class="icon-btn" @click="downloadExcel">
                <!-- <Icon type="ios-cloud-download-outline" size="18"/> -->
                <Icon custom="i-icon icon-download-cloud" size="18"/>
                <span>下载导入模板</span>
              </Button>
              <!-- <Button size="small" class="icon-btn" @click="createPersonAccount">
            <Icon type="ios-person-outline" size="18"/>
            <span>生成个人账号</span>
              </Button>-->
            </div>
          </div>
          <div class="box">
            <div class="table-box">
              <Table
                ref="table"
                v-if="firstUnitOid"
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

    <personTransfer
      ref="personTransfer"
      v-on:tableSearch="transferClose"
      :sentData="transferPersonData"
      v-if="isShowTransferModal"
    ></personTransfer>

    <Modal v-model="isShowModal" :title="personinfoModal.title" width="1000" :mask-closable="false">
      <div>
        <personAdd ref="personAdd" :sentData="personinfoModal.data" v-if="isShowModal"></personAdd>
      </div>
      <div slot="footer">
        <Button type="primary" style="width:90px;" @click="handleOk">保存</Button>
        <Button type="dashed" style="width:90px;" @click="handleCancel">取消</Button>
      </div>
    </Modal>

    <Modal v-model="isShowUploadModal" :title="uploadData.title" width="800" :mask-closable="false">
      <div class="upload" v-if="isShowUploadModal">
        <div class="tips">
          <div class="header">温馨提示：</div>
          <div class="content">
            <p>
              1、仅能上传
              <span class="blue-text">xls/xlsx</span>文件。
            </p>
            <p>
              2、模板内
              <span class="red-text">红色标注</span>的为必填项
            </p>
          </div>
        </div>
        <div class="upload-box">
          <Form
            ref="upload"
            key="uploadForm"
            :model="uploadData"
            :rules="uploadRuleCustom"
            :label-width="120"
          >
            <FormItem label="所属机构">
              <Select style="width:500px;" v-model="uploadData.unitOid" disabled>
                <Option
                  v-for="item in orgList"
                  :value="item.unitOid"
                  :key="item.unitOid"
                >{{ item.unitName }}</Option>
              </Select>
            </FormItem>
            <FormItem label="所属劳务公司" prop="companyOid">
              <Select
                style="width:500px;"
                v-model="uploadData.companyOid"
                :label-in-value="true"
                clearable
                filterable
              >
                <Option
                  v-for="item in companyList"
                  :value="item.companyOid"
                  :key="item.companyOid"
                >{{ item.companyName }}</Option>
              </Select>
            </FormItem>
            <FormItem label="选择文件">
              <Input style="width:500px;" disabled v-model="uploadData.fileName"/>
              <Button
                type="primary"
                style="width:90px;margin-left:10px;"
                @click.stop="openUploadBox"
              >浏览</Button>
            </FormItem>
          </Form>
        </div>
        <Upload
          ref="uploadBox"
          accept=".xls, .xlsx"
          :show-upload-list="false"
          :format="['xls','xlsx']"
          action="//jsonplaceholder.typicode.com/posts/"
          :before-upload="handleBeforeUpload"
        ></Upload>
      </div>
      <div slot="footer">
        <Button type="primary" style="width:90px;" @click="upload">上传</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
const Table = () => import("@/components/table/Table.vue");
const Tree = () => import("@/components/tree/Tree.vue");
const personAdd = () => import("@/views/person/personAdd/personAdd.vue");
const personTransfer = () =>
  import("@/views/person/personAdd/personTransfer.vue");
import eventBus from "@/views/person/eventbus.js";

import utils from "@/assets/js/utils.js";
import requestApi from "@/assets/js/requestApi.js";
import {
  getUnitList,
  getDeptList,
  deletePerson,
  addPerson,
  uploadPerson,
  personAccount,
  accountNoCheck
} from "@/api/person";
import { listCompany } from "@/api/company";

export default {
  name: "personList",
  data() {
    return {
      split: 0.2, // 分割线
      // unit: "", //选中的组织机构
      firstUnitOid: 0, //默认点击的树节点
      unitList: [], //架子队数组
      deptList: [], //班组数组
      companyList: [], //劳务公司数组
      selectRow: {}, //列表选中的数据
      // Page页面所需要的数据
      totalRows: 0,
      selectCount: 0,
      ids: [], // 选中的ids

      // 列表配置start
      propMaxHeight: window.innerHeight - 376, //表格的最大高度,默认600
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
                // this.$router.push({
                //   path: `/person/${row.personOid}`
                // });
                this.$router.push({
                  name: "personView",
                  params: { id: row.personOid, searchData: this.sendData }
                });
              }
            }
          ],
          isheadSearchFlag: false,
          width: 0.06,
          textAlign: "center" // 默认是“center”，可以设置左中右3个属性
        },
        {
          name: "序号",
          width: 0.06,
          initFormat: (row, index) => {
            return ++index;
          }
        },
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
          name: "手机号",
          attr: "phone",
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
        unitOid: "",
        deptOid: "",
        companyOid: "",
        personStatus: "",
        notCompletedFlag: ""
      },
      isShowCheckbox: true, // 是否展示复选框
      isShowSetting: false, // 是否展示设置字段显示的按钮
      isShowEdit: false, // 是否展示编辑按钮
      listUrl: requestApi.personList, // Table的列表数据请求的地址
      // 列表配置end

      isShowModal: false,
      personinfoModal: { title: "", data: {} }, //新增模态框的数据
      treeStyle: "style1", //组织机构的风格，默认展开

      isShowUploadModal: false, //显示上传人员的模态框
      isShowTransferModal: false, //显示调入人员的模态框
      transferPersonData: {}, //调入人员传入的数据
      orgList: [], //导入时所属机构列表
      uploadData: {
        title: "批量导入",
        file: null,
        fileName: "",
        unitOid: "",
        companyOid: ""
      },
      uploadRuleCustom: {
        companyOid: [
          {
            required: true,
            message: "劳务公司不能为空！",
            trigger: "change",
            type: "number"
          }
        ]
      }
    };
  },

  components: {
    Table,
    Tree,
    personAdd,
    personTransfer
  },
  created() {
    // if (
    //   this.$route.params.notCompletedFlag ||
    //   this.$route.params.personStatus
    // ) {
    //   this.handleReset("queryForm");
      this.sendData.notCompletedFlag =
        this.$route.params.notCompletedFlag || "";
      this.sendData.personStatus = this.$route.params.personStatus || "";
    // }
    //根据key名获取传递回来的参数，data就是map
    eventBus.$on("searchData", data => {
      this.sendData = Object.assign({}, this.sendData, data);
    });
    this.getCompanyList();
  },
  beforeDestroy() {
    eventBus.$off("searchData");
  },
  mounted() {
    window.onresize = () => {
      this.propMaxHeight = window.innerHeight - 376;
    };
  },
  computed: {
    minSplit() {
      return this.treeStyle === "style2" ? "80px" : "200px";
    }
  },
  methods: {
    getUnitList(unitOid) {
      return new Promise((resolve, reject) => {
        getUnitList(unitOid).then(res => {
          this.unitList = res;
          resolve();
        }),
          err => {
            this.$Message.error(err);
            reject();
          };
      });
    },
    getDeptList(unitOid) {
      return new Promise((resolve, reject) => {
        getDeptList(unitOid).then(res => {
          this.deptList = res;
          resolve();
        }),
          err => {
            this.$Message.error(err);
            reject();
          };
      });
    },
    getCompanyList() {
      listCompany().then(res => {
        this.companyList = res.result.list;
      });
    },
    onChangeStyle(style) {
      this.treeStyle = style;
      this.split = style === "style2" ? 80 / window.innerWidth : 0.2;// 分割线
    },
    //查询表格数据
    search() {
      this.$refs.table.queryData();
    },
    // tree渲染的数据
    onFirstData(data) {
      // 左侧架构树默认选择第一个架子队
      let unitData = this.findFirstUnit(data);
      this.firstUnitOid = unitData.unitOid;
      this.sendData.unitOid = unitData.unitOid;
      // this.sendData.unitName = unitData.unitName;
      this.unitList.push(unitData);
      this.getDeptList(unitData.unitOid);
    },
    findFirstUnit(data) {
      for (let i = 0; i < data.length; i++) {
        if (data[i].unitType === "3") {
          return data[i];
        } else {
          return this.findFirstUnit(data[i].children);
        }
      }
    },
    onNodeClick(data) {
      // this.unit = data;
      if (data.unitType === "3") {
        //点击架子队
        this.getUnitList(data.unitOid).then(res => {
          this.sendData.unitOid = data.unitOid;
          this.getDeptList(data.unitOid).then(res => {
            this.sendData.deptOid = "";
            this.search();
          });
        });
      } else if (data.unitType === "4") {
        //点击班组
        this.getUnitList(data.parentUnitOid).then(res => {
          this.sendData.unitOid = data.parentUnitOid;
          this.getDeptList(data.parentUnitOid).then(res => {
            this.sendData.deptOid = data.unitOid;
            this.search();
          });
        });
      }
    },
    handleOk() {
      //每一次提交之前，都看看子组件那里是否已经完成校验；
      this.$refs.personAdd.handleSubmit().then(res => {
        if (res) {
          this.isShowModal = false;
          this.ajaxAddPerson();
          this.removeAllData();
        } else {
          this.isShowModal = true;
        }
      });
    },
    handleCancel() {
      this.isShowModal = false;
      this.removeAllData();
    },
    ajaxAddPerson() {
      const data = Object.assign({}, this.$refs.personAdd.personData);
      addPerson(data).then(res => {
        if (res) {
          this.$Message.success({
            content: res.result,
            duration: 3
          });
          this.search();
        }
      });
    },
    // 清空父 -> 子的数据，以及子组件的数据
    removeAllData() {
      this.personinfoModal.data = {};
      this.$refs.personAdd.handleReset();
    },
    //查询
    handleSubmit(name) {
      this.search();
    },
    //重置查询栏
    handleReset(name) {
      this.$refs[name].resetFields();
    },
    /**
     * 单选复选框选中数据
     */
    onSelectRows(rows) {
      this.selectCount = rows.length;
      this.selectRow = rows[0];
      this.ids = []; // 每次获得都需要清空一下上次选择的删除数据
      rows.forEach((v, i) => {
        this.ids.push(v.personOid);
      });
    },
    // 新增
    addPerson() {
      this.isShowModal = true;
      this.personinfoModal.title = "新增人员";
      this.personinfoModal.data.unitOid = this.sendData.unitOid;
      this.personinfoModal.data.deptOid = this.sendData.deptOid;
    },
    //调入
    transferPerson() {
      this.isShowTransferModal = true;
      this.transferPersonData.unitOid = this.sendData.unitOid;
      this.transferPersonData.showModal = this.isShowTransferModal;
    },
    //调入的模态框关闭时，刷新人员列表
    transferClose() {
      this.search();
      this.isShowTransferModal = false;
    },
    // 删除
    deletePerson() {
      if (!this.ids.length) {
        this.$Message.error({
          content: "请选择要删除的记录",
          duration: 2
        });
        return false;
      }
      const data = this.ids.join(",");
      this.$Modal.confirm({
        title: "确认删除吗？",
        cancelText: "取消",
        onOk: () => {
          deletePerson(data).then(res => {
            if (res) {
              this.$Message.success({
                content: res.result,
                duration: 3
              });
              this.search();
            }
          });
        }
      });
    },
    // 下载导入模板
    downloadExcel() {
      let url = window.location.origin + "/" + "persons.xls";
      utils.downFile(url);
    },
    //批量导入
    uploadExcel() {
      this.isShowUploadModal = true;
      if (this.sendData.deptOid) {
        this.orgList = this.deptList;
        this.uploadData.unitOid = this.sendData.deptOid;
      } else {
        this.orgList = this.unitList;
        this.uploadData.unitOid = this.sendData.unitOid;
      }
      this.uploadData.file = null;
      this.uploadData.fileName = "";
      this.uploadData.companyOid = "";
      this.getCompanyList();
    },
    // 打开上传选择器
    openUploadBox() {
      this.$refs.uploadBox.handleClick();
    },
    handleBeforeUpload(file) {
      this.uploadData.fileName = file.name;
      this.uploadData.file = file;
      return false;
    },
    upload() {
      this.$refs.upload.validate(valid => {
        if (valid) {
          const formData = new FormData();
          formData.append(
            "file",
            this.uploadData.file,
            this.uploadData.fileName
          );
          formData.append("unitOid", this.uploadData.unitOid);
          formData.append("companyOid", this.uploadData.companyOid);
          uploadPerson(formData).then(res => {
            const messageList = res.result;
            if (messageList) {
              let content = "<div class='upload-tips high'>";
              messageList.forEach(item => {
                content += "<p>" + item + "</p>";
              });
              content += "</div>";
              this.$Modal.warning({
                title: "导入失败",
                width: "600px",
                content: content
              });
            } else {
              this.$Message.success({
                content: res.message,
                duration: 3
              });
              this.search();
            }
            this.isShowUploadModal = false;
          });
        }
        return valid;
      });
    }
  } /* ,
  activated: function() {
    this.propMaxHeight = window.innerHeight - 376;
    if (
      this.$route.params.notCompletedFlag ||
      this.$route.params.personStatus
    ) {
      this.handleReset("queryForm");
      this.sendData.notCompletedFlag =
        this.$route.params.notCompletedFlag || "";
      this.sendData.personStatus = this.$route.params.personStatus || "";
    }
    window.onresize = () => {
      this.propMaxHeight = window.innerHeight - 376;
    };
    if (this.$refs["table"]) {
      this.search();
    }
  } */
};
</script>
