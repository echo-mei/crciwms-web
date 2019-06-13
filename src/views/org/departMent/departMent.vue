<style lang="scss" scoped>
@import "./departMent.scss";
</style>

<template>
  <div class="departMent clearfix">
    <Split v-model="split" class="split-line" :min="minSplit" max="600px">
      <div slot="left" class="demo-split-pane">
        <Tree
          ref="vuetree"
          class="tree-box left"
          :defaultKey="currentUnitOid"
          @on-change-style="onChangeStyle"
          @on-node-click="onNodeClick"
          @on-first-data="onFirstData"
          @on-current-data="onCurrentData"
          :class="{ style2: this.treeStyle === 'style2' }"
        ></Tree>
      </div>
      <div slot="right" class="demo-split-pane">
        <div class="content-box" :class="{ 'content-style2': this.treeStyle === 'style2' }">
          <div class="search-box">
            <Form :model="sendData" :label-width="100" inline ref="queryForm">
              <FormItem label="机构编号" prop="unitCode">
                <Input placeholder="请输入机构编号" v-model="sendData.unitCode" clearable></Input>
              </FormItem>
              <FormItem label="机构名称" prop="unitName">
                <Input placeholder="请输入机构名称" v-model="sendData.unitName" clearable></Input>
              </FormItem>
              <!-- <FormItem>
                <Button type="primary" @click="handleSubmit('queryForm')">查询</Button>
                <Button @click="handleReset('queryForm')" style="margin-left:10px;">重置</Button>
              </FormItem>-->
              <div class="form-btn">
                <Button type="primary" @click="handleSubmit('queryForm')">查询</Button>
                <Button @click="handleReset('queryForm')" style="margin-left:10px;">重置</Button>
              </div>
            </Form>
          </div>
          <div class="setting clearfix">
            <div class="left fl">
              <Button size="small" @click="addOrg()" class="icon-btn">
                <Icon custom="i-icon icon-add" size="18"/>
                <span>新增</span>
              </Button>

              <!-- <Button size="small" @click="editOrg" class="icon-btn middle-btn">
            <Icon custom="i-icon icon-xiugaishuxing" size="18"/>
            <span>修改</span>
              </Button>-->

              <Button size="small" @click="deletOrg" class="icon-btn middle-btn">
                <Icon custom="i-icon icon-shanchuhover" size="18"/>
                <span>删除</span>
              </Button>
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
                :propMaxHeight="propMaxHeight"
              ></Table>
            </div>
          </div>
        </div>
      </div>
    </Split>

    <Modal
      v-model="isShowModal"
      :title="departMentModalTitle"
      width="1000"
      :mask-closable="false"
      @on-cancel="handleCancel"
    >
      <div>
        <addOrUpadta ref="addOrUpdate" :sentData="departMentSentData" v-if="isShowModal"></addOrUpadta>
      </div>
      <div slot="footer" v-if="this.departMentSentData.type === 'view'">
        <Button type="primary" style="width:90px;" @click="handleCancel">关闭</Button>
      </div>
      <div slot="footer" v-else>
        <Button type="primary" style="width:90px;" @click="handleOk">保存</Button>
        <Button type="dashed" style="width:90px;" @click="handleCancel">取消</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
const Table = () => import("@/components/table/Table.vue");
const Tree = () => import("@/components/tree/Tree.vue");
const addOrUpadta = () => import("@/views/org/departMent/addOrUpdate.vue");
import utils from "@/assets/js/utils.js";
import requestApi from "@/assets/js/requestApi.js";
import { deletOrg, editOrg, addOrg } from "@/api/org.js";

export default {
  data() {
    return {
      split: 0.2, // 分割线
      // Page页面所需要的数据
      totalRows: 0,
      selectData: {},
      ids: [], // 选中的ids
      isShowModal: false,

      // 列表配置start
      propMaxHeight: window.innerHeight - 332, //表格的最大高度,默认600
      // 表头列数据
      columns: [
        {
          name: "操作",
          attr: [
            {
              name: "修改",
              attr: "edit",
              initFormat: (row, index) => {
                return '<i title="修改" class="ivu-icon i-icon icon-xiugaishuxing edit"></i>'
              },
              initRender(row, index) {
                return true;
              },
              initEvent: (row, index) => {
                this.editOrg(row, index);
              }
            }
          ],
          width: 0.05,
          textAlign: "center" // 默认是“center”，可以设置左中右3个属性
        },
        {
          name: "机构类型",
          attr: "unitType",
          width: 0.06,
          initFormat: (row, index) => {
            switch (row.unitType) {
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
            // return `<a class="blue-text" :title="${d}" >${d} </a>`
          },
        },
        {
          name: "机构编号",
          attr: "unitCode",
          width: 0.1,
          textAlign: "left"
        },
        {
          name: "机构名称",
          attr: "unitName",
          width: 0.16,
          textAlign: "left"
        },
        {
          name: "联系人",
          attr: "contacts",
          width: 0.1,
          textAlign: "left"
        },
        {
          name: "联系电话",
          attr: "phone",
          width: 0.1,
          textAlign: "left"
        }
      ],
      // 传递参数
      sendData: {
        unitCode: "",
        unitName: "",
        parentUnitOid: "",
      },
      isShowCheckbox: true, // 是否展示复选框
      isShowSetting: false, // 是否展示设置字段显示的按钮
      isShowEdit: false, // 是否展示修改按钮
      listUrl: requestApi.orgList, // Table的列表数据请求的地址
      // 列表配置end
      currentOrg: null, //当前所选择的的组织机构
      departMentModalTitle: "新增组织机构", //模态框的默认title
      departMentSentData: {
        parentUnitName: "",
      }, // 用于修改子组件的参数传递
      treeStyle: "style1", //组织机构的风格，默认展开
    };
  },

  components: {
    Table,
    Tree,
    addOrUpadta
  },
  computed: {
    userInfo() {
      return this.$store.state.user.userInfo;
    },
    currentUnitOid() {
      if (this.currentOrg && this.currentOrg.unitOid) {
        return this.currentOrg.unitOid;
      } else {
        return this.$store.state.user.userInfo.unitOid;
      }
    },
    minSplit() {
      return this.treeStyle === "style2" ? "80px" : "200px";
    }

  },
  created() {
  },
  mounted() {
    window.onresize = () => {
      this.propMaxHeight = window.innerHeight - 332;
    };
  },

  methods: {

    onChangeStyle(style) {
      this.treeStyle = style;
      this.split = style === "style2" ? 80 / window.innerWidth : 0.2;// 分割线
    },

    // 点击左侧组织机构数，先判断是否有权限操作，无权限不响应
    onNodeClick(data) {
      this.currentOrg = data;
      if (data.isAuth) {
        this.sendData.parentUnitOid = data.unitOid;
        this.$refs.table.queryData();
      }
    },
    onCurrentData(data) {
      this.currentOrg = data;
      if (data.isAuth) {
        this.sendData.parentUnitOid = data.unitOid;
        this.$nextTick(() => {
          if (this.$refs.table) {
            this.$refs.table.queryData();
          }
        })
      }

    },

    handleOk() {
      //每一次提交之前，都看看子组件那里是否已经完成校验；
      var type = this.$refs.addOrUpdate.handleSubmit("formRefs");

      if (type) {
        this.isShowModal = false;
        this.departMentSentData.type === "add"
          ? this.ajaxAddOrg()
          : this.ajaxEditOrg();
        this.removeAllData();
      } else {
        this.isShowModal = true;
      }
    },
    handleCancel() {
      this.isShowModal = false;
      this.removeAllData();

    },
    //查询
    handleSubmit(name) {
      this.$refs.table.queryData(this.sendData);
    },
    //重置
    handleReset(name) {
      this.$refs[name].resetFields();
      this.$refs.table.queryData(this.sendData);
    },

    // 清空父 -> 子的数据，以及子组件的数据
    removeAllData() {
      this.departMentSentData = {};
      this.$refs.addOrUpdate.handleReset("formRefs");
    },
    //新增
    addOrg() {
      // 管理员用户 04 只能新增项目部，不做其他校验，新增的时候默认是新增项目部
      if (this.userInfo.userType !== "04") {
        if (!this.currentOrg) {
          this.$Message.error('请先选择一个组织机构！');
          return false;
        } else if (this.currentOrg && this.currentOrg.unitType === "4") {
          this.$Message.error('班组下面不能再新增组织机构了！');
          return false;
        } else if (this.currentOrg && !this.currentOrg.isAuth) {
          this.$Message.error('您暂无权限操作该组织，请和系统管理员联系！');
          return false;
        }
      } else {
        if (this.currentOrg && this.currentOrg.unitType === "4") {
          this.$Message.error('班组下面不能再新增组织机构了！');
          return false;
        }
      }
      if (this.currentOrg) {
        this.departMentSentData.parentUnitOid = this.currentOrg.unitOid;
        this.departMentSentData.parentUnitName = this.currentOrg.unitName;
      }
      this.isShowModal = true;
      this.departMentSentData.type = "add";
      this.departMentSentData.userInfo = this.userInfo;
      this.departMentModalTitle = "新增组织机构";
    },
    ajaxAddOrg() {
      const d = Object.assign({}, this.$refs.addOrUpdate.departMentData);
      addOrg(d).then(res => {
        this.$Message.success(res.result);
        this.$refs.table.queryData();
        this.$refs.vuetree.queryData();
      }),
        err => {
          this.$Message.error(err);
        };
    },
    ajaxEditOrg() {
      const data = Object.assign({}, this.$refs.addOrUpdate.departMentData);
      editOrg(data).then(res => {
        this.$Message.success(res.result);
        this.$refs.table.queryData();
        this.$refs.vuetree.queryData();
      }),
        err => {
          this.$Message.error(err);
        };
    },
    // 修改 or 查看详情
    editOrg(row, index) {

      // if (!this.ids.length) {
      //   return this.$Message.error("请选择需要修改的组织机构！");
      // } else if (this.ids.length > 1) {
      //   return this.$Message.error("请仅选择一条信息进行修改！");
      // }
      this.isShowModal = true;
      this.departMentSentData = row;
      this.departMentSentData.type = "edit";
      this.departMentModalTitle = "修改组织机构";
    },
    deletOrg() {
      if (!this.ids.length) {
        this.$Message.error('请选择需要删除的组织机构！')
        return false
      }
      const data = this.ids.join(",");
      this.$Modal.confirm({
        title: "确认删除吗？",
        content: "删除机构可能会影响正常功能使用，请谨慎操作，请确认是否删除。",
        cancelText: "取消",
        onOk: () => {
          deletOrg(data).then(res => {
            if (res) {
              this.$Message.success(res.result);
              this.$refs.table.queryData();
              this.$refs.vuetree.queryData();
              this.ids = [];
            }
          }),
            err => {
              this.$Message.error(err);
            };
        }
      });
    },

    onFirstData(data) { },


    /**
     * 单选复选框选中数据
     */
    onSelectRows(rows) {
      this.selectData = rows[0] || {}; //当前需要编辑的row，数组，默认只需要第一个
      this.ids = []; // 每次获得都需要清空一下上次选择的删除数据
      rows.forEach((v, i) => {
        this.ids.push(v.unitOid);
      });
    }
  },
  watch: {

  }
};
</script>
