import Vue from 'vue';
import App from './App.vue';
// import axios from 'axios'
import store from './store'

//引入全局的样式文件
import '@/assets/css/global.less'
//引入字体文件
import '@/assets/font/iconfont.css'


import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.use(ElementUI);
Vue.prototype.$echarts = window.echarts;

import router from '@/router';
Vue.config.productionTip = false

new Vue({
    render: h => h(App),
    store,
    router,
}).$mount('#app')