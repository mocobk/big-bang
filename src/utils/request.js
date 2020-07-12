import axios from "axios"
import Vue from 'vue'


let config = {
    baseURL: process.env.VUE_APP_BASE_API || "",
    timeout: 10 * 1000, // Timeout
    // withCredentials: true, // Check cross-site Access-Control
};

const request = axios.create(config);

request.interceptors.request.use(
    function(config) {
        // Do something before request is sent
        return config;
    },
    function(error) {
        // Do something with request error
        return Promise.reject(error);
    }
);

// Add a response interceptor
request.interceptors.response.use(
    function(response) {
        // Do something with response data
        return response.data
    },
    function(error) {
        // Do something with response error
        console.log(error) // for debug
        // 如果无响应，则提示连接超时
        if (!error.response) {
            Vue.prototype.$toast.fail('连接超时')
            return Promise.reject(error)
        }
        // 其他错误统一弹服务端返回的错误提示
        Vue.prototype.$toast.fail('出错啦')
        return Promise.reject(error)
    }
);


export default request;
