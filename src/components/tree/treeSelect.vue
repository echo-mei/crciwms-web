<style lang='scss' >
.tree-select {
  .tree-box {
    transition: all 0.8s;
    width: 100%;
    .ivu-input {
      border-color: #dcdee2;
      &:hover {
        border-color: #57a3f3;
      }
    }
    .ivu-poptip-popper {
      width: 99%;
      left: 0;
    }
    .ivu-poptip-rel {
      width: 100%;
    }
    .icon-box {
      position: relative;
      .select-div {
        padding: 2px 7px;
        padding-right: 30px;
        overflow: auto;
        text-align: left;
        display: inline-block;
        width: 100%;
        height: 32px;
        line-height: 1.5;
        font-size: 12px;
        border: 1px solid #dcdee2;
        border-radius: 4px;
        color: #515a6e;
        background-color: #fff;
        background-image: none;
        position: relative;
        cursor: text;
        transition: border 0.2s ease-in-out, background 0.2s ease-in-out,
          box-shadow 0.2s ease-in-out;
        &:hover {
          border-color: #57a3f3;
        }
        .select-span {
          display: inline-block;
          vertical-align: middle;
          max-width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .ivu-tag {
          .ivu-icon {
            vertical-align: super;
          }
          .ivu-tag-text {
            display: inline-block;
            max-width: 150px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
      }
      .right-icon {
        position: absolute;
        right: 10px;
        top: 5px;
        cursor: pointer;
        color: #808695;
        &:hover {
          color: #3e71f7;
        }
      }
      .bule {
        color: #3e71f7;
      }
    }
    .ivu-form-item-error {
      .select-div {
        border-color: #ed4014;
        &:hover {
          border-color: #ed4014;
        }
      }
    }
    .tree-title {
      text-align: left;
      line-height: 1;
      .search-input {
        .ivu-input {
          border-color: #dcdee2;
        }
        .ivu-input-icon {
          color: #808695;
        }
        .ivu-input:focus {
          border-color: #57a3f3;
          outline: 0;
          box-shadow: 0 0 0 2px rgba(45, 140, 240, 0.2);
        }
      }
      .superior {
        display: inline-block;
        width: 100px;
        text-align: center;
        font-size: 14px;
        color: #ccc;
        cursor: not-allowed;
        vertical-align: top;
        line-height: 36px;
        span {
          display: inline-block;
          margin-left: 5px;
        }
      }
      .parent {
        cursor: pointer;
        color: #3e71f7;
      }

      .active-select {
        width: 40%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        display: inline-block;
        height: 36px;
        line-height: 36px;
        padding: 0px 7px;
        font-size: 12px;
        border: 1px solid transparent;
        border-radius: 4px;
      }
      .validate {
        border-color: #ed4014;
      }
    }
    .content {
      margin-top: 4px;
      .el-tree {
        max-height: 200px;
        overflow: auto;
      }
    }
    .footer {
      margin-top: 20px;
      text-align: center;
      .ivu-btn-dashed {
        margin-left: 8px;
      }
    }
  }
}
</style>
<style >

</style>


<template>
  <div class="tree-select">
    <Poptip
      class="tree-box"
      placement="bottom"
      offset="-50"
      v-model="isShowPopTip"
      style="width:100%;left:0;"
    >
      <div
        :class="['icon-box',  { 'ivu-form-item-error': validateFail }]"
        @mouseout="isShowClose = false"
        @mouseover="handShowClose"
      >
        <!-- <div class="ivu-form-item-error-tip" v-if="validateFail">{{ errorTip }}</div> -->
        <!-- <Input :placeholder="placeholder" readonly style="width:100%;"/> -->
        <div class="select-div" v-if="multiple ">
          <Tag
            checkable
            color="primary"
            closable
            :name="item.id"
            @on-close="handleCloseTag"
            v-for="item in selectNodeList"
            :title="item.label"
            :key="item.label"
          >{{ item.label }}</Tag>
        </div>
        <div v-else class="select-div">
          <span
            class="select-span"
            v-for="item in selectNodeList"
            :title="item.label"
            :key="item.label"
          >{{ item.label }}</span>
        </div>
        <!-- <div>
          <span class="right-icon bule">添加</span>
        </div>-->
        <span class="right-icon" @click.prevent.stop="handleDel" v-if="selectNodeList.length > 0">
          <Icon type="ios-close-circle" size="14"/>
        </span>
        <span class="right-icon" v-else>
          <Icon type="ios-arrow-down" size="14"/>
        </span>
      </div>
      <div class="api" slot="content">
        <div class="content clearfix">
          <Tree
            ref="vuetree"
            class="tree-box left"
            :isShowLogo="false"
            :hideUnitType="hideUnitType"
            :defaultKey="defaultKey"
            @on-node-click="onNodeClick"
            @on-current-data="onCurrentData"
          ></Tree>
        </div>
      </div>
    </Poptip>
  </div>
</template>

<script>
import utils from "@/assets/js/utils.js";
import requestApi from "@/assets/js/requestApi.js";
const Tree = () => import("@/components/tree/Tree.vue");
export default {
  data() {
    return {
      isShow: true, //默认展示组织机构
      selectNodeList: [], // 选中的组织架构的列表
      isShowPopTip: false,
      isShowClose: false,

    };
  },
  props: {

    // 是否多选，默认false
    multiple: {
      default: false,
      type: Boolean,
    },

    errorTip: {
      type: String,
      default: "组织机构不能为空！"
    },
    validateFail: {
      default: false,
      type: Boolean,
    },
    placeholder: {
      type: String,
      default: "温馨提示：请选择机构"
    },
    hideUnitType: {

    },
    defaultKey: {

    },

  },
  components: {
    Tree
  },

  computed: {},

  created() {

  },
  mounted() { },

  methods: {
    handShowClose() { },
    handleDel() {
      this.selectNodeList = [];
    },

    handleCloseTag(event, name) {
      let key = "";
      this.selectNodeList.map((item, index) => {
        if (item.id === name) {
          key = index;
        }
      })
      this.selectNodeList.splice(key, 1);
      this.$emit('on-select-node', false);
    },
    onNodeClick(data) {
      if (!this.multiple && data.isAuth) {
        this.selectNodeList = [];
        this.selectNodeList.push(data);
      }
    },
    onCurrentData(data) {
      this.onNodeClick(data)
    },

  },

  watch: {

    selectNodeList(val) {
      const data = val.length > 0 ? val[0] : "";
      this.$emit('on-select-node', data);
    }
  },

}
</script>
