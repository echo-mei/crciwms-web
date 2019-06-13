<style lang="scss" scoped>
.wage-pdf-list {
  height: 50vh;
  overflow: auto;
  .ivu-row {
    height: 100%;
    .pdf-preview {
      height: 100%;
    }
  }
}
</style>
<style>
.wage-pdf-list .ivu-table-row-highlight td {
  background-color: #b3e0f5;
}
</style>

<template>
  <div class="wage-pdf-list">
    <Row v-if="PDFList.length > 0">
      <Col span="14">
        <template>
          <Table highlight-row border :columns="tableTitle" :data="PDFList">
            <template slot-scope="{ row }" slot="name">
              <strong>{{ row.detailName }}</strong>
            </template>
            <template slot-scope="{ row, index }" slot="action">
              <Button size="small" style="margin-right: 5px" @click="PDFPreview(row)">预览</Button>
              <Button
                type="primary"
                size="small"
                style="margin-right: 5px"
                @click="downLoad(row)"
              >下载</Button>
              <Button
                type="error"
                size="small"
                @click="remove(row)"
                v-if="sentData.planStatus === '1'"
              >删除</Button>
            </template>
          </Table>
        </template>
      </Col>
      <Col span="10" class="pdf-preview">
        <iframe ref="iframe" height="99%" width="100%"></iframe>
      </Col>
    </Row>

    <Row v-else>
      <Col span="24">
        <template>
          <Table border :columns="tableTitle" :data="PDFList">
            <template slot-scope="{ row }" slot="name">
              <strong>{{ row.detailName }}</strong>
            </template>
            <template slot-scope="{ row, index }" slot="action">
              <Button
                type="primary"
                size="small"
                style="margin-right: 5px"
                @click="PDFPreview(row)"
              >预览</Button>
              <Button
                type="primary"
                size="small"
                style="margin-right: 5px"
                @click="downLoad(row)"
              >下载</Button>
              <Button
                type="error"
                size="small"
                @click="remove(row)"
                v-if="sentData.planStatus === '1'"
              >删除</Button>
            </template>
          </Table>
        </template>
      </Col>
    </Row>
  </div>
</template>

<script>
import utils from "@/assets/js/utils.js";
import requestApi from "@/assets/js/requestApi.js";
import { listWageConfirmPDF, wagePlanDetail, downloadWageConfirmPDF } from "@/api/wage.js";
export default {
  data() {
    return {
      tableTitle: [
        {
          title: '文件名称',
          slot: 'name'
        },
        {
          title: '操作',
          slot: 'action',
          width: 200,
          align: 'center'
        }
      ],
      PDFList: []
    };
  },

  components: {},

  computed: {

  },

  created() {
    this.listWageConfirmPDF();
  },

  mounted() { },
  props: ["sentData"],
  methods: {
    listWageConfirmPDF() {
      const id = this.sentData.planOid;
      listWageConfirmPDF(id).then(res => {
        if (res &&  res.result) {
          this.PDFList = res.result;
          this.PDFList[0]._highlight = true
          this.PDFPreview(this.PDFList[0])
        } else {
          this.PDFList = [];
        }
      })
    },
    downLoad(row) {
      const params = `detailOid=${row.detailOid}`;
      const url = `${requestApi.downloadWageConfirmPDF}`;
      this.downLoadFile(url, params);
    },
    downLoadFile(url, data) {
      this.$Message.info('正在下载，请稍候..')
      const token = utils.getItem("TOKEN_KEY");
      url = `${window.location.origin}${url}?Authorization=${token}&${data}`;

      utils.downFile(url);
    },
    remove(row) {
      this.$Modal.confirm({
        title: "确认删除吗？",
        cancelText: "取消",
        onOk: () => {
          wagePlanDetail(row.detailOid).then(res => {
            this.listWageConfirmPDF();
            this.$Message.success(res.result);
          }),
            err => {
              this.$Message.error(err);
            };
        }
      });

    },
    PDFPreview(row) {
      downloadWageConfirmPDF(row.detailOid).then(res => {
        // 请求文件异常的时候返回的是json格式,正常是blob格式：Blob {size: 186651, type: "text/xml",__proto__: Blob}
        if (res.type == "application/pdf") {
          let binaryData = [];
          binaryData.push(res);
          let url = window.URL.createObjectURL(
            new Blob(binaryData, { type: "application/zip" })
          );
          const pdfUrl = `/pdfjs/web/viewer.html?file=${url}`
          this.set(pdfUrl);
        }
      });
    },
    //解决 vue-router 内嵌 iframe，导致 go(n) 异常问题
    set(src) {
      this.$refs.iframe.contentWindow.location.replace(src);
    }


  },


};
</script>
