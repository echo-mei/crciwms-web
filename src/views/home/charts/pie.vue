<template>
  <div ref="dom" class="charts chart-pie"></div>
</template>

<script>
import echarts from "echarts";
import tdTheme from "./theme.json";
import { on, off } from "@/assets/js/utils";
import $ from "jquery";
echarts.registerTheme("tdTheme", tdTheme);
export default {
  name: "ChartPie",
  props: {
    value: Array,
    subtext: String,
    color: Array
  },
  data() {
    return {
      total: 0,
      option: {},
      dom: null
    };
  },
  methods: {
    setEchartOption() {
      if ($(window).width() < 1300) {
        this.option.legend.left = "40%";
        this.option.title.left = "19%";
        this.option.series[0].center[0]="20%";
      } else if ($(window).width() < 1500) {
        this.option.legend.left = "45%";
      }
      this.dom.setOption(this.option);
    },
    resize() {
      this.setEchartOption();
      this.dom.resize();
    },
    initData() {
      this.$nextTick(() => {
        this.value.forEach(element => {
          this.total += element.value;
        });

        let legend = this.value.map(_ => {
          return { name: _.name, icon: "circle" };
        });
        let objData = {};
        this.value.forEach(item => {
          let percent;
          if (item.value) {
            percent = Number((item.value / this.total) * 100).toFixed(2);
          } else {
            percent = 0;
          }
          objData[item.name] = { value: item.value, percent: percent + "%" };
        });

        this.option = {
          title: {
            text: parseInt(this.total),
            left: "27%",
            y: "center",
            textAlign:'center',
            textStyle: {
              fontSize: 24,
              fontWeight: "bolder",
              color: "#000"
            }
          },
          color: this.color,
          tooltip: {
            trigger: "item",
            formatter: "{b} : {c} ({d}%)"
          },
          legend: {
            orient: "vertical",
            y: "center",
            left: "55%",
            formatter: function(name) {
              return (
                "{title|" +
                name +
                "}  {value|" +
                objData[name].value +
                "}{unit|人}{value| ,} {value|" +
                objData[name].percent +
                "}"
              );
            },
            textStyle: {
              rich: {
                title: {
                  width: 40,
                  fontSize: 16,
                  lineHeight: 20,
                  color: "#666"
                },
                value: {
                  fontSize: 18,
                  fontWeight: 700,
                  lineHeight: 20,
                  color: "#000"
                },
                unit: {
                  fontSize: 12,
                  lineHeight: 20,
                  color: "#666"
                }
              }
            },
            data: legend
          },
          series: [
            {
              type: "pie",
              radius: ["50%", "60%"],
              center: ["28%", "50%"],
              label: {
                normal: {
                  show: false
                }
              },
              data: this.value,
              itemStyle: {
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: "rgba(0, 0, 0, 0.5)"
                }
              }
            }
          ]
        };
        if (this.value.length > 2) {
          this.option.legend.textStyle.rich.title.width = 90;
        }
        this.dom = echarts.init(this.$refs.dom, "tdTheme");
        this.setEchartOption();
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
