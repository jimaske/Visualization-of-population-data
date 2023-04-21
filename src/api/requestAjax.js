import axios from "axios";

//1:创建一个axios实例
//2：requests就是axios，只不过稍微配置一下
let requests = axios.create({
    baseURL: 'http://127.0.0.1:5000',
    timeout: 5000,
});
//请求拦截器
requests.interceptors.request.use((config) => {
    return config;
});

//拦截响应器
requests.interceptors.response.use((res) => {
    //成功的回调函数
    return res.data;
}, (error) => {
    //响应失败的回调函数
    return Promise.reject(error);
})
export default requests;