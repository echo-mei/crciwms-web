<style scoped lang="scss">
.middle-btn {
  margin: 0 10px;
}
.box {
  margin-top: 16px;
}
</style>

<template>
  <div>
    <Button size="small" class="icon-btn" @click="add">
      <Icon custom="i-icon icon-add" size="18"/>
      <span>添加</span>
    </Button>
    <div class="box">
      <div class="table-box">
        <Table
          TableId="waitTable"
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
</template>

<script>
const Table = () => import("@/components/table/Table.vue");
import requestApi from "@/assets/js/requestApi.js";
import utils from "@/assets/js/utils.js";
import { insertIntoWageBatch } from "@/api/wage.js";
export default {
  props: ["sentData"],
  data() {
    return {
      // 列表配置start
      propMaxHeight: window.innerHeight - 400, //表格的最大高度,默认600
      // 表头列数据
      columns: [
        {
          name: "架子队名称",
          attr: "unitName",
          width: 0.1,

          initRender(row, index) {
            return true;
          },
          initEvent: (row, index) => {
            // this.editOrg(row, index, false);
          }
        },
        {
          name: "计划名称",
          attr: "planName",
          width: 0.1
        },
        {
          name: "计划说明",
          attr: "planDesc",
          width: 0.1
        },
        {
          name: "计划状态",
          attr: "batchStatus",
          width: 0.1,

        },
        {
          name: "创建人",
          attr: "createdByName",
          width: 0.1
        },
        {
          name: "创建时间",
          attr: "createdDate",
          width: 0.1,
          initFormat: (row, index) => {
          }
        }
      ],
      // 传递参数
      sendData: {
      },
      isShowCheckbox: true, // 是否展示复选框
      isShowSetting: false, // 是否展示设置字段显示的按钮
      isShowEdit: false, // 是否展示编辑按钮
      listUrl: requestApi.listWaitWagePlan, // Table的列表数据请求的地址
      // 列表配置end
      ids: [],
      addData: {},
    };
  },
  components: {
    Table
  },
  computed: {

  },
  created() {
    this.addData = this.sentData;
  },
  mounted() {

  },
  methods: {

    add() {
      const type = utils.validateIds(this, this.ids);
      if (!type) return false;
      const data = {
        planOid: this.ids.join(','),
        batchOid: this.addData.batchOid,
      }
      insertIntoWageBatch(data).then(res => {
        console.log('res', res)
        this.$Message.success(res.result);
        this.$emit('on-insert-success', true);
      })
    },
    remove() {
      const type = utils.validateIds(this, this.ids);
      if (!type) return false;
      const data = this.ids.join(",");
      // deleteFromWageBatch(data);
    },
    /**
         * 单选复选框选中数据
         */
    onSelectRows(rows) {
      this.ids = []; // 每次获得都需要清空一下上次选择的删除数据
      rows.forEach((v, i) => {
        this.ids.push(v.planOid);
      });
    },
  },
  watch: {

  },
};
</script>
