
<template>
  <div class="clearfix">
    <Table height="300" :columns="columns" :data="tableData"></Table>
  </div>
</template>

<script>

import utils from "@/assets/js/utils.js";
import requestApi from "@/assets/js/requestApi.js";


import { } from "jquery";
export default {
  data() {
    return {
      orgTitle: "",
      columns: [
        {
          title: "项目分部",
          key: 'unitName',
          align: "center"
        },
        {
          title: '在场人数',
          key: 'onCount',
          align: "center"
        },
        {
          title: '退场人数',
          key: 'outCount',
          align: "center"
        },
        {
          title: '无合同附件人数',
          key: 'notContractCount',
          align: "center"
        },
        {
          title: '证照不全人数',
          key: 'notImageCount',
          align: "center"
        },
        {
          title: '农民工总数',
          key: 'sumCount',
          align: "center"
        },

      ],
      tableData: []
    };
  },
  props: {
    sendData: Array,
  },
  components: {
  },
  computed: {
    // orgTitle() {
    //   return this.$store.state.user.userInfo.userType === "02" ? "架子队" : "项目分部"
    // },
  },
  created() {
    this.columns[0].title = this.$store.state.user.userInfo.userType === "02" ? "架子队" : "项目分部"
  },
  mounted() {
    window.onresize = () => {
      this.propMaxHeight = window.innerHeight - 680;
    };
  },

  methods: {


  },
  watch: {
    sendData(val) {
      this.tableData = this.sendData;
    }
  }

};
</script>
