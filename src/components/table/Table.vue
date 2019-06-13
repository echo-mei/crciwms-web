<style scoped="scoped" lang="scss">
.common_table_container {
  background: #fff;
  /* box-shadow: 0px 4px 10px #ddd; */
  width: 100%;
  overflow: hidden;
  transition: all 0.5s;
}

/*表格的样式*/
.common_table_container .common_table_div {
  width: 100%;
  overflow: auto;
  position: relative;
}

.common_table_div .common_table {
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
  /* display: block; */
  table-layout: fixed;
}

.common_table thead th {
  height: 50px;
  line-height: 50px;
  box-sizing: border-box;
  // border: solid 1px #eee;
  border-bottom: solid 1px #eee;
  position: relative;
}
.comon_table_body {
  width: 100%;
  overflow-x: hidden;
}
.common_table tbody tr td {
  /* border: solid 1px #eee; */
  height: 35px;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.common_table thead tr th .td_container,
.common_table tbody tr td .td_container {
  display: flex;
  text-align: center;
  height: 100%;
  width: 100%;
  height: 50px;
  line-height: 50px;
  box-sizing: border-box;
}
.common_table thead tr th .resize-line {
  width: 6px;
  height: 50px;
  position: absolute;
  z-index: 2;
  right: 0;
  top: 0;
  overflow: hidden;
  cursor: col-resize;
}
.common_table_div .resize-line:active,
.common_table_div .resize-line:hover {
  background-color: #77b8ff;
}
.common_table_div .resize-line:before,
.common_table_div .resize-line:after {
  content: " ";
  display: block;
  width: 2px;
  height: 2px;
  margin: 18px auto 0;
  background-color: #fff;
  overflow: hidden;
}
.common_table_div .resize-line:after {
  margin-top: 5px;
}
.common_table_div .col-scaleplate {
  position: absolute;
  width: 1px;
  height: calc(100% - 60px);
  background-color: #77b8ff;
  top: 0;
  left: -9999px;
  /* display: none; */
}
.common_table thead tr th .td_container .td_text {
  flex: 1;
  font-size: 14px;
}
.common_table thead tr th .td_container .td_text,
.common_table tbody tr td .td_container .td_text {
  padding: 0px 10px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.common_table thead tr th .td_container .td_operate,
.common_table tbody tr td .td_container .td_operate {
  width: 65px;
  box-sizing: border-box;
  text-align: center;
  z-index: 10;
  /* border-right: solid 1px #eee; */
}
.common_table tbody tr {
  transition: all 0.2s;
  border-bottom: solid 1px #eee;
}
.common_table tbody tr:nth-child(even) {
  background: #fbfbfb;
}
.common_table tbody tr:hover {
  background: #eef3ff;
}
.common_table tbody tr.td_select {
  background: #eef3ff;
}
.common_table tbody tr .image_icon {
  display: inline-block;
  width: 20px;
  height: 20px;
  vertical-align: middle;
}
.common_table tbody tr:hover .hover_show {
  display: inline-block;
}
.width_100 {
  display: inline-block;
  width: 100%;
}
.hover_show {
  display: none;
}

/*暂无数据样式*/
.common_table_div .common_table_nodata {
  text-align: center;
  padding: 10px;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-left: -93px;
}
.common_table_div .common_table_nodata .line1 {
  padding: 3px;
  font-size: 13px;
  color: #606167;
}

/*显示隐藏字段*/
.column_content .column_item {
  width: 25%;
  float: left;
  padding: 3px 0px 3px 20px;
}
</style>

<style>
/*定义复选框样式*/
.common_table .ivu-checkbox {
  height: 17px !important;
  width: 17px !important;
  border-radius: 2px;
  box-sizing: border-box;
}
.common_table .ivu-checkbox-inner {
  height: 17px !important;
  width: 17px !important;
  border-radius: 2px;
  box-sizing: border-box;
}
.common_table .ivu-checkbox-input {
}
.common_table .ivu-checkbox-checked .ivu-checkbox-inner {
  outline: solid 2px #eee;
  border-radius: 2px;
}
.common_table .ivu-checkbox-checked .ivu-checkbox-inner::after {
  width: 5px;
  height: 8px;
  top: 3px;
  left: 5px;
  border-radius: 2px;
}

.common_table .error {
  display: inline-block;
  padding: 5px 10px;
  background: #ff3000;
  color: #fff;
  height: 20px;
  line-height: 10px;
  margin-right: 5px;
}

/*icon的样式*/
.common_table .ivu-icon {
  font-size: 18px;
  color: #666;
}
.common_table .ivu-icon:hover:before {
  color: #2d8cf0;
}

.common_table .error-icon {
  padding: 5px 10px;
  color: #ff3000;
  vertical-align: sub;
}
.common_table .error-icon-hover:hover:before {
  color: #ff3000;
}
.common_table .no-hover {
  cursor: text;
}
.common_table .no-hover:hover:before {
  color: #666;
}
</style>

<template>
  <div class="common_table_container" :id="tableID" ref="tableContainer">
    <div class="common_table_div" @scroll="_ontableScroll($event)" id="common_table_div">
      <!-- :style="{width:getTableWidth+'px'}" -->
      <div>
        <table class="common_table table-header">
          <!-- 表格表头部分 -->
          <thead>
            <tr>
              <th v-if="isShowCheckbox || isShowSetting" width="30">
                <i v-if="!isShowCheckbox && !isShowEdit && !isShowSetting"></i>
                <div class="td_operate">
                  <Checkbox v-if="isShowCheckbox" v-model="checkedAll" @on-change="_checkedAll()"></Checkbox>
                  <Icon
                    v-if="isShowSetting"
                    @click.native.stop="isShowSettingColumn = true"
                    type="md-settings"
                    style="font-size:16px;cursor:pointer;bottom:-2px;position:relative;z-index:10;"
                  ></Icon>
                </div>
              </th>

              <th
                v-for="(col, index) in columns"
                v-if="col.showColumn"
                :key="index"
                :width="col.width * 1000 || 200"
                class="table-col-resize"
              >
                <div class="td_container">
                  <div
                    class="td_text"
                    :style="{ textAlign: col.textAlign || 'center' }"
                    @click.stop="_onTheadClick(col, $event, index)"
                    :title="col.value || col.name"
                    draggable="true"
                    @dragstart="dragstartEvent($event, index)"
                    @dragenter.stop.prevent="dragenterEvent($event, col)"
                    @dragend="dragendEvent($event, col)"
                    @dragover.stop.prevent="clearCursorIcon($event)"
                  >
                    <div>
                      <div v-if="col.type === 'input'">
                        {{ col.name }}
                        <Icon type="ios-search" size="16"/>
                      </div>
                      <div v-else-if="col.type === 'datePicker'">
                        {{ col.name }}
                        <!-- <svg-icon icon-class="time"></svg-icon> -->
                        <Icon type="md-time" size="16"/>
                      </div>
                      <div v-else-if="col.type === 'select'">
                        {{ col.name }}
                        <Icon type="md-arrow-dropdown" size="16"/>
                      </div>
                      <div v-else>{{ col.name }}</div>
                    </div>
                  </div>
                </div>
                <span class="resize-line" draggable="false"></span>
              </th>
            </tr>
          </thead>
        </table>
      </div>
      <div class="comon_table_body" :style="{ height: MaxHeight + 'px' }">
        <table class="common_table table-body">
          <!--通过col标签统一控制宽度-->
          <!-- <colgroup>
                            <col :width="20" v-if="isShowCheckbox || isShowSetting"></col>
                            <col :width="(col.width != undefined && col.width) ?parseFloat(col.width)*(getTableWidth / columns.length):200" :key="index" v-for="(col,index) in columns" v-if="col.showColumn">
                        </colgroup>
          -->
          <!--表格数据主要部分-->
          <tbody>
            <tr
              v-for="(row, rowIndex) in rowsData"
              :class="[{td_select: row.checked}, _getRowClass({row, rowIndex})]"
              :key="rowIndex"
            >
              <th v-if="isShowCheckbox || isShowSetting" width="30">
                <i v-if="!isShowCheckbox && !isShowEdit && !isShowSetting"></i>
                <div class="td_operate">
                  <Checkbox
                    v-show="isShowCheckbox"
                    v-model="row.checked"
                    @on-change="_onSelect(row)"
                  ></Checkbox>

                  <Icon
                    v-if="isShowEdit"
                    type="edit"
                    style="font-size:16px;cursor:pointer;bottom:-2px;position:relative;"
                    @click.native.stop="_onRowEdit(row, rowIndex, $event)"
                  ></Icon>
                </div>
              </th>
              <!-- <td v-for="(col,colIndex) in columns" v-if="col.showColumn" :key="colIndex" :style="[{width:(col.width*1000||200)+'px'},{maxWidth:(col.width*1000||200)+'px'}]"> -->
              <td
                v-for="(col, colIndex) in columns"
                v-if="col.showColumn"
                :key="colIndex"
                :width="col.width * 1000 || 200"
              >
                <div
                  class="td_container"
                  @click.stop="_renderEvent(row, col, rowIndex, $event)"
                  @dblclick.stop="_onRowDbclick(row, rowIndex, $event)"
                >
                  <div
                    class="td_text"
                    :class="{ width_100: !col.hasPicture, hover_show:col.showMode ==='hover' }"
                    :style="[{ textAlign: col.textAlign || 'center' }]"
                    v-html="_renderAttr(row, col, rowIndex)"
                    :title="
                      col.titleName
                        ? showTitle(col, row)
                        : _renderAttr(row, col, rowIndex, 'uniquetag')
                    "
                  ></div>
                  <span v-if="row.hasPicture && col.hasPicture" class="fl">
                    <img :src="require('@/assets/img/default.png')" alt class="image_icon">
                  </span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="col-scaleplate"></div>
      <div class="common_table_nodata" v-show="rowsData == null || rowsData.length == 0">
        <div class="line1">抱歉，没有找到数据</div>
        <div class="line1">修改查询条件，再查一次*_*</div>
      </div>
    </div>
    <div class="common_table_footer">
      <Page
        v-show="rowsData != null && rowsData.length > 0 && isShowPagination"
        :total="parseFloat(totalRows)"
        :page-size="pageSize"
        :current="currentPage"
        @on-change="_setCurrentPage"
        @on-page-size-change="_setPageSize"
        :page-size-opts="[10, 30, 50, 100]"
        :show-elevator="true"
        placement="top"
        show-sizer
        show-total
        transfer
      ></Page>
    </div>

    <!--设置展示隐藏列-->
    <Modal v-model="isShowSettingColumn" title="设置显示字段" width="630">
      <!-- <div class="column_content clearfix">
                    <span v-for="(item,index) in editColumnList" class="column_item" :key="index">
                        {{item.name}}
                    </span>
      </div>-->

      <draggable v-model="editColumnList" class="column_content clearfix">
        <transition-group>
          <span v-for="(item, index) in editColumnList" class="column_item" :key="index">
            <Checkbox v-model="item.showColumn">{{ item.name }}</Checkbox>
          </span>
        </transition-group>
      </draggable>
      <div slot="footer">
        <Button type="dashed" class="commonButton" @click.stop="isShowSettingColumn = false">取消</Button>
        <Button type="primary" class="commonButton" @click.stop="_editUserFieldShow()">保存</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import utils from "@/assets/js/utils.js";
import requestApi from "@/assets/js/requestApi.js";
import draggable from "vuedraggable";
import $ from "jquery";
import { ResizeSensor } from 'css-element-queries';


import Vue from "vue";
// import vuescroll from 'vuescroll';
// import 'vuescroll/dist/vuescroll.css';

// Vue.use(vuescroll);
// 解决鼠标单击和双击事件同时触发的问题
let timer = null;
export default {
  name: "Table",
  data() {
    return {
      checkedAll: false, //多选
      rowsData: [],
      //分页
      currentPage: 1,
      pageSize: 50,
      totalRows: 0,
      count: 0,
      columns: [],
      // 显示隐藏字段
      isShowSettingColumn: false,
      editColumnList: [],
      //搜索条件字段列表
      searchList: [],
      mouseDown: false,
      dragEndColumn: null,
      dragStartIndex: null,
      MaxHeight: this.propMaxHeight
    };
  },
  props: {
    //默认表格最大高度
    propMaxHeight: {
      type: Number,
      default: 600
    },
    tableID: {
      type: String,
      default: "table"
    },
    // 需要展示隐藏字段的模块名称
    moduleName: {
      type: String
    },
    rowClassName: [String, Function],
    //表头列数据
    columnList: {
      type: Array
    },
    // 传递参数
    sendData: {
      type: Object
    },
    // 请求列表数据的地址
    listUrl: {
      type: String
    },
    // 是否展示复选框
    isShowCheckbox: {
      type: Boolean,
      default: false
    },
    // 是否展示设置字段按钮
    isShowSetting: {
      type: Boolean,
      default: false
    },
    // 是否允许表头可搜索
    isShowheadSearch: {
      type: Boolean,
      default: false
    },
    // 是否展示编辑行按钮
    isShowEdit: {
      type: Boolean,
      default: false
    },
    //是否展示分页
    isShowPagination: {
      type: Boolean,
      default: true
    }
  },
  components: {
    draggable
  },

  created() {
    this.columns = this.columnList || [];

    this.pageSize = this.sendData.pageSize || this.pageSize;
    this.currentPage = this.sendData.currentPage || this.currentPage;
    // 初始化字段显示
    this._hideOrShowUserField(false);
    // 获得当前用户从后台获得的要展示列的数据
    this._getUserFieldShow();
    // 查询列表数据
    this.queryData(this.sendData);
  },
  mounted() {
    /**
     * 火狐部分版本浏览器，拖拽的时候会打开一个Tab页搜索对应内容，要禁止掉
     */
    document.body.ondrop = function (event) {
      event.preventDefault();
      event.stopPropagation();
    };

    window.addEventListener("mouseup", () => {
      this.mouseDown = false;
    });
    /**
     * 列表body的宽度需要当window的size变更的时候实时去变更一次；
     */

    new ResizeSensor(this.$refs.tableContainer, () => {
      this.$nextTick(() => {
        this.resetWidth();
      });
    });


    /**
     * 表头拖拽调整列宽
     */
    let i = -1,
      $scope = {},
      that = this,
      width = this.getTableWidth + 60,
      x = null;
    $("th").each(function () {
      $(".resize-line")
        .eq(++i)
        .bind("mousedown", { colNum: i }, function (e) {
          let $thDom = $(e.currentTarget).parent("th");
          $scope.originalPos = e.pageX;
          x = $(".common_table_container").offset().left;
          $(".col-scaleplate").css("left", e.pageX - x + "px");
          // 当前第几列 (从0开始)
          $scope.currentColNum = e.data.colNum;
          // 为body添加mousemove绑定
          $("body").bind("mousemove", function (e) {
            that.clearTxtSelect();
            $(".col-scaleplate").css("left", e.pageX - x + "px");
          });
          // 为body添加mouseup绑定
          $("body").bind("mouseup", function (e) {
            $(".col-scaleplate").css("left", "-9999px"); // 将标尺div移出视线
            $scope.targetPos = e.pageX;
            // 取消body的mousemove和mouseup绑定
            jQuery(this)
              .unbind("mousemove")
              .unbind("mouseup");

            // 计算鼠标移动的距离
            let distance = $scope.targetPos - $scope.originalPos,
              w = $thDom.width() + distance;
            if (distance !== 0) {
              that.columns[$scope.currentColNum].width =
                w < 90 ? 90 / 1000 : w / 1000;
              that.$nextTick(() => {
                that.resetWidth();
              });
            }

            that.clearTxtSelect();
          });
        });
    });
  },
  computed: {
    /**
     * 获得table的总宽度，将配置的每一列相加
     */
    getTableWidth() {
      let totalWidth = 0;
      this.columns.forEach((v, i) => {
        let width =
          v.width != undefined && v.width ? parseFloat(v.width) * 1000 : 200;
        totalWidth += width;
      });
      this.$emit("get-total-width", totalWidth);
      return totalWidth;
    },

  },
  methods: {
    /****************************************外部可以调用的函数 *************************************/

    /**
     * 查询列表数据
     */
    queryData(params, pageNo) {
      if (params !== "onChangePage") {
        this.currentPage = 1;
      }
      this.currentPage = pageNo || this.currentPage;
      let pageData = {
        page: this.currentPage,
        pageSize: this.pageSize
      };

      // 合并查询参数对象
      let queryParams = { ...this.sendData, ...pageData, ...params };
      this.$axios
        .get(this.listUrl, {
          params: queryParams
        })
        .then(
          response => {
            if (response.code == "200") {
              this.checkedAll = false; // 每次数据请求成功，重置一下全选按钮的状态
              this.totalRows = response.result.total;
              this.rowsData = response.result.list;
              // 获得分页总数，设置到父组件的调用中
              this.$emit("on-total-rows", this.totalRows);
              this.$emit("on-rows-data", response.result);
              // 重置选中的数据
              this._onSelectRows();
              // 增加复选框选中所需要的属性
              this.rowsData.forEach((v, i) => {
                v.checked = false;
              });
              // 如果页码大于总页数，则查询第一页
              if (this.currentPage >
                Math.ceil(parseFloat(this.totalRows) / this.pageSize) &&
                parseFloat(this.totalRows) > 0
              ) {
                this.currentPage = 1;
                // this.queryData();
              }
            } else {
              this.$emit("on-total-rows", 0);
            }
          },
          err => {
            this.$emit("on-total-rows", 0);
          }
        );
    },

    /****************************内部处理函数 *************************************/
    /**
     * getRowClass
     */
    _getRowClass(row, rowIndex) {
      if (typeof this.rowClassName === 'string') {
        return this.rowClassName;
      } else if (typeof this.rowClassName === 'function') {
        return this.rowClassName(row, rowIndex);
      }
    },
    /**
     * 单击表格行
     * @ date 2019-05-06
     * 触发_onRowClick事件的时候，触发复选框
     */
    _onRowClick(row, index, event) {
      clearTimeout(timer);
      if (this.isShowCheckbox) {
        row.checked = !row.checked;
      } else {
        this.rowsData.forEach((v, k) => {
          v.checked = false;
        });
        row.checked = !row.checked;
      }
      this.rowsData.reverse();
      this.rowsData.reverse();
      timer = setTimeout(() => {
        this.$emit("on-row-click", row, index, event);
        this._onSelectRows();
      }, 250);
    },
    /**
     * 双击表格行
     */
    _onRowDbclick(row, index, event) {
      clearTimeout(timer);
      this.$emit("on-row-dbclick", row, index, event);
    },
    /**
     * 获得选中行的数据
     */
    _onSelect(row) {
      //检测是否全选上
      this._checkedAllFlag();
      // 选中
      const status = row.checked;
      row.checked = status;
      this.rowsData.push();

      // 单击复选框取消，并重新调用选中数据的方法
      if (!row.checked) {
        this._onSelectCancel(row);
      } else {
        // 点击复选框单选的数据
        this.$emit("on-select", row);
      }
      // 调用获得选中数据的集合
      this._onSelectRows();
    },
    /**
     * 获得选中的数据集合
     */
    _onSelectRows() {
      let selectRows = [];
      if (this.rowsData == null || this.rowsData.length == 0) return;
      this.rowsData.forEach((v, i) => {
        if (v.checked) {
          selectRows.push(v);
        }
      });
      // 获得选中的数据集合
      this.$emit("on-select-rows", selectRows);
    },
    /**
     * 单击复选框取消
     */
    _onSelectCancel(row) {
      this.$emit("on-select-cancel", row);
    },
    /**
     * 单击表头
     */
    _onTheadClick(col, e, index) {
      this.columns.forEach((v, k) => {
        return (v.isheadSearchFlag = false);
      });
      this.$emit("on-head-click", col, index);
    },
    /**
     * 表格左右滚动
     */
    _ontableScroll(e) {
      this.$emit("on-table-scroll", e.target.scrollLeft);
    },
    /**
     * 全选和反选
     */
    _checkedAll() {
      let selectRows = [];
      this.rowsData.forEach((v, i) => {
        v.checked = this.checkedAll;
        if (v.checked) {
          selectRows.push(v);
        }
      });
      // 点击全选
      this.$emit("on-select-all", selectRows);
      // 获得选中的数据集合
      this.$emit("on-select-rows", selectRows);
    },
    /**
     * 检测是否全选上
     */
    _checkedAllFlag() {
      let count = 0;
      this.rowsData.forEach((v, i) => {
        if (v.checked) count++;
      });
      this.checkedAll = count == this.rowsData.length ? true : false;
    },
    /**
     * 点击编辑
     */
    _onRowEdit(row, index, event) {
      this.$emit("on-row-edit", row, index, event);
    },
    /**
     * 渲染字段
     */
    _renderAttr(row, col, index, showType) {
      let value = "";
      let attrGroupArray = [];
      // 如果有多个attr属性
      if (col.attr instanceof Array && col.attr.length > 0) {
        // 如果是字段组合
        if (col.attrGroup) {
          col.attr.forEach((v, i) => {
            attrGroupArray.push(this._formatValue(row[v.attr], v, row, index));
          });
          let groupValue = attrGroupArray.join(col.split || "/");
          if (col.initRender && col.initRender instanceof Function) {
            if (col.initRender(row, index)) {
              value = groupValue;
              if (col.initEvent && col.initEvent instanceof Function) {
                value = "<a>" + groupValue + "</a>";
              } else {
                value = groupValue;
              }
            }
          } else {
            if (col.initEvent && col.initEvent instanceof Function) {
              value = "<a>" + groupValue + "</a>";
            } else {
              value = groupValue;
            }
          }
        }
        // 如果是普通的多个字段
        else {
          col.attr.forEach((v, i) => {
            // 如果多个attr下面，包含有initRender，则判断返回的true和false来决定是否显示
            if (v.initRender && v.initRender instanceof Function) {
              if (v.initRender(row, index)) {
                if (v.initEvent && v.initEvent instanceof Function) {
                  if (v.initFormat(row, index)) {
                    value +=
                      "<a style='padding:0px 8px;' href='javascript:;'>" +
                      this._formatValue(v.name, v, row, index) +
                      "</a>";
                  }
                } else {
                  value = this._formatValue(v.name, v, row, index);
                }
              }
            }
            //多个Attr下面也包含了initEvent，则渲染为A链接样式
            else {
              if (v.initEvent && v.initEvent instanceof Function) {
                value +=
                  "<a style='padding:0px 8px;' href='javascript:;'>" +
                  this._formatValue(v.name, v, row, index) +
                  "</a>";
              } else {
                value = this._formatValue(v.name, v, row, index);
              }
            }
          });
        }
      }
      //如果单个attr属性
      else {
        // 如果包含initRender，则判断initRender的返回值来决定是否显示
        if (col.initRender && col.initRender instanceof Function) {
          if (col.initRender(row, index)) {
            if (col.initEvent && col.initEvent instanceof Function) {

              value =
                "<a>" +
                this._formatValue(row[col.attr], col, row, index) +
                "</a>";
            } else {
              value = this._formatValue(row[col.attr], col, row, index);
            }
          }
        }
        // 如果不包含initRender，默认为显示
        else {
          if (col.initEvent && col.initEvent instanceof Function) {

            value =
              "<a>" + this._formatValue(row[col.attr], col, row, index) ||
              "" + "</a>";
          } else {
            value = this._formatValue(row[col.attr], col, row, index);
          }
        }
      }

      // 返回最终渲染的数据
      if (showType === "uniquetag") {
        return utils.parseTags(value);
      } else {
        return value;
      }
      // return value;
    },
    /**
     * 渲染字段包含的回调函数
     */
    _renderEvent(row, col, index, event) {
      let text = event.target.innerText;
      let outerHTML = event.target.outerHTML;
      // 如果包含多个Attr
      if (col.attr && col.attr instanceof Array) {
        // 如果是attr组合的字段
        if (col.attrGroup) {
          // 组合的字段带点击事件
          if (col.initEvent) {

            if (event.target.nodeName == "A" || event.target.nodeName == "I") {
              col.initEvent(row, index);
            }
          } else {
            this._onRowClick(row, index, event);
          }
        }
        // 如果是attr普通多个操作字段
        else {
          col.attr.forEach((v, i) => {
            if (v.initEvent) {

              if (event.target.nodeName == "A") {
                // 判断是否格式化了字段;1.格式化了,并且是text;2.格式化了，是icon;
                if (v.initFormat) {
                  if (v.initFormat(row, index) == text) {
                    v.initEvent(row, index, event);
                  }
                } else {
                  if (v.name == text) {
                    v.initEvent(row, index);
                  }
                }
              } else if (event.target.nodeName == "I") {
                // console.log('outerHTML',outerHTML);
                // console.log('v.initFormat(row, index)',v.initFormat(row, index));
                // debugger
                if (v.initFormat(row, index) == outerHTML) {
                  // console.log('v', v.initEvent);

                  v.initEvent(row, index, event);
                }
              }
            } else {
              this._onRowClick(row, index, event);
            }
          });
        }
      }
      // 如果是单个attr
      else {
        // 单个attr有点击事件

        if (col.initEvent) {
          if (event.target.nodeName == "A" || event.target.nodeName == "I") {
            col.initEvent(row, index);
          }
        }
        // 单个attr没有点击事件
        else {
          this._onRowClick(row, index, event);
        }
      }
    },
    /**
     * 格式化字符串，比如为空返回--，或者格式化日期等
     *
     * @param value:要格式化的字符串，obj：格式化的数据所在的对象 row:行数据 index:数据行index
     */
    _formatValue(value, obj, row, index) {
      // 如果包含格式化的回调函数
      if (obj && obj.initFormat && obj.initFormat instanceof Function) {
        value = obj.initFormat(row, index);

      }
      // 否则返回原有字符串
      else {
        if (
          value == undefined ||
          value == null ||
          value == "" ||
          value == "undefined"
        ) {
          return "--";
        }
      }

      return value;
    },
    /**
     *Page 组件设置当前页码
     */
    _setCurrentPage: function (currentPage) {

      this.currentPage = currentPage;
      this.queryData("onChangePage");
    },
    /**
     * Page 组件设置每页显示条数
     */
    _setPageSize: function (pageSize) {
      this.pageSize = pageSize;
      this.queryData();
    },

    /**
     * 显示或者隐藏字段
     */
    _hideOrShowUserField(flag) {
      this.columns.forEach((v, i) => {
        v.showColumn = flag;
      });
      this.editColumnList = JSON.parse(JSON.stringify(this.columns));
      this.editColumnList.push();
    },
    /**
     * 获得当前用户需要展示的字段，如果为空，则展示所有，否则按照查询的字段来展示
     */
    _getUserFieldShow() {
      // 1.如果有传递查询的模块，则根据查询的结果去匹配显示的列
      if (!utils.isNull(this.moduleName)) {
        this.$axios
          .post(requestApi.selectUserFieldShow, {
            module: this.moduleName
          })
          .then(response => {
            let repCode = response.data.repCode;
            let data = response.data.resModel;
            if (repCode == "S0000") {
              // 列最少展示2个，为空时候是展示所有
              if (!utils.isNull(data)) {
                this.columns.forEach((v, i) => {
                  for (let vv of data) {
                    if (
                      v.attr == vv.field ||
                      (v.attrGroup != undefined &&
                        v.attrGroup.includes(vv.field))
                    ) {
                      v.showColumn = true;
                      return;
                    }
                  }
                });
                this.columns.push();
                this.editColumnList = this.columns;
                this.editColumnList.push();
              }
              // 否则，展示全部
              else {
                this._hideOrShowUserField(true);
              }
            }
          });
      } else {
        this._hideOrShowUserField(true);
      }
    },
    /**
     * 保存当前用户想展示的字段
     */
    _editUserFieldShow() {
      let count = 0;
      let fields = [];
      let that = this;
      this.editColumnList.forEach((v, i) => {
        if (v.showColumn) {
          let field = "";
          if (!utils.isNull(v.attrGroup)) {
            field = v.attrGroup;
          } else {
            field = v.attr;
          }
          fields.push({
            field: field,
            orderNum: i
          });
          count++;
        }
      });
      this.columns = this.editColumnList;

      this.$emit("on-change-column", this.columns);
      if (count > 1) {
        // 保存用户的列
        let fieldConfStr = {
          module: this.moduleName,
          conf: fields
        };
        // 关闭弹出框
        that.isShowSettingColumn = false;
      } else {
        this.$Message.warning({
          content: "抱歉，最少要展示2列数据！",
          duration: 1
        });
      }
    },

    showTitle(obj, item) {
      return utils.parseTags(item[obj.attr]);
    },
    clearTxtSelect() {
      "getSelection" in window
        ? window.getSelection().removeAllRanges()
        : document.selection.empty();
    },
    clearCursorIcon(event) {
      event.preventDefault();
    },
    //拖动开始
    dragstartEvent(e, index) {
      this.dragStartIndex = index;
      e.dataTransfer.setData("text/plain", "data");
    },
    //拖动过程
    dragenterEvent(e, col) {
      this.dragEndColumn = col;
    },
    //拖动结束
    dragendEvent(e, col) {
      let start = null;
      let end = null;
      let m = null;
      if (col.attr !== this.dragEndColumn.attr) {
        this.columns.forEach((item, index) => {
          if (item.attr === col.attr) {
            start = index;
            // this.columns.splice(index,1);
          }
          if (item.attr === this.dragEndColumn.attr) {
            end = index;
          }
        });
        m = this.columns[end];
        this.columns[end] = this.columns[start];
        this.columns[start] = m;
        this.columns.push();
      }
    },
    resetWidth() {
      let width = $(this.$refs.tableContainer).find('.table-header').css("width");
      $(this.$refs.tableContainer).find(".table-body").width(width);
      $(this.$refs.tableContainer).find(".comon_table_body").width(width);
    },
    //判断是否含有滚动条
    hasScrolled(el, direction = "vertical") {
      try {
        if (direction === "vertical") {
          return el.scrollHeight > el.clientHeight;
        } else if (direction === "horizontal") {
          return el.scrollWidth > el.clientWidth;
        }
      } catch (error) {
        console.log(error);
      }

    }
  },
  watch: {
    rowsData(val) {
      if (val.length !== 0) {
        this.$nextTick(() => {
          this.resetWidth();
        });
      }
    },
    columnList(val) {
      this.columns = val;
      this._getUserFieldShow();
    },

    /**
     * 动态计算table的高度
     * scrollHeight 当前滚动条的高度，chrome的滚动条经过改造，为8px，传统浏览器为17px
     * hasScroll 是否有滚动条
     *
     */
    propMaxHeight() {
      this.$nextTick(() => {
        let scrollHeight = 0;
        scrollHeight = utils.myBrowser() === "Chrome" ? 8 : 17;
        const d = document.querySelector(".common_table_div");
        const hasScroll = this.hasScrolled(d, "horizontal");
        const height = hasScroll
          ? this.propMaxHeight - scrollHeight
          : this.propMaxHeight;
        return (this.MaxHeight = height); //table最大高度
      });
    }
  }
};
</script>
