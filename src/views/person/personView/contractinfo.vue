<style lang="scss" scoped>
.info {
  display: flex;
  width: 100%;
  height: 100%;

  .info-wrap-left {
    flex: 1;

    .edit-btn {
      margin-left: 64px;
      width: 90px;
    }
    .ivu-form {
      padding: 10px;
      &.editForm {
        color: #000;
        .ivu-form-item {
          width: 80%;
        }
        .ivu-date-picker {
          width: 100%;
        }
      }
      .ivu-form-item {
        margin-bottom: 10px;
        font-size: 14px;

        .ivu-form-item-label {
          font-size: 14px; //不生效，后续再看
        }
      }
    }
  }
  .info-wrap-right {
    flex: 0 0 500px;
    width: 500px;

    iframe {
      border: none;
    }
  }
}
.ivu-upload {
  display: inline-block;
  .ivu-btn {
    margin-left: 20px;
  }
  .show-name {
    display: inline-block;
    margin-left: 16px;
  }
}
</style>


<template>
  <div class="info">
    <div class="info-wrap-left">
      <template v-if="editFlag == true">
        <Form
          key="editContractForm"
          ref="edit"
          :model="contractEditData"
          :rules="ruleCustom"
          :label-width="150"
          class="editForm"
        >
          <FormItem label="合同编号" prop="contractNo">
            <Input
              clearable
              type="text"
              v-model="contractEditData.contractNo"
              placeholder="请输入合同编号"
              :maxlength="50"
            ></Input>
          </FormItem>
          <FormItem label="甲方">
            <Input type="text" disabled v-model="contractEditData.firstParty"></Input>
          </FormItem>
          <FormItem label="乙方">
            <Input type="text" disabled v-model="contractEditData.secondParty"></Input>
          </FormItem>
          <FormItem label="身份证号">
            <Input type="text" disabled v-model="contractEditData.idNo"></Input>
          </FormItem>
          <FormItem label="合同起始时间" prop="contractBegin">
            <DatePicker
              clearable
              :editable="false"
              type="date"
              placeholder="请选择合同起始时间"
              v-model="contractEditData.contractBegin"
              :options="startTimeOption"
              @on-change="onStartTimeChange"
            ></DatePicker>
          </FormItem>
          <FormItem label="合同终止时间" prop="contractEnd">
            <DatePicker
              clearable
              :editable="false"
              type="date"
              placeholder="请选择合同终止时间"
              v-model="contractEditData.contractEnd"
              :options="endTimeOption"
              @on-change="onEndTimeChange"
            ></DatePicker>
          </FormItem>
          <FormItem label="签订时间" prop="sigantureDate">
            <DatePicker
              clearable
              :editable="false"
              type="date"
              placeholder="请选择签订时间"
              v-model="contractEditData.sigantureDate"
              @on-change="contractEditData.sigantureDate=$event"
            ></DatePicker>
          </FormItem>
          <FormItem label="备注" style="width:98%; flex: 0 0 98%;">
            <Input
              clearable
              type="textarea"
              placeholder="请输入备注"
              :autosize="{minRows: 2,maxRows: 5}"
              v-model="contractEditData.remark"
              :maxlength="200"
            ></Input>
          </FormItem>
        </Form>
      </template>

      <template v-else>
        <Form key="viewContractForm" :model="contractData" :label-width="150">
          <FormItem label="合同编号 : ">{{contractData.contractNo}}</FormItem>
          <FormItem label="甲方 : ">{{contractData.firstParty}}</FormItem>
          <FormItem label="乙方 : ">{{contractData.secondParty}}</FormItem>
          <FormItem label="身份证号 : ">{{contractData.idNo}}</FormItem>
          <FormItem label="合同起始时间 : ">{{contractData.contractBegin | formatDate}}</FormItem>
          <FormItem label="合同终止时间 : ">{{contractData.contractEnd | formatDate}}</FormItem>
          <FormItem label="签订时间 : ">{{contractData.sigantureDate | formatDate}}</FormItem>
          <FormItem label="备注: ">{{contractData.remark}}</FormItem>
        </Form>
      </template>
      <Button
        size="large"
        @click="edit"
        class="icon-btn edit-btn"
        v-if="canEdit && editFlag == false"
      >
        <Icon custom="i-icon icon-xiugaishuxing" size="18"/>
        <span>修改</span>
      </Button>
      <Button
        size="large"
        @click="save"
        class="icon-btn edit-btn"
        type="primary"
        v-if="canEdit && editFlag == true"
      >
        <!-- <Icon type="md-checkmark" size="18"/> -->
        <span>保存</span>
      </Button>
      <Upload
        ref="upload"
        accept=".pdf"
        action="//jsonplaceholder.typicode.com/posts/"
        :before-upload="handleBeforeUpload"
        v-if="canEdit"
      >
        <Button size="large" class="icon-btn">
          <Icon type="ios-cloud-upload-outline" size="18"/>
          <span>上传附件</span>
        </Button>
        <!-- <div class="show-name" v-if="uploadData.fileName != ''">{{ uploadData.fileName }}</div> -->
      </Upload>
    </div>
    <div class="info-wrap-right">
      <iframe ref="iframe" height="99%" width="100%"></iframe>
    </div>
  </div>
</template>

<script>
import utils from "@/assets/js/utils.js";
import {
  getContract,
  updateContract,
  uploadContractFile,
  getContractFile
} from "@/api/contract";

export default {
  data() {
    return {
      pdfUrl: "",
      editFlag: false,
      canEdit: true,
      contractEditData: {},
      contractData: {},
      uploadData: {},
      startTimeOption: {}, //开始日期设置
      endTimeOption: {}, //结束日期设置
      ruleCustom: {
        contractNo: [
          {
            required: true,
            message: "合同编号不能为空！",
            trigger: "blur"
          }
        ],
        contractBegin: [
          {
            required: true,
            message: "合同起始时间不能为空！",
            trigger: "blur",
            pattern: /.+/
          }
        ],
        contractEnd: [
          {
            required: true,
            message: "合同终止时间不能为空",
            trigger: "blur",
            pattern: /.+/
          }
        ],
        sigantureDate: [
          {
            required: true,
            message: "签订时间不能为空",
            trigger: "blur",
            pattern: /.+/
          }
        ]
      }
    };
  },
  props: ["sendData"],
  created() {
    this.canEdit = this.sendData.canEdit;
    this.getContract();
    this.getContractFileInfo();
  },
  mounted() {},
  filters: {
    formatDate(time) {
      if (time === null) {
        return "";
      } else {
        let date = new Date(time);
        return utils.formatDate(date, "yyyy-MM-dd");
      }
    }
  },
  methods: {
    getContract() {
      getContract(this.sendData.personOid).then(res => {
        this.contractData = res.result;
      });
    },
    onStartTimeChange(startTime) {
      this.contractEditData.contractBegin = startTime;
      this.endTimeOption = {
        disabledDate(endTime) {
          return endTime <= new Date(startTime);
        }
      };
    },
    onEndTimeChange(endTime) {
      this.contractEditData.contractEnd = endTime;
      this.startTimeOption = {
        disabledDate(startTime) {
          return startTime >= new Date(endTime);
        }
      };
    },
    edit() {
      this.editFlag = true;
      this.contractEditData = {
        ...this.contractEditData,
        ...this.contractData
      };
      this.onStartTimeChange(this.contractEditData.contractBegin);
      this.onEndTimeChange(this.contractEditData.contractEnd);
    },
    save() {
      this.$refs.edit.validate(valid => {
        if (valid) {
          this.ajaxUpdate();
        }
      });
    },
    ajaxUpdate() {
      const data = Object.assign({}, this.contractEditData);
      data.contractBegin = utils.formatDate(data.contractBegin, "yyyy-MM-dd");
      data.contractEnd = utils.formatDate(data.contractEnd, "yyyy-MM-dd");
      data.sigantureDate = utils.formatDate(data.sigantureDate, "yyyy-MM-dd");
      updateContract(this.contractEditData.contractOid, data).then(res => {
        this.$Message.success({
          content: res.result,
          duration: 3
        });
        this.editFlag = false;
        this.getContract();
      }),
        err => {
          this.$Message.error(err);
        };
    },
    handleBeforeUpload(file) {
      this.uploadData.fileName = file.name;
      this.uploadData.file = file;
      if (file.size > 10 * 1024 * 1024) {
        this.$Message.error({
          content: "文件过大，请选择10M以下的文件！",
          duration: 3
        });
      } else {
        this.upload();
      }
      return false;
    },
    upload() {
      const formData = new FormData();
      formData.append("file", this.uploadData.file, this.uploadData.fileName);
      formData.append("personOid", this.sendData.personOid);
      uploadContractFile(formData).then(res => {
        this.$Message.success({
          content: res.result,
          duration: 3
        });
        this.getContractFileInfo();
      });
    },
    getContractFileInfo() {
      let data = { personOid: this.sendData.personOid };
      getContractFile(data).then(res => {
        // 请求文件异常的时候返回的是json格式,正常是blob格式：Blob {size: 186651, type: "text/xml",__proto__: Blob}
        if (res.type == "text/xml") {
          let binaryData = [];
          binaryData.push(res);
          let url = window.URL.createObjectURL(
            new Blob(binaryData, { type: "application/zip" })
          );
          this.pdfUrl = "/pdfjs/web/viewer.html?file=" + url;
          this.set(this.pdfUrl);
        } else {
          this.pdfUrl = "";
        }
      });
    },
    //解决 vue-router 内嵌 iframe，导致 go(n) 异常问题
    set(src) {
      this.$refs.iframe.contentWindow.location.replace(src);
    }
  }
};
</script>
