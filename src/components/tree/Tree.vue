<style lang="scss" scoped>
.tree {
  background: #fff;
  // box-shadow: 0px 4px 10px #ddd;
  padding: 10px;
  // max-height: 100%;
  // overflow: auto;
  // transition: all 0.3s;
  width: 100%;
  display: inline-block;
  .ivu-input-wrapper {
    width: 100%;
  }
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
  .el-tree {
    overflow: auto;
    max-height: calc(100% - 90px);
    min-height: 100px;
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
.tree > div {
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
  text-align: left;
}
.custom-tree-node .ivu-icon {
  font-size: 16px;
}
.custom-tree-node .icon-worker {
  color: #eba432;

  font-size: 18px;
}
.custom-tree-node .icon-workers {
  color: #1b56b7;
}
.custom-tree-node .icon-xiangmu {
  color: #a32233;
  font-size: 20px;
}
.not-allowed {
  cursor: not-allowed;
}
.el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content {
  color: #3e71f7;
}
</style>

<template>
  <div class="tree">
    <div v-show="isShow">
      <div class="title clearfix" v-if="isShowLogo">
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
    isShowLogo: {
      default: true,
      type: Boolean,
    },
    hideUnitType: {
      // 需要隐藏的类型，默认不隐藏

    },
    disabledType: { // 禁用的类型，默认全部不禁用

    },
    defaultKey: {

    }
  },
  computed: {},

  created() {

    this.queryData(0);
  },

  mounted() {



  },

  methods: {
    /**
     *  element-ui的机构数示例做法仅把匹配到的数据展示，不匹配的全部false
     *  if (!value) return true;
     *  return data.label.indexOf(value) !== -1;
     *
     *  现要求，匹配上的数据的children允许展开
     */
    filterNode(value, data, node) {
      if (!value) {
        return true;
      }
      // let level = node.level;
      let _array = [];//这里使用数组存储 只是为了存储值。
      this.getReturnNode(node, _array, value);
      let result = false;
      _array.forEach(item => {
        result = result || item;
      });
      return result;
    },
    getReturnNode(node, _array, value) {
      let isPass = node.data && node.data.label && node.data.label.indexOf(value) !== -1;
      isPass ? _array.push(isPass) : '';
      if (!isPass && node.level != 1 && node.parent) {
        this.getReturnNode(node.parent, _array, value);
      }
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
    /**
     * isAuth 控制组织架构中的数据是否可操作，后台一般会将当前登录用户的上级机构设置为false，
     * 当前机构的下级机构不做限制，如业务需要，可以通过下面参数处理：
     *
     *    1、hideUnitType  : 需要隐藏的组织机构类型，一般用于隐藏班组
     *          unitType  1 项目部  2 项目分部 3 架子队 4 班组
     *    2、disabledType ：需要禁用的组织架构类型，一般用于限制选择班组不可选择；
     */
    queryData() {
      this.$axios.get(requestApi.orgTreeList).then(res => {
        if (res.code !== "200") return false;
        let treeList = res.result || [],
          o = {},
          iconClass = "";
        if (treeList.length) {
          treeList.sort(this.compare("unitOid", true));

          if (this.hideUnitType) {  // 如果存在需要隐藏的节点，先把数组去掉不需要的节点数据；
            treeList = treeList.filter(item =>
              item.unitType != this.hideUnitType
            )
          }
          if (this.disabledType) {  // 如果存在需要禁用的节点，需要把isAuth改成false
            treeList.forEach(item => {
              item.isAuth = (item.unitType == this.disabledType ? false : item.isAuth)
            }

            )
          }
          treeList.forEach((item, index) => {
            switch (item.unitType) {
              case "2":
                iconClass = "icon-xiangmu";
                break;
              case "3":
                iconClass = "icon-workers";
                break;
              case "4":
                iconClass = "icon-worker";
                break;
              default:
                iconClass = ""
                break;
            }
            item.iconClass = iconClass;
            if (!o[item.parentUnitOid]) {
              let tempArr = [];
              tempArr.push(item)
              o[item.parentUnitOid] = tempArr;
            } else {
              o[item.parentUnitOid].push(item);
            }
          })
          treeList.forEach((item) => {
            item.children = o[item.unitOid] || [];
            item.title = item.unitName;
            item.label = item.unitName;
            item.value = item.unitOid;
            item.id = item.unitOid;
          })
          let treeData = [];

          treeData.push(JSON.parse(JSON.stringify(treeList[0])));
          this.treeData = treeData;
          this.$emit("on-first-data", this.treeData);
          this.$nextTick(() => {
            this.$refs.tree.setCurrentKey(this.defaultKey);
            const currentData = this.$refs.tree.getCurrentNode();
            if (currentData) {
              this.$emit("on-current-data", currentData);
            }
            $('.el-tree-node__content').removeClass('not-allowed').find('.not-allowed').parent().addClass('not-allowed')
          })
        }else{
           this.treeData = [];
        }
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
     *
     */

    renderContent(h, { node, data, store }) {
      return (
        <span class={["custom-tree-node", !data.isAuth ? "not-allowed" : null].join(' ')}>
          <i class={["ivu-icon i-icon ", data.iconClass].join(' ')} size="18"></i>
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
    },
    defaultKey() {
      this.$nextTick(() => {
        this.$refs.tree.setCurrentKey(this.defaultKey);
      })
    },
    hideUnitType(val) {
      console.log('变更了selectType', val);

      this.queryData();
    }
  }
};
</script>
