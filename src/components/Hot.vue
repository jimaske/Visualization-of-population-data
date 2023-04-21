  <template>
    <div class="com-container">
        <div class="com-chart" ref="hot_ref"></div>
        <span class="iconfont arr-left" @click="toLeft" :style="arrComStyle">&#xe6ef;</span>
        <span class="iconfont arr-right" @click="toRight" :style="arrComStyle">&#xe6ed;</span>
        <span class="cat-name" :style="comStyle">{{catName}}</span>
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
            currentIndex:2,
            titleFontsize:0
        }
    },
    created() {
        //在组件创建完成之后，进行回调函数的注册
        this.$socket.registerCallBack('hotData',this.getData)
    },
    mounted() {
        this.initChart()
        // this.getData()
        this.$socket.send({
          action:'getData',
          socketType:'hotData',
          chartName:'hotproduct',
          value:''
      })
        window.addEventListener('resize',this.screenAdapter)
        this.screenAdapter()
    },
    computed:{
        catName(){
            if (!this.allData) {
                return ''
            }else{
                return this.allData[this.currentIndex].name
            }
        },
        comStyle(){
            return {
                fontSize:this.titleFontsize+'px',
                color:getThemeValue(this.theme).titleColor
            }
        },
        arrComStyle(){
            return {
                fontSize:2*this.titleFontsize+'px',
                color:getThemeValue(this.theme).titleColor
            }
        },
        ...mapState(['theme'])
    },
    watch:{
        theme(){
            this.chartInstance.dispose()
            this.initChart()
            this.screenAdapter()
            this.updataChart()
        }
    },
    beforeDestroy() {
        window.removeEventListener('resize',this.screenAdapter)
        this.$socket.unRegisterCallBack('trendData')
    },
    methods: {
        initChart(){
            this.chartInstance=this.$echarts.init(this.$refs.hot_ref,this.theme)
            const initOption={
                title:{
                    text:'热销商品的占比',
                    left:20,
                    top:20
                },
                legend:{
                    top:'15%',
                    icon:'circle'
                },
                tooltip:{
                    show:true,
                    formatter:(arg)=>{
                        const thirdCategory=arg.data.children
                        let total=0;
                        thirdCategory.forEach(item=>{
                            total+=item.value
                        })
                        let retStr=''
                        thirdCategory.forEach(item=>{
                            retStr+=`${item.name}:${parseInt(item.value/total*100)}%<br/>`
                        })
                        return retStr
                    }
                },
                series:[
                    {
                        type:'pie',
                        label:{
                            show:false
                        },
                        emphasis:{
                            label:{
                                show:true
                            },
                            // labelLine:{
                            //     show:false
                            // }
                        }
                    }
                ]
            }
            this.chartInstance.setOption(initOption)
        },
        async getData(ret){
            this.allData=ret
            this.updataChart()
        },
        updataChart(){
            const legendDate=this.allData[this.currentIndex].children.map(item=>{
                return item.name
            })
            const seriesData=this.allData[this.currentIndex].children.map(item=>{
                return {
                    name:item.name,
                    value:item.value,
                    children:item.children
                }
            })
            const dataOption={
                legend:{
                    data:legendDate
                },
                series:[
                    {
                        data:seriesData
                    }
                ]
            }
            this.chartInstance.setOption(dataOption)
        },
        screenAdapter(){
            this.titleFontsize=this.$refs.hot_ref.offsetWidth/100*3.6
            const adapterOption={
                title:{
                    textStyle:{
                        fontSize:this.titleFontsize
                    }
                },
                legend:{
                    itemWidth:this.titleFontsize/1.5,
                    itemHeight:this.titleFontsize/1.5,
                    itemGap:this.titleFontsize/2,
                    textStyle:{
                        fontSize:this.titleFontsize/1.5,
                    }
                },
                series:[
                    {
                        radius:this.titleFontsize*4,
                        center:['50%','55%']
                    }
                ]
            }
            this.chartInstance.setOption(adapterOption)
            this.chartInstance.resize()
        },
        toLeft(){
            this.currentIndex=--this.currentIndex<0?this.allData.length-1:this.currentIndex
            this.updataChart()
        },
        toRight(){
            this.currentIndex= ++this.currentIndex%this.allData.length
            this.updataChart()
        }
    },
}
</script>
<style scoped>
.arr-left{
    position: absolute;
    left: 10%;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
    color: #fff;
}
.arr-right{
    position: absolute;
    right: 10%;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
    color: #fff;
}
.cat-name{
    position: absolute;
    left: 80%;
    bottom: 20px;
    color: #fff;
}
</style>
