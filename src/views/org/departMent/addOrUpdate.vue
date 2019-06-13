<style lang="scss" scoped>
.text-ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.text-left {
  text-align: left;
}
</style>
<style>
.add-or-update .add-user .bottom .ivu-form-item-label {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
</style>

<template>
  <div class="add-or-update">
    <div class="add-user">
      <Row>
        <!-- 查看 -->
        <template v-if="departMentData.type === 'view'">
          <Form
            ref="formRefs"
            :model="departMentData"
            :rules="ruleCustom"
            :label-width="120"
            class="add-box"
            inline
          >
            <div class="top clearfix">
              <Col span="24">
                <FormItem label="姓名：">
                  <div class="text-left">{{ departMentData.userName }}</div>
                </FormItem>
                <FormItem label="组织机构：">
                  <div class="text-left">{{ departMentData.teamName }}</div>
                </FormItem>
                <FormItem label="职务级别：">
                  <div class="text-left">{{ departMentData.orgStatus }}</div>
                </FormItem>
                <FormItem label="职务：">
                  <div class="text-left">{{ departMentData.orgStatus }}</div>
                </FormItem>
              </Col>
            </div>
          </Form>
        </template>

        <template v-else>
          <Form
            ref="formRefs"
            :model="departMentData"
            :rules="ruleCustom"
            :label-width="120"
            class="add-box"
            inline
          >
            <div class="top clearfix">
              <Col span="24">
                <FormItem label="上级机构：" v-if="departMentData.parentUnitName">
                  <div
                    class="text-left text-ellipsis"
                    style="width: 300px"
                    :title="departMentData.parentUnitName "
                  >{{ departMentData.parentUnitName }}</div>
                </FormItem>
                <FormItem label="机构类型：" prop="unitType" v-if="departMentData.type === 'add'">
                  <div class="text-left">
                    <Select v-model="departMentData.unitType" style="width:300px">
                      <Option
                        v-for="item in orgTypeList"
                        :value="item.dicItemCode"
                        :key="item.dicItemCode"
                      >{{ item.dicItemName }}</Option>
                    </Select>
                  </div>
                </FormItem>
                <FormItem label="机构类型：" v-else>
                  <div class="text-left" style="width: 300px">{{ unitTypeCN }}</div>
                </FormItem>

                <FormItem label="机构名称：" prop="unitName">
                  <div class="text-left">
                    <Input
                      placeholder="请输入机构名称"
                      v-model="departMentData.unitName"
                      style="width: 300px"
                      :maxlength="100"
                      clearable
                    ></Input>
                  </div>
                  <!-- <div class="text-left" v-else>{{ departMentData.unitName }}</div> -->
                </FormItem>
                <FormItem label="机构编号：" prop="unitCode" class="code-input">
                  <div class="text-left">
                    <Input
                      placeholder="请输入机构编号"
                      v-model="departMentData.unitCode"
                      style="width: 300px"
                      :maxlength="100"
                      clearable
                    ></Input>
                  </div>
                  <!-- <div class="text-left" v-else>{{ departMentData.unitCode }}</div> -->
                </FormItem>
                <FormItem label="联系人：" prop="contacts">
                  <div class="text-left">
                    <Input
                      placeholder="请输入联系人"
                      v-model="departMentData.contacts"
                      style="width: 300px"
                      :maxlength="50"
                      clearable
                    ></Input>
                  </div>
                </FormItem>
                <FormItem label="联系电话：" prop="phone">
                  <div class="text-left">
                    <Input
                      placeholder="请输入联系电话"
                      v-model="departMentData.phone"
                      style="width: 300px"
                      :maxlength="20"
                      clearable
                    ></Input>
                  </div>
                </FormItem>
              </Col>
            </div>
          </Form>
        </template>
      </Row>
    </div>
  </div>
</template>

<script>
import utils from "@/assets/js/utils.js";
import { getOrgType } from "@/api/org.js";

export default {
  data() {
    const validatePhone = (rule, value, callback) => {
      // let reg = /(^1[3|4|5|7|8]\d{9}$)|(^09\d{8}$)/;
      let reg = /^\d+$/;

      if (this.departMentData.phone && !reg.test(this.departMentData.phone)) {
        callback(new Error("仅能输入数字！"));
      } else {
        callback();
      }
    };
    const validateUnitCode = (rule, value, callback) => {
      let node = document.querySelector('.code-input');
      if (this.departMentData.unitType === "1") {
        node.classList.remove("ivu-form-item-error");
        callback();
      } else if (!value) {
        callback(new Error("机构编号不能为空！"));
      } else {
        callback();
      }
    };
    const validateUnitType = (rule, value, callback) => {
      if (!this.departMentData.unitType) {
        callback(new Error("机构类型不能为空！"));
      } else {
        callback();
      }
    };



    return {
      departMentData: {
        phone: "",
        contacts: ""
      },
      hasHeadImage: false, // 是否含有头像，默认没有
      orgTypeList: [],
      ruleCustom: {
        unitType: [
          {
            required: true,
            message: "机构类型不能为空！",
            trigger: "change",
            validator: validateUnitType
          }
        ],
        unitName: [
          {
            required: true,
            message: "机构名称不能为空！",
            trigger: "blur"
          }
        ],
        unitCode: [
          {
            required: true,
            validator: validateUnitCode,
            trigger: "blur"
          }
        ],
        phone: [
          {
            required: false,
            validator: validatePhone,
            trigger: "blur"
          }
        ]
      }
    };
  },

  components: {},

  computed: {
    unitTypeCN() {
      switch (this.departMentData.unitType) {
        case "1":
          return "项目部";
          break;
        case "2":
          return "项目分部";
          break;
        case "3":
          return "架子队";
          break;
        case "4":
          return "班组";
          break;
        default:
          return "未知类型";
          break;
      }
    }
  },

  created() {
    this.departMentData = { ...this.departMentData, ...this.sentData };
    this.initOrgType();

  },

  mounted() { },
  props: ["sentData"],
  methods: {
    initOrgType() {
      const pId = this.departMentData.parentUnitOid || null;
      console.log(2131231231);
      
      getOrgType(pId).then(res => {
        if (res) {
          this.orgTypeList = res.result;
          // 如果select有且仅有一个选择，默认选中
          if (this.orgTypeList.length && this.orgTypeList.length === 1) {
            this.departMentData.unitType = (this.orgTypeList[0].dicItemCode);
          }
        }

      }),
        err => {
          this.$Message.error(err);
        };
    },
    handleSubmit(name) {
      let type = null;
      this.$refs[name].validate(valid => {
        return (type = valid ? true : false);
      });
      return type;
    },
    handleReset(name) {
      this.$refs.formRefs.resetFields();
    },
    removeData() {
      this.departMentData = {};
    },

    getHeadImageUrl(personId) {
      this.hasHeadImage = true;
      return utils.getHeadImageUrl(requestApi.getPhoto, personId);
    },
    getDefaultHeadImageUrl(e, type) {
      this.hasHeadImage = false;
      e.target.src = require("@/assets/img/" + type + ".png");
    },


  },

  watch: {
    "departMentData.unitType"(value) {
      let node = document.querySelector('.code-input');
      if (this.departMentData.unitType === "1") {
        node.classList.remove("ivu-form-item-error");
        node.classList.remove('ivu-form-item-required');
      } else {
        node.classList.add('ivu-form-item-required');
      }
    },


  }
};
</script>
