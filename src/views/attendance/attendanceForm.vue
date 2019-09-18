<template>
  <div>
    <!-- 考勤信息导入 -->
    <Modal
      v-model="importModal"
      title="考勤信息导入"
      width="800"
      :mask-closable="false"
      class="uploadatt"
      @on-cancel="importHandleCancel"
    >
      <div v-if="this.importModal">
        <div class="tip" style="margin-bottom:15px">
          <div class="header">温馨提示：</div>
          <div class="content">
            <p>
              1、仅能上传
              <span class="blue-text">xls,xlsx</span>文件，大小
              <span class="blue-text">10MB</span>内
            </p>
            <p>
              2、模板内
              <span class="red-text">红色标注</span>的为必填项
            </p>
          </div>
        </div>
        <Form :label-width="150" :model="importAtt" :rules="importAttRules" ref="importAtt">
          <FormItem label="所属劳务公司" prop="companyOid">
            <Select v-model="importAtt.companyOid" placeholder="请选择所属劳务公司" filterable clearable>
              <Option
                v-for="item in companysList"
                :value="item.value"
                :key="item.value"
              >{{ item.label }}</Option>
            </Select>
          </FormItem>
          <FormItem label="架子队" prop="unitOid">
            <Select v-model="importAtt.unitOid" placeholder="请选择所属架子队" filterable clearable>
              <Option
                v-for="item in shelfteam"
                :value="item.value"
                :key="item.value"
              >{{ item.label }}</Option>
            </Select>
          </FormItem>
          <FormItem label="选择文件" class="attendUpload">
            <Input style disabled v-model="importAtt.fileName"/>
            <Button
              type="primary"
              style="width:90px;margin-left:10px;"
              @click.stop="openimUploadBox"
            >浏览</Button>
          </FormItem>
        </Form>
        <Upload
          action="//jsonplaceholder.typicode.com/posts/"
          accept=".xls, .xlsx"
          ref="imuploadBox"
          :show-upload-list="false"
          :format="['xls','xlsx']"
          :before-upload="handleBeforeUpload"
        >
          <!-- <Button icon="ios-cloud-upload-outline">上传附件</Button>
          <div class="show-name" v-if="importAtt.file !== null">{{ importAtt.fileName }}</div>-->
        </Upload>
      </div>
      <div slot="footer">
        <Button type="primary" style="width:90px" @click="importHandleOk">导入</Button>
        <Button type="dashed" style="width:90px" @click="importHandleCancel">取消</Button>
      </div>
      <!-- 考勤扫描件上传 -->
    </Modal>
    <Modal
      v-model="scannModal"
      title="考勤扫描件上传"
      width="800"
      :mask-closable="false"
      class="uploadatt"
      @on-cancel="scannHandleCancel"
    >
      <div
        class="attendUploadContent"
        :style="{height:attendContentHeight+'px'}"
        v-if="this.scannModal"
      >
        <div class="tip">
          <div class="header">温馨提示：</div>
          <div class="content">
            <p>
              1、仅能上传
              <span class="blue-text">PDF</span>文件，大小
              <span class="blue-text">10MB</span>内
            </p>
            <p>
              2、模板内
              <span class="red-text">红色标注</span>的为必填项
            </p>
          </div>
        </div>
        <Form :label-width="150" :model="scannAtt" ref="scannAtt" :rules="scannAttRules">
          <FormItem label="所属劳务公司" prop="companyOid">
            <Select v-model="scannAtt.companyOid" placeholder="请选择所属劳务公司" filterable clearable>
              <Option
                v-for="item in companysList"
                :value="item.value"
                :key="item.value"
              >{{ item.label }}</Option>
            </Select>
          </FormItem>
          <FormItem label="架子队" prop="unitOid">
            <Select v-model="scannAtt.unitOid" placeholder="请选择所属架子队" filterable clearable>
              <Option
                v-for="item in shelfteam"
                :value="item.value"
                :key="item.value"
              >{{ item.label }}</Option>
            </Select>
          </FormItem>
          <FormItem label="考勤时间范围" prop="transferDate">
            <DatePicker
              v-model="scannAtt.transferDate"
              format="yyyy-MM-dd"
              type="daterange"
              placeholder="请选择起止日期"
              :editable="false"
              @on-change="changeTime"
              @on-open-change="initDatePick"
              transfer
            ></DatePicker>
          </FormItem>
          <FormItem label="备注" prop="remark" style="width:90%" class="remark">
            <Input
              type="textarea"
              v-model="scannAtt.remark"
              :rows="5"
              placeholder="请输入相关备注..."
              class="textarea"
              :maxlength="200"
            />
            <p>
              <span class="blue-text">{{reasonMax}}</span>/
              <span class="blue-text">200</span>字符
            </p>
          </FormItem>
          <FormItem label="选择文件" class="attendUpload">
            <Input style disabled v-model="scannAtt.fileName"/>
            <Button
              type="primary"
              style="width:90px;margin-left:10px;"
              @click.stop="openUploadBox"
            >浏览</Button>
          </FormItem>
        </Form>
        <Upload
          multiple
          action="//jsonplaceholder.typicode.com/posts/"
          accept=".pdf"
          :show-upload-list="false"
          :format="['pdf']"
          ref="uploadBox"
          :before-upload="scannBeforeUpload"
        >
          <!-- <Button icon="ios-cloud-upload-outline">上传附件</Button>
          <div class="show-name" v-if="scannAtt.file !== null">{{ scannAtt.fileName }}</div>-->
        </Upload>
      </div>
      <div slot="footer">
        <Button type="primary" style="width:90px" @click="scannHandleOk">上传</Button>
        <Button type="dashed" style="width:90px" @click="scannHandleCancel">取消</Button>
      </div>
    </Modal>
    <!-- 附件查看 -->
    <Modal
      v-model="annexModal"
      title="附件列表查看"
      width="1200"
      :mask-closable="false"
      class="viewattAnnex"
      @on-cancel="annexHandleCancle"
    >
      <div v-if="this.annexModal">
        <Form :model="sendData" :label-width="150" inline ref="queryForm" @submit.native.prevent>
          <FormItem label="附件名称" prop="detailName">
            <Input placeholder="请输入附件名" v-model="sendData.detailName" clearable/>
          </FormItem>
          <FormItem label="所属劳务公司" prop="companyOid">
            <Select v-model="sendData.companyOid" placeholder="请选择所属劳务公司" filterable clearable>
              <Option
                v-for="item in companysList"
                :value="item.value"
                :key="item.value"
              >{{ item.label }}</Option>
            </Select>
          </FormItem>
          <FormItem label="架子队" prop="unitOid">
            <Select v-model="sendData.unitOid" placeholder="请选择所属架子队" filterable clearable>
              <Option
                v-for="item in shelfteam"
                :value="item.value"
                :key="item.value"
              >{{ item.label }}</Option>
            </Select>
          </FormItem>
          <FormItem label="考勤时间范围" prop="vtransferDate" class="vtranTime">
            <DatePicker
              v-model="vtransferDate"
              format="yyyy-MM-dd"
              type="daterange"
              placeholder="请选择起止日期"
              :editable="false"
              @on-change="sendChangeTime"
              @on-open-change="initDatePick"
              transfer
            ></DatePicker>
          </FormItem>
          <FormItem>
            <Button type="primary" @click="handleSubmit">查询</Button>
            <Button @click="handleReset" style="margin-left:10px;">重置</Button>
          </FormItem>
        </Form>
        <div class="setting clearfix">
          <div class="left fl">
            <Button size="small" class="icon-btn" @click="deleteAnnex">
              <Icon custom="i-icon icon-shanchuhover" size="18"/>
              <span>附件删除</span>
            </Button>
          </div>
        </div>
        <Table
          ref="table"
          :columnList="columns"
          :listUrl="listUrl"
          :sendData="sendData"
          :isShowSetting="isShowSetting"
          :isShowCheckbox="isShowCheckbox"
          :isShowEdit="isShowEdit"
          @on-select-rows="onSelectRows"
          :propMaxHeight="cpropMaxHeight"
        ></Table>
      </div>
      <div slot="footer">
        <Button type="primary" style="width:90px" @click="annexHandleCancle">关闭</Button>
      </div>
    </Modal>
    <Modal v-model="pdfModel" title="pdf文件预览" width="800" :mask-closable="false">
      <div v-if="this.pdfModel">
        <iframe ref="iframe" :height="pdfHeight" width="100%"></iframe>
      </div>
      <div slot="footer">
        <Button type="primary" style="width:90px" @click="pdfCancel">关闭</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
const Table = () => import("@/components/table/Table.vue");
import requestApi from "@/assets/js/requestApi.js";
import utils from "@/assets/js/utils.js";
export default {
  props: ["shelfteam", "companysList", "cpropMaxHeight", "attendContentHeight"],
  data() {
    return {
      vtransferDate: "",
      importModal: false,
      scannModal: false,
      annexModal: false,
      pdfModel: false,
      annexList: [],
      pdfIds: [],
      sendData: {
        detailName: "",
        companyOid: "",
        unitOid: "",
        startDate: "",
        endDate: ""
      },
      importAtt: {
        unitOid: "",
        file: null,
        companyOid: "",
        fileName: ""
      },
      scannAtt: {
        file: null,
        companyOid: "",
        unitOid: "",
        startDate: "",
        endDate: "",
        remark: "",
        transferDate: "",
        fileName: ""
      },
      importAttRules: {
        unitOid: [
          {
            type: "number",
            required: true,
            message: "所属架子队不能为空",
            trigger: "change"
          }
        ],
        companyOid: [
          {
            type: "number",
            required: true,
            message: "所属劳务公司不能为空",
            trigger: "change"
          }
        ]
      },
      scannAttRules: {
        unitOid: [
          {
            type: "number",
            required: true,
            message: "所属架子队不能为空",
            trigger: "change"
          }
        ],
        companyOid: [
          {
            type: "number",
            required: true,
            message: "所属劳务公司不能为空",
            trigger: "change"
          }
        ],
        transferDate: [
          {
            type: "array",
            required: true,
            message: "考勤时间范围不能为空",
            fields: {
              0: { type: "date", required: true, message: "请选择开始日期" },
              1: { type: "date", required: true, message: "请选择截止日期" }
            }
          }
        ]
      },
      columns: [
        {
          name: "操作",
          width: 0.1,
          attr: [
            {
              name: "下载",
              attr: "download",
              initFormat: (row, index) => {
                return '<i title="下载" class="ivu-icon i-icon icon-download-cloud download"></i>';
              },
              initRender(row, index) {
                return true;
              },
              initEvent: (row, index) => {
                const url = requestApi.downLoadAnnex;
                const params = `detailOid=${row.detailOid}`;
                this.downLoadFile(url, params);
              }
            },
            {
              name: "预览",
              attr: "review",
              initFormat: (row, index) => {
                return '<i title="预览" class="ivu-icon i-icon icon-kejian view"></i>';
              },
              initRender: (row, index) => {
                return true;
              },
              initEvent: (row, index) => {
                this.PDFPreview(row);
              }
            }
          ]
        },
        {
          name: "附件",
          attr: "detailName",
          width: 0.1
        },
        {
          name: "考勤起始日期",
          attr: "startDate",
          width: 0.1
        },
        {
          name: "考勤截止日期",
          attr: "endDate",
          width: 0.1
        },
        {
          name: "上传时间",
          attr: "createdDate",
          width: 0.1
        },
        {
          name: "所属劳务公司",
          attr: "companyName",
          width: 0.1
        },
        {
          name: "架子队",
          attr: "unitName",
          width: 0.1
        },
        {
          name: "备注",
          attr: "remark",
          width: 0.1
        }
      ],
      isShowCheckbox: true, // 是否展示复选框
      isShowSetting: false, // 是否展示设置字段显示的按钮
      isShowEdit: false, // 是否展示编辑按钮
      listUrl: requestApi.getAnnexList // Table的列表数据请求的地址
    };
  },
  components: {
    Table
  },
  computed: {
    reasonMax() {
      return this.scannAtt.remark.length;
    },
    pdfHeight() {
      return this.cpropMaxHeight + 180;
    }
  },
  methods: {
    pdfCancel() {
      this.pdfModel = false;
    },
    downloadPDF(detailOid) {
      const data = {
        detailOid: detailOid
      };
      return this.$axios.request({
        url: `${requestApi.downLoadAnnex}`,
        params: data,
        method: "get",
        responseType: "blob"
      });
    },
    PDFPreview(row) {
      this.downloadPDF(row.detailOid).then(res => {
        if (res.type == "application/pdf") {
          let binaryData = [];
          binaryData.push(res);
          let url = window.URL.createObjectURL(
            new Blob(binaryData, { type: "application/zip" })
          );
          const pdfUrl = `/pdfjs/web/viewer.html?file=${url}`;
          this.pdfModel = true;
          this.$nextTick(() => {
            this.set(pdfUrl);
          });
        }
      });
    },
    set(src) {
      this.$refs.iframe.contentWindow.location.replace(src);
    },
    openimUploadBox() {
      this.$refs.imuploadBox.handleClick();
    },
    // 打开上传选择器
    openUploadBox() {
      this.$refs.uploadBox.handleClick();
    },
    handleBeforeUpload(file) {
      if (file.size > 10 * 1024 * 1024) {
        this.$Message.error({
          content: `文件 ${file.name} 太大了，最大不能超过10MB`
        });
      } else {
        this.importAtt.fileName = file.name;
        this.importAtt.file = file;
      }
      return false;
    },
    scannBeforeUpload(file) {
      if (file.size > 10 * 1024 * 1024) {
        this.$Message.error({
          content: `文件 ${file.name} 太大了，最大不能超过10MB`
        });
      } else {
        this.scannAtt.fileName = file.name;
        this.scannAtt.file = file;
      }
      return false;
    },
    openImportModal() {
      this.importModal = true;
    },
    openScannModal() {
      this.scannModal = true;
    },
    openAnnexModal() {
      this.annexModal = true;
    },
    importHandleOk() {
      const formData = new FormData();
      formData.append("file", this.importAtt.file, this.importAtt.fileName);
      formData.append("unitOid", this.importAtt.unitOid);
      formData.append("companyOid", this.importAtt.companyOid);
      this.$refs.importAtt.validate(valid => {
        if (valid) {
          this.$axios
            .post(requestApi.importAtt, formData)
            .then(({ result, message }) => {
              if (result) {
                let content = "<div class='upload-tips'>";
                result.forEach(item => {
                  content += `<p>${item}</p>`;
                });
                content += "</div>";
                this.$Modal.warning({
                  title: "导入失败",
                  content,
                  scrollable: true,
                  width: "500px",
                  okText: "关闭",
                  onOk: () => {
                    this.$emit("refreshTable");
                  }
                });
              } else {
                if (this.importAtt.fileName) {
                  this.$Message.success({
                    content: "导入成功",
                    duration: 3
                  });
                  this.$emit("refreshTable");
                }
              }
              this.importHandleCancel();
            });
        } else {
          // this.$Message.error("请正确填写相关数据");
        }
      });
    },
    importHandleCancel() {
      this.$refs.importAtt.resetFields();
      this.importAtt.fileName = null;
      this.importAtt.file = null;
      this.importModal = false;
    },
    scannHandleOk() {
      const formData = new FormData();
      formData.append("file", this.scannAtt.file, this.scannAtt.fileName);
      formData.append("companyOid", this.scannAtt.companyOid);
      formData.append("unitOid", this.scannAtt.unitOid);
      formData.append(
        "startDate",
        new Date(this.scannAtt.startDate).toString()
      );
      formData.append("endDate", new Date(this.scannAtt.endDate).toString());
      formData.append("remark", this.scannAtt.remark);
      this.$refs.scannAtt.validate(valid => {
        if (valid) {
          if (this.scannAtt.fileName) {
            this.$axios.post(requestApi.scannAtt, formData).then(({ flag }) => {
              this.scannHandleCancel();
              if (flag) {
                this.$Message.success("考勤扫描件上传成功");
                this.$emit("refreshTable");
              } else {
                // this.$Message.error("考勤扫描件上传失败");
              }
            });
          } else {
            this.$Message.error("请选择考勤扫描件");
          }
        }
      });
    },
    scannHandleCancel() {
      this.$refs.scannAtt.resetFields();
      this.scannAtt.fileName = null;
      this.scannAtt.file = null;
      this.scannAtt.startDate = "";
      this.scannAtt.endDate = "";
      this.scannAtt.transferDate = "";
      this.scannModal = false;
    },
    annexHandleCancle() {
      this.$refs.queryForm.resetFields();
      this.sendData.startDate = "";
      this.sendData.endDate = "";
      this.vtransferDate = "";
      this.annexModal = false;
    },
    //查询
    handleSubmit() {
      this.$refs.table.queryData();
    },
    //重置
    handleReset() {
      this.$refs.queryForm.resetFields();
      this.sendData.startDate = "";
      this.sendData.endDate = "";
      this.vtransferDate = "";
      this.$refs.table.queryData();
    },
    downLoadFile(url, data) {
      this.$Message.info("正在下载，请稍候...");
      const token = utils.getItem("TOKEN_KEY");
      url = `${window.location.origin}${url}?Authorization=${token}&${data}`;
      utils.downFile(url);
    },
    deleteAnnex() {
      if (this.annexList.length > 0) {
        this.$Modal.confirm({
          title: "提醒",
          content: "是否删除附件？",
          onOk: () => {
            this.$axios
              .delete(requestApi.deleteAnnex, {
                params: { detailOids: this.pdfIds.join(",") }
              })
              .then(({ flag }) => {
                if (flag) {
                  this.$Message.success("考勤附件删除成功");
                  this.$refs.table.queryData();
                  this.annexList = [];
                } else {
                  // this.$Message.error("考勤附件删除失败");
                }
              });
          }
        });
      } else {
        this.$Message.error("先选择一条或多条记录再进行操作!");
      }
    },
    onSelectRows(rows) {
      this.annexList = rows;
      this.pdfIds = [];
      this.annexList.forEach(v => {
        this.pdfIds.push(v.detailOid);
      });
    },
    changeTime(data) {
      if (data.length) {
        this.scannAtt.startDate = data[0];
        this.scannAtt.endDate = data[1];
      }
    },
    sendChangeTime(data) {
      if (data.length) {
        this.sendData.startDate = data[0];
        this.sendData.endDate = data[1];
      }
    },
    initDatePick() {
      utils.initDate();
    }
  }
};
</script>
