<style scoped lang="scss">
@import "./login.scss";
</style>
<style>
.loginPage .logon-center .ivu-input {
  width: 350px;
  height: 50px;
  line-height: 50px;
  font-size: 14px;
  background: rgba(252, 252, 252, 0.9);
  border: 1px solid #fff;
  border-radius: 0;
}

.loginPage .logon-center .ivu-input-suffix {
  line-height: 50px;
}
.loginPage .logon-center .ivu-form-item-error-tip {
  padding-top: 6px;
}
</style>

<template>
  <div class="loginPage">
    <div class="logon-center">
      <h1 class="login-title">农民工实名制工资管理系统</h1>
      <div class="login-top">
        <Form
          ref="refInitForm"
          class="initForm"
          :model="initForm"
          :rules="ruleInitForm"
          :label-width="0"
          @submit.native.prevent
        >
          <div class="form-item-wrap">
            <div class="login-icon-wrap">
              <Icon custom="i-icon icon-user" size="18"/>
            </div>
            <FormItem prop="logoName">
              <Input
                v-model="initForm.logoName"
                type="text"
                placeholder="手机号/用户名"
                @on-enter="logoSubmit('refInitForm')"
                autofocus
              />
            </FormItem>
          </div>

          <div class="form-item-wrap">
            <div class="login-icon-wrap">
              <Icon custom="i-icon icon-password" size="18"/>
            </div>
            <FormItem prop="logoPassword">
              <Input
                v-model="initForm.logoPassword"
                :type="passwordType"
                size="large"
                placeholder="密码"
                @on-enter="logoSubmit('refInitForm')"
              >
                <Icon
                  slot="suffix"
                  :type="passwordEye"
                  size="24"
                  @click.native="showPassword(true)"
                />
              </Input>
            </FormItem>
          </div>
          <div class="login-btn-wrap">
            <Button
              class="login-btn"
              type="primary"
              shape="circle"
              :loading="loginLoading"
              @click="logoSubmit('refInitForm')"
            >登录</Button>
          </div>
        </Form>
      </div>

      <p class="tips">推荐使用谷歌浏览器（分辨率1360-1920）</p>
    </div>
  </div>
</template>
<script>
import utils from "@/assets/js/utils.js";
import requestApi from "@/assets/js/requestApi.js";
import JSEncrypt from "jsencrypt";
import Fingerprint2 from "fingerprintjs2";
import { login, logout, getRSAPublicKey } from "@/api/user";
import { mapActions } from "vuex";
export default {
  components: {},
  data() {
    return {
      RASKey: null, // 公钥
      deviceId: null, //设备id，目前pc是获取浏览器的canvas指纹
      passwordType: "password", // 默认密码输入框的type为password
      passwordEye: "ios-eye-off", //密码输入框右侧提示icon
      loginLoading: false,
      // 表单配置_start
      initForm: {
        logoName: "",
        logoPassword: ""
      },
      ruleInitForm: {
        logoName: [
          {
            required: true,
            message: "账号不能为空",
            trigger: "change"
          }
          // { type: 'number', min: '11', message: '账号为11为手机号码', trigger: 'change' }
        ],
        logoPassword: [
          {
            required: true,
            message: "密码不能为空",
            trigger: "change"
          }
        ]
      }
      // 表单配置_end
    };
  },
  created() {
    this.hashChangeByIE();
  },
  mounted() {
    // this.canvasFingerprint();
  },
  methods: {
    ...mapActions(["handleLogin"]),
    /**
     * vue-route的bug，IE下，会出现hash跳转，但页面不跳转的情况，这里需要额外跳转一次；
     */
    hashChangeByIE() {
      if (utils.myBrowser() === "IE") {
        window.addEventListener(
          "hashchange",
          () => {
            const currentPath = window.location.hash.slice(1);
            if (this.$route.path !== currentPath) {
              this.$router.push(currentPath);
            }
          },
          false
        );
      }
    },
    //
    showPassword() {
      if (this.passwordType === "password") {
        this.passwordType = "text";
        this.passwordEye = "ios-eye";
      } else {
        this.passwordType = "password";
        this.passwordEye = "ios-eye-off";
      }
    },

    //生成canvas 指纹
    canvasFingerprint() {
      const that = this;
      if (window.requestIdleCallback) {
        requestIdleCallback(function() {
          Fingerprint2.get(function(components) {
            that.deviceId = Fingerprint2.x64hash128(
              components
                .map(function(pair) {
                  return pair.value;
                })
                .join(),
              31
            );
            return that.deviceId;
          });
        });
      } else {
        setTimeout(function() {
          Fingerprint2.get(function(components) {
            that.deviceId = Fingerprint2.x64hash128(
              components
                .map(function(pair) {
                  return pair.value;
                })
                .join(),
              31
            );
            return that.deviceId;
          });
        }, 500);
      }
    },
    // 提交登录
    logoSubmit(name) {
      this.loginLoading = true;

      // 接口数据
      this.$refs[name].validate(valid => {
        if (!valid) {
          this.loginLoading = false;
          return false;
        }
        const sendData = {
          accountNo: this.initForm.logoName.trim(),
          channel: "PC", // 固定值，移动端为mobike，pc为PC
          deviceId: ""
        };

        return new Promise((resolve, reject) => {
          getRSAPublicKey()
            .then(res => {
              this.loginLoading = false;
              if (res) {
                this.RASKey = res.result;
                if (this.RASKey) {
                  const encrypt = new JSEncrypt(); // 实例化加密对象
                  encrypt.setPublicKey(this.RASKey); // 设置公钥
                  var psw = encrypt.encrypt(this.initForm.logoPassword); // 加密明文
                }
                if (psw) {
                  sendData.password = psw;
                  // sendData.deviceId = this.deviceId;
                  sendData.deviceId = 123456789;
                }
                resolve();
              }
            })
            .catch(err => {
              this.loginLoading = false;
              reject(err);
            });
        }).then(() => {
          this.handleLogin(sendData)
            .then(res => {
              this.hashChangeByIE();
              this.$router.push({ name: "index" });
            })
            .catch(error => {
              this.loginLoading = false;
            });
        });
      });
    }
  },
  watch: {}
};
</script>
