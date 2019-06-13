<template>
  <div ref="dom" class="charts chart-bar"></div>
</template>

<script>
import echarts from "echarts";
import tdTheme from "./theme.json";
import { on, off } from "@/assets/js/utils";
echarts.registerTheme("tdTheme", tdTheme);
export default {
  name: "ChartBar",
  props: {
    value: Array,
    name: Object,
    color: Array,
    hoverColor: Array
  },
  data() {
    return {
      dom: null
    };
  },
  methods: {
    resize() {
      this.dom.resize();
    },
    initData() {
      this.$nextTick(() => {
        let legend = Object.values(this.name);
        let name = this.name;
        let option = {
          grid: {
            left: "5%",
            bottom: "20%"
          },
          xAxis: {
            type: "category",
            show: true,
            axisLabel: {
              interval: 0,
              color: "#000",
              formatter: function(value, index) {
                let str="";
                if(value.length>10){
                  str = value.substr(0,10)+"...";
                }else{
                  str = value;
                }
                return str;
              }
            }
          },
          yAxis: {
            type: "value"
          },
          tooltip: {
            trigger: "axis",
            axisPointer: {
              type: "none",
              textStyle: {
                color: "#fff"
              }
            }
          },
          color: this.color,
          legend: {
            orient: "horizontal",
            left: "center",
            data: legend
          },
          dataset: {
            dimensions: ["unitName"].concat(Object.values(name)),
            source: this.value
          },
          series: [
            {
              type: "bar",
              stack: "人数",
              barMaxWidth: "50",
              label: {
                show: true,
                position: "insideTop",
                formatter: function(p) {
                  return p.value > 0 ? p.value : "";
                }
              },
              emphasis: {
                itemStyle: {
                  color: this.hoverColor[0]
                }
              }
            },
            {
              type: "bar",
              stack: "人数",
              barMaxWidth: "50",
              label: {
                show: true,
                position: "insideTop",
                formatter: function(p) {
                  return p.value > 0 ? p.value : "";
                }
              },
              emphasis: {
                itemStyle: {
                  color: this.hoverColor[1]
                }
              }
            }
          ]
        };
        if (this.value.length > 8) {
          option.xAxis.axisLabel.rotate = "25";
        }
        this.dom = echarts.init(this.$refs.dom, "tdTheme");
        this.dom.setOption(option);
        on(window, "resize", this.resize);
      });
    }
  },
  mounted() {
    this.initData();
  },
  beforeDestroy() {
    off(window, "resize", this.resize);
  }
};
</script>
