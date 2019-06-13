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
    <!-- 新增、移除发放计划 -->
    <template v-if="type === 'addOrRemove'">
      <!-- <Button size="small" class="icon-btn" @click="add">
        <Icon custom="i-icon icon-add" size="18"/>
        <span>获取待添加的计划</span>
      </Button>-->

      <div v-if="sentData.type === 'application'">
        <Button type="primary" @click="add" size="small">
          <Icon type="ios-search" size="18"></Icon>获取待添加的计划
        </Button>

        <Button
          size="small"
          type="error"
          ghost
          class="icon-btn middle-btn"
          @click="remove"
          v-if="tableLength !== 0"
        >
          <Icon custom="i-icon icon-shanchuhover" size="18"/>
          <span>移除</span>
        </Button>
      </div>
      <planList
        :type="sentData.type"
        :sentData="sendData"
        :url="applicationUrl"
        @on-success="onSuccess"
        @on-current-change="onAddCurrentChange"
        ref="planList"
      ></planList>
    </template>
    <!-- 查看发放计划详情 -->
    <template v-else-if="type === 'planDetailList'">
      <div class="clearfix">
        <Button size="small" @click="goBack" class="icon-btn middle-btn fr">
          <Icon type="ivu-icon i-icon icon-fanhuishangji" size="18"/>
          <span>返回</span>
        </Button>
      </div>
      <planDetailList :sentData="sendData" ref="planDetailList"></planDetailList>
    </template>
    <!-- 未添加到发放批次的计划列表 -->
    <template v-else>
      <div>
        <div class="clearfix">
          <Button size="small" class="icon-btn" @click="addWaitPlan">
            <Icon custom="i-icon icon-add" size="18"/>
            <span>添加计划至发放批次中</span>
          </Button>
          <Button size="small" @click="type='addOrRemove'" class="icon-btn middle-btn fr">
            <Icon type="ivu-icon i-icon icon-fanhuishangji" size="18"/>
            <span>返回</span>
          </Button>
        </div>
        <planList
          :type="type"
          :sentData="sendData"
          :url="waitPlanUrl"
          @on-success="onSuccess"
          @on-wait-success="onWaitSuccess"
          @on-current-change="onCheckCurrentChange"
          ref="planList"
        ></planList>
      </div>
    </template>
  </div>
</template>

<script>
const planList = () => import("@/views/wage/wageBatch/planList.vue");
const planDetailList = () => import("@/views/wage/wageBatch/planDetailList.vue");
export default {
  props: ["sentData"],
  data() {
    return {
      type: "addOrRemove", // 默认是新增/删除
      applicationUrl: "listWagePlanByBatchOid", // 默认是新增/删除
      waitPlanUrl: "listWaitWagePlan", // 默认是新增/删除

      sendData: {
        batchOid: "",
      },
      tableLength: 0,
    };
  },
  components: {
    planList, planDetailList
  },
  computed: {

  },
  created() {
    this.sendData.batchOid = this.sentData.batchOid;
  },
  mounted() {


    //
  },
  methods: {

    add() {
      this.type = "add"
    },
    addWaitPlan() {
      this.sendData.batchOid = this.sentData.batchOid;
      this.$refs.planList.add();
    },
    remove() {
      this.$refs.planList.remove();
    },
    handleOk() {

    },

    onSuccess() {
      this.type = "addOrRemove"
      this.$nextTick(() => {
        this.tableLength = this.$refs.planList.tableData.length;
      })
    },
    onAddCurrentChange(data) {
      this.type = "planDetailList";
      this.sendData = data;
      this.sendData.type = "add";
    },
    onCheckCurrentChange(data) {

      this.type = "planDetailList";
      this.sendData = data;
      this.sendData.type = "check";
    },
    goBack() {
      if (this.sendData.type === "check") {
        this.type = "";

      } else if (this.sendData.type === "add") {
        this.type = "addOrRemove";


      }
    },
    onWaitSuccess() {
      this.$nextTick(() => {
        this.tableLength = this.$refs.planList.tableData.length;
      })
    },

  },
  watch: {

  },
};
</script>
