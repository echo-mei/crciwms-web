<style lang='scss'>
@import "./inOut.scss";
</style>

<template>
  <div class="inOut clearfix">
    <Split v-model="split" class="split-line" :min="minSplit" max="600px">
      <div slot="left" class="demo-split-pane">
        <Tree
          ref="tree"
          class="tree-box left"
          :defaultKey="userInfo.unitOid"
          @on-change-style="onChangeStyle"
          @on-node-click="onNodeClick"
          @on-first-data="onFirstData"
          @on-current-data="onCurrentData"
          :class="{'style2' : this.treeStyle === 'style2' }"
        ></Tree>
      </div>
      <div slot="right" class="demo-split-pane">
        <div class="content-box" :class="{'content-style2' : this.treeStyle === 'style2' }">
          <div class="search-box">
            <Form
              :model="sendData"
              :label-width="150"
              inline
              ref="queryForm"
              @submit.native.prevent
              class="inoutForm"
            >
              <FormItem label="姓名" prop="name">
                <Input placeholder="请输入姓名" v-model="sendData.name" clearable/>
              </FormItem>
              <FormItem label="所属班组" prop="deptOid">
                <Select v-model="sendData.deptOid" placeholder="请选择所属班组" :disabled="showDept" filterable clearable>
                  <Option
                    v-for="item in steamNames"
                    :value="item.value"
                    :key="item.value"
                  >{{ item.label }}</Option>
                </Select>
              </FormItem>
              <FormItem label="所属劳务公司" prop="companyOid">
                <Select v-model="sendData.companyOid" placeholder="请选择所属劳务公司" filterable clearable>
                  <Option
                    v-for="item in companysList"
                    :value="item.value"
                    :key="item.value"
                  >{{ item.label }}</Option>
                </Select>
              </FormItem>
              <FormItem label="在场状态" prop="personStatus">
                <Select v-model="sendData.personStatus" placeholder="请选择在场状态" filterable clearable>
                  <Option
                    v-for="item in orgStatus"
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
              <Button size="small" @click="Arrival" class="icon-btn">
                <Icon custom="i-icon icon-daoru" size="18"/>
                <span>进场</span>
              </Button>
              <Button size="small" @click="outModalOpen" class="icon-btn middle-btn">
                <Icon custom="i-icon icon-daochu1" size="18"/>
                <span>退场</span>
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
      :title="inOutModalTitle"
      width="600"
      @on-cancel="inHandleCancel"
      class="inoutModal"
      :mask-closable="maskClosable"
    >
      <Form :label-width="100" ref="inOut" :model="inOutData" :rules="inOutRules">
        <FormItem label="已选人员：" class="personlist">
          <p>
            {{inOutPersons}}
            <span v-show="personsList.length>3">{{personsList.length}}人</span>
          </p>
        </FormItem>
        <FormItem label="进场日期" prop="inDate">
          <DatePicker
            type="date"
            placeholder="选择进场日期"
            v-model="inOutData.inDate"
            format="yyyy-MM-dd"
            :editable="isEditable"
            @on-change="inOutData.inDate=$event"
            @on-open-change="initDatePick"
          ></DatePicker>
        </FormItem>
        <FormItem label="所属班组" prop="selectedTeam">
          <Select
            v-model="inOutData.selectedTeam"
            placeholder="请选择所属班组"
            filterable
            clearable
            style="width:300px"
          >
            <Option
              v-for="item in modsteamNames"
              :value="item.value"
              :key="item.value"
            >{{ item.label }}</Option>
          </Select>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" style="width:90px" @click="inHandleOk">进场</Button>
        <Button type="dashed" style="width:90px" @click="inHandleCancel">取消</Button>
      </div>
    </Modal>
    <Modal
      v-model="outModal"
      :title="OutModalTitle"
      width="1000"
      @on-cancel="outHandleCancel"
      class="inoutModal"
      :mask-closable="maskClosable"
    >
      <Form :label-width="100" ref="Out" :model="outData" :rules="outRules">
        <FormItem label="已选人员：" class="personlist">
          <p>
            {{inOutPersons}}
            <span v-show="personsList.length>3">{{personsList.length}}人</span>
          </p>
        </FormItem>
        <FormItem label="退场日期" prop="outDate">
          <DatePicker
            type="date"
            placeholder="选择退场日期"
            v-model="outData.outDate"
            format="yyyy-MM-dd"
            :editable="isEditable"
            @on-change="outData.outDate=$event"
            @on-open-change="initDatePick"
          ></DatePicker>
        </FormItem>
        <FormItem label="退场原因" prop="outReason" class="outReason">
          <Input
            type="textarea"
            v-model="outData.outReason"
            :rows="5"
            :maxlength="200"
            placeholder="请输入相关退场原因"
          />
          <p>
            <span class="blue-text">{{reasonMax}}</span>/
            <span class="blue-text">200</span>字符
          </p>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" style="width:90px" @click="outHandleOk">退场</Button>
        <Button type="dashed" style="width:90px" @click="outHandleCancel">取消</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
const Table = () => import("@/components/table/Table.vue");
const Tree = () => import("@/components/tree/Tree.vue");
import utils from "@/assets/js/utils.js";
import requestApi from "@/assets/js/requestApi.js";
import {} from "jquery";
export default {
  data() {
    return {
      split: 0.2,
      outModal: false,
      OutModalTitle: "退场管理",
      isEditable: false,
      maskClosable: false,
      formModalList: [],
      showDept:false,
      inOutData: {
        selectedTeam: "",
        inDate: ""
      },
      inOutPersons: "",
      personsList: [],
      outData: {
        outDate: utils.formatDate(new Date(), "yyyy-MM-dd"),
        outReason: ""
      },
      inOutRules: {
        inDate: [
          {
            pattern: /.+/,
            required: true,
            message: "进场日期不能为空",
            trigger: "change"
          }
        ],
        selectedTeam: [
          {
            type: "number",
            required: true,
            message: "所属班组不能为空",
            trigger: "change"
          }
        ]
      },
      outRules: {
        outDate: {
          pattern: /.+/,
          required: true,
          message: "进场日期不能为空",
          trigger: "change"
        }
      },
      steamNames: [],
      modsteamNames: [],
      orgStatus: [
        {
          value: "1",
          label: "已进场"
        },
        {
          value: "2",
          label: "已退场"
        }
      ],
      // Page页面所需要的数据
      totalRows: 0,
      selectCount: 0,
      ids: [], // 选中的ids
      isShowModal: false,

      // 列表配置start
      propMaxHeight: window.innerHeight - 376, //表格的最大高度,默认600
      // 表头列数据
      columns: [
        {
          name: "姓名",
          attr: "name",
          width: 0.1
        },
        {
          name: "性别",
          attr: "sexCode",
          width: 0.1,
          initFormat: (row, index) => {
            if (row.sexCode == 1) {
              return "男";
            } else {
              return "女";
            }
          }
        },
        {
          name: "身份证号",
          attr: "idNo",
          width: 0.1
        },
        {
          name: "所属架子队",
          attr: "unitName",
          width: 0.1
        },
        {
          name: "所属班组",
          attr: "deptName",
          width: 0.1
        },
        {
          name: "所属劳务公司",
          attr: "companyName",
          width: 0.1
        },
        {
          name: "在场状态",
          attr: "personStatus",
          width: 0.1,
          initFormat: (row, index) => {
            if (row.personStatus == "1") {
              return "已进场";
            } else if (row.personStatus == "2") {
              return "<span style='color:red'>已退场</span>";
            } else {
              return "--";
            }
          }
        }
      ],
      // 传递参数
      sendData: {
        name: "",
        deptOid: "",
        companyOid: "",
        personStatus: ""
      },
      isShowCheckbox: true, // 是否展示复选框
      isShowSetting: false, // 是否展示设置字段显示的按钮
      isShowEdit: false, // 是否展示编辑按钮
      listUrl: requestApi.getTableList, // Table的列表数据请求的地址
      // 列表配置end
      inOutModalTitle: "进场管理", //模态框的默认title
      treeStyle: "style1", //组织机构的风格，默认展开
      personOids: [],
      companysList: []
    };
  },
  components: {
    Table,
    Tree
    // addOrUpadta
  },
  computed: {
    userInfo() {
      return this.$store.state.user.userInfo;
    },
    reasonMax() {
      return this.outData.outReason.length;
    },
    minSplit() {
      return this.treeStyle === "style2" ? "80px" : "200px";
    }
  },
  mounted() {
    window.onresize = () => {
      this.propMaxHeight = window.innerHeight - 376;
    };
    //获取劳务公司列表
    this.$axios.get(requestApi.listCompanyInfo).then(({ result }) => {
      result.list.forEach(v => {
        this.companysList.push({
          value: v.companyOid,
          label: v.companyName
        });
      });
    });
  },

  methods: {
    onCurrentData(data) {
      this.getDeptInfo(data.unitOid);
      this.$refs.table.queryData();
    },
    onChangeStyle(style) {
      this.treeStyle = style;
      this.split = style === "style2" ? 0.06 : 0.2; // 分割线
      this.$nextTick(() => {
        this.$refs.table.resetWidth();
      });
    },
    onNodeClick(data) {
      this.$refs.queryForm.resetFields();
      if (data.isAuth) {
        if (data.unitType == "4") {
          this.sendData.deptOid = data.unitOid;
          this.showDept = true;
        } else {
          this.getDeptInfo(data.unitOid);
          this.showDept = false;
        }
        this.$refs.table.queryData();
      }
    },
    outModalOpen() {
      if (this.formModalList.length > 0) {
        this.outModal = true;
      } else {
        this.$Message.error({
          content: "先选择一条或多条记录再进行操作!"
        });
      }
    },
    outHandleOk() {
      this.$refs.Out.validate(valid => {
        if (valid) {
          this.outData.outDate = utils.formatDate(
            this.outData.outDate,
            "yyyy-MM-dd"
          );
          this.$axios
            .get(requestApi.outOrg, {
              params: {
                personOids: this.personOids.join(","),
                outReason: this.outData.outReason,
                outAuthDate: new Date(this.outData.outDate).toString()
              }
            })
            .then(({ flag }) => {
              this.outHandleCancel();
              if (flag) {
                this.$Message.success("退场成功");
                this.$refs.table.queryData();
              } else {
                //  this.$Message.error("退场失败");
              }
            });
        }
      });
    },
    outHandleCancel() {
      this.$refs.Out.resetFields();
      this.outModal = false;
    },
    inHandleOk() {
      //进场校验
      this.$refs.inOut.validate(valid => {
        if (valid) {
          this.$axios
            .get(requestApi.inOrg, {
              params: {
                personOids: this.personOids.join(","),
                deptOid: this.inOutData.selectedTeam,
                inAuthDate: new Date(this.inOutData.inDate).toString()
              }
            })
            .then(({ flag }) => {
              this.$refs.inOut.resetFields();
              this.isShowModal = false;
              if (flag) {
                this.$Message.success("进场成功");
                this.$refs.table.queryData();
              } else {
                // this.$Message.error("进场失败");
              }
            });
        } else {
          // this.$Message.error("请正确填写相关数据!");
        }
      });
    },
    inHandleCancel() {
      this.$refs.inOut.resetFields();
      this.isShowModal = false;
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
    //获取所属班组列表
    getDeptInfo(unitOid) {
      this.steamNames = [];
      this.$axios.get(requestApi.getOrg + "/" + unitOid).then(({ result }) => {
        result.forEach(v => {
          //判断是否是班组信息
          if (v.unitType == "4") {
            //获取所属班组类型列表
            this.steamNames.push({
              value: v.unitOid,
              label: v.unitName
            });
          }
        });
      });
    },
    //进场操作
    Arrival(type) {
      if (this.formModalList.length > 0) {
        this.isShowModal = true;
        ///当选择多条记录时，所属班组全部显示
        this.modsteamNames = JSON.parse(JSON.stringify(this.steamNames));
        if (this.formModalList.length < 2) {
          //选择一条记录时，原本进场的所属班组不出现原班组
          this.modsteamNames.forEach((v, i) => {
            if (
              v.value == this.formModalList[0].deptOid &&
              this.formModalList[0].personStatus == "1"
            ) {
              this.modsteamNames.splice(i, 1);
            }
          });
        }
      } else {
        this.$Message.error({
          content: "先选择一条或多条记录再进行操作!"
        });
      }
    },
    onFirstData(data) {},
    /**
     * 单选复选框选中数据
     */
    onSelectRows(rows) {
      this.formModalList = rows;
      this.personOids = [];
      this.personsList = [];
      this.formModalList.forEach((v, i) => {
        this.personOids.push(v.personOid);
        this.personsList.push(v.name);
      });
      if (this.personsList.length > 3) {
        this.inOutPersons = this.personsList.slice(0, 3).join(",") + "...等";
      } else {
        this.inOutPersons = this.personsList.join(",");
      }
    },
    initDatePick() {
      utils.initDate();
    }
  }
};
</script>
