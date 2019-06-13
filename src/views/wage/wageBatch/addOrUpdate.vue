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

        <template >
          <Form
            ref="formRefs"
            :model="batchData"
            :rules="ruleCustom"
            :label-width="120"
            class="add-box"
          >
            <div class="top clearfix">
              <Col span="20">
                <FormItem label="批次名称：" prop="batchName">
                  <div class="text-left">
                    <Input
                      placeholder="请输入批次名称"
                      v-model="batchData.batchName"
                      style="width: 500px"
                      :maxlength="100"
                      clearable
                    ></Input>
                  </div>
                </FormItem>

                <FormItem label="项目部名称：" prop="unitOid">
                  <div class="text-left">
                    <Select v-model="batchData.unitOid" style="width:500px" placeholder="请选择项目部" filterable>
                      <Option
                        v-for="item in orgList"
                        :value="item.unitOid"
                        :label="item.unitName"
                        :key="item.unitOid"
                      >{{ item.unitName }}</Option>
                    </Select>
                  </div>
                </FormItem>

                <FormItem label="批次描述：" prop="batchDesc">
                  <div class="text-left">
                    <Input
                      placeholder="请输入批次描述"
                      v-model="batchData.batchDesc"
                      type="textarea"
                      :autosize="{minRows: 2,maxRows: 8}"
                      style="width: 500px"
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
      batchData: {
        batchDesc: "",
        batchName: "",
        unitOid: "",
      },
      orgList: [],
      ruleCustom: {
        batchName: [
          {
            required: true,
            message: "批次名称不能为空！",
            trigger: "blur"
          }
        ],
        unitOid: [
          {
            type: 'number',
            required: true,
            message: "项目部名称不能为空！",
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
    this.batchData = { ...this.batchData, ...this.sentData };
    this.initOrgList();
  },

  mounted() { },
  props: ["sentData"],
  methods: {
    initOrgList() {
      getOrgTreeList().then(res => {
        if (res.result) {
          this.orgList = res.result.filter(item => {
            // 项目部 1 和 项目分部 2 都可以添加批次
            return (item.unitType === "1" && item.isAuth)  || (item.unitType === "2"&& item.isAuth) ;
          })

          if(this.orgList.length === 1){
            this.batchData.unitOid = this.orgList[0].unitOid;
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
      this.batchData = {};
    },



  },


};
</script>
