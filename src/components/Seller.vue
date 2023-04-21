<template>
    <div class="com-container">
        <div class="com-chart" ref="seller_ref"></div>
    </div>
</template>

<script>
import {mapState} from 'vuex'
export default {
    data(){
        return{
            chartInstance:null,
            allData:null,  //服务器返回的数据
            currentPage:1, //当前显示的页数
            totalPage:0,    //一共有多少页
            timeId:null,
        }
    },
    created() {
        //在组件创建完成之后，进行回调函数的注册
        this.$socket.registerCallBack('sellerData',this.getData)
    },
    mounted() {
        this.initChart()
        this.$socket.send({
          action:'getData',
          socketType:'sellerData',
          chartName:'seller',
          value:''
        })
        window.addEventListener('resize',this.screenAdapter)
        // 在页面加载完成的时候,主动进行屏幕的适配
        this.screenAdapter()
    },
    beforeDestroy() {
        clearInterval(this.timeId);
        window.removeEventListener('resize',this.screenAdapter)
        this.$socket.unRegisterCallBack('sellerData')
    },
    methods: {
        initChart(){
            this.chartInstance= this.$echarts.init(this.$refs.seller_ref,this.theme);
            const initOption={
                title:{
                    text:'商家销售统计',
                   
                    left:20,
                    top:20
                },
                gird:{
                    top:"20%",
                    left:"3%",
                    right:"6%",
                    bottom:"3%",
                    // containLabel:true
                },
                xAxis:{
                    type:'value'
                },
                yAxis:{
                    type:'category',
                },
                tooltip:{
                    trigger:'axis',
                    axisPointer:{
                        type:'line',
                        z:0,
                        lineStyle:{
                            color:'#2d3443'
                        }
                    }
                },
                series:[{
                    type:'bar',
                    label:{
                        show:true,
                        position:'right',
                        textStyle:{
                            color:'white'
                        }
                    },
                    itemStyle:{
                        color:new this.$echarts.graphic.LinearGradient(0,0,1,0,[
                            {
                                offset:0,
                                color:'#5052EE'
                            },
                            {
                                offset:1,
                                color:'#AB6EE5'
                            }])
                    }
                }]
            }
            this.chartInstance.setOption(initOption)
            this.chartInstance.on('mouseover',()=>{
                clearInterval(this.timeId)
            })
            this.chartInstance.on('mouseout',()=>{
                this.startInterval()
            })
        },
        getData(ret){
            this.allData=ret;
            this.allData.sort((a,b)=>{
                return a.value-b.value //从小到大排序
            })
            this.totalPage=Math.ceil(this.allData.length/5)
            this.updataChart()
            this.startInterval()
        },
        updataChart(){
            const start=(this.currentPage-1)*5
            const end=this.currentPage*5
            const showDate=this.allData.slice(start,end)
            const sellerNames=showDate.map((item)=>{
                return item.name
            })
            const sellerValues=showDate.map((item)=>{
                return item.value
            })
            const dataOption={
                yAxis:{
                    data:sellerNames
                },
                series:[{
                    data:sellerValues,
                }]
            }
                
            this.chartInstance.setOption(dataOption)
        },
        startInterval(){
            if (this.timeId) {
                clearInterval(this.timeId)
            }
            this.timeId=setInterval(()=>{
                this.currentPage++;
                this.currentPage= this.currentPage%(this.totalPage+1)||1;
                this.updataChart()
            },3000)
        },
        //当浏览器大小发生变化
        screenAdapter(){
            const titleFontSize=this.$refs.seller_ref.offsetWidth/100*3.6
            // 和分辨率大小相关的配置项
            const adapterOption={
                title:{
                    textStyle:{
                        fontSize:titleFontSize
                    },
                },
                tooltip:{
                    axisPointer:{
                        lineStyle:{
                            width:titleFontSize,
                        }
                    }
                },
                series:[{
                    barWidth:titleFontSize,
                    itemStyle:{
                        barBorderRadius:[0,titleFontSize/2,titleFontSize/2,0],
                    }
                }]
            }
            this.chartInstance.setOption(adapterOption)
            this.chartInstance.resize()
        }
    },
    computed: {
        ...mapState(['theme'])
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

<style>

</style>