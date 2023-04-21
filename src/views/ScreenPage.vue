<template>
  <div class="screen-container" :style="containerStyle">
    <header class="screen-header">
      <div>
        <img :src="headerSrc" alt="" />
      </div>
      
      <ul class="link">
        <li><router-link to="/index" :style="linkStyle">首页</router-link></li>
        <li><router-link to="/world" :style="linkStyle">世界人口数据</router-link></li>
      </ul>
      <span class="title" :style="titleFontSize">第七次人口普查数据</span>
      <div class="title-right">
        <img :src="themeSrc" class="qiehuan" @click="handleChangeTheme" />
        <span class="datetime" :style="dataFontSize">{{ nowtime }}</span>
      </div>
    </header>
    <div class="screen-body">
      <section class="screen-left">
        <div
          id="left-top"
          :class="[fullScreenStatus.trend ? 'fullscreen' : 'normal']"
        >
          
          <Trend ref="trend" />
          <div class="resize">
            <span
              @click="changeSize('trend')"
              :class="[
                'iconfont',
                fullScreenStatus.trend
                  ? 'icon-compress-alt'
                  : 'icon-expand-alt',
              ]"
            ></span>
          </div>
        </div>
        <div
          id="left-bottom"
          :class="[fullScreenStatus.age ? 'fullscreen' : 'normal']"
        >
          <!-- 年龄和性别比例图 -->
          <Age ref="age" />
          <div class="resize">
            <span
              @click="changeSize('age')"
              :class="[
                'iconfont',
                fullScreenStatus.age
                  ? 'icon-compress-alt'
                  : 'icon-expand-alt',
              ]"
            ></span>
          </div>
        </div>
      </section>
      <section class="screen-middle">
        <div
          id="middle-top"
          :class="[fullScreenStatus.areamap ? 'fullscreen' : 'normal']"
        >
          <!-- 人口数量分布图表 -->
          <Map ref="areamap" />
          <div class="resize">
            <span
              @click="changeSize('areamap')"
              :class="[
                'iconfont',
                fullScreenStatus.areamap
                  ? 'icon-compress-alt'
                  : 'icon-expand-alt',
              ]"
            ></span>
          </div>
        </div>
      </section>
      <section class="screen-right">
        
        <div v-if="pid>=0" id="right-top" :class="[fullScreenStatus.provinceIncrease ? 'fullscreen' : 'normal']">
          <!-- 市级人口增长图表 -->
          <ProvinceIncrease ref="provinceIncrease"></ProvinceIncrease>
          <div class="resize">
            <span
              @click="changeSize('provinceIncrease')"
              :class="[
                'iconfont',
                fullScreenStatus.provinceIncrease ? 'icon-compress-alt' : 'icon-expand-alt',
              ]"
            ></span>
          </div>
        </div>
        <div v-else id="right-top" :class="[fullScreenStatus.increase ? 'fullscreen' : 'normal']">
          <!-- 省级人口增长图表 -->
          <Increase ref="increase" />
          <div class="resize">
            <span
              @click="changeSize('increase')"
              :class="[
                'iconfont',
                fullScreenStatus.increase ? 'icon-compress-alt' : 'icon-expand-alt',
              ]"
            ></span>
          </div>
        </div>
        
        <div
          id="right-bottom"
          :class="[fullScreenStatus.education ? 'fullscreen' : 'normal']"
        >
          <!-- 教育程度图表 -->
          <Education ref="education" />
          <div class="resize">
            <span
              @click="changeSize('education')"
              :class="[
                'iconfont',
                fullScreenStatus.education
                  ? 'icon-compress-alt'
                  : 'icon-expand-alt',
              ]"
            ></span>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import Hot from "@/components/Hot.vue";
import Map from "@/components/Map.vue";
import ProvinceIncrease from "@/components/ProvinceIncrease.vue";
import Rank from "@/components/Rank.vue";
import Seller from "@/components/Seller.vue";
import Age from "@/components/Age.vue";
import Trend from "@/components/Trend.vue";
import Increase from "@/components/Increase.vue";
import Education from "@/components/Education.vue";

import { mapState } from "vuex";
import { getThemeValue } from "@/utils/theme_utils";
import dayjs from "dayjs";
export default {
  components: {
    Hot,
    Map,
    Seller,
    Age,
    Trend,
    Increase,
    Education,
    ProvinceIncrease
  },
  created() {
    // this.$socket.registerCallBack("fullScreen", this.recvData);
    // this.$socket.registerCallBack("themeChange", this.recvChangeTheme);
  },
  mounted() {
    this.getDate();
    window.addEventListener("resize", this.screenAdapter);
    setInterval(() => this.getDate(), 1000);
    this.screenAdapter();
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.screenAdapter);
    this.$store.commit("SETPID", undefined);
    // this.$socket.unRegisterCallBack("fullScreen");
    // this.$socket.unRegisterCallBack("themeChange");
  },
  data() {
    return {
      fullScreenStatus: {
        trend: false,
        seller: false,
        areamap: false,
        rank: false,
        hot: false,
        age: false,
        increase:false,
        education:false,
        provinceIncrease:false
      },
      screenFontSize: 0,
      nowtime: "2023-01-01 00:00:00",
    };
  },
  methods: {
    changeSize(chartName) {
      // //1.改变fullScreenStatus
      this.fullScreenStatus[chartName]=!this.fullScreenStatus[chartName];
      // //2.需要调用每一个图标组件的screenAdapter的方法
      this.$nextTick(()=>{
          this.$refs[chartName].screenAdapter()
      })
    },
    recvData(data) {
      //取出是哪一个图表需要切换
      const chartName = data.chartName;
      const targetValue = data.value;
      this.fullScreenStatus[chartName] = targetValue;
      this.$nextTick(() => {
        this.$refs[chartName].screenAdapter();
      });
    },
    
    handleChangeTheme() {
      //修改Vuex中的数据
      this.$store.commit("CHANGETHEME");
    },
    screenAdapter() {
      this.screenFontSize = (document.body.offsetWidth / 100) * 3.6;
    },
    getDate() {
      this.nowtime = dayjs().format("YYYY-MM-DD HH:mm:ss");
    },
    returnIndex(){
      this.$router.push({
        name: "index",
      });
    }
  },
  
  computed: {
    logoSrc() {
      return "/static/img/" + getThemeValue(this.theme).logoSrc;
    },
    headerSrc() {
      return "/static/img/" + getThemeValue(this.theme).headerBorderSrc;
    },
    themeSrc() {
      return "/static/img/" + getThemeValue(this.theme).themeSrc;
    },
    containerStyle() {
      return {
        backgroundColor: getThemeValue(this.theme).backgroundColor,
        color: getThemeValue(this.theme).titleColor,
      };
    },
    titleFontSize() {
      return {
        fontSize: this.screenFontSize / 2 + "px",
      };
    },
    linkStyle() {
      return {
        fontSize: this.screenFontSize / 3 + "px",
        color: getThemeValue(this.theme).titleColor,
      };
    },
    dataFontSize() {
      return {
        fontSize: this.screenFontSize / 3 + "px",
      };
    },

    ...mapState(["theme","pid"]),
  },
};
</script>

<style lang="less" scoped>
.link{
  position: absolute;
  top: 10px;
  display: flex;
  li{
    margin-left: 15px;
  }
}
.normal{
  border-radius: 20px;
  overflow: hidden;
}
.fullscreen {
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  width: 100% !important;
  height: 100% !important;
  margin: 0 !important;
  z-index: 100;
  
}
.return{
  
  padding: 5px 15px;
  border-radius: 20px;
  background-color: #fff;
  cursor: pointer;
}
.screen-container {
  width: 100%;
  height: 100%;
  padding: 0 20px;
  background-color: #161522;
  color: #fff;
  box-sizing: border-box;
}
.screen-header {
  width: 100%;
  height: 64px;
  position: relative;
  > div {
    height: 100%;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .title {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
  .title-right {
    display: flex;
    align-items: center;
    position: absolute;
    right: 0px;
    top: 50%;
    transform: translateY(-65%);
  }
  .qiehuan {
    width: 28px;
    height: 21px;
    cursor: pointer;
  }
  .datetime {
    margin-left: 10px;
  }
  .logo {
    position: absolute;
    left: 0px;
    top: 50%;
    transform: translateY(-80%);
    img {
      height: 35px;
      width: 128px;
    }
  }
}
.screen-body {
  width: 100%;
  height: 100%;
  display: flex;
  margin-top: 10px;
  .screen-left,
  .screen-middle,
  .screen-right {
    height: 90%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .screen-left {
    width: 27.6%;

    #left-top {
      height: 55%;
      position: relative;
    }
    #left-bottom {
      height: 45%;
      margin-top: 25px;
      position: relative;
    }
  }
  .screen-middle {
    width: 41.5%;
    margin-left: 1.6%;
    margin-right: 1.6%;
    #middle-top {
      width: 100%;
      flex: 1;
      position: relative;
    }
    // #middle-bottom {
    //   margin-top: 25px;
    //   width: 100%;
    //   height: 28%;
    //   position: relative;
    // }
  }
  .screen-right {
    width: 27.6%;
    #right-top {
      height: 65%;
      position: relative;
    }
    #right-bottom {
      height: 35%;
      margin-top: 25px;
      position: relative;
    }
  }
}
.resize {
  position: absolute;
  right: 20px;
  top: 20px;
  cursor: pointer;
}
</style>
