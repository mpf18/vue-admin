import axios from "axios";
import { Message } from 'element-ui';

//创建axios,赋值给service

const BASEURL = process.env.NODE_ENV === 'production' ? '' : '/devApi';

const service = axios.create({
    baseURL: BASEURL,
    timeout: 15000, //超时
});
/**
 * 请求接口前，做一些数据处理(请求拦截器)
 */
// 添加请求拦截器
service.interceptors.request.use(function(config) {
    // 在发送请求之前做些什么
    //后台需要前端这边传相关的参数(在请求头添加参数)
    config.headers.Token = '11111111111';
    // config.headers['Token'] = '1111111111';
    return config;
}, function(error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});
/**
 * 请求接口后返回数据进行拦截(响应拦截)
 */
// 添加响应拦截器
service.interceptors.response.use(function(response) {
    //请求之前拦截
    let data = response.data;
    if (data.resCode != 0) {
        Message({
            showClose: true,
            message: data.message,
            type: 'error'
        })
        return Promise.reject(data);
    } else {
        return response;
    }
}, function(error) {
    return Promise.reject(error);
});




export default service;
/**
 * 使用export default时，但不能同时存在多个default
 * 文件import，不需要花括号
 */