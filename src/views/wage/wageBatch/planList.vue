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
    <!-- <Button size="small" class="icon-btn" @click="add">
      <Icon custom="i-icon icon-add" size="18"/>
      <span>添加</span>
    </Button>-->
    <div class="box">
      <div class="table-box">
        <Table
          height="300"
          :columns="columns"
          :data="tableData"
          ref="selection"
          @on-select="onSelectRows"
          @on-select-all="onSelectAll"
          highlight-row
        >
          <template slot-scope="{ row, index }" slot="planStatus">{{ formatStatus(row.planStatus) }}</template>
          <template slot-scope="{ row, index }" slot="action">
              <Button
                type="primary"
                size="small"
                style="margin-right: 5px"
                @click="onCurrentChange(row)"
              >查看</Button>
            </template>
        </Table>
      </div>
    </div>
  </div>
</template>

<script>
import utils from "@/assets/js/utils.js";
import { insertIntoWageBatch, listWaitWagePlan, listWagePlanByBatchOid, deleteFromWageBatch } from "@/api/wage.js";
import { planStatusList } from "@/assets/js/commonJSON.js";
export default {
  props: ["type","sentData", "url"],
  name: "planList",
  data() {
    return {
      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: "架子队名称",
          key: "unitName",
          align: "center",
          tooltip:true
        },
        {
          title: "计划名称",
          key: "planName",
          ellipsis: true,
          align: "center",
        },
        {
          title: "计划说明",
          key: "planDesc",
          ellipsis: true,
          align: "center",
        },
        {
          title: "计划状态",
          slot: "planStatus",
          align: "center",

        },
        {
          title: "创建人",
          key: "createdByName",
          align: "center",
        },
        {
          title: "创建时间",
          key: "createdDate",
          align: "center",
        },
        {
          title: '操作',
          slot: 'action',
          width: 200,
          align: 'center'
        }
      ],
      tableData: [], // 表格数据
      ids: [],
      addData: {},
    };
  },
  components: {
    // Table
  },
  computed: {

  },
  created() {
    this.addData = this.sentData;
    this.initData();
    if(this.type && this.type === "checkApplication"){
      this.columns.shift();
    }
  },
  mounted() {

  },
  methods: {
    initData() {

      if (this.url === "listWaitWagePlan") {
        listWaitWagePlan().then(res => {
          console.log('查询待添加的');

          if (res)
            this.tableData = res.result.list;
          this.$emit('on-wait-success', true);
        })
      } else {
        listWagePlanByBatchOid(this.addData.batchOid).then(res => {
           console.log('根据id查询已添加的',this.addData);
          if (res)
            this.tableData = res.result.list;
          this.$emit('on-success', true);
        })
      }

    },
    formatStatus(status) {
      let statusLabel = "";
      planStatusList.filter(item => {
        if (item.value === status)
          return statusLabel = item.label;
      })
      return statusLabel;
    },
    add() {
      const type = utils.validateIds(this, this.ids);
      if (!type) return false;
      const data = {
        planOid: this.ids.join(','),
        batchOid: this.addData.batchOid,
      }
      insertIntoWageBatch(data).then(res => {
        this.$Message.success(res.result);
        this.$emit('on-success', true);
      })
    },
    remove() {
      const type = utils.validateIds(this, this.ids);
      if (!type) return false;
      const data = this.ids.join(",");
      deleteFromWageBatch(data).then(res => {
        if (res)
          this.$Message.success(res.result);
        this.initData();
        this.$emit('on-success', true);
      });
    },
    /**
         * 单选复选框选中数据
         */
    onSelectRows(selection, row) {
      this.ids = []; // 每次获得都需要清空一下上次选择的删除数据
      selection.forEach((v, i) => {
        this.ids.push(v.planOid);
      });
    },
    onCurrentChange(data) {
      this.$emit('on-current-change', data)
    },
    onSelectAll(selection) {
      this.ids = []; // 每次获得都需要清空一下上次选择的删除数据
      selection.forEach((v, i) => {
        this.ids.push(v.planOid);
      });
    },
    handleSelectAll(status) {
      this.$refs.selection.selectAll(status);
    }

  },
  watch: {

  },
};
</script>
