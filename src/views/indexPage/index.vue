<template>
  <div class="indexPage">
    <div class="bg"></div>
    <div class="head">
      <div class="left"></div>
      <ul class="right">
        <li class="active"><router-link to="/index">首页</router-link></li>
        <li><router-link to="/world">世界人口数据</router-link></li>
        <li><router-link to="/screen">中国人口数据</router-link></li>
      </ul>
    </div>
    <div class="center-box">
      <div class="title">
        <div class="big">人从众</div>
        <div class="small">——第七次人口普查数据</div>
      </div>
      <div class="search">
        <el-select v-model="searchValue" placeholder="请选择查询的地区数据">
          <el-option :key="-1" label="全国" value="">
            <span style="float: left">全国</span>
          </el-option>
          <el-option
            v-for="item in cities"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
            <span style="float: left">{{ item.label }}</span>
            <!-- <span style="float: right; color: #8492a6; font-size: 13px">{{
              item.value
            }}</span> -->
          </el-option>
        </el-select>
        <el-button plain round class="searchBtn" @click="search"
          >查询</el-button
        >
      </div>
    </div>
  </div>
</template>
<script>
import { reqgetPid } from "../../api/index";
export default {
  data() {
    return {
      cities: [{}],
      searchValue: "",
    };
  },
  methods: {
    async search() {
      if (
        this.searchValue === null ||
        this.searchValue === undefined ||
        this.searchValue === "" ||
        this.searchValue < 0
      )
        this.$store.commit("SETPID", undefined);
      else this.$store.commit("SETPID", this.searchValue * 1);
      console.log(this.searchValue, this.cities[this.searchValue * 1].label);
      this.$router.push({
        name: "screen",
      });
    },
    async getPid() {
      this.cities = await reqgetPid();
      this.$store.commit("SETPIDLIST", this.cities);
    },
  },
  created() {
    this.getPid();
  },
};
</script>
<style lang="less" scoped>
a {
  text-decoration: none;
  color: #666;
}
li {
  list-style: none;
}
.bg {
  position: fixed;
  height: 100vh;
  width: 100vw;
  background: #fff url("../../assets/img/index1.png") no-repeat center;
  background-size: cover;
  z-index: -1;
  filter: blur(1.5px);
  &:after {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(83, 83, 83, 0.3);
    z-index: 2;
  }
}
.head {
  display: flex;
  justify-content: space-between;
  height: 60px;
  background-color: #488f9be3;
  border-bottom: 1px solid rgba(163, 163, 163, 0.5);
  .right {
    display: flex;
    li {
      line-height: 30px;
      padding: 15px 25px;
      cursor: pointer;
      a{
        color: #ddd;
      }
      &.active {
        background: #47a6b7 !important;
        a {
          color: #fff;
        }
      }
      &:hover {
        background: #47a6b7;
      }
    }
  }
}
.center-box {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  height: 300px;
  width: 500px;
  text-align: center;
  .title {
    font-size: 106px;
    color: #fff;
    font-weight: 700;
    margin-bottom: 30px;
    .big{
      letter-spacing: 20px;
    }
    .small {
      margin-top: 15px;
      font-size: 26px;
      font-weight: 400;
      margin-left: 200px;
    }
  }
  .searchBtn {
    margin-left: 15px;
  }
}
</style>
