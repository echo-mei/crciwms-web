<style lang="scss" scoped>
.upload-body {
  margin: 14px 0;
}

.upload-box {
  // border: 1px dashed #ccc;
  // text-align: center;
  padding: 6px;
  // background: #c1e7ff;

  // &:hover {
  //   border-color: #3e71f7;
  // }

  .upload-input-label {
    display: inline-block;
    width: 100px;
    text-align: right;
    font-size: 14px;
    padding: 10px 12px 10px 0;
    box-sizing: border-box;
  }

  .upload-input {
    width: 60%;
    margin-right: 20px;
  }

  .ivu-form-item {
    margin-bottom: 10px;
  }
}

.tips {
  padding: 10px;
  background: #f5f9fd;
  margin-bottom: 20px;
  .header {
    font-size: 14px;
  }

  .content {
    line-height: 30px;
    font-size: 14px;
  }
}
</style>

<template>
  <div class="upload-body">
    <div>
      <div class="tips">
        <div class="header">温馨提示：</div>
        <div class="content">
          <p>
            1、仅能上传
            <span class="blue-text">PDF</span>文件，大小
            <span class="blue-text">10MB</span>内
          </p>
        </div>
      </div>
      <div class="upload-box">
        <span class="upload-input-label">选择文件：</span>
        <Input class="upload-input" disabled v-model="uploadData.fileName"/>
        <Button type="primary" style="width:90px;" @click.stop="openUploadBox">浏览</Button>
      </div>
    </div>
    <Upload
      ref="upload"
      :show-upload-list="false"
      :accept="uploadData.accept"
      :format="uploadData.format"
      :max-size="uploadData.maxSize"
      :before-upload="uploadBefore"
      :multiple="uploadData.multiple"
      action="//jsonplaceholder.typicode.com/posts/"
      style="display: inline-block;"
    ></Upload>
  </div>
</template>

<script>
import utils from "@/assets/js/utils.js";
import requestApi from "@/assets/js/requestApi.js";
import { exportWageCompanyList, importWageCompanyList } from "@/api/company.js";
import { uploadWageConfirmPDF } from "@/api/wage.js";
export default {
  data() {
    return {
      companyList: [],
      fileName: "",
      uploadData: {
        companyOid: "",
        file: [],
        fileName: "",
        maxSize: 1024 * 10,
        multiple: true,
        accept: ".pdf", // 允许上传的类型
        format: [".pdf"] // 允许上传的类型
      }, //上传文件的data
      uploadRules: {
        companyOid: [
          {
            required: true,
            message: "请选择劳务公司",
            trigger: "change",
            type: "number"
          }
        ]
      } //上传文件的校验规则
    };
  },

  components: {},

  computed: {

  },

  created() {
    this.uploadData = { ...this.uploadData, ... this.sentData }
  },

  mounted() { },
  props: ["sentData"],
  methods: {
    // 列出可导出工资确认表的劳务公司清单
    exportWageCompanyList(data) {
      exportWageCompanyList(data).then(res => {
        this.companyList = res.result;
      });
    },
    // 列出可导入工资信息的劳务公司清单
    importWageCompanyList(data) {
      importWageCompanyList(data).then(res => {
        this.companyList = res.result;
      });
    },
    handleCancel() {
      this.uploadData = {
        companyOid: "",
        file: [],
        fileName: "",
        maxSize: 1024 * 10,
        multiple: false,
        accept: ".xls, .xlsx", // 允许上传的类型
        format: [".xls", ".xlsx"] // 允许上传的类型
      };
      this.uploadData = { ...this.uploadData, ... this.sentData }
    },
    // 打开上传选择器
    openUploadBox() {
      this.$refs.upload.handleClick();
    },
    // 上传
    handleUpload(name) {
      const list = this.uploadData.file;
      if (!this.uploadData.file.length) {
        this.$Message.error("请先上传文件!");
        return false;
      }
      list.forEach((item, index) => {
        const formData = new FormData();
        formData.append("file", item, item.name);
        uploadWageConfirmPDF(formData, this.uploadData.planOid).then(res => {
          if (res) {
            this.$Message.success(res.result);
            this.$emit('on-close-modal', false);
            this.handleCancel("uploadForm");
          }


        });
        return false;
      });
    },
    // 上传之前
    uploadBefore(file) {
      this.fileName = file.name;
      this.$set(this.uploadData, "file", []);
      if (this.uploadData.maxSize) {
        if (file.size > this.uploadData.maxSize * 1024) {
          this.handleMaxSize(file);
          return false;
        } else {
          this.$set(this.uploadData, "fileName", file.name);
          this.uploadData.file.push(file);
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
};
</script>
