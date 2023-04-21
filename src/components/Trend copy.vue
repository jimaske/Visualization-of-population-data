<template>
  <div class="com-container">
      <div class="title" :style="comStyle">
          <span>{{'▣ '+showTitle}}</span>
          <span class="iconfont title-icon" :style="comStyle" @click="showChoice=!showChoice">&#xe6eb;</span>
          <div class="select-con" v-show="showChoice">
              <div class="select-item" :style="marginStyle" v-for="item in selectTypes" :key="item.key" @click="handleSelect(item.key)">
                  {{item.text}}
              </div>
          </div>
      </div>
      <div class="com-chart" ref="trend_ref"></div>
  </div>
</template>

<script>
import {mapState} from 'vuex'
import {getThemeValue} from '@/utils/theme_utils'
export default {
    data() {
        return {
            chartInstance:null,
            allData:null,
            showChoice:false,
            choiceType:'map',
            titleFontSize:0
        }
    },
    created() {
        //在组件创建完成之后，进行回调函数的注册
        this.$socket.registerCallBack('trendData',this.getData)
    },
    mounted() {
      this.initChart()  
      // this.getData()
      this.$socket.send({
          action:'getData',
          socketType:'trendData',
          chartName:'trend',
          value:''
      })
      window.addEventListener('resize',this.screenAdapter)
      this.screenAdapter()
    },
    beforeDestroy() {
        window.removeEventListener('resize',this.screenAdapter)
        this.$socket.unRegisterCallBack('trendData')
    },
    computed:{
        selectTypes(){
            if (!this.allData) {
                return []
            }else{
                return this.allData.type.filter(item=>{
                    return item.key!==this.choiceType
                })
            }
        },
        showTitle(){
            if (!this.allData) {
                return ''
            }else{
                return this.allData[this.choiceType].title
            }
        },
        comStyle(){
            return {
                fontSize:this.titleFontSize+'px',
                color:getThemeValue(this.theme).titleColor
            }
        },
        marginStyle(){
            return {
                marginLeft:this.titleFontSize+'px'
            }
        },
        ...mapState(['theme'])
    },
    methods: {
        initChart(){
           this.chartInstance =this.$echarts.init(this.$refs.trend_ref,this.theme)
           const initOption={
               grid:{
                   left:'3%',
                   top:'35%',
                   right:'4%',
                   bottom:'1%',
                   containLabel:true
               },
               tooltip:{
                   trigger:'axis'
               },
               legend:{
                   left:20,
                   top:'15%',
                   icon:'circle'
               },
               xAxis:{
                   type:'category',
                   boundaryGap:false
               },
               yAxis:{
                   type:'value'
               }
           }
           this.chartInstance.setOption(initOption)
        },
        getData(ret){
            // const {data:ret}=await this.$http.get('trend')
            this.allData=ret;
            this.updataChart()
        },
        updataChart(){
            const colorArr1=[
                'rgba(11,168,44,0.5)',
                'rgba(44, 110, 255, 0.5)',
                'rgba(22, 242, 217, 0.5)',
                'rgba(254, 33, 30, 0.5)',
                'rgba(250, 105, 0, 0.5)'
            ]
             // 全透明的颜色值
            const colorArr2 = [
                'rgba(11, 168, 44, 0)',
                'rgba(44, 110, 255, 0)',
                'rgba(22, 242, 217, 0)',
                'rgba(254, 33, 30, 0)',
                'rgba(250, 105, 0, 0)'
            ]
            //处理数据
            const timeArr=this.allData.common.month
            const valueArr=this.allData[this.choiceType].data
            const seriesArr=valueArr.map((item,index)=>{
                return {
                    name:item.name,
                    type:'line',
                    data:item.data,
                    stack:'map',
                    areaStyle:{
                        color:new this.$echarts.graphic.LinearGradient(0,0,0,1,[
                            {
                                offset:0,
                                color:colorArr1[index]
                            },//0%颜色值
                            {
                                offset:1,
                                color:colorArr2[index]
                            }//100%颜色值
                        ])
                    }
                    }
                })
            const lengendArr=valueArr.map(item=>{
                return item.name
            })
            const dataOption={
                xAxis:{
                    data:timeArr
                },
                legend:{
                    data:lengendArr
                },
                series:seriesArr
            };
            this.chartInstance.setOption(dataOption)
        },
        screenAdapter(){
            this.titleFontSize=this.$refs.trend_ref.offsetWidth/100*3.6
            const adapterOption={
                legend:{
                    itemWidth:this.titleFontSize,
                    itemHeight:this.titleFontSize,
                    itemGap:this.titleFontSize,
                    textStyle:{
                        fontSize:this.titleFontSize/1.5,
                        lineHeight:this.titleFontSize
                    }
                }
            }
            this.chartInstance.setOption(adapterOption)
            this.chartInstance.resize()
        },
        handleSelect(currentType){
            this.choiceType=currentType;
            this.updataChart()
            this.showChoice=false
        }
    },
    watch:{
        theme(){
            this.chartInstance.dispose()
            this.initChart()
            this.screenAdapter()
            this.updataChart()
        }
    }
}
</script>

<style  lang="less" scoped>
.title{
    position: absolute;
    left: 20px;
    top: 20px;
    z-index: 10;
    color: white;
    cursor: default;
    
    
    .select-con{
        background-color: rgba(0, 0, 0, .3);
        padding-bottom: 10px;
        border-bottom-left-radius: 10px;
        border-bottom-right-radius: 10px;
        .select-item{
        padding: 8px 0;
    }
    .active{
        background-color: rgba(255,255,255,0.3);
    }
    }
}
.title-icon{
    margin-left: 10px;
    cursor: pointer;

}

</style>