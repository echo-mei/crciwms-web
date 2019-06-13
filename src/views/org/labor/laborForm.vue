<template>
  <div>
    <!-- 新增 -->
    <Modal
      v-model="addModal"
      title="新增劳务公司"
      width="1000"
      @on-cancel="addHandleCancel"
      :mask-closable="maskClosable"
    >
      <div class="laborForm" :style="{height:cpropMaxHeight+'px'}" v-if="this.addModal">
        <Form
          :label-width="150"
          :rules="ruleValidate"
          ref="addformValidate"
          :model="addformValidate"
        >
          <FormItem label="劳务公司名称" prop="companyName" class="allWid">
            <Input placeholder="请输入劳务公司名称" v-model="addformValidate.companyName" clearable/>
          </FormItem>
          <FormItem label="统一社会信用代码" prop="corporationCode">
            <Input placeholder="请输入统一社会信用代码" v-model="addformValidate.corporationCode" clearable/>
          </FormItem>
          <FormItem label="法定代表人" prop="responsePerson">
            <Input placeholder="请输入法定代表人" v-model="addformValidate.responsePerson" clearable/>
          </FormItem>
          <FormItem label="注册地址" prop="registerPalce" class="allWid">
            <Input placeholder="请输入注册地址" v-model="addformValidate.registerPalce" clearable/>
          </FormItem>
          <FormItem label="邮政编码" prop="zipcode">
            <Input placeholder="请输入邮政编码" v-model="addformValidate.zipcode" clearable type="number"/>
          </FormItem>
          <FormItem label="注册资本(万)" prop="registerCapital">
            <Input placeholder="请输入注册资本" v-model="addformValidate.registerCapital" clearable/>
          </FormItem>
          <FormItem label="成立日期" prop="establishedDate">
            <DatePicker
              type="date"
              placeholder="请选择日期"
              v-model="addformValidate.establishedDate "
              format="yyyy-MM-dd"
              :editable="isEditable"
              @on-change="addformValidate.establishedDate =$event"
              @on-open-change="initDatePick"
            ></DatePicker>
          </FormItem>
          <FormItem label="联系人" prop="contacts">
            <Input placeholder="请输入联系人" v-model="addformValidate.contacts" clearable/>
          </FormItem>
          <FormItem label="email" prop="email">
            <Input placeholder="请输入邮箱" v-model="addformValidate.email" clearable/>
          </FormItem>
          <FormItem label="手机号" prop="phone">
            <Input placeholder="请输入手机号" v-model="addformValidate.phone" clearable :maxlength="11" />
          </FormItem>
          <FormItem label="固定电话" prop="mobilePhone">
            <Input placeholder="请输入固定电话" v-model="addformValidate.mobilePhone" clearable/>
          </FormItem>
          <FormItem label="联系地址" prop="address">
            <Input placeholder="请输入联系地址" v-model="addformValidate.address" clearable/>
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <Button type="primary" style="width:90px" @click="addHandleOk">保存</Button>
        <Button type="dashed" style="width:90px" @click="addHandleCancel">取消</Button>
      </div>
    </Modal>
    <!-- 修改-->
    <Modal
      v-model="modModal"
      title="修改劳务公司"
      width="1000"
      @on-cancel="modHandleCancel"
      :mask-closable="maskClosable"
    >
      <div class="laborForm" :style="{height:cpropMaxHeight+'px'}" v-if="this.modModal">
        <Form
          :label-width="150"
          :rules="modruleValidate"
          ref="modformValidate"
          :model="modformValidate"
        >
          <FormItem label="劳务公司名称" prop="companyName" class="allWid">
            <Input placeholder="请输入劳务公司名称" v-model="modformValidate.companyName" clearable/>
          </FormItem>
          <FormItem label="统一社会信用代码" prop="corporationCode">
            <Input placeholder="请输入统一社会信用代码" v-model="modformValidate.corporationCode" clearable/>
          </FormItem>
          <FormItem label="法定代表人" prop="responsePerson">
            <Input placeholder="请输入法定代表人" v-model="modformValidate.responsePerson" clearable/>
          </FormItem>
          <FormItem label="注册地址" prop="registerPalce">
            <Input placeholder="请输入注册地址" v-model="modformValidate.registerPalce" clearable/>
          </FormItem>
          <FormItem label="邮政编码" prop="zipcode">
            <Input placeholder="请输入邮政编码" v-model="modformValidate.zipcode" clearable type="number"/>
          </FormItem>
          <FormItem label="注册资本(万)" prop="registerCapital">
            <Input placeholder="请输入注册资本" v-model="modformValidate.registerCapital" clearable/>
          </FormItem>
          <FormItem label="成立日期" prop="establishedDate">
            <DatePicker
              type="date"
              placeholder="请选择日期"
              format="yyyy-MM-dd"
              v-model="modformValidate.establishedDate "
              :editable="isEditable"
              @on-change="modformValidate.establishedDate =$event"
              @on-open-change="initDatePick"
            ></DatePicker>
          </FormItem>
          <FormItem label="联系人" prop="contacts">
            <Input placeholder="请输入联系人" v-model="modformValidate.contacts" clearable/>
          </FormItem>
          <FormItem label="email" prop="email">
            <Input placeholder="请输入邮箱" v-model="modformValidate.email" clearable/>
          </FormItem>
          <FormItem label="手机号" prop="phone">
            <Input placeholder="请输入手机号" v-model="modformValidate.phone" clearable :maxlength="11" />
          </FormItem>
          <FormItem label="固定电话" prop="mobilePhone">
            <Input placeholder="请输入固定电话" v-model="modformValidate.mobilePhone" clearable/>
          </FormItem>
          <FormItem label="联系地址" prop="address">
            <Input placeholder="请输入联系地址" v-model="modformValidate.address" clearable/>
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <Button type="primary" style="width:90px" @click="modHandleOk">保存</Button>
        <Button type="dashed" style="width:90px" @click="modHandleCancel">取消</Button>
      </div>
    </Modal>
    <!-- 查看 -->
    <Modal
      v-model="viewModal"
      title="查看劳务公司"
      width="1000"
      @on-cancel="viewHandleClose"
      :mask-closable="maskClosable"
      class="viewLabor"
    >
      <div class="laborForm" :style="{height:cpropMaxHeight+'px'}" v-if="this.viewModal" >
        <Form :label-width="150">
          <FormItem label="劳务公司名称：" class="allWid">
            <p>{{viewformValidate.companyName}}</p>
          </FormItem>
          <FormItem label="统一社会信用代码：">
            <p>{{viewformValidate.corporationCode}}</p>
          </FormItem>
          <FormItem label="法定代表人：">
            <p>{{viewformValidate.responsePerson}}</p>
          </FormItem>
          <FormItem label="注册地址：">
            <p>{{viewformValidate.registerPalce}}</p>
          </FormItem>
          <FormItem label="邮政编码：">
            <p>{{viewformValidate.zipcode}}</p>
          </FormItem>
          <FormItem label="注册资本(万)：">
            <p>{{viewformValidate.registerCapital}}</p>
          </FormItem>
          <FormItem label="成立日期：">
            <p>{{viewformValidate.establishedDate}}</p>
          </FormItem>
          <FormItem label="联系人：">
            <p>{{viewformValidate.contacts}}</p>
          </FormItem>
          <FormItem label="email：">
            <p>{{viewformValidate.email}}</p>
          </FormItem>
          <FormItem label="手机号：">
            <p>{{viewformValidate.phone}}</p>
          </FormItem>
          <FormItem label="固定电话：">
            <p>{{viewformValidate.mobilePhone}}</p>
          </FormItem>
          <FormItem label="联系地址：">
            <p>{{viewformValidate.address}}</p>
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <Button type="primary" style="width:90px" @click="viewHandleClose">关闭</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import requestApi from "@/assets/js/requestApi.js";
import utils from "@/assets/js/utils.js";
export default {
  props: ["modformValidate", "viewformValidate", "cpropMaxHeight"],
  data() {
    //电话号码校验
    const validateMobilePhone = (rule, value, callback) => {
      //var mobilePhone = /^0\d{2,3}-?\d{1,16}$/;
      //var mobilePhone =/^[a-zA-Z\u4e00-\u9fa5]+$/ ;
      var mobilePhone = /.*[a-zA-Z\u4e00-\u9fa5]+.*$/;
      if (value.length > 20) {
        callback(new Error("最多输入20位"));
      } else {
        if (mobilePhone.test(value)) {
          callback(new Error("请输入正确的固定电话"));
        } else {
          callback();
        }
      }
    };
    //资本
    const validateCap = (rule, value, callback) => {
      if ($.trim(value) >= 0) {
        callback();
      } else {
        callback(new Error("请输入合法的数值"));
      }
    };
    const validateCapl = (rule, value, callback) => {
      const validateCapl = /^(([1-9]{1}\d{0,4})|(0{1}))(\.\d{0,4})?$/gm;
      if (validateCapl.test(value) || $.trim(value) === "") {
        callback();
      } else {
        callback(new Error("注册资本数值最大为5位整数，4位小数"));
      }
    };

    //手机号校验
    const validatePhone = (rule, value, callback) => {
      var phone = /(^1[2|3|4|5|7|8|9]\d{9}$)/;
      if (phone.test(value) || $.trim(value) === "") {
        callback();
      } else {
        callback(new Error("请填写正确的手机号"));
      }
    };
    //邮箱校验
    const validateEmail = (rule, value, callback) => {
      var email = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
      if (email.test(value) || $.trim(value) === "") {
        callback();
      } else {
        callback(new Error("请填写正确的邮箱"));
      }
    };
    //社会代码格式校验

    //社会代码校验
    const validateCorporationCode = (rule, value, callback) => {
      var CorporationCode = /^[0-9A-Z]*$/g;
      if (CorporationCode.test(value)) {
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
          this.$axios
            .get(requestApi.checkCompany, {
              params: { corporationCode: value }
            })
            .then(({ flag }) => {
              flag ? callback() : callback(new Error("统一社会信用代码重复"));
            });
        }, 0);
      } else {
        callback(new Error("信用代码由数字和大写字母(不包括小写)组成"));
      }
    };
    //社会代码校验--修改
    const movalidateCorporationCode = (rule, value, callback) => {
      var CorporationCode = /^[0-9A-Z]*$/g;
      this.$nextTick(() => {
        if (value != this.oldModCorporationCode) {
          if (CorporationCode.test(value)) {
            clearTimeout(this.timer);
            this.timer = setTimeout(() => {
              this.$axios
                .get(requestApi.checkCompany, {
                  params: { corporationCode: value }
                })
                .then(({ flag }) => {
                  flag
                    ? callback()
                    : callback(new Error("统一社会信用代码重复"));
                });
            }, 0);
          } else {
            callback(new Error("信用代码由数字和大写字母(不包括小写)组成"));
          }
        } else {
          callback();
        }
      });
    };
    return {
      isEditable: false,
      maskClosable: false,
      timer: null,
      modTimer: null,
      oldModCorporationCode: 0,
      addModal: false,
      modModal: false,
      viewModal: false,
      addformValidate: {
        companyName: "",
        corporationCode: "",
        responsePerson: "",
        registerPalce: "",
        registerCapital: "",
        establishedDate: "",
        contacts: "",
        mobilePhone: "",
        zipcode: "",
        phone: "",
        email: "",
        address: ""
      },
      ruleValidate: {
        companyName: [
          {
            required: true,
            message: "劳务公司名称不能为空",
            trigger: "change"
          },
          {
            max: 50,
            message: "最多输入50字符",
            trigger: "change"
          }
        ],
        corporationCode: [
          {
            required: true,
            message: "社会信用代码不能为空",
            trigger: "change"
          },
          {
            max: 18,
            message: "最多输入18位",
            trigger: "change"
          },
          {
            validator: validateCorporationCode,
            trigger: "default"
          }
        ],
        responsePerson: [
          {
            max: 50,
            message: "最多输入50字符",
            trigger: "change"
          }
        ],
        registerPalce: [
          {
            max: 50,
            message: "最多输入50字符",
            trigger: "change"
          }
        ],
        zipcode: [{ max: 6, message: "最多输入6位数", trigger: "change" }],
        registerCapital: [
          {
            validator: validateCap,
            trigger: "blur"
          },
          {
            validator: validateCapl,
            trigger: "blur"
          },
          {
            max: 10,
            message: "最多输入10位",
            trigger: "change",
            transform(value) {
              return String(value);
            }
          }
        ],
        contacts: [
          {
            max: 25,
            message: "最多输入25字符",
            trigger: "change"
          }
        ],
        email: [
          { max: 20, message: "最多输入20位", trigger: "change" },
          { validator: validateEmail, trigger: "blur" }
        ],
        phone: [
          { max: 11, message: "最多输入11位数", trigger: "change" },
          { validator: validatePhone, trigger: "blur" }
        ],
        mobilePhone: [
          {
            max: 20,
            message: "最多输入20字符",
            trigger: "change"
          },
          {
            validator: validateMobilePhone,
            trigger: "blur"
          }
        ],
        address: [
          {
            max: 50,
            message: "最多输入50字符",
            trigger: "change"
          }
        ]
      },
      modruleValidate: {
        companyName: [
          {
            required: true,
            message: "劳务公司名称不能为空",
            trigger: "change"
          },
          {
            max: 50,
            message: "最多输入50字符",
            trigger: "change"
          }
        ],
        corporationCode: [
          {
            required: true,
            message: "社会信用代码不能为空",
            trigger: "change"
          },
          {
            max: 18,
            message: "最多输入18位",
            trigger: "change"
          },
          {
            validator: movalidateCorporationCode,
            trigger: "default"
          }
        ],
        responsePerson: [
          {
            max: 50,
            message: "最多输入50字符",
            trigger: "change"
          }
        ],
        registerPalce: [
          {
            max: 50,
            message: "最多输入50字符",
            trigger: "change"
          }
        ],
        zipcode: [{ max: 6, message: "最多输入6位数", trigger: "change" }],
        registerCapital: [
          {
            validator: validateCap,
            trigger: "blur"
          },
          {
            validator: validateCapl,
            trigger: "blur"
          },
          {
            max: 10,
            message: "最多输入10位",
            trigger: "change",
            transform(value) {
              return String(value);
            }
          }
        ],
        contacts: [
          {
            max: 25,
            message: "最多输入25字符",
            trigger: "change"
          }
        ],
        email: [
          { max: 20, message: "最多输入20位", trigger: "change" },
          { validator: validateEmail, trigger: "blur" }
        ],
        phone: [
          { max: 11, message: "最多输入11位数", trigger: "change" },
          { validator: validatePhone, trigger: "blur" }
        ],
        mobilePhone: [
          {
            max: 20,
            message: "最多输入20字符",
            trigger: "change"
          },
          {
            validator: validateMobilePhone,
            trigger: "blur"
          }
        ],
        address: [
          {
            max: 50,
            message: "最多输入50字符",
            trigger: "change"
          }
        ]
      }
    };
  },
  computed: {},
  methods: {
    addformReset() {
      this.$refs.addformValidate.resetFields();
    },
    addformCheck() {
      //新增校验
      this.$refs.addformValidate.validate(valid => {
        if (valid) {
          this.$axios
            .post(requestApi.addCompany, {
              companyName: this.addformValidate.companyName,
              corporationCode: this.addformValidate.corporationCode,
              responsePerson: this.addformValidate.responsePerson,
              registerPalce: this.addformValidate.registerPalce,
              registerCapital: this.addformValidate.registerCapital,
              establishedDate: this.addformValidate.establishedDate,
              contacts: this.addformValidate.contacts,
              mobilePhone: this.addformValidate.mobilePhone,
              email: this.addformValidate.email,
              phone: this.addformValidate.phone,
              zipcode: this.addformValidate.zipcode,
              address: this.addformValidate.address
            })
            .then(({ flag }) => {
              this.addformReset();
              this.addModal = false;
              if (flag) {
                this.$Message.success("添加劳务公司成功");
                this.$emit("refreshTable");
              } else {
                // this.$Message.error("添加劳务公司失败");
              }
            });
        } else {
          // this.$Message.error("请正确填写相关数据!");
        }
      });
    },
    modformReset() {
      this.$refs.modformValidate.resetFields();
    },
    modformCheck() {
      //修改校验
      this.$refs.modformValidate.validate(valid => {
        if (valid) {
          this.modformValidate.establishedDate = utils.formatDate(
            this.modformValidate.establishedDate,
            "yyyy-MM-dd"
          );
          this.$axios
            .put(
              requestApi.updateCompany + "/" + this.modformValidate.companyOid,
              {
                companyOid: this.modformValidate.companyOid,
                companyName: this.modformValidate.companyName,
                corporationCode: this.modformValidate.corporationCode,
                responsePerson: this.modformValidate.responsePerson,
                registerPalce: this.modformValidate.registerPalce,
                registerCapital: this.modformValidate.registerCapital,
                establishedDate: this.modformValidate.establishedDate,
                contacts: this.modformValidate.contacts,
                mobilePhone: this.modformValidate.mobilePhone,
                email: this.modformValidate.email,
                phone: this.modformValidate.phone,
                zipcode: this.modformValidate.zipcode,
                address: this.modformValidate.address
              }
            )
            .then(({ flag }) => {
              this.modformReset();
              this.modModal = false;
              if (flag) {
                this.$Message.success("修改劳务公司成功");
                this.$emit("refreshTable");
              } else {
                // this.$Message.error("修改劳务公司失败");
              }
            });
        } else {
          // this.$Message.error("请正确填写相关数据!");
        }
      });
    },
    openAddmodal() {
      this.addModal = true;
    },
    openModmodal() {
      this.modModal = true;
      this.oldModCorporationCode = this.modformValidate.corporationCode;
    },
    openViewmodal() {
      this.viewModal = true;
    },
    addHandleOk() {
      this.addformCheck();
    },
    addHandleCancel() {
      this.addModal = false;
      this.addformReset();
    },
    modHandleOk() {
      this.modformCheck();
    },
    modHandleCancel() {
      this.modModal = false;
      this.modformReset();
    },
    viewHandleClose() {
      this.viewModal = false;
    },
    initDatePick() {
      utils.initDate();
    }
  }
};
</script>

