<style lang="scss" scoped>
.tree {
  background: #fff;
  // box-shadow: 0px 4px 10px #ddd;
  padding: 10px;
  max-height: 100%;
  overflow: auto;
  // transition: all 0.3s;
  width: 100%;
  display: inline-block;
  .title {
    padding: 10px 0;
    font-size: 24px;
    color: #3e71f7;
    line-height: 1;
    .logo {
      display: inline-block;
      padding: 5px;
      margin-left: 10px;
      border-radius: 5px;
      background: #3e71f7;
      color: #fff;
    }
    .menu {
      cursor: pointer;
      margin-top: 5px;
    }
  }
  .style2 {
    // width: 60px;
  }
}
.style2 {
  //   width: 80px;
  text-align: center;
  .title {
    .logo {
      margin-left: 0px;
      margin-bottom: 10px;
    }
  }
}
</style>
<style>
.tree>div{
  height: 100%;
}
.el-tree-node__label {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
.custom-tree-node {
  font-size: 14px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content {
  color: #3e71f7;
}
</style>

<template>
  <div class="tree">
    <div v-show="isShow">
      <div class="title clearfix">
        <span class="logo fl">
          <Icon custom="i-icon icon-yinxing" size="26"/>
        </span>
        <span style="vertical-align: sub;">组织机构</span>
        <span class="menu fr" @click="onShowTree">
          <Icon custom="i-icon icon-menu-fold" size="28"/>
        </span>
      </div>
      <Input v-model="filterText" placeholder="请输入单位名称" search @on-search="onfilterText"/>
      <el-tree
        :data="treeData"
        node-key="id"
        :default-expand-all="defaultExpandAll"
        @node-drag-start="handleDragStart"
        @node-drag-enter="handleDragEnter"
        @node-drag-leave="handleDragLeave"
        @node-drag-over="handleDragOver"
        @node-drag-end="handleDragEnd"
        @node-drop="handleDrop"
        @node-click="handleNodeClick"
        :expand-on-click-node="false"
        :allow-drop="allowDrop"
        :allow-drag="allowDrag"
        :highlight-current="true"
        :render-content="renderContent"
        :filter-node-method="filterNode"
        ref="tree"
      ></el-tree>
    </div>
    <div v-show="!isShow">
      <div class="title clearfix">
        <div class="logo">
          <Icon custom="i-icon icon-yinxing" size="26"/>
        </div>
        <div class="menu" @click="onShowTree">
          <Icon custom="i-icon icon-menu-unfold" size="28"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import utils from "@/assets/js/utils.js";
import requestApi from "@/assets/js/requestApi.js";

import { } from "jquery";
export default {
  data() {
    return {
      isShow: true, //默认展示组织机构
      treeData: [],
      filterText: "", //过滤的关键字
      defaultProps: {
        children: "children",
        label: "label"
      }
    };
  },

  components: {},
  props: {
    defaultExpandAll: {
      default: true,
      type: Boolean,
    },
    defaultKey: {
      type: Number,
    }
  },
  computed: {},

  created() {
    this.queryData(0);
  },

  mounted() {

  },

  methods: {
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    onfilterText(val) {
      this.$refs.tree.filter(val);
    },
    onShowTree() {
      this.isShow = !this.isShow;
      this.isShow
        ? this.$emit("on-change-style", "style1")
        : this.$emit("on-change-style", "style2");
    },
    queryData() {

      this.$axios.get(requestApi.orgTreeList).then(
        res => {
          var treeList = res.result;
          var o = {};
          if (treeList.length) {
            treeList.sort(this.compare('unitOid', true));
          }
          return new Promise((resolve, reject) => {
            treeList.forEach((item, index) => {
              item.parentUnitOid = !item.parentUnitOid ? "1" : item.parentUnitOid;
              if (!o[item.parentUnitOid]) {
                let tempArr = [];
                tempArr.push(item)
                o[item.parentUnitOid] = tempArr;
              } else {
                o[item.parentUnitOid].push(item);
              }
            })
            treeList.forEach((item, index) => {
              item.children = o[item.unitOid] || [];
              item.title = item.unitName;
              item.label = item.unitName;
              item.value = item.unitOid;
              item.id = item.unitOid;
            })
            resolve();

          }).then(() => {
            let treeData = [];
            treeData.push(JSON.parse(JSON.stringify(treeList[0])));
            this.treeData = treeData;
            this.$emit("on-first-data", this.treeData);
            this.$nextTick(() => {
              this.$refs.tree.setCurrentKey(this.defaultKey);
              const currentData = this.$refs.tree.getCurrentNode();
              this.$emit("on-current-data", currentData);
            })
          }).catch(() => {
            reject();
          })


        },

      );
    },
    /**
     *  根据key排序
     * property是属性名，desc是一个bool值，desc为true是升序排列 ，desc为false是降序排列
     *  @param {*} property 需要排序的key的名称
     *  @param {*} desc Boolean值，true为升序 false为降序
     */
    compare(property, desc) {
      return function (a, b) {
        var value1 = a[property];
        var value2 = b[property];
        if (desc == true) {
          return value1 - value2;
        } else {
          return value2 - value1;
        }
      }
    },
    /**
     * 避免部门长度太长，超出看不到，故使用自定义渲染，设置了title属性，实现了鼠标移入展示全部
     */
    renderContent(h, { node, data, store }) {
      return (
        <span class="custom-tree-node">
          <span title={node.label}>{node.label}</span>
        </span>
      );
    },

    handleDragStart(node, ev) {
      console.log("drag start", node);
    },
    handleDragEnter(draggingNode, dropNode, ev) {
      console.log("tree drag enter: ", dropNode.label);
    },
    handleDragLeave(draggingNode, dropNode, ev) {
      console.log("tree drag leave: ", dropNode.label);
    },
    handleDragOver(draggingNode, dropNode, ev) {
      console.log("tree drag over: ", dropNode.label);
    },
    handleDragEnd(draggingNode, dropNode, dropType, ev) {
      console.log("tree drag end: ", dropNode && dropNode.label, dropType);
    },
    handleDrop(draggingNode, dropNode, dropType, ev) {
      console.log("tree drop: ", dropNode.label, dropType);
    },
    handleNodeClick(data) {
      console.log("data", data);
      this.$emit("on-node-click", data);
    },
    allowDrop(draggingNode, dropNode, type) {
      if (dropNode.data.label === "二级 3-1") {
        return type !== "inner";
      } else {
        return true;
      }
    },
    allowDrag(draggingNode) {
      return draggingNode.data.label.indexOf("三级 3-2-2") === -1;
    }
  },

  watch: {
    filterText(newValue, oldValue) {
      //组织机构搜索，搜索内容为空，则应该执行一次搜索全部
      if (!newValue) {
        this.$refs.tree.filter(newValue);
      }
    }
  }
};
</script>
