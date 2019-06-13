<style lang="scss" scoped>
.upload-body {
  margin: 14px 0;
}

.upload-box {
  border: 1px dashed #ccc;
  // text-align: center;
  padding: 6px;
  background: #c1e7ff;

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
    width: 500px;
    margin-right: 20px;
  }

  .ivu-form-item {
    margin-bottom: 10px;
    margin-top: 10px;
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
      <div class="tips" v-if="!companyList.length">
        <div class="header">温馨提示：</div>
        <div class="content">
          <p>1、工资发放计划暂未导入劳务公司农民工工资信息，请先操作导入工资信息</p>
        </div>
      </div>
      <div class="upload-box">
        <Form ref="confirmPDF" inline :label-width="100" :model="uploadData" :rules="uploadRules">
          <FormItem prop="companyOid" label="劳务公司：">
            <Select style="width:500px" placeholder="请选择劳务公司" v-model="uploadData.companyOid">
              <Option
                v-for="item in companyList"
                :value="item.companyOid"
                :key="item.companyOid"
              >{{ item.companyName }}</Option>
            </Select>
          </FormItem>
        </Form>
      </div>
    </div>
  </div>
</template>

<script>
import utils from "@/assets/js/utils.js";
import requestApi from "@/assets/js/requestApi.js";
import { exportWageCompanyList } from "@/api/company.js";
import { exportWageBaseConfirmPDF } from "@/api/wage.js";
export default {
  data() {
    return {
      companyList: [],
      uploadData: {
        companyOid: ""
      },
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
    this.exportWageCompanyList(this.sentData.unitOid);
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

    downLoadFile(url, data) {
      this.$Message.info("正在下载，请稍候...");
      const token = utils.getItem("TOKEN_KEY");
      url = `${window.location.origin}${url}?Authorization=${token}&${data}`;
      utils.downFile(url);
    },
    handleCreated(name) {
      this.$refs["confirmPDF"].validate(valid => {
        if (valid) {
          const data = this.sentData.planOid;
          const companyOid = this.uploadData.companyOid;
          const params = `planOid=${data}&companyOid=${companyOid}`;
          const url = `${requestApi.exportWageBaseConfirmPDF}`;
          exportWageBaseConfirmPDF(data, companyOid).then(res => {
            this.$emit('on-close-modal',false)
            if (res && res.code !== "1095") {
              this.downLoadFile(url, params);
            } else {
              this.$Message.error(res.message);
            }
          });
        }
      });
    }
  }
};
</script>
