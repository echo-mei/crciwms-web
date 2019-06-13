<style lang="scss" scoped>
.wage-pdf-list {
  height: 50vh;
  overflow: auto;

}
</style>
<style>
.wage-pdf-list .ivu-table-row-highlight td {
  background-color: #b3e0f5;
}

</style>

<template>
  <div class="wage-pdf-list">
        <iframe ref="iframe" height="99%" width="100%"></iframe>
    </Row>
  </div>
</template>

<script>
import utils from "@/assets/js/utils.js";
import requestApi from "@/assets/js/requestApi.js";
import { listWageConfirmPDF, wagePlanDetail, downloadBankBill } from "@/api/wage.js";

export default {
  data() {
    return {
      PDFList: []
    };
  },

  components: {},

  computed: {

  },

  created() {
    this.PDFPreview(this.sentData);
  },

  mounted() { },
  props: ["sentData"],
  methods: {
    listWageConfirmPDF() {
      const id = this.sentData.planOid;


      listWageConfirmPDF(id).then(res => {
        if (res) {
          this.PDFList = res.result;
          this.PDFList[0]._highlight = true
          this.PDFPreview(this.PDFList[0])
        }
      })
    },
    // 下载银行回执
    downloadBankBill(row, index) {
      const data =  this.sentData.batchOid;
      downloadBankBill(data).then(res => {
        if (res.code !== "1084" && res.code !== "1112") {
          const params = `batchOid=${data}`;
          const url = `${requestApi.downloadBankBill}`;
          this.downLoadFile(url, params);
        } else {
          this.$Message.error(res.message);
        }
      })
    },
    downLoad(row) {
      const params = `detailOid=${row.detailOid}`;
      const url = `${requestApi.downloadWageConfirmPDF}`;
      this.downLoadFile(url, params);
    },
    downLoadFile(url, data) {
      this.$Message.info('正在下载，请稍候...')
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
      downloadBankBill(row.batchOid).then(res => {
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
