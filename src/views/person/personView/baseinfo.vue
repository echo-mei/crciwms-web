<style lang="scss" scoped>
.info {
  display: flex;
  width: 100%;
  height: 100%;

  .info-wrap-left {
    flex: 1;
    width: 40%;

    .edit-btn {
      margin-left: 64px;
      width: 90px;
    }
    .ivu-form {
      padding: 10px;
      &.editForm {
        color: #000;
        .ivu-form-item {
          margin-bottom: 16px;
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
    flex: 0 0 60%;
    width: 60%;
    text-align: center;

    .idcard-imgs-info {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      padding: 30px 30px 10px 30px;
      // background: #f0f0f0;
      .img-cont {
        position: relative;
        flex: 0 0 48%;
        width: 48%;
        padding-top: 36%;
        text-align: center;
        margin-bottom: 20px;
        background: #f0f0f0;

        .img-wrap {
          position: absolute;
          top: 0;
          width: 100%;
          height: calc(100% - 30px);
          padding: 1px;
          display: flex;
          justify-content: center;
          align-items: Center;
          .has-img {
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: inherit;
            align-items: center;
            img {
              max-width: 100%;
              max-height: 100%;
            }

            .list-cover {
              display: none;
              position: absolute;
              top: 0;
              bottom: 0;
              left: 0;
              right: 0;
              background: rgba(0, 0, 0, 0.6);
              justify-content: center;
              align-items: Center;
              .ivu-icon {
                color: #fff;
                font-size: 50px;
                cursor: pointer;
                margin: 10px;
              }
            }

            &:hover .list-cover {
              display: flex;
            }
          }

          .ivu-icon {
            font-size: 90px;
          }
        }
        .img-text {
          position: absolute;
          bottom: 0;
          width: 100%;
          height: 30px;
          line-height: 30px;
          font-size: 14px;
          font-weight: normal;
          text-align: center;
        }
      }
    }
  }
}
</style>
<style>
.modal-img-view .ivu-modal .ivu-modal-body {
  text-align: center;
}
</style>


<template>
  <div class="info">
    <div class="info-wrap-left">
      <template v-if="editFlag == true">
        <Form
          key="editForm"
          ref="personEdit"
          :model="personEditData"
          :rules="ruleCustom"
          :label-width="150"
          class="editForm"
        >
          <FormItem label="姓名" prop="name">
            <Input
              clearable
              type="text"
              v-model="personEditData.name"
              placeholder="请输入姓名"
              :maxlength="50"
            ></Input>
          </FormItem>
          <FormItem label="性别" prop="sexCode">
            <Select clearable v-model="personEditData.sexCode">
              <Option value>--请选择--</Option>
              <Option value="1">男</Option>
              <Option value="2">女</Option>
            </Select>
          </FormItem>
          <FormItem label="民族">
            <Select clearable v-model="personEditData.nationCode" filterable>
              <Option value>--请选择--</Option>
              <Option
                v-for="item in nationList"
                :value="item.dicItemCode"
                :key="item.dicItemCode"
              >{{ item.dicItemName }}</Option>
            </Select>
          </FormItem>
          <FormItem label="出生日期" prop="brithday">
            <DatePicker
              clearable
              :editable="false"
              type="date"
              placeholder="请选择出生日期"
              v-model="personEditData.brithday"
              @on-change="birthChange()"
            ></DatePicker>
          </FormItem>
          <FormItem label="手机号" prop="phone">
            <Input
              clearable
              type="text"
              v-model="personEditData.phone"
              placeholder="请输入手机号"
              :maxlength="20"
            ></Input>
          </FormItem>
          <FormItem label="身份证号" prop="idNo">
            <Input
              ref="idNo"
              clearable
              type="text"
              v-model="personEditData.idNo"
              placeholder="请输入身份证号"
              :maxlength="18"
            ></Input>
          </FormItem>
          <FormItem label="身份证签发机关">
            <Input
              clearable
              type="text"
              v-model="personEditData.issuedBy"
              placeholder="请输入身份证签发机关"
              :maxlength="100"
            ></Input>
          </FormItem>
          <FormItem label="户口所在地">
            <Input
              clearable
              type="text"
              v-model="personEditData.hukouPlace"
              placeholder="请输入户口所在地"
              :maxlength="100"
            ></Input>
          </FormItem>
          <FormItem label="证件有效期">
            <DatePicker
              clearable
              :editable="false"
              type="date"
              placeholder="请选择证件有效期"
              v-model="personEditData.effectiveDate"
            ></DatePicker>
          </FormItem>
          <FormItem label="银行卡号" prop="bankNo">
            <Input
              clearable
              type="text"
              v-model="personEditData.bankNo"
              placeholder="请输入银行卡号"
              :maxlength="20"
            ></Input>
          </FormItem>
          <FormItem label="发卡银行" prop="bankName">
            <Input
              clearable
              type="text"
              v-model="personEditData.bankName"
              placeholder="请输入发卡银行"
              :maxlength="100"
            ></Input>
          </FormItem>
          <FormItem label="所属架子队">
            <Input clearable type="text" disabled v-model="personEditData.unitName"></Input>
          </FormItem>
          <FormItem label="所属工作班组">
            <Input clearable type="text" disabled v-model="personEditData.deptName"></Input>
          </FormItem>
          <FormItem label="进场时间" v-if="personEditData.deptName">
            <Input clearable type="text" disabled v-model="personEditData.inAuthDate"></Input>
          </FormItem>
          <FormItem label="所属劳务公司" prop="companyOid">
            <Select clearable v-model="personEditData.companyOid" filterable>
              <Option
                v-for="item in companyList"
                :value="item.companyOid"
                :key="item.companyOid"
              >{{ item.companyName }}</Option>
            </Select>
          </FormItem>
        </Form>
      </template>

      <template v-else>
        <Form key="viewForm" :model="personData" :label-width="150" class="viewForm">
          <FormItem label="姓名 : ">{{personData.name}}</FormItem>
          <FormItem label="性别 : ">{{sexName}}</FormItem>
          <FormItem label="民族 : ">{{nationName}}</FormItem>
          <FormItem label="出生日期 : ">{{personData.brithday | formatDate}}</FormItem>
          <FormItem label="手机号 : ">{{personData.phone}}</FormItem>
          <FormItem label="身份证号 : ">{{personData.idNo}}</FormItem>
          <FormItem label="身份证签发机关 : ">{{personData.issuedBy}}</FormItem>
          <FormItem label="户口所在地 : ">{{personData.hukouPlace}}</FormItem>
          <FormItem label="证件有效期 : ">{{personData.effectiveDate | formatDate}}</FormItem>
          <FormItem label="银行卡号 : ">{{personData.bankNo}}</FormItem>
          <FormItem label="发卡银行 : ">{{personData.bankName}}</FormItem>
          <FormItem label="所属架子队 : ">{{personData.unitName}}</FormItem>
          <FormItem label="所属工作班组 : ">{{personData.deptName}}</FormItem>
          <FormItem label="进场时间 : " v-if="personData.deptName">{{personData.inAuthDate}}</FormItem>
          <FormItem label="所属劳务公司 : ">{{personData.companyName}}</FormItem>
        </Form>
      </template>
      <Button
        size="large"
        @click="editPerson"
        class="icon-btn edit-btn"
        v-if="canEdit && editFlag == false"
      >
        <Icon custom="i-icon icon-xiugaishuxing" size="18"/>
        <span>修改</span>
      </Button>
      <Button
        size="large"
        @click="savePerson"
        class="icon-btn edit-btn"
        type="primary"
        v-if="editFlag == true"
      >
        <!-- <Icon type="md-checkmark" size="18"/> -->
        <span>保存</span>
      </Button>
    </div>
    <div class="info-wrap-right">
      <div class="idcard-imgs-info">
        <div class="img-cont" v-for="item in uploadImgList" :key="item.type">
          <div class="img-wrap">
            <div class="has-img" v-if="item.url">
              <img :src="item.url">
              <div class="list-cover">
                <Icon type="ios-eye-outline" @click.native="handleView(item.url)"></Icon>
                <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
              </div>
            </div>
            <div class="has-img" v-else @click="canEdit && uploadImg(item.type)">
              <Icon type="ios-add-circle-outline"></Icon>
            </div>
          </div>
          <h3 class="img-text">{{item.name}}</h3>
        </div>
      </div>
      <Upload
        v-if="canEdit"
        ref="upload"
        accept=".jpg, .jpeg, .png"
        :show-upload-list="false"
        :max-size="500"
        action="//jsonplaceholder.typicode.com/posts/"
        :before-upload="beforeUploadImg"
      ></Upload>

      <Modal title="查看图片" v-model="visible" :mask-closable="false" class="modal-img-view">
        <img :src="imgData" v-if="visible" style="max-width: 100%;max-height:calc(100vh - 300px);">
        <div slot="footer">
          <Button type="primary" style="width:90px;" @click="closeModal">关闭</Button>
        </div>
      </Modal>
    </div>
  </div>
</template>

<script>
import utils from "@/assets/js/utils.js";
import {
  getPerson,
  getDicItemList,
  updatePerson,
  uploadImage,
  deleteImage,
  getImage,
  checkBankNo,
  checkIdNo,
  checkPhone
} from "@/api/person";
import { listCompany } from "@/api/company";
import lrz from "lrz";

export default {
  data() {
    const birthJudge = () => {
      let IdBrith = "";
      if (!this.personEditData.brithday) return true;
      if (this.personEditData.idNo.length == 15) {
        //15位的身份证默认年份是19XX年
        IdBrith =
          "19" +
          this.personEditData.idNo.substring(6, 8) +
          "-" +
          this.personEditData.idNo.substring(8, 10) +
          "-" +
          this.personEditData.idNo.substring(10, 12);
      } else if (this.personEditData.idNo.length == 18) {
        IdBrith =
          this.personEditData.idNo.substring(6, 10) +
          "-" +
          this.personEditData.idNo.substring(10, 12) +
          "-" +
          this.personEditData.idNo.substring(12, 14);
      }
      let birth = utils.formatDate(this.personEditData.brithday, "yyyy-MM-dd");
      if (birth != IdBrith) {
        return false;
      } else {
        return true;
      }
    };
    const validatePhone = (rule, value, callback) => {
      let reg =  /(^1\d{10}$)/;
      if (!value) {
        callback(new Error("手机号不能为空！"));
      } else if (!reg.test(value)) {
        callback(new Error("手机号有误！"));
      } else {
        checkPhone({
          personOid: this.personEditData.personOid,
          phone: value
        }).then(res => {
          if (res.flag) callback();
          else callback(new Error(res.message));
        }),
          err => {
            callback(new Error(err));
          };
      }
    };

    const validateIdNo = (rule, value, callback) => {
      let reg = /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}$)/;
      if (!value) {
        callback(new Error("身份证号不能为空！"));
      } else if (!reg.test(value)) {
        callback(new Error("身份证号不合法,只支持15/18位身份证号！"));
      } else if (!birthJudge()) {
        callback(new Error("身份证号上的出生日期与上面所填出生日期不一致！"));
      } else {
        checkIdNo({
          personOid: this.personEditData.personOid,
          idNo: value
        }).then(res => {
          if (res.flag) callback();
          else callback(new Error(res.message));
        }),
          err => {
            callback(new Error(err));
          };
      }
    };
    const validateBankNo = (rule, value, callback) => {
      let reg = /^\d+$/;
      if (!value) {
        callback(new Error("银行卡号不能为空！"));
      } else if (!reg.test(value)) {
        callback(new Error("银行卡号只能输入数字！"));
      } else {
        checkBankNo({
          personOid: this.personEditData.personOid,
          bankNo: value
        }).then(res => {
          if (res.flag) callback();
          else callback(new Error(res.message));
        }),
          err => {
            callback(new Error(err));
          };
      }
    };
    return {
      nationList: [], //民族数组
      companyList: [], //劳务公司数组
      editFlag: false,
      canEdit: true,
      imageType: "", //证照类型
      uploadData: {},
      personEditData: {},
      personData: {},
      uploadImgList: [
        { name: "身份证正面", url: "", type: 1 },
        { name: "身份证背面", url: "", type: 2 },
        { name: "银行卡正面", url: "", type: 3 },
        { name: "手持身份证和银行卡照片", url: "", type: 4 }
      ],
      imgData: "", //查看大图的图片数据
      visible: false, //查看大图的模态框显示与否
      ruleCustom: {
        name: [
          {
            required: true,
            message: "姓名不能为空！",
            trigger: "blur"
          }
        ],
        sexCode: [
          {
            required: true,
            message: "性别不能为空",
            trigger: "change"
          }
        ],
        brithday: [
          {
            required: true,
            message: "出生日期不能为空",
            trigger: "blur",
            pattern: /.+/
          }
        ],
        phone: [
          {
            required: true,
            validator: validatePhone,
            trigger: "blur"
          }
        ],
        idNo: [
          {
            required: true,
            validator: validateIdNo,
            trigger: "blur"
          }
        ],
        bankNo: [
          {
            required: true,
            validator: validateBankNo,
            trigger: "blur"
          }
        ],
        bankName: [
          {
            required: true,
            message: "发卡银行不能为空！",
            trigger: "blur"
          }
        ],
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
  props: ["sendData"],
  created() {
    this.canEdit = this.sendData.canEdit;
    this.getPerson();
    this.getImg("1");
    this.getImg("2");
    this.getImg("3");
    this.getImg("4");
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
  computed: {
    sexName() {
      if (this.personData.sexCode == "1") {
        return "男";
      } else if (this.personData.sexCode == "2") {
        return "女";
      } else {
        return "";
      }
    },
    nationName() {
      let nation = this.nationList.find(
        item => item.dicItemCode == this.personData.nationCode
      );
      return nation && nation.dicItemName;
    }
  },
  methods: {
    getPerson() {
      getPerson(this.sendData.personOid).then(res => {
        this.personData = res.result;
        this.getCompanyList();
        this.getNationList();
      });
    },
    getCompanyList() {
      listCompany().then(res => {
        this.companyList = res.result.list;
        if (this.companyList.length && this.companyList.length === 1) {
          this.personEditData.companyOid = this.companyList[0].companyOid;
        }
      });
    },
    getNationList() {
      // 获取民族数据
      getDicItemList("JDRS0003").then(res => {
        this.nationList = res.result;
      }),
        err => {
          this.$Message.error(err);
        };
    },
    //出生日期变化
    birthChange() {
      if (this.personEditData.idNo) {
        this.$refs.idNo.focus();
        this.$refs.idNo.blur();
      }
    },
    editPerson() {
      this.editFlag = true;
      this.personEditData = { ...this.personEditData, ...this.personData };
    },
    savePerson() {
      this.$refs.personEdit.validate(valid => {
        if (valid) {
          this.ajaxUpdatePerson();
        }
      });
    },
    ajaxUpdatePerson() {
      const data = Object.assign({}, this.personEditData);
      data.brithday = utils.formatDate(data.brithday, "yyyy-MM-dd");
      data.effectiveDate = utils.formatDate(data.effectiveDate, "yyyy-MM-dd");
      updatePerson(this.personEditData.personOid, data).then(res => {
        this.$Message.success({
          content: res.result,
          duration: 3
        });
        this.editFlag = false;
        this.getPerson();
      }),
        err => {
          this.$Message.error(err);
        };
    },
    //证照查看
    handleView(data) {
      this.imgData = data;
      this.visible = true;
    },
    //证照删除
    handleRemove(item) {
      this.$Modal.confirm({
        title: "确认删除吗？",
        cancelText: "取消",
        onOk: () => {
          const data = {
            personOid: this.sendData.personOid,
            imageType: item.type
          };
          deleteImage(data).then(res => {
            this.$Message.success({
              content: res.result,
              duration: 3
            });
            item.url = "";
          });
        }
      });
    },
    uploadImg(imageType) {
      this.imageType = imageType;
      this.$refs.upload.handleClick();
    },
    beforeUploadImg(file) {
      this.uploadData.fileName = file.name;
      lrz(file)
        .then(rst => {
          if (rst.fileLen > 500 * 1024 * 1) {
            this.$Message.error({
              content: "图片文件过大，请选择压缩后不超过500kb的图片！",
              duration: 3
            });
            return;
          }
          this.uploadData.file = rst.file;
          this.uploadImage(this.imageType);
        })
        .catch(function(err) {
          this.$Message.error({
            content: "压缩图片失败！",
            duration: 3
          });
        });
      return false;
    },
    uploadImage(imageType) {
      const formData = new FormData();
      formData.append("file", this.uploadData.file, this.uploadData.fileName);
      formData.append("personOid", this.personData.personOid);
      formData.append("imageType", imageType);
      uploadImage(formData).then(res => {
        this.$Message.success({
          content: res.result,
          duration: 3
        });
        this.getImg(imageType);
      });
    },
    getImg(imageType) {
      const data = {
        personOid: this.sendData.personOid,
        imageType: imageType
      };
      getImage(data).then(res => {
        // 请求图片异常的时候返回的是json格式,正常是blob格式：Blob {size: 186651, type: "text/xml",__proto__: Blob}
        if (res.type == "text/xml" && res.size != 0) {
          let img = this.uploadImgList.find(item => {
            return item.type == imageType;
          });
          img.url = `${window.URL.createObjectURL(res)}`;
        }
      });
    },
    closeModal() {
      this.visible = false;
    }
  }
};
</script>
