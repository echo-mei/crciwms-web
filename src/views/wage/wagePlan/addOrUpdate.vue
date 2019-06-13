<style lang="scss" scoped></style>
<style>
.add-or-updata .add-user .bottom .ivu-form-item-label {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
</style>

<template>
  <div class="add-or-updata">
    <div class="add-user">
      <Row>
        <!-- 查看 -->
        <template v-if="planData.type === 'view'">
          <Form
            ref="formRefs"
            :model="planData"
            :rules="ruleCustom"
            :label-width="120"
            class="add-box"
          >
            <div class="top clearfix">
              <Col span="24">
                <FormItem label="姓名：">
                  <div class="text-left">{{ planData.userName }}</div>
                </FormItem>
                <FormItem label="组织机构：">
                  <div class="text-left">{{ planData.teamName }}</div>
                </FormItem>
                <FormItem label="职务级别：">
                  <div class="text-left">{{ planData.orgStatus }}</div>
                </FormItem>
                <FormItem label="职务：">
                  <div class="text-left">{{ planData.orgStatus }}</div>
                </FormItem>
              </Col>
            </div>
          </Form>
        </template>

        <template v-else>
          <Form
            ref="formRefs"
            :model="planData"
            :rules="ruleCustom"
            :label-width="120"
            class="add-box"
          >
            <div class="top clearfix">
              <Col span="20">
                <FormItem label="计划名称：" prop="planName">
                  <div class="text-left">
                    <Input
                      placeholder="请输入计划名称"
                      v-model="planData.planName"
                      :maxlength="100"
                      clearable
                    ></Input>
                  </div>
                </FormItem>

                <FormItem label="架子队名称：" prop="unitOid">
                  <div class="text-left">
                    <Select v-model="planData.unitOid" placeholder="请选择架子队" filterable>
                      <Option
                        v-for="item in orgList"
                        :value="item.unitOid"
                        :label="item.unitName"
                        :key="item.unitOid"
                      >{{ item.unitName }}</Option>
                    </Select>
                  </div>
                </FormItem>

                <FormItem label="计划描述：" prop="planDesc">
                  <div class="text-left">
                    <Input
                      placeholder="请输入计划描述"
                      v-model="planData.planDesc"
                      type="textarea"
                      :autosize="{minRows: 2,maxRows: 8}"
                      :maxlength="1000"
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
import { getOrgTreeList } from "@/api/org.js";

export default {
  data() {

    return {
      planData: {
        planDesc: "",
        planName: "",
        unitOid: "",
      },
      orgList: [],
      ruleCustom: {
        planName: [
          {
            required: true,
            message: "计划名称不能为空！",
            trigger: "blur"
          }
        ],
        unitOid: [
          {
            type: 'number',
            required: true,
            message: "架子队名称不能为空！",
            trigger: 'change'
          }
        ],

      }
    };
  },

  components: {},

  computed: {

  },

  created() {
    this.planData = { ...this.planData, ...this.sentData };
    this.initOrgList();
  },

  mounted() { },
  props: ["sentData"],
  methods: {
    initOrgList() {
      getOrgTreeList().then(res => {
        if (res.result) {
          this.orgList = res.result.filter(item => {
            return item.unitType === "3" && item.isAuth;
          })
          if(this.orgList.length === 1){
            this.planData.unitOid = this.orgList[0].unitOid;
          }
        }
      })
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
      this.planData = {};
    },



  },


};
</script>
