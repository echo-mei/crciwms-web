<template>
  <div>
    <!-- 新增 -->
    <Modal
      v-model="addModal"
      title="新增用户"
      width="1000"
      @on-cancel="addHandleCancel"
      :mask-closable="maskClosable"
    >
      <Form
        :label-width="130"
        :inline="true"
        ref="addformValidate"
        :model="addformValidate"
        :rules="addruleValidate"
        class="userssForm"
        v-if="this.addModal"
      >
        <FormItem label="登录账号" prop="accountNo" >
          <Input placeholder="请输入登录账号" v-model="addformValidate.accountNo" clearable/>
        </FormItem>
        <FormItem label="用户姓名" prop="userName" >
          <Input placeholder="请输入用户姓名" v-model="addformValidate.userName" clearable/>
        </FormItem>
        <FormItem label="用户类型" prop="userType" >
          <Select v-model="addformValidate.userType" placeholder="请选择用户类型" filterable clearable>
            <Option v-for="item in userTypes" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
        <FormItem label="所属组织机构" prop="unitOid">
          <treeSelect
            :hideUnitType="4"
            :defaultKey="addformValidate.unitOid"
            :validateFail="validateFail"
            class="ivu-select"
            @on-select-node="onAddSelectNode"
            v-if="addModal"
          ></treeSelect>
        </FormItem>
        <FormItem label="有效截止日期" prop="expiredDate" >
          <DatePicker
            type="date"
            placeholder="请选择日期"
            v-model="addformValidate.expiredDate"
            format="yyyy-MM-dd"
            :editable="isEditable"
            @on-change="addformValidate.expiredDate=$event"
            @on-open-change="initDatePick"
          ></DatePicker>
        </FormItem>
        <FormItem label="用户状态" prop="userStatus">
          <Select v-model="addformValidate.userStatus" placeholder="请选择用户状态" filterable>
            <Option
              v-for="item in userstatus"
              :value="item.value"
              :key="item.value"
            >{{ item.label }}</Option>
          </Select>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" style="width:90px" @click="addHandleOk">保存</Button>
        <Button type="dashed" style="width:90px" @click="addHandleCancel">取消</Button>
      </div>
    </Modal>
    <!-- 修改 -->
    <Modal
      v-model="modModal"
      title="修改用户"
      width="1000"
      @on-cancel="modHandleCancel"
      :mask-closable="maskClosable"
    >
      <!-- <div class="eg">
        <p>
          温馨提示：请先选择
          <span class="blue-text">用户类型</span>，再选择
          <span class="blue-text">组织机构</span>
        </p>
      </div> -->
      <Form
        :label-width="130"
        ref="modformValidate"
        :model="modformValidate"
        :rules="modruleValidate"
        :inline="true"
        class="userssForm"
        v-if="this.modModal"
      >
      <FormItem label="登录账号" prop="accountNo" >
          <Input placeholder="请输入登录账号" v-model="modformValidate.accountNo" disabled/>
        </FormItem>
        <FormItem label="用户姓名" prop="userName">
          <Input placeholder="请输入用户姓名" v-model="modformValidate.userName" clearable/>
        </FormItem>
        <FormItem label="用户类型" prop="userType" >
          <Select v-model="modformValidate.userType" placeholder="请选择用户类型" filterable clearable>
            <Option
              v-for="item in userTypes"
              :value="item.value"
              :key="item.value"
            >{{ item.label }}</Option>
          </Select>
        </FormItem>
        <FormItem label="所属组织机构" prop="unitOid">
          <treeSelect
            :hideUnitType="4"
            :defaultKey="modformValidate.unitOid"
            :validateFail="validateFail"
            class="ivu-select"
            @on-select-node="onSelectNode"
            v-if="modModal"
          ></treeSelect>

        </FormItem>
        <FormItem label="有效截止日期" prop="expiredDate" >
          <DatePicker
            type="date"
            placeholder="请选择日期"
            v-model="modformValidate.expiredDate"
            format="yyyy-MM-dd"
            :editable="isEditable"
            @on-change="modformValidate.expiredDate=$event"
            @on-open-change="initDatePick"
          ></DatePicker>
        </FormItem>
        <FormItem label="用户状态" prop="userStatus">
          <Select v-model="modformValidate.userStatus" placeholder="请选择用户状态" filterable>
            <Option
              v-for="item in userstatus"
              :value="item.value"
              :key="item.value"
            >{{ item.label }}</Option>
          </Select>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" style="width:90px" @click="modHandleOk">保存</Button>
        <Button type="dashed" style="width:90px" @click="modHandleCancel">取消</Button>
      </div>
    </Modal>
    <!-- 查看 -->
    <Modal
      v-model="viewModal"
      title="查看用户"
      width="1000"
      class="viewUserModal"
      @on-cancel="viewHandleClose"
      :mask-closable="maskClosable"
    >
      <Form :label-width="130" class="userssForm" :inline="true" v-if="this.viewModal">
        <FormItem label="登录账号：">
          <p :title="viewformValidate.accountNo">{{viewformValidate.accountNo}}</p>
        </FormItem>
        <FormItem label="用户姓名：">
          <p :title="viewformValidate.userName">{{viewformValidate.userName}}</p>
        </FormItem>
        <FormItem label="用户类型：">
          <p :title="viewUserType">{{viewUserType}}</p>
        </FormItem>
        <FormItem label="所属组织机构：">
          <p :title="viewformValidate.unitName">{{viewformValidate.unitName}}</p>
        </FormItem>
        <FormItem label="有效截止日期：">
          <p :title="viewformValidate.expiredDate">{{viewformValidate.expiredDate}}</p>
        </FormItem>
        <FormItem label="用户状态：">
          <p :title="viewUserStatu">{{viewUserStatu}}</p>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" style="width:90px" @click="viewHandleClose">关闭</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import requestApi from "@/assets/js/requestApi.js";
import utils from "@/assets/js/utils.js";
const treeSelect = () => import("@/components/tree/treeSelect.vue");

export default {
  props: ["modformValidate", "viewformValidate"],
  components: {
    treeSelect
  },
  data() {
    const accountNoCheck = (rule, value, callback) => {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.$axios
          .get(requestApi.accountNoCheck, { params: { accountNo: value } })
          .then(({ flag }) => {
            flag ? callback() : callback(new Error("登录账号重复"));
          });
      }, 0);
    };
    const validateAddUnitOid = (rule, value, callback) => {
      if (!this.addformValidate.unitOid) {
        this.validateFail = true;
        callback(new Error('组织机构不能为空！'))
      } else {
        callback()
      }

    };
    const validateUnitOid = (rule, value, callback) => {
      if (!this.modformValidate.unitOid) {
        this.validateFail = true;
        callback(new Error('组织机构不能为空！'))
      } else {
        callback()
      }

    };
    return {

      isEditable: false,
      maskClosable: false,
      timer: null,
      modTimer: null,
      addModal: false,
      modModal: false,
      viewModal: false,
      validateFail: false, // 组织机构的校验
      addformValidate: {
        accountNo: "",
        userName: "",
        userType: "",
        unitOid: "",
        expiredDate: "",
        userStatus: "2"
      },
      addruleValidate: {
        accountNo: [
          { required: true, message: "登录账号不能为空", trigger: "change" },
          { max: 20, message: "最多输入20位", trigger: "change" },
          { validator: accountNoCheck, trigger: "default" }
        ],
        userName: [
          { required: true, message: "用户姓名不能为空", trigger: "change" },
          { max: 20, message: "最多输入20字", trigger: "change" }
        ],
        userType: [
          {
            required: true,
            message: "用户类型不能为空",
            trigger: "change"
          }
        ],
        unitOid: [
          {
            type: "number",
            required: true,
            message: "所属组织机构不能为空",
            trigger: "change",
            validator: validateAddUnitOid
          }
        ],
        expiredDate: [
          {
            pattern: /.+/,
            required: true,
            message: "有效日期不能为空",
            trigger: "change"
          }
        ]
      },
      modruleValidate: {
        userName: [
          { required: true, message: "用户姓名不能为空", trigger: "change" },
          { max: 20, message: "最多输入20字", trigger: "change" }
        ],
        userType: [
          {
            required: true,
            message: "用户类型不能为空",
            trigger: "change"
          }
        ],
        unitOid: [
          {
            type: "number",
            required: true,
            message: "所属组织机构不能为空",
            trigger: "change",
            validator: validateUnitOid,
          }
        ],
        expiredDate: [
          {
            pattern: /.+/,
            required: true,
            message: "有效日期不能为空",
            trigger: "change"
          }
        ]
      },
      userstatus: [
        {
          value: "2",
          label: "正常"
        },
        {
          value: "3",
          label: "失效"
        }
      ],
      userTypes: [],
      unitNameList: []
    };
  },
  computed: {
    userInfo() {
      return this.$store.state.user.userInfo;
    },
    viewUserType() {
      switch (this.viewformValidate.userType) {
        case "01":
          return "农民工";
          break;
        case "02":
          return "架子队管理员";
          break;
        case "03":
          return "项目部管理员";
          break;
      }
    },
    viewUserStatu() {
      switch (this.viewformValidate.userStatus) {
        case "0":
          return "冻结";
          break;
        case "2":
          return "正常";
          break;
        case "3":
          return "失效";
          break;
      }
    }
  },
  mounted() {
    if (this.userInfo.userType == "02") {
      this.userTypes = [
        {
          value: "02",
          label: "架子队管理员"
        }
      ];
    } else {
      this.userTypes = [
        {
          value: "02",
          label: "架子队管理员"
        },
        {
          value: "03",
          label: "项目部管理员"
        }
      ];
    }
    this.$axios.get(requestApi.getListOrg).then(({ result }) => {
      result.list.forEach(v => {
        if (v.unitType == "4") {
        } else {
          this.unitNameList.push({
            value: v.unitOid,
            label: v.unitName
          });
        }
      });
    });

  },
  watch: {

  },

  methods: {
    addformCheck() {
      this.$refs.addformValidate.validate(valid => {
        if (valid) {
          this.$axios
            .post(requestApi.createUser, {
              accountNo: this.addformValidate.accountNo,
              expiredDate: this.addformValidate.expiredDate,
              unitOid: this.addformValidate.unitOid,
              userName: this.addformValidate.userName,
              userStatus: this.addformValidate.userStatus,
              userType: this.addformValidate.userType
            })
            .then(({ flag }) => {
              this.$refs.addformValidate.resetFields();
              this.addModal = false;
              if (flag) {
                this.$Message.success("添加用户成功");
                this.$emit("refreshTable");
              } else {
                // this.$Message.error("添加用户失败");
              }
            });
        } else {
          // this.$Message.error("请正确填写相关数据!");
        }
      });
    },
    modformCheck() {
      this.$refs.modformValidate.validate(valid => {
        if (valid) {
          this.modformValidate.expiredDate = utils.formatDate(
            this.modformValidate.expiredDate,
            "yyyy-MM-dd"
          );
          this.$axios
            .put(requestApi.updateUser + "/" + this.modformValidate.userId, {
              userId: this.modformValidate.userId,
              accountNo: this.modformValidate.accountNo,
              expiredDate: this.modformValidate.expiredDate,
              unitOid: this.modformValidate.unitOid,
              userName: this.modformValidate.userName,
              userStatus: this.modformValidate.userStatus,
              userType: this.modformValidate.userType
            })
            .then(({ flag }) => {
              this.$refs.modformValidate.resetFields();
              this.modModal = false;
              if (flag) {
                this.$Message.success("修改用户成功");
                this.$emit("refreshTable");
              } else {
                // this.$Message.error("修改用户失败");
              }
            });
        } else {
          // this.$Message.error("请正确填写相关数据!");
        }
      });
    },
    openAddModal() {
      this.addModal = true;
    },
    openModModal() {
      this.modModal = true;
    },
    openViewModal() {
      this.viewModal = true;
    },
    addHandleOk() {
      this.addformCheck();
    },
    addHandleCancel() {
      this.addModal = false;
      this.$refs.addformValidate.resetFields();
    },
    modHandleOk() {
      this.modformCheck();
    },
    modHandleCancel() {
      this.modModal = false;
      this.$refs.modformValidate.resetFields();
    },
    viewHandleClose() {
      this.viewModal = false;
    },
    initDatePick() {
      utils.initDate();
    },
    onSelectNode(data) {
      if (data) {
        this.validateFail = false;
      }
      this.modformValidate.unitOid = data.unitOid;
      this.$refs.modformValidate.validateField('unitOid');
    },
    onAddSelectNode(data) {
      if (data) {
        this.validateFail = false;
      }
      this.addformValidate.unitOid = data.unitOid;
      this.$refs.addformValidate.validateField('unitOid');
    }
  }
};
</script>
