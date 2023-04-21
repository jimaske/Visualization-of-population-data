import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);
// 引入路由组件
import ScreenPage from '@/views/ScreenPage'
import indexPage from '@/views/indexPage'
import mapPage from '@/views/mapPage'
export default new VueRouter({
    routes: [{
            path: '/',
            redirect: '/index',
        },
        {
            path: '/index',
            name: 'index',
            component: indexPage
        },
        {
            path: '/screen',
            name: 'screen',
            component: ScreenPage
        }, {
            path: '/world',
            name: 'world',
            component: mapPage
        }
    ]
})