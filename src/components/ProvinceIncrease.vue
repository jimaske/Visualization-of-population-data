<template>
  <div class="com-container">
    <div class="com-chart" ref="pvi_ref"></div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { reqgetPeopleIncrease } from "../api/index";
export default {
  data() {
    return {
      chartInstance: null,
      allData: null, //服务器返回的数据
      currentPage: 1, //当前显示的页数
      totalPage: 0, //一共有多少页
      timeId: null,
    };
  },
  created() {
    //在组件创建完成之后，进行回调函数的注册
    // this.$socket.registerCallBack("sellerData", this.getData);
  },
  async mounted() {
    this.initChart();
    // this.$socket.send({
    //   action: "getData",
    //   socketType: "sellerData",
    //   chartName: "seller",
    //   value: "",
    // });
    await this.getData();
    // window.addEventListener("resize", this.screenAdapter);
    // 在页面加载完成的时候,主动进行屏幕的适配
    this.screenAdapter();
  },
  beforeDestroy() {
    // clearInterval(this.timeId);
    window.removeEventListener("resize", this.screenAdapter);
    // this.$socket.unRegisterCallBack("sellerData");
  },
  methods: {
    initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.pvi_ref, this.theme);

      const initOption = {
        title: [
          {
            show: true,
            text: "▎ 人口数量前七",
            left: 20,
            top: 20,
          },
        ],

        grid: {
          left: "4%",
          right: "5%",
          bottom: "2%",
          top: "7%",
          containLabel: true,
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
          formatter: "{b} <br> 人口数量: {c}万人",
        },
        xAxis: {
          name:"万人",
          show: true,
          type: "value",
          splitNumber: 8,
          nameTextStyle: {
            color: "#333",
          },
          axisLine: {
            lineStyle: {
              color: "#333",
            },
          },
          axisLabel: {
            formatter: function (value, index) {
              return value+"万" ;
            },
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: "#ccc",
            },
          },
        },
        yAxis: [
          {
            type: "category",
            axisLabel: {
              show: true,
              interval: 0,
              rotate: 0,
              margin: 10,
              inside: false,
              textStyle: {
                //color: '#fff',
                fontWeight: "50",
              },
            },
            splitLine: {
              show: false,
            },
            axisTick: {
              show: false,
            },
            axisLine: {
              show: false,
            },
            // data: getName,
          },
        ],
        series: [
          {
            type: "bar",
            label: {
              normal: {
                show: true,
                // formatter: '{c}',
                formatter: function (v) {
                  var val = v.data;
                  if (val === 0) {
                    return "";
                  }
                  return val;
                },
                color: "#fff",
              },
            },
            barWidth: 10,
            barBorderRadius: 30,
          },
        ],
      };
      this.chartInstance.setOption(initOption);
    },
    async getData() {
      this.allData = await reqgetPeopleIncrease({ pid: this.pid });
      this.updataChart();
      return;
    },
    updataChart() {
      const yAxisData = this.allData.yAxisData;
      const data = this.allData.data;
      console.log(yAxisData,data);
      const dataOption = {
        yAxis: [
          {
            data: yAxisData,
          },
        ],
        series: [
          {
            data: data,
          },
        ],
      };

      this.chartInstance.setOption(dataOption);
      console.log(this.chartInstance.getOption());
    },

    //当浏览器大小发生变化
    screenAdapter() {
      const persent =
        this.$refs.pvi_ref.offsetWidth * 0.5 +
        this.$refs.pvi_ref.offsetHeight * 0.5;
      const titleFontSize = (persent / 100) * 3.6;
      // 和分辨率大小相关的配置项
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: titleFontSize,
          },
        },
        tooltip: {
          axisPointer: {
            lineStyle: {
              width: titleFontSize / 2,
            },
          },
        },
        yAxis: [
          {
            axisLabel: {
              textStyle: {
                fontSize: titleFontSize / 1.4,
              },
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
