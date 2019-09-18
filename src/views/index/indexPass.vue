<template>
  <!-- 密码修改弹框 -->
  <Modal
    v-model="passModal"
    title="修改密码"
    width="700"
    @on-cancel="passHandleCancel"
    :mask-closable="maskClosable"
  >
  <div v-if="this.passModal">
    <div class="eg">
      <span>温馨提示：</span>
      <p>
        1.密码应包含至少一位大写字母，小写字母和数字等，比如：
        <span class="blue-text">Asa88888</span>
      </p>
      <p>
        2.密码位数在
        <span class="blue-text">8位</span>与
        <span class="blue-text">16位</span>之间（含8位和16位）
      </p>
    </div>
    <Form
      :label-width="130"
      ref="passformValidate"
      :model="dpassformValidate"
      :rules="passruleValidate"
    >
      <FormItem label="当前密码" prop="oldPassword">
        <Input
          placeholder="请输入当前密码"
          v-model="dpassformValidate.oldPassword"
          type="password"
          clearable
          onpaste="return false"
        />
      </FormItem>
      <FormItem label="新密码" prop="password1">
        <Input
          placeholder="请输入新密码"
          v-model="dpassformValidate.password1"
          type="password"
          clearable
          onpaste="return false"
        />
      </FormItem>
      <FormItem label="确认新密码" prop="password2">
        <Input
          placeholder="请再次输入新密码"
          v-model="dpassformValidate.password2"
          type="password"
          clearable
          onpaste="return false"
        />
      </FormItem>
    </Form>
  </div>
    <div slot="footer">
      <Button type="primary" style="width:90px" @click="passHandleOk">保存</Button>
      <Button type="dashed" style="width:90px" @click="passHandleCancel">取消</Button>
    </div>
  </Modal>
</template>
<script>
import requestApi from "@/assets/js/requestApi.js";
export default {
  props: ["userInfo"],
  data() {
    //新密码校验
    const passValidate = (rule, value, callback) => {
      var pass = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{8,16}$/;
      if (value === "") {
        callback(new Error("密码不能为空"));
      } else {
        if (pass.test(value)) {
          callback();
        } else {
          callback(new Error("密码应包含至少一位大写字母、小写字母和数字"));
        }
      }
    };
    //密码去空格校验
    const passSpaceValidate = (rule, value, callback) => {
      if (value.indexOf(" ") >= 0) {
        callback(new Error("密码不能有空格"));
      } else {
        callback();
      }
    };
    //确认密码输入校验
    const validatePassCheck = (rule, value, callback) => {
      if (value === "" && this.dpassformValidate.password1 !== "") {
        callback(new Error("请再次输入密码"));
      } else {
        if (value != this.dpassformValidate.password1) {
          callback(new Error("两次密码不匹配"));
        } else {
          callback();
        }
      }
    };
    //当输入确认密码时，密码不能为空
    const passNo = (rule, value, callback) => {
      if (this.dpassformValidate.password1 === "") {
       // this.$refs.passformValidate.validateField("password1");
      }
      callback();
    };
    return {
      passModal: false,
      dpassformValidate: {
        oldPassword: "",
        password1: "",
        password2: ""
      },
      passruleValidate: {
        oldPassword: [
          {
            required: true,
            message: "当前密码不能为空",
            trigger: "change"
          }
        ],
        password1: [
          { required: true, message: "密码不能为空", trigger: "change" },
          { min: 8, message: "最少输入8位", trigger: "blur" },
          { max: 16, message: "最多输入16位", trigger: "change" },
          { validator: passSpaceValidate, trigger: "change" },
          { validator: passValidate, trigger: "default" }
        ],
        password2: [
          { required: true, message: "请再次输入密码", trigger: "change" },
          { validator: passNo, trigger: "change" },
          {
            validator: validatePassCheck,
            trigger: "blur"
          }
        ]
      },
      maskClosable: false
    };
  },
  methods: {
    passformCheck() {
      this.$refs.passformValidate.validate(valid => {
        if (valid) {
          this.$axios
            .post(requestApi.updatePass, {
              accountNo: this.userInfo.accountNo,
              oldPassword: this.dpassformValidate.oldPassword,
              password1: this.dpassformValidate.password1,
              password2: this.dpassformValidate.password2
            })
            .then(({ flag }) => {
              this.$refs.passformValidate.resetFields();           
              if (flag) {
                this.passModal = false;
                this.$Message.success({
                  content: "密码修改成功",
                  onClose: () => {
                    this.$emit("clogout");
                  }
                });
              } else {
                // this.$Message.error("密码修改失败");
              }
            });
        } else {
          // this.$Message.error("请正确填写相关数据!");
        }
      });
    },
    openPassModal() {
      this.passModal = true;
    },
    passHandleOk() {
      this.passformCheck();
    },
    passHandleCancel() {
      this.passModal = false;
      this.$refs.passformValidate.resetFields();
    }
  }
};
</script>
<style lang="scss">
.eg {
  margin-bottom: 15px;
  text-align: left;
  p {
    line-height: 30px;
    text-indent: 2em;
    .blue-text {
      color: #39f;
    }
  }
}
</style>

