<template>
  <div class="com-container">
    <div class="title" :style="comStyle">
    </div>
    <div class="com-chart" ref="trend_ref"></div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { getThemeValue } from "@/utils/theme_utils";
import { reqgetPeople } from "../api/index";
export default {
  data() {
    return {
      chartInstance: null,
      allData: null,
      titleFontSize: 0,
    };
  },
  
  async mounted() {
    this.initChart();
    await this.getData()
    
    window.addEventListener("resize", this.screenAdapter);
    this.screenAdapter();
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.screenAdapter);
  },
  computed: {
    comStyle() {
      return {
        fontSize: this.titleFontSize + "px",
        color: getThemeValue(this.theme).titleColor,
      };
    },
    marginStyle() {
      return {
        marginLeft: this.titleFontSize + "px",
      };
    },
    ...mapState(["theme","pid","provinceName"]),
  },
  methods: {
    initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.trend_ref, this.theme);
      const initOption = {
        grid: {
          left: "3%",
          top: "35%",
          right: "4%",
          bottom: "1%",
          containLabel: true,
        },
        title: {
          show: true,
          text: "▎ 全国人口数量及增长率",
          top:20,
          left:20

        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow", // 默认为直线，可选为：'line' | 'shadow'
          },
        },
        toolbox: {
          show: false,
        },
        legend: {
          left: 20,
          top: "15%",
          //   icon: "circle",
          itemWidth: 11,
          itemHeight: 11,
          textStyle: {
            // color: "#ffffff",
            fontSize: 14,
          },
        },
        xAxis: [
          {
            type: "category",
            boundaryGap: true,
            show: true,
            axisTick: {
              show: false,
            },
            axisLabel: {
              fontSize: 10,
              color: "#d0d0d0",
              margin: 8,
              interval: 0,
            },
            axisLine: {
              lineStyle: {
                type: "solid",
                color: "#4e608b", //左边线的颜色
                width: "1", //坐标线的宽度
              },
            },
          },
        ],
        yAxis: [
          {
            type: "value",
            scale: true,
            name: "单位：万人",
            axisLine: {
              show: false,
            },
            splitNumber: 4,
            axisTick: {
              show: false,
            },
            splitLine: {
              lineStyle: {
                // 使用深浅的间隔色
                color: "#4e608b",
              },
            },
            axisLabel: {
              fontSize: 10,
              color: "#d0d0d0",
              margin: 12,
            },
            
            boundaryGap: [0.2, 0.2],
          },
          {
            type: "value",
            scale: true,
            axisLine: {
              show: false,
            },
            splitNumber: 3,
            axisTick: {
              show: false,
            },
            axisLabel: {
              fontSize: 13,
              color: "#d0d0d0",
              margin: 12,
            },
            splitLine: {
              lineStyle: {
                // 使用深浅的间隔色
                color: "#4e608b",
              },
            },
            name: "单位：%",
            boundaryGap: [0.2, 0.2],
          },
        ],
        series: [
          {
            name: "总人口",
            type: "bar",
            label: {
              show: true,
              position: "top",
              textStyle: {
                color: "#1dacfe",
              },
            },
            itemStyle: {
              normal: {
                color: new this.$echarts.graphic.LinearGradient(
                  0,
                  1,
                  0,
                  0,
                  [
                    {
                      offset: 0,
                      color: "#4889fb", // 0% 处的颜色
                    },
                    {
                      offset: 1,
                      color: "#15b3ff", // 100% 处的颜色
                    },
                  ],
                  false
                ),
              },
            },
            barWidth: "40%",
            yAxisIndex: 0,
            
          },
          {
            name: "增长率",
            type: "line",
            yAxisIndex: 1,
            color: "#ffd300",
            label: {
              show: true,
              position: "top",
              textStyle: {
                color: "#ffd300",
              },
            },
            lineStyle: {
              color: "#ffd300",
            },
            smooth: false,
          },
        ],
      };
      this.chartInstance.setOption(initOption);
    },
    async getData() {
      this.allData=await reqgetPeople({pid:this.pid})
      this.updataChart();
      return;
    },
    updataChart() {
      //处理数据
      const xAxisData = this.allData.xAxisData;
      const seriesData = this.allData.seriesData;
      
      const seriesArr = seriesData.map(item => {
        return {
          data: item.data,
        };
      });
      const lengendArr = seriesData.map((item) => {
        return item.name;
      });
      let title=this.provinceName?`▎ ${this.provinceName}人口数量及增长率`:`▎全国人口数量及增长率`
      
      const dataOption = {
        title: {
          text: title
        },
        xAxis: {
          data: xAxisData,
        },
        legend: {
          data: lengendArr,
        },
        series: seriesArr,
      };
      this.chartInstance.setOption(dataOption);
    },
    screenAdapter() {
      this.titleFontSize = (this.$refs.trend_ref.offsetWidth / 100) * 3.6;
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: this.titleFontSize,
          },
        },
        legend: {
          itemWidth: this.titleFontSize,
          itemHeight: this.titleFontSize,
          itemGap: this.titleFontSize,
          textStyle: {
            fontSize: this.titleFontSize / 1.5,
            lineHeight: this.titleFontSize,
          },
        },
      };
      this.chartInstance.setOption(adapterOption);
      this.chartInstance.resize();
    },
    handleSelect(currentType) {
      this.choiceType = currentType;
      this.updataChart();
      this.showChoice = false;
    },
  },
  watch: {
    theme() {
      this.chartInstance.dispose();
      this.initChart();
      this.screenAdapter();
      this.updataChart();
    },
    pid(){
      this.getData()
    }
  },
};
</script>

<style scoped>
.title {
  position: absolute;
  left: 20px;
  top: 20px;
  z-index: 10;
  color: white;
  cursor: default;

  
}
.select-con {
    background-color: rgba(0, 0, 0, 0.3);
    padding-bottom: 10px;
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
    
  }
  .select-item {
      padding: 8px 0;
    }
    .active {
      background-color: rgba(255, 255, 255, 0.3);
    }
.title-icon {
  margin-left: 10px;
  cursor: pointer;
}
</style>
