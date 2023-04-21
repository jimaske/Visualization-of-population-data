<template>
  <div class="com-container">
    <div class="com-chart" ref="seller_ref"></div>
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
  mounted() {
    this.initChart();
    // this.$socket.send({
    //   action: "getData",
    //   socketType: "sellerData",
    //   chartName: "seller",
    //   value: "",
    // });
    this.getData();
    window.addEventListener("resize", this.screenAdapter);
    // 在页面加载完成的时候,主动进行屏幕的适配
    this.screenAdapter();
  },
  updated(){
    this.screenAdapter();
  },
  beforeDestroy() {
    // clearInterval(this.timeId);
    window.removeEventListener("resize", this.screenAdapter);
    // this.$socket.unRegisterCallBack("sellerData");
  },
  methods: {
    initChart() {
      this.chartInstance = this.$echarts.init(
        this.$refs.seller_ref,
        this.theme
      );
      const initOption = {
        baseOption: {
          title: [
            {
              text: "▎ 各省人口增长",
              left: 20,
              top: 20,
             
            },
            {
              text: "",
              right: "2%",
              bottom: "10%",
              textStyle: {
                fontSize: 50,
                color: "#666",
              },
            },
          ],
          grid: {
            left: "8%",
            right: "12%",
            bottom: "9%",
            top: "10%",
            containLabel: true,
          },
          timeline: {
            axisType: "category",
            autoPlay: true,
            playInterval: 3000,
            left: "10%",
            right: "10%",
            // top:"10%",
            bottom: "0%",
            width: "80%",
            //  height: null,
            label: {
              normal: {
                textStyle: {
                  color: "#ff8800",
                },
              },
              emphasis: {
                textStyle: {
                  color: "#fff",
                },
              },
            },
            symbolSize: 10,
            lineStyle: {
              color: "#555",
            },
            checkpointStyle: {
              borderColor: "#777",
              borderWidth: 2,
            },
            controlStyle: {
              showNextBtn: true,
              showPrevBtn: true,
              normal: {
                color: "#ff8800",
                borderColor: "#ff8800",
              },
              emphasis: {
                color: "#aaa",
                borderColor: "#aaa",
              },
            },
          },

          tooltip: {
            trigger: "axis",
          },
          calculable: true,

          label: {
            normal: {
              textStyle: {
                color: "#fff",
              },
            },
          },
          yAxis: [
            {
              offset: "20",
              type: "category",
              data: "",
              nameTextStyle: {
                color: "#fff",
              },
              axisLabel: {
                //rotate:45,
                textStyle: {
                  fontSize: 12,
                  color: " #38B0DE",
                },
                interval: 0,
              },
              axisLine: {
                lineStyle: {
                  color: "#333",
                },
              },
              splitLine: {
                show: false,
                lineStyle: {
                  color: "#333",
                },
              },
            },
          ],
          xAxis: [
            {
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
                  return  value;
                },
              },
              splitLine: {
                show: true,
                lineStyle: {
                  color: "#ccc",
                },
              },
            },
          ],
          series: [
            {
              name: "",
              type: "bar",
              markLine: {
                label: {
                  normal: {
                    show: false,
                  },
                },
                lineStyle: {
                  normal: {
                    color: "red",
                    width: 3,
                  },
                },
              },
              barWidth: "70%",
              label: {
                normal: {
                  show: true,
                  position: "right",
                  formatter: "{c}",
                },
              },
              itemStyle: {
                normal: {
                  color: function (params) {
                    // build a color map as your need.
                    var colorList = [
                      "#376956",
                      "#c3bed4",
                      "#495a80",
                      "#9966cc",
                      "#bdb76a",
                      "#38B0DE",
                      "#bcd3bb",
                      "#e88f70",
                      "#9dc5c8",
                      "#e1e8c8",
                      "#E9C2A6",
                      "#BC8F8F",
                      "#4F4F2F",
                      "#EAADEA",
                      "#2F2F4F",
                      "#236B8E",
                      "#5F9F9F",
                      "#D98719",
                      "#04dd98",
                      "#d9b3e6",
                      "#b6c3fc",
                      "#315dbc",
                      "#5C4033 ",
                      "#CC3299",
                      "#eee8ab",
                      "#a35015",
                      "#23238E",
                      "#7b7c68",
                      "#e5b5b5",
                      "#f0b489",
                      "#928ea8",
                      "#bda29a",
                    ];
                    return colorList[params.dataIndex];
                  },
                  barBorderRadius: [0, 50, 50, 0],
                },
              },
            },
          ],
          animationDurationUpdate: 500,
          animationEasingUpdate: "quinticInOut",
        },
        options: [],
      };
      this.chartInstance.setOption(initOption);
    },
    async getData() {
      this.allData = await reqgetPeopleIncrease({ pid: this.pid });
      this.updataChart();
    },
    updataChart() {
      const years = this.allData.year;
      const jdData = this.allData.jdData;
      const data = this.allData.data;
      const dataOption = { timeline: {}, options: [] };
      for (var n = 0; n < years.length; n++) {
        var res = [];
        //alert(jdData.length);
        for (let j = 0; j < data[n].length; j++) {
          res.push({
            name: jdData[n][j],
            value: data[n][j],
          });
        }
        res
          .sort(function (a, b) {
            return b.value - a.value;
          })
          .slice(0, 6);

        res.sort(function (a, b) {
          return a.value - b.value;
        });

        //console.log(res);
        let res1 = [];
        let res2 = [];
        for (let t = 0; t < res.length; t++) {
          res1[t] = res[t].name;
          res2[t] = res[t].value;
        }
        dataOption.options.push({
          title: [
            {
              text: "▎ 各省人口增长",
              left: 20,
              top: 20,
            },
            {
              text: years[n] + "年",
            },
          ],
          yAxis: {
            data: res1,
          },
          series: [
            {
              data: res2,
            },
          ],
        });
      }

      dataOption.timeline.data = years;
      this.chartInstance.setOption(dataOption);
    },

    //当浏览器大小发生变化
    screenAdapter() {
      const persent =
        this.$refs.seller_ref.offsetWidth * 0.4 +
        this.$refs.seller_ref.offsetHeight * 0.6;
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
                fontSize: titleFontSize / 2.4 + 2,
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
