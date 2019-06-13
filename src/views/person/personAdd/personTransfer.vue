<style lang="scss">

</style>
<template>
  <div v-if="showModal">
    <Modal
      v-model="modal"
      @on-visible-change="changeShow()"
      title="调入人员"
      width="1000"
      :mask-closable="false"
    >
      <div class="content">
        <div class="search-box">
          <Form ref="queryForm" key="searchForm" :model="queryData" :label-width="45" inline>
            <FormItem label="姓名" prop="name" style="width:40%;">
              <Input clearable placeholder="请输入姓名" v-model="queryData.name"/>
            </FormItem>
            <div style="display:inline-block;margin-left:10px;">
              <Button type="primary" @click="search()">查询</Button>
              <Button @click="reset()" style="margin-left:10px;">重置</Button>
            </div>
          </Form>
        </div>
        <div class="box">
          <div class="table-box">
            <Table
              ref="table"
              :columnList="columns"
              :listUrl="listUrl"
              :sendData="queryData"
              :isShowSetting="isShowSetting"
              :isShowCheckbox="isShowCheckbox"
              :isShowEdit="isShowEdit"
              @on-select-rows="onSelectRows"
              :propMaxHeight="propMaxHeight"
            ></Table>
          </div>
        </div>
      </div>
      <div slot="footer">
        <Button type="primary" style="width:90px;" @click="handleOk">调入</Button>
        <Button type="dashed" style="width:90px;" @click="handleCancel">取消</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
const Table = () => import("@/components/table/Table.vue");
import utils from "@/assets/js/utils.js";
import requestApi from "@/assets/js/requestApi.js";
import { transferPersons } from "@/api/person";
import { getOrg } from "@/api/org";

export default {
  data() {
    return {
      showModal: true,
      modal: true,
      unitName: "",
      // Page页面所需要的数据
      totalRows: 0,
      selectCount: 0,
      ids: [], // 选中的ids
      // 列表配置start
      propMaxHeight: window.innerHeight - 500, //表格的最大高度,默认600
      // 表头列数据
      columns: [
        {
          name: "序号",
          width: 0.05,
          initFormat: (row, index) => {
            return ++index;
          }
        },
        {
          name: "姓名",
          attr: "name",
          width: 0.1
        },
        {
          name: "身份证号",
          attr: "idNo",
          width: 0.1
        },
        {
          name: "手机号",
          attr: "phone",
          width: 0.1
        },
        {
          name: "架子队",
          attr: "unitName",
          width: 0.1
        },
        // {
        //   name: "班组",
        //   attr: "deptName",
        //   width: 0.1
        // },
        // {
        //   name: "劳务公司",
        //   attr: "companyName",
        //   width: 0.1
        // },
        {
          name: "在场状态",
          attr: "personStatus",
          width: 0.1,
          initFormat: (row, index) => {
            switch (row.personStatus) {
              case "1":
                return "已进场";
                break;
              case "2":
                return "已退场";
                break;
            }
          }
        }
      ],
      // 传递参数
      queryData: {
        name: "",
        unitOid: "",
        createFlag: "Y"
      },
      isShowCheckbox: true, // 是否展示复选框
      isShowSetting: false, // 是否展示设置字段显示的按钮
      isShowEdit: false, // 是否展示编辑按钮
      listUrl: requestApi.personList // Table的列表数据请求的地址
      // 列表配置end
    };
  },
  props: ["sentData"],
  components: { Table },
  created() {
    this.queryData.unitOid = this.sentData.unitOid;
    this.showModal = this.sentData.showModal;
    getOrg(this.queryData.unitOid).then(res => {
      this.unitName = res.result.unitName;
    });
    console.log("created");
  },
  mounted() {
    window.onresize = () => {
      this.propMaxHeight = window.innerHeight - 500;
    };
  },
  methods: {
    search() {
      this.$refs.table.queryData();
    },
    reset() {
      this.$refs.queryForm.resetFields();
      this.search();
    },
    /**
     * 单选复选框选中数据
     */
    onSelectRows(rows) {
      this.selectCount = rows.length;
      this.selectRow = rows[0];
      this.ids = []; // 每次获得都需要清空一下上次选择的删除数据
      rows.forEach((v, i) => {
        this.ids.push(v.personOid);
      });
    },
    changeShow() {
      if (!this.modal) this.$emit("tableSearch");
    },
    handleOk() {
      if (!this.ids.length) {
        this.$Message.error({
          content: "请选择要调入的人员",
          duration: 2
        });
        return false;
      }
      this.$Modal.confirm({
        title: "确认将选中的人员调入到【" + this.unitName + "】吗？",
        cancelText: "取消",
        onOk: () => {
          const personOids = this.ids.join(",");
          const data = {
            personOid: personOids,
            unitOid: this.queryData.unitOid
          };
          transferPersons(data).then(res => {
            if (res) {
              this.$Message.success({
                content: res.result,
                duration: 3
              });
              this.modal = false;
            }
          });
        }
      });
    },
    handleCancel() {
      this.modal = false;
    }
  }
};
</script>