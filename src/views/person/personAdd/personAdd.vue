<style lang="scss" scoped>
.person {
  height: calc(100vh - 270px);
  overflow: auto;
  .ivu-form {
    display: flex;
    flex-wrap: wrap;
    .title {
      font-size: 16px;
      width: 100%;
      margin-bottom: 16px;

      .icon-btn{margin-left: 10px;}
    }
    .ivu-form-item {
      width: 49%;
      flex: 0 0 49%;
      margin-bottom: 16px;

      .ivu-date-picker {
        width: 100%;
      }
    }
  }
}
</style>
<template>
  <div class="person">
    <OBJECT
      classid="clsid:10946843-7507-44FE-ACE8-2B3483D179B7"
      codebase="@/views/person/personAdd/CVR100.cab#version=3,0,3,3"
      id="CVR_IDCard"
      name="CVR_IDCard"
      width="0"
      height="0"
      align="center"
      hspace="0"
      vspace="0"
    ></OBJECT>

    <Form ref="personAdd" :model="personData" :rules="ruleCustom" :label-width="120">
      <h2 class="title">基本信息
        <Button size="small" class="icon-btn" @click="setid()" :disabled="showReadIDCard" title="请使用IE内核浏览器读取身份证信息">
          <Icon custom="i-icon  icon-zhengjian" size="18"/>
          <span>读取二代身份证信息</span>
        </Button>
      </h2>
      <FormItem label="姓名" prop="name">
        <Input clearable type="text" v-model="personData.name" placeholder="请输入姓名" :maxlength="50"></Input>
      </FormItem>
      <FormItem label="性别" prop="sexCode">
        <Select clearable v-model="personData.sexCode">
          <Option value>--请选择--</Option>
          <Option value="1">男</Option>
          <Option value="2">女</Option>
        </Select>
      </FormItem>
      <FormItem label="民族">
        <Select clearable v-model="personData.nationCode" filterable>
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
          v-model="personData.brithday"
          @on-change="birthChange($event)"
        ></DatePicker>
      </FormItem>
      <FormItem label="身份证号" prop="idNo">
        <Input
          ref="idNo"
          clearable
          type="text"
          v-model="personData.idNo"
          placeholder="请输入身份证号"
          :maxlength="18"
        ></Input>
      </FormItem>
      <FormItem label="身份证签发机关">
        <Input
          clearable
          type="text"
          v-model="personData.issuedBy"
          placeholder="请输入身份证签发机关"
          :maxlength="100"
        ></Input>
      </FormItem>
      <FormItem label="户口所在地">
        <Input
          clearable
          type="text"
          v-model="personData.hukouPlace"
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
          v-model="personData.effectiveDate"
          @on-change="personData.effectiveDate=$event"
        ></DatePicker>
      </FormItem>
      <FormItem label="手机号" prop="phone">
        <Input
          clearable
          type="text"
          v-model="personData.phone"
          placeholder="请输入手机号"
          :maxlength="20"
        ></Input>
      </FormItem>
      <FormItem label="银行卡号" prop="bankNo">
        <Input
          clearable
          type="text"
          v-model="personData.bankNo"
          placeholder="请输入银行卡号"
          :maxlength="20"
        ></Input>
      </FormItem>
      <FormItem label="发卡银行" prop="bankName">
        <Input
          clearable
          type="text"
          v-model="personData.bankName"
          placeholder="请输入发卡银行"
          :maxlength="100"
        ></Input>
      </FormItem>
      <FormItem label="所属架子队">
        <Input clearable type="text" disabled v-model="personData.unitName"></Input>
      </FormItem>
      <FormItem label="所属工作班组">
        <Select clearable v-model="personData.deptOid" :disabled="deptDisableFlag">
          <Option value>--请选择--</Option>
          <Option
            v-for="item in deptList"
            :value="item.unitOid"
            :key="item.unitOid"
          >{{ item.unitName }}</Option>
        </Select>
      </FormItem>
      <FormItem label="进场时间" prop="inAuthDate" v-if="personData.deptOid">
        <DatePicker
          clearable
          :editable="false"
          type="date"
          placeholder="请选择进场时间"
          v-model="personData.inAuthDate"
          @on-change="personData.inAuthDate=$event"
        ></DatePicker>
      </FormItem>
      <FormItem label="所属劳务公司" prop="companyOid">
        <Select clearable v-model="personData.companyOid" filterable>
          <Option
            v-for="item in companyList"
            :value="item.companyOid"
            :key="item.companyOid"
          >{{ item.companyName }}</Option>
        </Select>
      </FormItem>

      <h2 class="title">合同信息</h2>
      <FormItem label="合同编号" prop="contractNo">
        <Input
          clearable
          type="text"
          v-model="personData.contractNo"
          placeholder="请输入合同编号"
          :maxlength="50"
        ></Input>
      </FormItem>
      <FormItem label="甲方">
        <Input type="text" disabled v-model="selectCompanyName"></Input>
      </FormItem>
      <FormItem label="乙方">
        <Input type="text" disabled v-model="personData.name"></Input>
      </FormItem>
      <FormItem label="身份证号">
        <Input type="text" disabled v-model="personData.idNo"></Input>
      </FormItem>
      <FormItem label="合同起始时间" prop="contractBegin">
        <DatePicker
          clearable
          :editable="false"
          type="date"
          :options="startTimeOption"
          @on-change="onStartTimeChange"
          placeholder="请选择合同起始时间"
          v-model="personData.contractBegin"
        ></DatePicker>
      </FormItem>
      <FormItem label="合同终止时间" prop="contractEnd">
        <DatePicker
          clearable
          :editable="false"
          type="date"
          placeholder="请选择合同终止时间"
          v-model="personData.contractEnd"
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
          v-model="personData.sigantureDate"
          @on-change="personData.sigantureDate=$event"
        ></DatePicker>
      </FormItem>
      <FormItem label="备注" style="width:98%; flex: 0 0 98%;">
        <Input
          clearable
          type="textarea"
          placeholder="请输入备注"
          :autosize="{minRows: 2,maxRows: 5}"
          v-model="personData.remark"
          :maxlength="200"
        ></Input>
      </FormItem>
    </Form>
  </div>
</template>
<script>
import utils from "@/assets/js/utils.js";
import requestApi from "@/assets/js/requestApi.js";
import {
  getDicItemList,
  getDeptList,
  checkBankNo,
  checkIdNo,
  checkPhone
} from "@/api/person";
import { getOrg } from "@/api/org";
import { listCompany } from "@/api/company";
import $ from "jquery";

export default {
  data() {
    const birthJudge = () => {
      let IdBrith = "";
      if (!this.personData.brithday) return true;
      if (this.personData.idNo.length == 15) {
        //15位的身份证默认年份是19XX年
        IdBrith =
          "19" +
          this.personData.idNo.substring(6, 8) +
          "-" +
          this.personData.idNo.substring(8, 10) +
          "-" +
          this.personData.idNo.substring(10, 12);
      } else if (this.personData.idNo.length == 18) {
        IdBrith =
          this.personData.idNo.substring(6, 10) +
          "-" +
          this.personData.idNo.substring(10, 12) +
          "-" +
          this.personData.idNo.substring(12, 14);
      }
      let birth = utils.formatDate(this.personData.brithday, "yyyy-MM-dd");
      if (birth != IdBrith) {
        return false;
      } else {
        return true;
      }
    };
    const validatePhone = (rule, value, callback) => {
      let reg = /(^1\d{10}$)/;
      if (!value) {
        callback(new Error("手机号不能为空！"));
      } else if (!reg.test(value)) {
        callback(new Error("手机号有误！"));
      } else {
        checkPhone({ phone: value }).then(res => {
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
        checkIdNo({ idNo: value }).then(res => {
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
        checkBankNo({ bankNo: value }).then(res => {
          if (res.flag) callback();
          else callback(new Error(res.message));
        }),
          err => {
            callback(new Error(err));
          };
      }
    };
    return {
      showReadIDCard:true,//是否显示读取二代身份证按钮，IE才显示其他不显示
      startTime: "",
      endTime: "",
      nationList: [], //民族列表
      deptList: [], //班组数组
      companyList: [], //劳务公司数组
      deptDisableFlag: false,
      startTimeOption: {}, //开始日期设置
      endTimeOption: {}, //结束日期设置
      personData: {},
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
        inAuthDate: [
          {
            required: true,
            message: "进场时间不能为空！",
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
        ],
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
  components: {},
  created() {
    this.personData = { ...this.personData, ...this.sentData };
    if (this.personData.deptOid) this.deptDisableFlag = true;
    this.getUnitName();
    this.getNationList();
    this.getDeptList();
    this.getCompanyList();
    this.showReadIDCard = !(utils.getExplorer()=="ie");
    console.log(utils.getExplorer())
  },
  computed: {
    selectCompanyName() {
      let company = this.companyList.find(
        item => item.companyOid == this.personData.companyOid
      );
      if (company) {
        return company.companyName;
      } else {
        return null;
      }
    }
  },
  mounted() {},
  props: ["sentData"],
  methods: {
    getUnitName() {
      getOrg(this.personData.unitOid).then(res => {
        this.personData.unitName = res.result.unitName;
      });
    },
    getDeptList() {
      getDeptList(this.personData.unitOid).then(res => {
        this.deptList = res;
      });
    },
    getCompanyList() {
      listCompany().then(res => {
        this.companyList = res.result.list;
        if (this.companyList.length && this.companyList.length === 1) {
          this.personData.companyOid = this.companyList[0].companyOid;
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
    onStartTimeChange(startTime, type) {
      this.personData.contractBegin = startTime;
      this.endTimeOption = {
        disabledDate(endTime) {
          return endTime <= new Date(startTime);
        }
      };
    },
    onEndTimeChange(endTime, type) {
      this.personData.contractEnd = endTime;
      this.startTimeOption = {
        disabledDate(startTime) {
          return startTime >= new Date(endTime);
        }
      };
    },
    handleSubmit() {
      return this.$refs.personAdd.validate(valid => {
        return valid;
      });
    },
    handleReset() {
      this.$refs.personAdd.resetFields();
    },
    getHeadImageUrl(personId) {
      this.hasHeadImage = true;
      return utils.getHeadImageUrl(requestApi.getPhoto, personId);
    },
    getDefaultHeadImageUrl(e, type) {
      this.hasHeadImage = false;
      e.target.src = require("@/assets/img/" + type + ".png");
    },
    birthChange($event) {
      this.personData.brithday = $event;
      if (this.personData.idNo) {
        this.$refs.idNo.focus();
        this.$refs.idNo.blur();
      }
    },
    getNationCode(nationName) {
      let nation = this.nationList.find(
        item => item.dicItemName == nationName + "族"
      );
      return nation && nation.dicItemCode;
    },
    //点击读二代证按钮，获取身份证号信息
    setid() {
      this.clearIDCard(); //读前清理读卡器缓存
      if (!this.readIDCard()) {
         this.$Message.error("身份证读取失败！");
        return;
      }
      var pName = CVR_IDCard.NameL;
      var pSex = CVR_IDCard.Sex;
      var pNation = CVR_IDCard.NationL;
      var pBorn = CVR_IDCard.BornL;
      var pAddress = CVR_IDCard.Address;
      var pCardNo = CVR_IDCard.CardNo;
      var pPolice = CVR_IDCard.Police;
      var pActivity = CVR_IDCard.Activity;
      var pNewAddr = CVR_IDCard.NewAddr;
      var pActivityLFrom = CVR_IDCard.ActivityLFrom;
      var pActivityLTo = CVR_IDCard.ActivityLTo;
      var pPhotoBuffer = CVR_IDCard.GetPhotoBuffer;

      this.personData.name = pName;
      this.personData.idNo = pCardNo;
      this.personData.sexCode = pSex;
      this.personData.brithday = pBorn;
      this.personData.hukouPlace = pAddress;
      this.personData.issuedBy = pPolice;
      this.personData.nationCode = this.getNationCode(pNation);
      this.personData.effectiveDate = pActivityLTo;
      $("#img_app_pic").attr("src", "data:image/gif;base64," + pPhotoBuffer);

      //ClearIDCard(); //读后清理读卡器缓存
      //CVR_IDCard.DoStopRead; //停止读卡
    },
    clearIDCard() {
      CVR_IDCard.Name = "";
      CVR_IDCard.NameL = "";
      CVR_IDCard.Sex = "";
      // CVR_IDCard.SexL="";
      CVR_IDCard.Nation = "";
      //CVR_IDCard.NationL="";
      CVR_IDCard.Born = "";
      // CVR_IDCard.BornL="";
      CVR_IDCard.Address = "";
      CVR_IDCard.CardNo = "";
      CVR_IDCard.Police = "";
      CVR_IDCard.Activity = "";
      CVR_IDCard.NewAddr = "";
      return true;
    },
    readIDCard() {
      var strReadResult = CVR_IDCard.ReadCard;
      if (strReadResult == "0") {
        return true;
      }
      return false;
    }
  },
  watch: {
    sentData(val) {
      console.log("val", val);
    }
  }
};
</script>
