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
  .ivu-form-item {
    width: 100%;
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
            <span class="blue-text">xls/xlsx</span>文件，大小
            <span class="blue-text">10MB</span>内。
          </p>
          <p>
            2、模板内
            <span class="red-text">红色标注</span>的为必填项
          </p>
        </div>
      </div>
      <div class="upload-box">
        <Form ref="uploadForm" inline :label-width="100" :model="uploadData" :rules="uploadRules">
          <FormItem prop="companyOid" label="劳务公司：">
            <Select style="width:60%" placeholder="请选择劳务公司" v-model="uploadData.companyOid">
              <Option
                v-for="item in companyList"
                :value="item.companyOid"
                :key="item.companyOid"
              >{{ item.companyName }}</Option>
            </Select>
          </FormItem>
           <FormItem prop="companyOid" label="选择文件：">
            <Input class="upload-input" disabled v-model="uploadData.fileName"/>
            <Button type="primary" style="width:90px;" @click.stop="openUploadBox">浏览</Button>
          </FormItem>
        </Form>
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
import { uploadFile } from "@/api/wage.js";
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
        multiple: false,
        accept: ".xls, .xlsx", // 允许上传的类型
        format: [".xls", ".xlsx"] // 允许上传的类型
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
    this.importWageCompanyList(this.sentData.unitOid);
    console.log('有什么东西', this.sentData);

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
      }
    },
    // 打开上传选择器
    openUploadBox() {
      this.$refs.upload.handleClick();
    },
    // 上传
    handleUpload(name) {
      this.$refs["uploadForm"].validate(valid => {
        const list = this.uploadData.file;
        console.log('list', list);
        console.log('this.uploadData', this.uploadData);

        if (valid) {
          if (!list.length) {
            this.$Message.error("请先上传文件!");
            return false;
          }
          const formData = new FormData();
          formData.append("file", list[0], list[0].name);

          uploadFile(
            formData,
            this.uploadData.unitOid,
            this.uploadData.planOid,
            this.uploadData.companyOid
          ).then(res => {
            if (res) {
              this.$emit('on-close-modal', false)
              this.handleCancel();
              const messageList = res.result;
              let content = "<div class='upload-tips'>";
              if (messageList) {
                messageList.forEach(item => {
                  content += `<p>${item}</p>`
                });
                content += "</div>"
                this.$Modal.warning({
                  title: "导入失败",
                  content: content,
                  scrollable: true,
                  okText: "关闭",
                  width: "500px"
                });
              } else {
                this.$Message.success(res.message);
              }
            }
          });
        }
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
