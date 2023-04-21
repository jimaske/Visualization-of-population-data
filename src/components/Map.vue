<template>
  <div class="com-container" @dblclick="revertMap">
    <div v-loading="loading"></div>
    <div class="com-chart" ref="map_ref"></div>
  </div>
</template>

<script>
import axios from "axios";
import { getProvinceMapInfo } from "@/utils/map_utils";
import { mapState } from "vuex";
import { reqgetMap } from "../api/index";
export default {
  data() {
    return {
      chartInstance: null,
      allDate: null,
      mapData: {}, // 所获取的省份的地图矢量数据
      loading:true
    };
  },
  async mounted() {
    await this.initChart();
    await this.getData();
    this.changeMap();
    window.addEventListener("resize", this.screenAdapter);
    this.screenAdapter();
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.screenAdapter);
  },
  methods: {
    async initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.map_ref, this.theme);
      //获取中国地图的矢量数据
      const ret = await axios.get(
        "../../static/map/china.json"
      );
      this.$echarts.registerMap("china", ret.data);
      const initOption = {
        title: {
          text: "▎ 人口数量",
          left: 20,
          top: 20,
        },
        tooltip: {
          trigger: "item",
          formatter: "{b}<br/>{c} (万人)",
        },
        visualMap: {
          min: 15000,
          max: 100,
          text: ["High", "Low"],

          realtime: false,
          calculable: true,
          inRange: {
            color: ["lightskyblue", "yellow", "orangered"],
          },
        },
        series: {
          name: "中国人口数量",
          type: "map",
          map: "china",
          layoutCenter: ["50%", "60%"],
          layoutSize: "100%",
          label: {
            show: true,
          },
          data: [],
        },
        legend: {
          left: "5%",
          bottom: "5%",
          orient: "vertical",
        },
      };
      this.chartInstance.setOption(initOption);
      this.chartInstance.on("click", (arg) => {
        this.$store.commit("SETPID", arg.dataIndex * 1);
      });
    },
    async changeMap() {
      let changeOption;
      if (this.provinceName) {
        const provinceInfo = getProvinceMapInfo(this.provinceName);
        // console.log(provinceInfo);
        if (provinceInfo.key || provinceInfo.key <= 33) {
          if (!this.mapData[provinceInfo.key]) {
            console.log(provinceInfo.path);
            const ret = await axios.get("../" + provinceInfo.path);
            this.mapData[provinceInfo.key] = ret.data;
            this.$echarts.registerMap(provinceInfo.key, ret.data);
          }
          changeOption = {
            visualMap: {
              min: 2500,
              max: 100,
            },
            series: {
              layoutCenter: ["50%", "50%"],
              layoutSize: "90%",
              map: provinceInfo.key,
              data: this.allDate,
            },
          };
        }
      } else {
        changeOption = {
          visualMap: {
            min: 15000,
            max: 100,
          },
          series: {
            layoutCenter: ["50%", "60%"],
            layoutSize: "100%",
            map: "china",
            data: this.allDate,
          },
        };
      }
      this.chartInstance.setOption(changeOption);
    },
    async getData() {
      this.allDate = await reqgetMap({ pid: this.pid });
      this.updataChart();
      return;
    },
    updataChart() {
      const dataOption = {
        series: {
          data: this.allDate,
        },
      };
      this.chartInstance.setOption(dataOption);
    },
    screenAdapter() {
      const titleFontsize = (this.$refs.map_ref.offsetWidth / 100) * 3.6;
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: titleFontsize,
          },
        },
        legend: {
          itemWidth: titleFontsize / 2,
          itemHeight: titleFontsize / 2,
          itemGap: titleFontsize / 2,
          textStyle: {
            fontSize: titleFontsize / 2,
          },
        },
      };
      this.chartInstance.setOption(adapterOption);
      this.chartInstance.resize();
    },
    revertMap() {
      this.$store.commit("SETPID", undefined);
      // const revertOption = {
      //   series: {
      //     map: "china",
      //     data: this.allDate,
      //   },
      // };
      // this.chartInstance.setOption(revertOption);
    },
  },
  computed: {
    ...mapState(["theme", "pid", "provinceName"]),
  },
  watch: {
    async theme() {
      this.chartInstance.dispose();
      await this.initChart();
      this.changeMap();
      this.screenAdapter();
      this.updataChart();
    },
    async pid(newV, oldV) {
      await this.changeMap();

      this.getData();
    },
  },
};
</script>

<style></style>
