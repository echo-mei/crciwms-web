<style lang='scss'>
@import "./appeal.scss";
</style>

<template>
  <div class="appeal clearfix">
    <div class="content-box" :class="{'content-style2' : this.treeStyle === 'style2' }">
      <div class="search-box">
        <Form :model="sendData" :label-width="100" inline ref="queryForm" @submit.native.prevent>
          <FormItem label="姓名" prop="name">
            <Input placeholder="请输入姓名" v-model="sendData.name" clearable/>
          </FormItem>
          <FormItem label="内容" prop="content">
            <Input placeholder="请输入内容" v-model="sendData.content" clearable/>
          </FormItem>
          <FormItem label="核销类型" prop="status">
            <Select v-model="sendData.status" placeholder="请选择核销类型" filterable>
              <Option
                v-for="item in writeType"
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
          <!-- <Button size="small" @click="appealHanle" class="icon-btn middle-btn">
            <Icon custom="i-icon icon-xiugaishuxing" size="18"/>
            <span>申诉处理核销</span>
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
            :propMaxHeight="propMaxHeight"
          ></Table>
        </div>
      </div>
    </div>
    <Modal
      v-model="appealModal"
      title="申诉处理核销"
      width="1000"
      :mask-closable="false"
      @on-cancel="appealCancel"
    >
      <div class="appeal_form" :style="{height:appealFormHeight+'px'}" v-if="this.appealModal">
        <Form
          :label-width="80"
          class="appealForm"
          :rules="appealruleValidate"
          ref="appealValidate"
          :model="viewData"
        >
          <FormItem label="姓名">
            <Input placeholder v-model="viewData.name" readonly clearable class="name"/>
          </FormItem>
          <FormItem label="申诉时间">
            <Input placeholder v-model="viewData.createdDate" readonly clearable class="name"/>
          </FormItem>
          <FormItem label="手机号">
            <Input placeholder v-model="viewData.phone" readonly clearable class="name"/>
          </FormItem>
          <FormItem label="内容">
            <div class="appeal_content">{{viewData.content}}</div>
          </FormItem>
          <FormItem label="核销意见" prop="remark">
            <Input
              type="textarea"
              v-model="viewData.remark"
              :rows="5"
              placeholder="请输入相关核销意见..."
              class="textarea"
              :maxlength="200"
            />
            <p>
              <span class="blue-text">{{reasonMax}}</span>/
              <span class="blue-text">200</span>字符
            </p>
          </FormItem>
          <FormItem label="处理结果">
            <Checkbox v-model="viewData.checkStatus" size="large">核销</Checkbox>
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <Button type="primary" style="width:90px" @click="appealOk">保存</Button>
        <!-- <Button type="warning" style="width:90px" @click="appealWaite">暂不核销</Button> -->
        <Button type="dashed" style="width:90px" @click="appealCancel">取消</Button>
      </div>
    </Modal>
    <!-- 查看 -->
    <Modal v-model="viewModal" title="申诉处理查看" width="1000" :mask-closable="false">
      <div class="appeal_form" :style="{height:appealFormHeight+'px'}" v-if="this.viewModal">
        <Form :label-width="150" class="viewForm">
          <FormItem label="姓名：">
            <p>{{viewsData.name}}</p>
          </FormItem>
          <FormItem label="申诉时间：">
            <p>{{viewsData.createdDate}}</p>
          </FormItem>
          <FormItem label="手机号：">
            <p>{{viewsData.phone}}</p>
          </FormItem>
          <FormItem label="内容：">
            <div class="appeal_content">{{viewsData.content}}</div>
          </FormItem>
          <FormItem label="核销意见：">
            <div class="appeal_remark">{{viewsData.remark}}</div>
          </FormItem>
          <FormItem label="处理结果：">
            <p>{{viewStatus}}</p>
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <Button type="primary" style="width:90px" @click="viewOk">关闭</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
const Table = () => import("@/components/table/Table.vue");
import utils from "@/assets/js/utils.js";
import requestApi from "@/assets/js/requestApi.js";
import {} from "jquery";
export default {
  data() {
    const remarkValidate = (rule, value, callback) => {
      if (this.viewData.checkStatus && $.trim(value) === "") {
        callback(new Error("核销状态下，处理意见不能为空!"));
      } else {
        callback();
      }
    };
    return {
      appealModal: false,
      viewModal: false,
      appealOid: "",
      formModalList: [],
      viewData: {
        name: "",
        content: "",
        remark: "",
        phone: "",
        createdDate: "",
        checkStatus: false
      },
      viewsData: {
        name: "",
        phone: "",
        createdDate: "",
        content: "",
        remark: "",
        status: ""
      },
      // Page页面所需要的数据
      totalRows: 0,
      selectCount: 0,
      // 列表配置start
      propMaxHeight: window.innerHeight - 297, //表格的最大高度,默认600
      appealFormHeight: window.innerHeight - 340,
      // 表头列数据
      columns: [
        {
          name: "核销",
          width: 0.08,
          attr: [
            {
              name: "核销",
              attr: "edit",
              initFormat: (row, index) => {
                if (row.status == "2") {
                  return '<i title="核销"  class="ivu-icon i-icon icon-chuli edit writeOff"></i>';
                } else {
                  return '<i title="核销" class="ivu-icon i-icon icon-chuli edit"></i>';
                }
              },
              initRender(row, index) {
                return true;
              },
              initEvent: (row, index) => {
                this.$axios
                  .get(requestApi.getAppealInfo, {
                    params: { appealOid: row.appealOid }
                  })
                  .then(({ result }) => {
                    this.viewData = result;
                    if (this.viewData.remark === null) {
                      this.viewData.remark = "";
                    }
                    this.$nextTick(() => {
                      this.appealModal = true;
                      this.appealOid = result.appealOid;
                    });
                  });
              }
            },
            {
              name: "查看",
              attr: "view",
              initFormat: (row, index) => {
                return '<i title="查看" class="ivu-icon i-icon icon-kejian view"></i>';
              },
              initRender(row, index) {
                return true;
              },
              initEvent: (row, index) => {
                this.$axios
                  .get(requestApi.getAppealInfo, {
                    params: { appealOid: row.appealOid }
                  })
                  .then(({ result }) => {
                    this.viewsData = result;
                    if (
                      $.trim(this.viewsData.phone) == "" ||
                      this.viewsData.phone === null
                    ) {
                      this.viewsData.phone == "--";
                    }
                    if (
                      $.trim(this.viewsData.createdDate) == "" ||
                      this.viewsData.createdDate === null
                    ) {
                      this.viewsData.createdDate == "--";
                    }
                    this.$nextTick(() => {
                      this.viewModal = true;
                    });
                  });
              }
            }
          ]
        },
        {
          name: "姓名",
          attr: "name",
          width: 0.1
        },
        {
          name: "内容",
          attr: "content",
          width: 0.5,
          textAlign: "left"
        },
        {
          name: "架子队",
          attr: "unitName",
          width: 0.1
        },
        {
          name: "申诉时间",
          attr: "createdDate",
          width: 0.1
        },
        {
          name: "手机号",
          attr: "phone",
          width: 0.1
        },
        {
          name: "处理状态",
          attr: "status",
          width: 0.1,
          initFormat: (row, index) => {
            if (row.status == "1") {
              return "待核销";
            } else if (row.status == "2") {
              return "已核销";
            } else {
              return "--";
            }
          }
        },
        {
          name: "处理意见",
          attr: "remark",
          width: 0.2
        }
      ],
      appealruleValidate: {
        remark: [{ validator: remarkValidate, trigger: "change" }]
      },
      // 传递参数
      sendData: {
        name: "",
        content: "",
        status: "1"
      },
      writeType: [
        {
          value: "1",
          label: "待核销"
        },
        {
          value: "2",
          label: "已核销"
        }
      ],
      isShowCheckbox: false, // 是否展示复选框
      isShowSetting: false, // 是否展示设置字段显示的按钮
      isShowEdit: false, // 是否展示编辑按钮
      listUrl: requestApi.getListAppeal, // Table的列表数据请求的地址
      treeStyle: "style1"
      // 列表配置end
    };
  },
  created() {
    this.sendData.status = this.$route.params.status || this.sendData.status;
  },
  components: {
    Table
  },
  computed: {
    reasonMax() {
      return this.viewData.remark.length;
    },
    status() {
      if (this.viewData.checkStatus) {
        return "2";
      } else if (!this.viewData.checkStatus) {
        return "1";
      }
    },
    viewStatus() {
      if (this.viewsData.status == "1") {
        return "待核销";
      } else if (this.viewsData.status == "2") {
        return "已核销";
      } else {
        return "--";
      }
    }
  },
  mounted() {
    window.onresize = () => {
      this.propMaxHeight = window.innerHeight - 297;
      this.appealFormHeight = window.innerHeight - 340;
    };
  },

  methods: {
    viewOk() {
      this.viewModal = false;
    },
    //核销
    appealOk() {
      this.$refs.appealValidate.validate(valid => {
        if (valid) {
          this.$axios
            .get(requestApi.updateAppeal, {
              params: {
                appealOid: this.appealOid,
                status: this.status,
                remark: this.viewData.remark
              }
            })
            .then(({ flag }) => {
              this.appealModal = false;
              if (flag) {
                if (this.status == "2") {
                  this.$Message.success("核销成功");
                } else {
                  this.$Message.info("暂不核销");
                }
                this.$refs.table.queryData();
              } else {
                // this.$Message.error("核销失败");
              }
            });
        }
      });
    },
    appealCancel() {
      this.$refs.appealValidate.resetFields();
      this.appealModal = false;
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

    /**
     * 单选复选框选中数据
     */
    onSelectRows(rows) {
      this.formModalList = rows;
    },
    refreshTable() {
      this.$refs.table.queryData();
    }
  }
};
</script>
