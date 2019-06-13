<style lang="scss" scoped>
@import "./wagePlan.scss";
</style>

<template>
  <div class="wageList clearfix">
    <div class="content-box">
      <div class="search-box">
        <Form :model="sendData" :label-width="100" inline ref="queryForm">
          <FormItem label="架子队名称" prop="unitOid">
            <div class="text-left">
              <Select v-model="sendData.unitOid" style="width:500px" placeholder="请选择架子队">
                <Option
                  v-for="item in orgList"
                  :value="item.unitOid"
                  :label="item.unitName"
                  :key="item.unitOid"
                >{{ item.unitName }}</Option>
              </Select>
            </div>
          </FormItem>
          <FormItem label="申请状态" prop="planStatus">
            <Select v-model="sendData.planStatus" placeholder="请选择申请状态" clearable>
              <Option
                v-for="item in planStatusList"
                :value="item.value"
                :key="item.value"
              >{{ item.label }}</Option>
            </Select>
          </FormItem>
          <FormItem label="创建时间" prop="date">
            <DatePicker
              type="daterange"
              placeholder="请选择创建时间"
              @on-change="changeTime"
              v-model="Time"
              :editable="false"
            ></DatePicker>
          </FormItem>
          <FormItem>
            <Button type="primary" @click="handleSubmit('queryForm')">查询</Button>
            <Button @click="handleReset('queryForm')" style="margin-left:10px;">重置</Button>
          </FormItem>
        </Form>
      </div>
      <div class="setting clearfix">
        <div class="left fl">
          <Button size="small" @click="addPlan()" class="icon-btn middle-btn">
            <Icon custom="i-icon icon-add" size="18"/>
            <span>创建发放计划</span>
          </Button>

          <Button size="small" @click="deletePlan" class="icon-btn">
            <Icon custom="i-icon icon-shanchuhover" size="18"/>
            <span>批量删除</span>
          </Button>
          <Button size="small" @click="downLoadTemplate" class="icon-btn middle-btn">
            <Icon custom="i-icon icon-download-cloud" size="18"/>
            <span>下载工资清单模板</span>
          </Button>

          <!-- <Button size="small" class="icon-btn middle-btn" @click="exportWageBaseConfirmPDF">
            <Icon custom="i-icon icon-shanchuhover" size="18"/>
            <span>生成工资确认表</span>
          </Button>-->

          <Button size="small" class="icon-btn" @click="submitWagePlan">
            <Icon type="ios-send" size="18"/>
            <span>提交发放申请</span>
          </Button>
          <Button size="small" class="icon-btn middle-btn" @click="recallWagePlan">
            <Icon custom="i-icon icon-chexiao" size="18"/>
            <span>撤回发放申请</span>
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

    <Modal v-model="isShowModal" :title="ModalTitle" :width="modalWidth" :mask-closable="false">
      <!-- 新增 or 编辑 -->
      <template v-if="['add', 'edit', 'view'].includes(this.wagePlanSentData.type)">
        <div>
          <addOrUpadta ref="addOrUpdate" :sentData="wagePlanSentData"></addOrUpadta>
        </div>
        <div slot="footer" v-if="this.wagePlanSentData.type === 'view'">
          <Button type="primary" style="width:90px;" @click="handleCancel('addOrUpdate')">关闭</Button>
        </div>
        <div slot="footer" v-else>
          <Button type="primary" style="width:90px;" @click="handleOk">保存</Button>
          <Button type="dashed" style="width:90px;" @click="handleCancel('addOrUpdate')">取消</Button>
        </div>
      </template>
      <!--  文件导入 -->

      <template v-else-if="['import','importPDF'].includes(this.wagePlanSentData.type)">
        <div class="upload-body">
          <!-- 导入工资清单 -->
          <importWageList
            v-if="wagePlanSentData.type !== 'importPDF'"
            :sentData="wagePlanSentData"
            ref="importWageList"
            @on-close-modal="onCloseModal"
          ></importWageList>
          <!-- 导入工资确认表 -->
          <importWagePDF
            v-else
            :sentData="wagePlanSentData"
            ref="importWagePDF"
            @on-close-modal="onCloseModal"
          ></importWagePDF>
        </div>
        <div slot="footer">
          <Button
            type="primary"
            style="width:90px;"
            @click="handlePDF()"
            v-if="wagePlanSentData.type === 'importPDF'"
          >开始上传</Button>
          <Button type="primary" style="width:90px;" @click="handleUpload('uploadForm')" v-else>开始上传</Button>
          <Button type="dashed" style="width:90px;" @click="handleCancel('uploadForm')">取消</Button>
        </div>
      </template>
      <!--  查看附件列表 -->
      <template v-else-if="['pdf'].includes(this.wagePlanSentData.type)">
        <div>
          <wagePDF ref="wagePDF" :sentData="wagePlanSentData"></wagePDF>
        </div>
        <div slot="footer">
          <Button type="primary" style="width:90px;" @click="handleCancel('wagePDF')">关闭</Button>
        </div>
      </template>
      <!-- 生成工资确认表 -->
      <template v-else-if="['created'].includes(this.wagePlanSentData.type)">
        <div>
          <confirmPDF ref="confirmPDF" :sentData="wagePlanSentData" @on-close-modal="onCloseModal"></confirmPDF>
        </div>
        <div slot="footer">
          <Button type="primary" style="width:90px;" @click="handleCreated()">生成</Button>
          <Button type="dashed" style="width:90px;" @click="handleCancel()">关闭</Button>
        </div>
      </template>
    </Modal>
  </div>
</template>

<script>
const Table = () => import("@/components/table/Table.vue");
const addOrUpadta = () => import("@/views/wage/wagePlan/addOrUpdate.vue");
const wagePDF = () => import("@/views/wage/wagePlan/wagePDF.vue");
const importWageList = () => import("@/views/wage/wagePlan/importWageList.vue");
const importWagePDF = () => import("@/views/wage/wagePlan/importWagePDF.vue");
const confirmPDF = () => import("@/views/wage/wagePlan/confirmPDF.vue");

import utils from "@/assets/js/utils.js";
import requestApi from "@/assets/js/requestApi.js";
import {
  addPlan,
  editPlan,
  deletePlan,
  submitWagePlan,
  recallWagePlan
} from "@/api/wage.js";
import { planStatusList } from "@/assets/js/commonJSON.js";
import { getOrgTreeList } from "@/api/org.js";
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
      propMaxHeight: window.innerHeight - 332, //表格的最大高度,默认600
      // 表头列数据
      /**
       * 架子队批次 操作权限
       * 待确认 batchStatus = 1 全部都可以操作；
       * 非待确认 batchStatus = 2/3 非待确认只能看工资确认表
       */

      columns: [
        {
          name: "架子队名称",
          attr: "unitName",
          width: 0.1,
          textAlign: "left",

          initRender(row, index) {
            return true;
          },
          initEvent: (row, index) => {
            this.$router.push({
              name: "wageManage",
              params: {
                id: row.planOid,
                sendData: this.sendData
                }
            });
          },
          initFormat: (row, index) => {
            return (
              '<a class="blue-text" :title="' +
              row.unitName +
              '">' +
              row.unitName +
              "</a>"
            );
          }
        },
        {
          name: "",
          attr: [
            {
              name: "编辑",
              attr: "edit",
              initFormat: (row, index) => {
                if (row.planStatus === "1") {
                  return '<i title="编辑" class="ivu-icon i-icon icon-xiugaishuxing edit"></i>';
                } else {
                  return false;
                }
              },
              initRender(row, index) {
                return true;
              },
              initEvent: (row, index) => {
                if (row.planStatus !== "1") return false;
                if (this.canTodo(row)) this.editPlan(row, index);
              }
            },
            {
              name: "导入工资清单",
              attr: "import",
              initFormat: (row, index) => {
                if (row.planStatus === "1") {
                  return '<i title="导入工资清单" class="ivu-icon ivu-icon-ios-cloud-upload import"></i>';
                } else {
                  return false;
                }
              },
              initRender(row, index) {
                return true;
              },
              initEvent: (row, index) => {
                if (row.planStatus !== "1") return false;
                if (this.canTodo(row)) this.importFile(row, index);
              }
            },
            {
              name: "删除",
              attr: "delete",
              initFormat: (row, index) => {
                if (row.planStatus === "1") {
                  return '<i title="删除" class="ivu-icon i-icon icon-shanchuhover delete"></i>';
                } else {
                  return false;
                }
              },
              initRender(row, index) {
                return true;
              },
              initEvent: (row, index) => {
                if (row.planStatus !== "1") return false;
                if (this.canTodo(row)) {
                  this.deletePlan(row, index, true);
                }
              }
            },
            {
              name: "生成工资确认表",
              attr: "created",
              initFormat: (row, index) => {
                if (row.planStatus === "1") {
                  return '<i title="生成工资确认表" class="ivu-icon i-icon icon-daoru created"></i>';
                } else {
                  return false;
                }
              },
              initRender(row, index) {
                return true;
              },
              initEvent: (row, index) => {
                if (row.planStatus !== "1") return false;
                if (this.canTodo(row))
                  this.exportWageBaseConfirmPDF(row, index);
              }
            },
            {
              name: "上传工资确认扫描件",
              attr: "upload",
              initFormat: (row, index) => {
                if (row.planStatus === "1") {
                  return '<i title="上传工资确认扫描件" class="ivu-icon i-icon  icon-upload-cloud upload"></i>';
                } else {
                  return false;
                }
              },
              initRender(row, index) {
                return true;
              },
              initEvent: (row, index) => {
                if (row.planStatus !== "1") return false;
                if (this.canTodo(row)) this.importFile(row, index, "importPDF");
              }
            },

            {
              name: "查看工资确认表",
              attr: "check",
              initFormat: (row, index) => {
                return '<i title="查看工资确认表" class="ivu-icon i-icon icon-kejian check"></i>';
              },
              initRender(row, index) {
                return true;
              },
              initEvent: (row, index) => {
                this.listWageConfirmPDF(row, index);
              }
            }
          ],
          width: 0.15,
          textAlign: "right", // 默认是“center”，可以设置左中右3个属性
          showMode: "hover" // 默认是show，可以设置成hover，鼠标移入才显示
        },
        {
          name: "发放计划名称",
          attr: "planName",
          width: 0.1,
          textAlign: "left"
        },
        {
          name: "发放计划说明",
          attr: "planDesc",
          width: 0.1,
          textAlign: "left"
        },
        {
          name: "申请状态",
          attr: "planStatus",
          width: 0.06,
          initFormat: (row, index) => {
            const status = this.planStatusList.filter(item => {
              return item.value === row.planStatus;
            });
            const label = status.length ? status[0].label : "未知状态";
            return label;
          }
        },
        {
          name: "创建人",
          attr: "createdByName",
          width: 0.1
        },
        {
          name: "创建时间",
          attr: "createdDate",
          width: 0.06,
          initFormat: (row, index) => {
            return utils.formatDate(row.createdDate, "yyyy-MM-dd");
          }
        }
      ],
      // 传递参数
      sendData: {
        unitName: "",
        planStatus: "",
        beginDate: "",
        endDate: ""
      },
      isShowCheckbox: true, // 是否展示复选框
      isShowSetting: false, // 是否展示设置字段显示的按钮
      isShowEdit: false, // 是否展示编辑按钮
      listUrl: requestApi.wagePlanList, // Table的列表数据请求的地址
      // 列表配置end
      Time: "", //创建时间
      companyList: [], // 劳务公司列表
      ModalTitle: "新增组织机构", //模态框的默认title
      modalWidth: 60,
      planStatusList: planStatusList,
      wagePlanSentData: {}, // 用于编辑子组件的参数传递
      orgList: [], // 架子队列表
      fileName: "",
      uploadData: {
        companyOid: "",
        file: [],
        fileName: "",
        accept: "", // 允许上传的类型
        format: [] // 允许上传的类型
      } //上传文件的data
    };
  },

  components: {
    Table,
    addOrUpadta,
    wagePDF,
    importWageList,
    importWagePDF,
    confirmPDF
  },
  computed: {},
  created() {
    this.sendData.notCompletedFlag = this.$route.params.notCompletedFlag || "";
    let parentSendData = this.$route.params.parentSendData;
    if(parentSendData){
      this.Time = [parentSendData.beginDate,parentSendData.endDate]
      this.sendData = {...this.sendData, ... parentSendData}
    }
    this.initOrgList();
  },
  mounted() {
    window.onresize = () => {
      this.propMaxHeight = window.innerHeight - 332;
    };
  },

  methods: {
    canTodo(row) {
      if (row.planStatus !== "1") {
        this.$Message.error("工资发放计划状态非待确认，不可以维护");
        return false;
      }
      return true;
    },
    // 初始化架子队列表
    initOrgList() {
      getOrgTreeList().then(res => {
        if (res.result) {
          this.orgList = res.result.filter(item => {
            return item.unitType === "3" && item.isAuth;
          });
        }
      });
    },

    handleOk() {
      //每一次提交之前，都看看子组件那里是否已经完成校验；
      var type = this.$refs.addOrUpdate.handleSubmit("formRefs");
      if (type) {
        this.isShowModal = false;
        this.wagePlanSentData.type === "add"
          ? this.ajaxAddPlan()
          : this.ajaxEditPlan();
        this.removeAllData();
      } else {
        this.isShowModal = true;
      }
    },
    handleCancel(name) {
      this.isShowModal = false;
      this.removeAllData(name);
    },
    //查询
    handleSubmit(name) {
      this.$refs.table.queryData(this.sendData);
    },
    //重置
    handleReset(name) {
      this.sendData.beginDate = "";
      this.sendData.endDate = "";
      this.Time = "";
      this.uploadData = {
        companyOid: "",
        file: [],
        fileName: "",
        accept: "", // 允许上传的类型
        format: [] // 允许上传的类型
      };
      this.$refs[name].resetFields();
      this.$refs.table.queryData(this.sendData);
    },

    // 清空父 -> 子的数据，以及子组件的数据
    removeAllData() {
      this.wagePlanSentData = {};
      this.uploadData = {
        companyOid: ""
      };
      if (name === "addOrUpdate") this.$refs[name].handleReset("formRefs");
    },
    //新增
    addPlan() {
      this.isShowModal = true;

      this.$set(this.wagePlanSentData, "type", "add")
      this.ModalTitle = "创建发放计划";
      const data = {
        type: "add"
      };
      this.wagePlanSentData = data;
    },
    ajaxAddPlan() {
      const data = Object.assign({}, this.$refs.addOrUpdate.planData);
      addPlan(data).then(res => {
        this.$Message.success(res.result);
        this.$refs.table.queryData();
      }),
        err => {
          this.$Message.error(err);
        };
    },
    ajaxEditPlan() {
      const data = Object.assign({}, this.$refs.addOrUpdate.planData);
      editPlan(data).then(res => {
        this.$Message.success(res.result);
        this.$refs.table.queryData();
      }),
        err => {
          this.$Message.error(err);
        };
    },
    // 编辑
    editPlan(row, index) {
      this.isShowModal = true;
      this.wagePlanSentData = row;
      this.$set(this.wagePlanSentData, "type", "edit")
      this.ModalTitle = "编辑发放计划";
    },
    /**
     * @param type true表示单个删除
     */
    deletePlan(row, index, type) {
      let data = null;
      if (type) {
        data = row.planOid;
      } else {
        const type = utils.validateIds(this, this.ids);
        if (!type) return false;
        data = this.ids.join(",");
      }
      this.$Modal.confirm({
        title: "确认删除吗？",
        content:
          "删除本工资发放计划会同步删除已导入的工资信息，请确认是否删除。",
        cancelText: "取消",
        onOk: () => {
          deletePlan(data).then(res => {
            this.$refs.table.queryData();
            const message = res.result || res.message;
            this.$Message.success(message);
            this.ids = [];
          }),
            err => {
              this.$Message.error(err);
            };
        }
      });
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
        this.ids.push(v.planOid);
      });
    },
    downLoadTemplate() {
      this.$Message.info("正在下载，请稍候...");
      const url = `${window.location.origin}/wageList.xls`;
      utils.downFile(url);
    },
    downLoadFile(url, data) {
      this.$Message.info("正在下载，请稍候...");
      const token = utils.getItem("TOKEN_KEY");
      url = `${window.location.origin}${url}?Authorization=${token}&${data}`;
      utils.downFile(url);
    },
    // 选择时间查询
    changeTime(data) {
      if (data.length) {
        this.sendData.beginDate = data[0];
        this.sendData.endDate = data[1];
      }
    },

    /**
     * 上传文件相关
     */

    // 打开上传模态框  导入工资清单 和 上传工资确认扫描件 共用一个方法
    importFile(row, index, type) {
      this.isShowModal = true;
      this.wagePlanSentData = row;
      if (type) {
        this.$set(this.wagePlanSentData, "type", type)
      } else {
        this.$set(this.wagePlanSentData, "type", "import")
      }
      this.ModalTitle = "上传文件";
    },

    handlePDF() {
      this.$refs.importWagePDF.handleUpload();
    },

    // 打开上传选择器
    openUploadBox() {
      this.$refs.upload.handleClick();
    },
    onCloseModal() {
      this.isShowModal = false;
      this.$set(this.wagePlanSentData, "type", "")
    },
    // 上传
    handleUpload(name) {
      this.$refs.importWageList.handleUpload();
    },

    // 提交发放申请
    submitWagePlan() {
      const type = utils.validateIds(this, this.ids);
      if (!type) return false;
      const data = this.ids.join(",");
      submitWagePlan(data).then(res => {
        this.$refs.table.queryData();
        if (res) {
          this.$Message.success(res.message);
        }
      });
    },
    // 撤回发放申请
    recallWagePlan() {
      const type = utils.validateIds(this, this.ids);
      if (!type) return false;
      const data = this.ids.join(",");
      recallWagePlan(data).then(res => {
        this.$refs.table.queryData();
        if (res) {
          this.$Message.success(res.message);
        }
      });
    },

    // 生成工资确认表
    exportWageBaseConfirmPDF(row, index) {
      // this.exportWageCompanyList(row.unitOid); // 获取可导出工资确认表的劳务公司清单
      this.isShowModal = true;
      this.wagePlanSentData = row;
      this.$set(this.wagePlanSentData, "type", "created")
      this.uploadData.companyOid = "";
      this.ModalTitle = "生成工资确认表";
    },
    // 请求后台生成工资确认表
    handleCreated(name) {
      this.$refs.confirmPDF.handleCreated();
    },

    // 查看工资确认表附件列表

    listWageConfirmPDF(row, index) {
      this.isShowModal = true;
      this.wagePlanSentData = row;
      this.$set(this.wagePlanSentData, "type", "pdf")
      this.ModalTitle = "附件列表";
    }
  },
  watch: {
    "wagePlanSentData.type"(val) {
      this.modalWidth = val === "pdf" ? 80 : 60;
    }
  }
};
</script>
