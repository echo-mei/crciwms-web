<style lang='scss' >
@import "./users.scss";
</style>

<template>
  <div class="users clearfix">
    <div class="content-box" :class="{'content-style2' : this.treeStyle === 'style2' }">
      <div class="search-box">
        <Form
          :model="sendData"
          :label-width="100"
          inline
          ref="queryForm"
          @submit.native.prevent
          class="userForm"
        >
          <FormItem label="登录账号" prop="accountNo">
            <Input placeholder="请输入登录账号" v-model="sendData.accountNo" clearable/>
          </FormItem>
          <FormItem label="用户姓名" prop="userName">
            <Input placeholder="请输入用户名" v-model="sendData.userName" clearable/>
          </FormItem>
          <FormItem label="用户类型" prop="userType">
            <Select v-model="sendData.userType" placeholder="请选择用户类型" filterable clearable>
              <Option
                v-for="item in userTypes"
                :value="item.value"
                :key="item.value"
              >{{ item.label }}</Option>
            </Select>
          </FormItem>
          <FormItem>
            <Button type="primary" @click="handleSubmit">查询</Button>
            <Button @click="handleReset" style="margin-left:10px;">重置</Button>
          </FormItem>
        </Form>
      </div>
      <div class="setting clearfix">
        <div class="left fl">
          <Button size="small" @click="addUser" class="icon-btn middle-btn">
            <Icon custom="i-icon icon-add" size="18"/>
            <span>新增</span>
          </Button>
          <!-- <Button size="small" @click="modUser" class="icon-btn middle-btn">
            <Icon custom="i-icon icon-xiugaishuxing" size="18"/>
            <span>修改</span>
          </Button>-->
          <Button size="small" @click="deleteUser" class="icon-btn middle-btn">
            <Icon custom="i-icon icon-shanchuhover" size="18"/>
            <span>删除</span>
          </Button>
          <!-- <Button size="small" @click="viewUser" class="icon-btn middle-btn">
            <Icon custom="i-icon icon-kejian" size="18"/>
            <span>查看</span>
          </Button>-->
          <!-- <Button size="small" @click="passResetUser" class="icon-btn middle-btn">
            <Icon custom="i-icon icon-xiugaimima" size="18"/>
            <span>密码重置</span>
          </Button>-->
        </div>
      </div>
      <div class="box">
        <div class="table-box">
          <Table
            ref="table"
            :columnList="columns"
            :listUrl="listUrl"
            :sendData="sendData"
            :isShowSetting="isShowSetting"
            :isShowCheckbox="isShowCheckbox"
            :isShowEdit="isShowEdit"
            @on-select-rows="onSelectRows"
            @on-row-click="onRowClick"
            :propMaxHeight="propMaxHeight"
          ></Table>
        </div>
      </div>
    </div>
    <UsersForm
      ref="userform"
      :modformValidate="modifyData"
      @refreshTable="refreshTable"
      :viewformValidate="viewmodifyData"
    />
  </div>
</template>

<script>
const Table = () => import("@/components/table/Table.vue");
const Tree = () => import("@/components/tree/Tree.vue");
const UsersForm = () => import("./usersForm.vue");
import utils from "@/assets/js/utils.js";
import requestApi from "@/assets/js/requestApi.js";
import {} from "jquery";
export default {
  data() {
    return {
      userIds: [],
      nonguser: "",
      userTypes: [
        {
          value: "02",
          label: "架子队管理员"
        },
        {
          value: "03",
          label: "项目部管理员"
        },
        {
          value: "01",
          label: "农民工"
        }
      ],
      // Page页面所需要的数据
      totalRows: 0,
      selectCount: 0,
      ids: [], // 选中的ids
      isShowModal: false,
      // 列表配置start
      propMaxHeight: window.innerHeight - 333, //表格的最大高度,默认600
      // 表头列数据
      columns: [
        {
          name: "登录账号",
          attr: "accountNo",
          width: 0.1
        },
        {
          name: "",
          showMode: "hover",
          attr: [
            {
              name: "修改",
              attr: "edit",
              initFormat: (row, index) => {
                if (row.userType == "01") {
                  return '<i title="编辑" class="ivu-icon i-icon icon-xiugaishuxing edit migrant"></i>';
                } else {
                  return '<i title="编辑" class="ivu-icon i-icon icon-xiugaishuxing edit"></i>';
                }
              },
              initRender(row, index) {
                return true;
              },
              initEvent: (row, index) => {
                this.$axios
                  .get(requestApi.getUser + "/" + row.userId)
                  .then(({ result }) => {
                    this.modifyData = result;
                    this.$nextTick(() => {
                      this.$refs.userform.openModModal();
                    });
                  });
              }
            },
            // {
            //   name: "删除",
            //   attr: "delete",
            //   initFormat: (row, index) => {
            //     return '<i class="ivu-icon i-icon icon-shanchuhover delete" title="删除"></i>';
            //   },
            //   initRender: (row, index) => {
            //     return true;
            //   },
            //   initEvent: (row, index) => {
            //     this.$Modal.confirm({
            //       title: "提醒",
            //       content: "是否删除？",
            //       onOk: () => {
            //         this.$axios
            //           .delete(requestApi.deleteUser + "/" + row.userId)
            //           .then(({ flag }) => {
            //             if (flag) {
            //               this.$Message.success("删除成功");
            //               this.$refs.table.queryData();
            //             } else {
            //               // this.$Message.error("删除失败");
            //             }
            //           });
            //       }
            //     });
            //   }
            // },
            {
              name: "查看",
              attr: "view",
              initFormat: (row, index) => {
                return '<i title="查看" class="ivu-icon i-icon icon-kejian"></i>';
              },
              initRender(row, index) {
                return true;
              },
              initEvent: (row, index) => {
                this.$axios
                  .get(requestApi.getUser + "/" + row.userId)
                  .then(({ result }) => {
                    this.viewmodifyData = result;
                    for (var i in this.viewmodifyData) {
                      if (
                        $.trim(this.viewmodifyData[i]) === "" ||
                        this.viewmodifyData[i] === null
                      ) {
                        this.viewmodifyData[i] = "--";
                      }
                    }
                    this.$nextTick(() => {
                      this.$refs.userform.openViewModal();
                    });
                  });
              }
            },
            {
              name: "密码重置",
              attr: "passEdit",
              initFormat: (row, index) => {
                return '<i title="密码重置" class="ivu-icon i-icon icon-xiugaimima"></i>';
              },
              initRender(row, index) {
                return true;
              },
              initEvent: (row, index) => {
                this.$Modal.confirm({
                  title: "提醒",
                  content: "是否重置密码？",
                  onOk: () => {
                    this.$axios
                      .get(requestApi.resetPass, {
                        params: { accountNo: row.accountNo }
                      })
                      .then(({ flag }) => {
                        if (flag) {
                          this.$Message.success("密码重置成功");
                          this.$refs.table.queryData();
                        } else {
                          // this.$Message.error("密码重置失败");
                        }
                      });
                  }
                });
              }
            }
          ],
          width: 0.06
        },
        {
          name: "用户姓名",
          attr: "userName",
          width: 0.1
        },
        {
          name: "用户类型",
          attr: "userType",
          width: 0.1,
          initFormat: (row, index) => {
            switch (row.userType) {
              case "02":
                return "架子队管理员";
                break;
              case "03":
                return "项目部管理员";
                break;
              case "01":
                return "农民工";
                break;
              default:
                return "--";
            }
          }
        },
        {
          name: "所属组织机构",
          attr: "unitName",
          width: 0.1
        },
        {
          name: "有效截止日期",
          attr: "expiredDate",
          width: 0.1
          // initFormat: (row, index) => {
          //   return utils.formatDate(row.expiredDate, "yyyy-MM-dd");
          // }
        },
        {
          name: "用户状态",
          attr: "userStatus",
          width: 0.1,
          initFormat: (row, index) => {
            switch (row.userStatus) {
              case "2":
                return "正常";
                break;
              case "3":
                return "失效";
                break;
              case "0":
                return "冻结";
                break;
              default:
                return "--";
            }
          }
        }
      ],
      // 传递参数
      sendData: {
        accountNo: "",
        userName: "",
        userType: ""
      },
      isShowCheckbox: true, // 是否展示复选框
      isShowSetting: false, // 是否展示设置字段显示的按钮
      isShowEdit: false, // 是否展示编辑按钮
      listUrl: requestApi.listUsers, // Table的列表数据请求的地址
      // 列表配置end

      inOutModalTitle: "", //模态框的默认title
      departMentSentData: {}, // 用于编辑子组件的参数传递
      treeStyle: "style1", //组织机构的风格，默认展开
      modifyData: {
        accountNo: "",
        userName: "",
        userType: "",
        unitOid: "",
        expiredDate: "",
        userStatus: "2"
      },
      viewmodifyData: {}
    };
  },
  components: {
    Table,
    Tree,
    UsersForm
  },
  computed: {},
  mounted() {
    window.onresize = () => {
      this.propMaxHeight = window.innerHeight - 333;
    };
  },

  methods: {
    refreshTable() {
      this.$refs.table.queryData();
    },
    onNodeClick(data) {
      let o = {
          attr: "organizationId",
          name: "组织机构",
          value: data.id
        },
        d = {
          label: data.label
        };
      this.sendData.organizationId = data.id;
      this.$refs.table.queryData();
    },
    addUser() {
      this.$refs.userform.openAddModal();
    },

    deleteUser() {
      if (this.userIds.length > 0) {
        if (!this.nonguser) {
          this.$Modal.confirm({
            title: "提醒",
            content: "是否删除？",
            onOk: () => {
              this.$axios
                .delete(requestApi.deleteUsers, {
                  params: { userIds: this.userIds.join(",") }
                })
                .then(({ flag }) => {
                  if (flag) {
                    this.$Message.success("删除成功");
                    this.$refs.table.queryData();
                    this.userIds = [];
                  } else {
                    // this.$Message.error("删除失败");
                  }
                });
            }
          });
        } else {
          this.$Message.error("选择用户包含农民工，不允许删除！");
        }
      } else {
        this.$Message.error("先选择一条或多条记录再进行操作!");
      }
    },
    //查询
    handleSubmit() {
      this.$refs.table.queryData();
    },
    //重置
    handleReset() {
      this.$refs.queryForm.resetFields();
      this.$refs.table.queryData();
    },

    onFirstData(data) {},
    onRowClick(row, index) {},
    /**
     * 单选复选框选中数据
     */
    onSelectRows(rows) {
      this.userIds = [];
      this.nonguser = rows.find(v => v.userType == "01");
      rows.forEach(v => {
        this.userIds.push(v.userId);
      });
    }
  }
};
</script>
