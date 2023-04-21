<template>
  <div class="com-container">
    <div class="com-chart" ref="age_ref"></div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { reqgetAge } from "../api/index";
export default {
  data() {
    return {
      chartInstance: null,
      allDate: null,
      currentIndex: 0, //当前显示的数据
      timerId: null,
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
    clearInterval(this.timerId);
  },
  methods: {
    initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.age_ref, this.theme);
      const initOption = {
        title: {
          text: "▎ 人口和年龄比例",
          left: 20,
          top: 20,
        },
        
      };
      this.chartInstance.setOption(initOption);
    },
    async getData() {
      let data = await reqgetAge({ pid: this.pid });
      this.allDate = data;
      this.updataChart();
      return;
    },
    updataChart() {
      const seriesArr = this.allDate.map((item, index) => {
        let left,top
        if (index==0) {
          left=48
          top=35
          
        }else{
          left = 28 + (index-1) * 43;
          top=75
        }
        
        return {
          type: "pie",
          radius: [40, 60],
          center: [left + "%", top+"%"],
          width: "50%",
          itemStyle: {
            borderColor: "#fff",
            borderWidth: 1,
          },
          label: {
            position: "outside",
            alignTo: "labelLine",
            formatter: "{b} \n{d}%",
            minMargin: 5,
            edgeDistance: 10,
          },
          labelLine: {
            length: 5,
            length2: 10,
            maxSurfaceAngle: 80,
            showAbove: true,
          },

          data: item,
        };
      });
      const dataOption = {
        series: seriesArr,
      };

      this.chartInstance.setOption(dataOption);
    },
    screenAdapter() {
      const titleFontsize = (this.$refs.age_ref.offsetWidth / 100) * 3.6;
      const innerRadius = titleFontsize * 3+5;
      const outterRadius = titleFontsize * 2+5;
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: titleFontsize,
          },
        },
        series: [
          {
            type: "pie",
            radius: [outterRadius, innerRadius],
            label: {
              fontSize: titleFontsize / 2 + 4,
            },
            labelLine: {
              length: titleFontsize/3,
              length2: 10,
            },
          },
          {
            type: "pie",
            radius: [outterRadius, innerRadius],
            label: {
              fontSize: titleFontsize / 2 + 4,
            },
            labelLine: {
              length: titleFontsize/3,
              length2: 10,
              maxSurfaceAngle: 80,
            },
          },
          {
            type: "pie",
            radius: [outterRadius, innerRadius],
            label: {
              fontSize: titleFontsize / 2 + 4,
            },
            labelLine: {
              length: titleFontsize/3,
              length2: 10,
              maxSurfaceAngle: 80,
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
