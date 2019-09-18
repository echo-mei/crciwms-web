<style lang='scss'>
@import "./contractQuery.scss";
</style>
<template>
  <div class="contractQuery clearfix">
    <div class="content-box" :class="{'content-style2' : this.treeStyle === 'style2' }">
      <div class="search-box">
        <Form :model="sendData" :label-width="150" inline ref="queryForm" @submit.native.prevent>
          <FormItem label="合同编号" prop="contractNo">
            <Input placeholder="请输入合同编号" v-model="sendData.contractNo" clearable/>
          </FormItem>
          <FormItem label="甲方" prop="companyOid">
            <Select v-model="sendData.companyOid" placeholder="请选择甲方" filterable clearable>
              <Option
                v-for="item in companyList"
                :value="item.value"
                :key="item.value"
              >{{ item.label }}</Option>
            </Select>
          </FormItem>
          <FormItem label="乙方" prop="name">
            <Input placeholder="请输入乙方" v-model="sendData.name" clearable/>
          </FormItem>
          <!-- <FormItem label="合同有效期范围" prop="transferDate">
            <DatePicker
              v-model="transferDate"
              format="yyyy-MM-dd"
              type="daterange"
              placeholder="请选择起始日期"
              :editable="false"
              @on-change="changeTime"
              @on-open-change="initDatePick"
            ></DatePicker>
          </FormItem>-->
          <FormItem label="合同起始日期" prop="beginDate">
            <DatePicker
              v-model="sendData.beginDate"
              format="yyyy-MM-dd"
              placeholder="请选择起始日期"
              :editable="false"
              :options="startTimeOption"
              @on-open-change="initDatePick"
              @on-change="onStartTimeChange"
            ></DatePicker>
          </FormItem>
          <FormItem label="合同截止日期" prop="endDate">
            <DatePicker
              v-model="sendData.endDate"
              format="yyyy-MM-dd"
              placeholder="请选择截止日期"
              :editable="false"
              :options="endTimeOption"
              @on-change="onEndTimeChange"
              @on-open-change="initDatePick"
            ></DatePicker>
          </FormItem>
          <FormItem>
            <Button type="primary" @click="handleSubmit">查询</Button>
            <Button @click="handleReset" style="margin-left:10px;">重置</Button>
          </FormItem>
        </Form>
      </div>
      <div class="setting"></div>
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
</template>

<script>
const Table = () => import("@/components/table/Table.vue");
import utils from "@/assets/js/utils.js";
import requestApi from "@/assets/js/requestApi.js";
import { getContractPdf } from "@/api/contract";
import {} from "jquery";
import { saveAs } from "file-saver";
import { mapMutations } from "vuex";

export default {
  data() {
    return {
      transferDate: "",
      formModalList: [],
      startTimeOption: {}, //开始日期设置
      endTimeOption: {}, //结束日期设置
      // Page页面所需要的数据
      totalRows: 0,
      selectCount: 0,
      // 列表配置start
      propMaxHeight: window.innerHeight - 350, //表格的最大高度,默认600
      // 表头列数据
      columns: [
        {
          name: "操作",
          attr: [
            {
              name: "查看",
              attr: "view",
              initFormat: (row, index) => {
                return '<i title="查看" class="ivu-icon i-icon icon-kejian" style="margin-right: 10px;"></i>';
              },
              initRender(row, index) {
                return true;
              },
              initEvent: (row, index) => {
                this.setPersonSearchData([
                  {
                    id: 2,
                    type: "contractinfo",
                    name: "合同信息",
                    icon: "md-folder",
                    canEdit: false
                  }
                ]);
                this.$router.push({
                  path: `/person/${row.relationOid}`
                });
                // this.$router.push({
                //   path: `/person/${row.relationOid}`,
                //   query: {
                //     showMenuList: JSON.stringify([
                //       {
                //         id: 2,
                //         type: "contractinfo",
                //         name: "合同信息",
                //         icon: "md-folder",
                //         canEdit: false
                //       }
                //     ])
                //   }
                // });
              }
            },
            {
              name: "下载合同附件",
              attr: "dowload",
              initFormat: (row, index) => {
                if (row.contractPath !== null) {
                  return '<i title="下载合同附件" class="ivu-icon i-icon icon-download-cloud"></i>';
                } else {
                  return false;
                }
              },
              initRender(row, index) {
                return true;
              },
              initEvent: (row, index) => {
                this.downLoadContract(row.contractOid);
              }
            }
          ],
          isheadSearchFlag: false,
          width: 0.06,
          textAlign: "left" // 默认是“center”，可以设置左中右3个属性
        },
        {
          name: "合同编号",
          attr: "contractNo",
          width: 0.1
        },
        {
          name: "甲方",
          attr: "firstParty",
          width: 0.1
        },
        {
          name: "乙方",
          attr: "secondParty",
          width: 0.1
        },
        {
          name: "身份证号",
          attr: "idNo",
          width: 0.1
        },
        {
          name: "合同起始日期",
          attr: "contractBegin",
          width: 0.1
        },
        {
          name: "合同截止日期",
          attr: "contractEnd",
          width: 0.1
        },
        {
          name: "合同签订日期",
          attr: "sigantureDate",
          width: 0.1
        },
        {
          name: "合同说明",
          attr: "remark",
          width: 0.1
        }
      ],
      // 传递参数
      sendData: {
        contractNo: "",
        companyOid: "",
        name: "",
        beginDate: "",
        endDate: ""
      },
      companyList: [],
      isShowCheckbox: false, // 是否展示复选框
      isShowSetting: false, // 是否展示设置字段显示的按钮
      isShowEdit: false, // 是否展示编辑按钮
      listUrl: requestApi.getListContract, // Table的列表数据请求的地址
      treeStyle: "style1"
    };
  },
  components: {
    Table
  },
  computed: {},
  mounted() {
    window.onresize = () => {
      this.propMaxHeight = window.innerHeight - 350;
    };
    //获取甲方公司
    this.$axios.get(requestApi.listCompanyInfo).then(({ result }) => {
      result.list.forEach(v => {
        this.companyList.push({
          value: v.companyOid,
          label: v.companyName
        });
      });
    });
  },

  methods: {
    ...mapMutations([
      // `mapMutations` 也支持载荷：
      "setPersonSearchData" // 将 `this.incrementBy(amount)` 映射为 `this.$store.commit('incrementBy', amount)`
    ]),
    onStartTimeChange(startTime) {
      this.sendData.beginDate = startTime;
      this.endTimeOption = {
        disabledDate(endTime) {
          return endTime <= new Date(startTime);
        }
      };
    },
    onEndTimeChange(endTime) {
      this.sendData.endDate = endTime;
      this.startTimeOption = {
        disabledDate(startTime) {
          return startTime >= new Date(endTime);
        }
      };
    },
    //下载合同附件
    downLoadContract(contractOid) {
      const data = { contractOid: contractOid };
      getContractPdf(data).then(res => {
        if (res.type == "application/json") {
          var reader = new FileReader();
          reader.onload = e => {
            const msg = JSON.parse(e.target.result);
            this.$Message.error({
              content: msg["message"],
              duration: 2
            });
          };
          reader.readAsText(res);
        } else {
          // this.$Message.success("正在下载中,请稍候...");
          // saveAs(res, "contract.pdf");
          this.downLoad(data);
        }
      });
    },
    //下载合同附件
    downLoad(data) {
      const params = this.$qs.stringify(data);
      let url = `${requestApi.downloadContract}`;
      const token = utils.getItem("TOKEN_KEY");
      url = `${window.location.origin}/${url}?Authorization=${token}&${params}`;
      this.$Message.info("正在下载中,请稍候...");
      utils.downFile(url);
    },
    //查询
    handleSubmit() {
      this.sendData.beginDate = utils.formatDate(
        this.sendData.beginDate,
        "yyyy-MM-dd"
      );
      this.sendData.endDate = utils.formatDate(
        this.sendData.endDate,
        "yyyy-MM-dd"
      );
      this.$refs.table.queryData();
    },
    //重置
    handleReset() {
      this.$refs.queryForm.resetFields();
      // this.sendData.beginDate = "";
      // this.sendData.endDate = "";
      // this.transferDate = "";
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
    },
    // changeTime(data) {
    //   if (data.length) {
    //     this.sendData.beginDate = data[0];
    //     this.sendData.endDate = data[1];
    //   }
    // },
    initDatePick() {
      utils.initDate();
    }
  }
};
</script>
