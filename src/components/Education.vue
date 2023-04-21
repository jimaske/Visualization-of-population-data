<template>
  <div class="com-container">
    <div class="com-chart" ref="rank_ref"></div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { reqgetEducation } from "../api/index";
export default {
  data() {
    return {
      chartInstance: null,
      allData: null,
      startValue: 0, // 区域缩放的起点值
      endValue: 9, // 区域缩放的终点值
    };
  },
  async mounted() {
    this.initChart();
    await this.getData();
    window.addEventListener("resize", this.screenAdapter);
    this.screenAdapter();
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.screenAdapter);
  },
  methods: {
    initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.rank_ref, this.theme);
      const initOption = {
        title: {
          text: "▎ 教育占比",
          left: 20,
          top: 20,
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        grid: {
          left: "5%",
          right: "8%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: {
          triggerEvent: true,
          axisTick: {
            show: false,
          },
          axisLine: {
            show: false,
          },
          axisLabel: {
            show: true,
            rotate: 0,
            interval: 0,
            textStyle: {
              padding: [14, 0, 0, 0],
              fontSize: 14,
            },
          },
          data: [],
        },
        yAxis: {
          name: "单位：人/十万人",
          triggerEvent: true,
          nameTextStyle: {
            fontSize: 16,
            padding: [0, 0, 10, -80],
          },
          splitLine: {
            show: true,
          },
          axisTick: {
            show: false,
          },
          axisLine: {
            show: true,
          },
          axisLabel: {
            show: true,
            textStyle: {
              color: "rgb(148,159,167)",
              fontSize: 16,
            },
          },
        },

        series: [
          {
            name: "数量",
            barMinHeight: 10,
            type: "pictorialBar",
            barCategoryGap: "60%",
            // symbol: 'path://M0,10 L10,10 L5,0 L0,10 z',
            symbol:
              "path://M0,10 L10,10 C5.5,10 5.5,5 5,0 C4.5,5 4.5,10 0,10 z",
            itemStyle: {
              normal: {
                //barBorderRadius: 5,
                //渐变色
                color: this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: "#01EAED",
                  },
                  {
                    offset: 0.5,
                    color: "#02C4DD",
                  },
                  {
                    offset: 1,
                    color: "#029ED9",
                  },
                ]),
              },
            },
            label: {
              normal: {
                show: true,
                position: "top",
                textStyle: {
                  fontSize: 16,
                },
              },
            },
            // data: data,
            z: 10,
          },
          {
            name: "hill",
            type: "bar",
            barWidth: "20%",
            symbol:
              "path://M0,10 L10,10 C5.5,10 5.5,5 5,0 C4.5,5 4.5,10 0,10 z",
            itemStyle: {
              normal: {
                color: "rgba(11,47,68,.8)",
              },
            },
            // data: maxArr,
            z: 9,
          },
        ],
      };
      this.chartInstance.setOption(initOption);
      //   this.chartInstance.on("mouseover", () => {
      //     clearInterval(this.timerId);
      //   });
      //   this.chartInstance.on("mouseout", () => {
      //     this.startInterval();
      //   });
    },
    async getData() {
      this.allData = await reqgetEducation({pid:this.pid});
      this.updataChart();
      return;
    },
    updataChart() {
      let xAxisData = this.allData.xAxisData;
      let data = this.allData.data;
      let maxArr = this.allData.maxArr;
      const dataOption = {
        tooltip: {
          formatter: "{b} <br> 总人数 ： {c}万人",
        },
        xAxis: {
          data: xAxisData,
        },
        series: [
          {
            data: data,
          },
          {
            data: maxArr,
          },
        ],
      };
      this.chartInstance.setOption(dataOption);
    },
    screenAdapter() {
      const titleFontSize = (this.$refs.rank_ref.offsetWidth / 100) * 3.6;

      const adapterOption = {
        grid: {
          top: titleFontSize+80,
        },
        title: {
          textStyle: {
            fontSize: titleFontSize,
          },
        },
        series: [
          {
            barWidth: titleFontSize,
            itemStyle: {
              barBorderRadius: [titleFontSize / 2, titleFontSize / 2, 0, 0],
            },
          },
        ],
      };
      this.chartInstance.setOption(adapterOption);
      this.chartInstance.resize();
    },
  },
  computed: {
    ...mapState(["theme", "pid"]),
  },
  watch: {
    theme() {
      this.chartInstance.dispose();
      this.initChart();
      this.screenAdapter();
      this.updataChart();
    },
    pid() {
      this.getData();
    },
  },
};
</script>

<style></style>
