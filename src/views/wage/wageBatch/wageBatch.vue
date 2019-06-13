<style lang="scss" scoped>
@import "./wageBatch.scss";
</style>
<style lang="scss">
.wageBatch {
  .table-box {
    .common_table {
      tbody {
        .warning-row {
          background: #f56c6c;
          // background: #E6A23C;
          color: #fff;
          .td_container {
            a {
              color: #fff;
            }
            .blue-text {
              color: #39f;
            }
          }
        }
      }
    }
  }
}
</style>

<style>
.wage-batch-modal .ivu-modal-body {
  max-height: 60vh;
  overflow: auto;
}
</style>



<template>
  <div class="wageBatch clearfix">
    <div class="content-box">
      <div class="search-box">
        <Form :model="sendData" :label-width="100" inline ref="queryForm">
          <FormItem label="项目部名称：" prop="unitOid">
            <div class="text-left">
              <Select v-model="sendData.unitOid" style="width:500px" placeholder="请选择项目部">
                <Option
                  v-for="item in orgList"
                  :value="item.unitOid"
                  :label="item.unitName"
                  :key="item.unitOid"
                >{{ item.unitName }}</Option>
              </Select>
            </div>
          </FormItem>
          <FormItem label="批次状态" prop="batchStatus">
            <Select v-model="sendData.batchStatus" placeholder="请选择批次状态" clearable>
              <Option
                v-for="item in batchStatusList"
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
          <Button size="small" @click="addBatch()" class="icon-btn">
            <Icon custom="i-icon icon-add" size="18"/>
            <span>创建批次</span>
          </Button>
          <!-- <Button size="small" @click="editBatch" class="icon-btn middle-btn">
            <Icon custom="i-icon icon-xiugaishuxing" size="18"/>
            <span>编辑</span>
          </Button>-->
          <Button size="small" @click="deleteBatch" class="icon-btn middle-btn">
            <Icon custom="i-icon icon-shanchuhover" size="18"/>
            <span>批量删除</span>
          </Button>
          <!-- <Button size="small" @click="listWagePlanByBatchOid" class="icon-btn middle-btn">
            <Icon custom="i-icon icon-shanchuhove" size="18"/>
            <span>添加或移除工资发放计划</span>
          </Button>-->

          <Button size="small" class="icon-btn" @click="confirmWageBatch">
            <Icon type="ios-send" size="18"/>
            <span>确认发放工资</span>
          </Button>

          <Button size="small" class="icon-btn middle-btn" @click="cancelWageBatch">
            <Icon custom="i-icon icon-chexiao" size="18"/>
            <span>取消确认</span>
          </Button>

          <Button size="small" class="icon-btn" @click="completedWageBatch">
            <Icon type="md-checkmark-circle-outline" size="18"/>
            <span>完成发放</span>
          </Button>
          <!-- <Button size="small" class="icon-btn" @click="uploadBankBill">
            <Icon custom="i-icon icon-shanchuhover" size="18"/>
            <span>上传银行回执</span>
          </Button>-->
          <!-- <Button size="small" class="icon-btn middle-btn" @click="downloadBankBill">
            <Icon custom="i-icon icon-download-cloud" size="18"/>
            <span>下载银行回执</span>
          </Button>-->
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
            :row-class-name="tableRowClassName"
          ></Table>
        </div>
      </div>
    </div>

    <Modal
      v-model="isShowModal"
      :title="ModalTitle"
      :width="modalWidth"
      :mask-closable="false"
      class="wage-batch-modal"
      @on-cancel="handleCancel"
    >
      <template v-if="['add','edit','view'].includes(this.wageBatchSentData.type) ">
        <div>
          <addOrUpadta ref="addOrUpdate" :sentData="wageBatchSentData" v-if="isShowModal"></addOrUpadta>
        </div>
        <div slot="footer" v-if="this.wageBatchSentData.type === 'view'">
          <Button type="primary" style="width:90px;" @click="handleCancel">关闭</Button>
        </div>
        <div slot="footer" v-else>
          <Button type="primary" style="width:90px;" @click="handleOk">保存</Button>
          <Button type="dashed" style="width:90px;" @click="handleCancel">取消</Button>
        </div>
      </template>
      <template
        v-else-if="['application','checkApplication'].includes(this.wageBatchSentData.type) "
      >
        <div>
          <application :sentData="wageBatchSentData" v-if="isShowModal"></application>
        </div>
        <div slot="footer">
          <Button type="primary" style="width:90px;" @click="handleCancel('app')">关闭</Button>
        </div>
      </template>
      <template v-else-if="['bankPDF'].includes(this.wageBatchSentData.type) ">
        <bankPDF :sentData="wageBatchSentData" v-if="isShowModal" ref="bankPDF"></bankPDF>
        <div slot="footer">
          <Button type="primary" style="width:90px;" @click="handleCancel('pdf')">关闭</Button>
          <Button  style="width:90px;" @click="handleDownLoad('pdf')">下载PDF</Button>
        </div>
      </template>
      <template v-else class="upload-body">
        <div class="tips">
          <div class="header">温馨提示：</div>
          <div class="content">
            <p>
              1、仅能上传
              <span class="blue-text">PDF</span>文件，大小
              <span class="blue-text">10MB</span>内。
            </p>
            <p>
              2、如已上传过银行回执单，本次上传将会
              <span class="red-text">覆盖</span>之前上传过的银行回执单附件，请确认是否上传。
            </p>
          </div>
        </div>
        <div class="upload-box">
          <span class="upload-input-label">选择文件：</span>
          <Input class="upload-input" disabled v-model="uploadData.fileName"/>
          <Button type="primary" style="width:90px;" @click.stop="openUploadBox">浏览</Button>
          <!-- <div @click.stop="openUploadBox">
            <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
            <p v-if="uploadData.fileName">{{ uploadData.fileName }}</p>
            <p v-else>上传文件</p>
          </div>-->
        </div>
        <div slot="footer">
          <Button type="primary" style="width:90px;" @click="handleUpload('uploadForm')">开始上传</Button>
          <Button type="dashed" style="width:90px;" @click="handleCancel('uploadForm')">取消</Button>
        </div>
      </template>

      <Upload
        ref="upload"
        :show-upload-list="false"
        :accept="uploadData.accept"
        :max-size="uploadData.maxSize"
        :before-upload="uploadBefore"
        :multiple="uploadData.multiple"
        action="//jsonplaceholder.typicode.com/posts/"
        style="display: inline-block;"
      ></Upload>
    </Modal>
  </div>
</template>

<script>
const Table = () => import("@/components/table/Table.vue");
const addOrUpadta = () => import("@/views/wage/wageBatch/addOrUpdate.vue");
const application = () => import("@/views/wage/wageBatch/application.vue");
const bankPDF = () => import("@/views/wage/wageBatch/bankPDF.vue");

import utils from "@/assets/js/utils.js";
import requestApi from "@/assets/js/requestApi.js";
import { addBatch, editBatch, deleteBatch, exportWageExcel, confirmWageBatch, cancelWageBatch, completedWageBatch, listWagePlanByBatchOid, downloadBankBill, uploadBankBill } from "@/api/wage.js";
import { statusList } from "@/assets/js/commonJSON.js";
import { getOrgTreeList } from "@/api/org.js";

import { } from "jquery";
export default {
  data() {
    return {
      // Page页面所需要的数据
      totalRows: 0,
      selectData: {},
      ids: [], // 选中的ids
      isShowModal: false,

      // 列表配置start
      propMaxHeight: window.innerHeight - 332, //表格的最大高度,默认600
      // 表头列数据

      /**
       * 项目部批次 操作权限
       * 待确认 batchStatus = 1 可以操作修改、删除、添加移出计划；
       * 已确认 batchStatus = 2 可以操作生成银行工资表和上传回执单；
       * 已上传回执单  查看、下载回执单；
       *
       */
      columns: [

        {
          name: "项目部名称",
          attr: "unitName",
          width: 0.1,
          textAlign: "left"
        },
        {
          name: "",
          attr: [{
            name: "编辑",
            attr: "edit",
            initFormat: (row, index) => {
              if (row.batchStatus === "1") {
                return '<i title="编辑" class="ivu-icon i-icon icon-xiugaishuxing edit"></i>'
              } else {
                return false;
              }
            },
            initRender(row, index) {
              return true;
            },
            initEvent: (row, index) => {
              if (row.batchStatus !== "1")
                return false
              if (this.canTodo(row, "1")) {
                this.editBatch(row, index);
              }
            }
          },
          {
            name: "添加或移除工资发放计划",
            attr: "add",
            initFormat: (row, index) => {
              if (row.batchStatus === "1") {
                return '<i title="添加或移除工资发放计划" class="ivu-icon i-icon icon-add add"></i>'
              } else {
                return false;
              }

            },
            initRender(row, index) {
              return true;
            },
            initEvent: (row, index) => {
              if (row.batchStatus !== "1")
                return false
              if (this.canTodo(row, "1")) {
                this.listWagePlanByBatchOid(row, index);
              }
            }
          },
          {
            name: "删除",
            attr: "delete",
            initFormat: (row, index) => {

              if (row.batchStatus === "1") {
                return '<i title="删除" class="ivu-icon i-icon icon-shanchuhover delete"></i>'
              } else {
                return false;
              }

            },
            initRender(row, index) {
              return true;
            },
            initEvent: (row, index) => {
              if (row.batchStatus !== "1")
                return false
              if (this.canTodo(row, "1")) {
                this.deleteBatch(row, index, true)
              }
            }
          },
          {
            name: "生成银行发放工资表",
            attr: "created",
            initFormat: (row, index) => {
              if (row.batchStatus === "2") {
                return '<i title="生成银行发放工资表" class="ivu-icon i-icon icon-download-cloud created"></i>'
              } else {
                return false;
              }
            },
            initRender(row, index) {
              return true;
            },
            initEvent: (row, index) => {
              if (row.batchStatus !== "2")
                return false
              if (this.canTodo(row, "2")) {
                this.exportWageExcel(row, index)
              }

            }
          },
          {
            name: "上传银行回执",
            attr: "import",
            initFormat: (row, index) => {
              if (row.batchStatus === "2") {
                return '<i title="上传银行回执" class="ivu-icon i-icon icon-upload-cloud import"></i>'
              } else {
                return false;
              }

            },
            initRender(row, index) {
              return true;
            },
            initEvent: (row, index) => {
              if (row.batchStatus !== "2")
                return false
              if (this.canTodo(row, "2")) {
                this.importFile(row, index)
              }
            }

          },
          {
            name: "查看银行回执",
            attr: "check",
            initFormat: (row, index) => {
              if (row.batchPath)
                return '<i title="查看银行回执" class="ivu-icon i-icon icon-kejian check"></i>'
              else {
                return false;
              }
            },
            initRender(row, index) {
              return true;
            },
            initEvent: (row, index) => {
              if (row.batchPath) {
                this.checkBankPDF(row, index)
              } else {
                return false
              }
            }

          },


          ],
          width: 0.06,
          textAlign: "right", // 默认是“center”，可以设置左中右3个属性
          showMode: "hover",// 默认是show，可以设置成hover，鼠标移入才显示
        },
        {
          name: "批次名称",
          attr: "batchName",
          width: 0.1,
          textAlign: "left"
        },
        {
          name: "批次说明",
          attr: "batchDesc",
          width: 0.1,
          textAlign: "left"
        },
        {
          name: "已添加计划数",
          attr: "planCount",
          width: 0.06,
          textAlign: "center",
          initFormat: (row, index) => {
            return row.planCount === 0 ? row.planCount : '<a class="blue-text" :title="' + row.planCount + '">' + row.planCount + "</a>"
          },
          initRender(row, index) {
            return true;
          },
          initEvent: (row, index) => {
            if (row.planCount === 0) return false;
            this.checkWagePlanByBatchOid(row, index);
          }
        },
        {
          name: "批次状态",
          attr: "batchStatus",
          width: 0.06,
          initFormat: (row, index) => {
            const status = this.batchStatusList.filter(item => {
              return item.value === row.batchStatus;
            })
            let label = status.length ? status[0].label : "未知状态";
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

            return utils.formatDate(row.createdDate, 'yyyy-MM-dd')
          }
        }
      ],
      // 传递参数
      sendData: {
        unitOid: "",
        batchStatus: "",
        beginDate: "",
        endDate: "",
      },
      isShowCheckbox: true, // 是否展示复选框
      isShowSetting: false, // 是否展示设置字段显示的按钮
      isShowEdit: false, // 是否展示编辑按钮
      listUrl: requestApi.wageBatchList, // Table的列表数据请求的地址
      // 列表配置end
      Time: "", //创建时间
      batchStatusList: statusList,
      ModalTitle: "新增组织架构", //模态框的默认title
      modalWidth: 60, // 模态框宽度
      wageBatchSentData: {}, // 用于编辑子组件的参数传递
      orgList: [], // 项目部列表
      fileName: "",
      uploadData: {
        file: null,
        fileName: "",
      }, //上传文件的data
    };
  },

  components: {
    Table,
    addOrUpadta,
    application,
    bankPDF
  },
  computed: {

  },
  created() {
    this.sendData.notCompletedFlag = this.$route.params.notCompletedFlag || "";
    this.initOrgList();
  },
  mounted() {
    window.onresize = () => {
      this.propMaxHeight = window.innerHeight - 332;
    };
  },

  methods: {
    tableRowClassName({ row, rowIndex }) {
      if (row.batchStatus === "1" || row.batchStatus === "2") {
        return 'warning-row';
      }
      return '';
    },
    canTodo(row, status, msg = '工资发放计划状态非待确认，不可以维护') {
      if (row.batchStatus !== status) {
        this.$Message.error(msg);
        return false;
      }
      return true;
    },

    // 初始化项目部列表
    initOrgList() {
      getOrgTreeList().then(res => {
        if (res.result) {
          this.orgList = res.result.filter(item => {
            // 项目部 1 和 项目分部 2 都可以添加批次
            return (item.unitType === "1" && item.isAuth) || (item.unitType === "2" && item.isAuth);
          })
        }
      })
    },
    handleOk() {
      //每一次提交之前，都看看子组件那里是否已经完成校验；
      var type = this.$refs.addOrUpdate.handleSubmit("formRefs");
      if (type) {
        this.isShowModal = false;

        this.wageBatchSentData.type === "add"
          ? this.ajaxAddBatch()
          : this.ajaxEditBatch();
        this.removeAllData();
      } else {
        this.isShowModal = true;
      }
    },
    handleCancel(type) {
      this.isShowModal = false;
      if (type === "app") {
        this.$refs.table.queryData();
      }
      if (type) return false;
      this.removeAllData();
    },
    handleDownLoad(){
      this.$refs.bankPDF.downloadBankBill();
    },
    handleAppOk() {
      this.handleAppCancel();
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
      this.$refs[name].resetFields();
      this.$refs.table.queryData(this.sendData);
    },

    // 清空父 -> 子的数据，以及子组件的数据
    removeAllData() {
      this.wageBatchSentData = {};

      const type = ['add', 'edit', 'view'].includes(this.wageBatchSentData.type);
      if (type) this.$refs.addOrUpdate.handleReset("formRefs");
    },
    //新增
    addBatch() {
      this.isShowModal = true;
      this.$set(this.wageBatchSentData, "type", 'add')
      // this.wageBatchSentData.type = "add";
      this.ModalTitle = "创建批次";
      const data = {
        type: "add"
      };
      this.wageBatchSentData = data;
    },
    ajaxAddBatch() {
      const data = Object.assign({}, this.$refs.addOrUpdate.batchData);
      addBatch(data).then(res => {
        this.$Message.success(res.result);
        this.$refs.table.queryData();
      }),
        err => {
          this.$Message.error(err);
        };
    },
    ajaxEditBatch() {
      const data = Object.assign({}, this.$refs.addOrUpdate.batchData);
      editBatch(data).then(res => {
        this.$Message.success(res.result);
        this.$refs.table.queryData();
      }),
        err => {
          this.$Message.error(err);
        };
    },
    // 编辑
    editBatch(row, index) {

      this.isShowModal = true;
      this.wageBatchSentData = row;
      // this.wageBatchSentData.type = "edit";
      this.$set(this.wageBatchSentData, "type", 'edit')
      this.ModalTitle = "编辑批次";
    },
    /**
     * @param type true表示单个删除
     */
    deleteBatch(row, index, type) {
      let data = null;
      if (type) {
        data = row.batchOid;
      } else {
        const type = utils.validateIds(this, this.ids);
        if (!type) return false;
        data = this.ids.join(",");
      }
      this.$Modal.confirm({
        title: "确认删除吗？",
        cancelText: "取消",
        onOk: () => {
          deleteBatch(data).then(res => {
            this.$Message.success(res.result);
            this.$refs.table.queryData();
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
      this.wageBatchSentData = rows;
      this.selectData = rows[0] || {}; //当前需要编辑的row，数组，默认只需要第一个
      this.ids = []; // 每次获得都需要清空一下上次选择的删除数据
      rows.forEach((v, i) => {
        this.ids.push(v.batchOid);
      });
    },
    downLoadFile(url, data) {
      this.$Message.info('正在下载，请稍候...')
      const token = utils.getItem("TOKEN_KEY");
      url = `${window.location.origin}/${url}?Authorization=${token}&${data}`;
      utils.downFile(url);
    },
    changeTime(data) {
      if (data.length) {
        this.sendData.beginDate = data[0];
        this.sendData.endDate = data[1];
      }
    },
    // 生成银行发放工资单  生成之前先要看是否具备条件，先请求一次
    exportWageExcel(row, index) {
      const data = row.batchOid;
      exportWageExcel(data).then(res => {
        if (res.code !== "1084") {
          const params = `batchOid=${data}`;
          const url = `${requestApi.exportWageExcel}`;
          this.downLoadFile(url, params);
        } else {
          this.$Message.error(res.message);
        }

      })


    },

    // 下载银行回执
    downloadBankBill(row, index) {
      const data = row.batchOid;
      downloadBankBill(data).then(res => {
        if (res.code !== "1084" && res.code !== "1112") {

          const params = `batchOid=${data}`;
          const url = `${requestApi.downloadBankBill}`;
          this.downLoadFile(url, params);
        } else {
          this.$Message.error(res.message);
        }
      })
    },

    checkBankPDF(row, index) {
      this.isShowModal = true;
      this.wageBatchSentData = row;
      this.$set(this.wageBatchSentData, "type", 'bankPDF')
      this.ModalTitle = "查看银行回执";
    },

    // 确认发放批次
    confirmWageBatch() {
      const type = utils.validateIds(this, this.ids);
      if (!type) return false;
      const data = this.ids.join(",");
      confirmWageBatch(data).then(res => {
        this.$refs.table.queryData();
        if (res) {
          this.$Message.success(res.result);
        }
      })

    },

    cancelWageBatch() {
      const type = utils.validateIds(this, this.ids);
      if (!type) return false;
      const data = this.ids.join(",");
      cancelWageBatch(data).then(res => {
        this.$refs.table.queryData();
        if (res) {
          this.$Message.success(res.result);
        }
      })

    },


    // 完成发放批次

    completedWageBatch() {
      const type = utils.validateIds(this, this.ids);
      if (!type) return false;
      this.$Modal.confirm({
        title: '温馨提示',
        content: '<p>工资发放完成后，批次及相关附件信息不可再维护，请确认是否完成发放。</p>',
        onOk: () => {
          const data = this.ids.join(",");
          completedWageBatch(data).then(res => {
            this.$refs.table.queryData();
            if (res) {
              this.$Message.success(res.result);
            }
          })
        },

      });

    },

    // listWagePlanByBatchOid
    listWagePlanByBatchOid(row, index) {
      this.isShowModal = true;
      this.wageBatchSentData = row;
      // this.wageBatchSentData.type = "application";
      this.$set(this.wageBatchSentData, "type", 'application')
      this.ModalTitle = "添加或移除工资发放计划";

    },
    checkWagePlanByBatchOid(row) {
      this.isShowModal = true;
      this.wageBatchSentData = row;
      // this.wageBatchSentData.type = "checkApplication";
      this.$set(this.wageBatchSentData, "type", 'checkApplication')
      this.ModalTitle = "查看已经添加的计划";
    },

    //上传相关

    importFile(row, index) {

      this.$Modal.confirm({
        title: '温馨提示',
        content: '如已上传过银行回执单，本次上传将会覆盖之前上传过的银行回执单附件，请确认是否上传。',
        onOk: () => {
          this.isShowModal = true;
          // this.wageBatchSentData.type = "import";
          this.$set(this.wageBatchSentData, "type", 'import')
          this.uploadData = row;
          this.ModalTitle = "上传文件";
          this.setUploadConfig();
        },

      });

    },
    setUploadConfig(type) {
      this.$set(this.uploadData, 'maxSize', 1024 * 10);
      this.$set(this.uploadData, 'multiple', false);
      this.$set(this.uploadData, 'accept', ".pdf");
      this.$set(this.uploadData, 'format', ['.pdf']);
      // 清空选项
      this.$refs.upload.clearFiles();
      this.$set(this.uploadData, 'fileName', "")
      this.$set(this.uploadData, 'file', [])
    },
    // 打开上传选择器
    openUploadBox() {
      this.$refs.upload.handleClick();
    },
    // 上传
    handleUpload(name) {
      if (!this.uploadData.file || !this.uploadData.file.name) return this.$Message.error('请先选择文件！');
      const formData = new FormData();
      formData.append("file", this.uploadData.file, this.uploadData.fileName);
      formData.append("batchOid", this.uploadData.batchOid);
      uploadBankBill(formData).then(res => {
        this.handleCancel("uploadForm");
        this.$Message.success(res.result);
        this.$refs.table.queryData();
      })


    },
    // 上传之前
    uploadBefore(file) {

      // this.fileName = file.name;
      if (this.uploadData.maxSize) {
        if (file.size > this.uploadData.maxSize * 1024) {
          this.handleMaxSize(file);
          return false;
        } else {
          this.$set(this.uploadData, 'fileName', file.name)
          this.uploadData.file = file;
        }
      }
      return false;
    },

    handleMaxSize(file) {
      this.$Message.error({
        content: `文件 ${file.name} 太大了，最大不能超过${this.uploadData.maxSize / 1000}MB`,
        duration: 3
      });
    },
  },
  watch: {
    "wageBatchSentData.type"(val) {
      if (['add', 'edit', 'view'].includes(this.wageBatchSentData.type)) {
        this.modalWidth = 60
      } else if (['application', 'checkApplication', 'bankPDF'].includes(this.wageBatchSentData.type)) {
        this.modalWidth = 80
      } else {
        console.log(this.modalWidth);
        this.modalWidth = 60
      }
    }
  }
};
</script>
