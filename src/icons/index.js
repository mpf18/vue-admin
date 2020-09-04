import Vue from "vue";

import Svgicons from './Svgicons.vue';
//自定义全局组件
Vue.component('svg-icon', Svgicons);



/** require.context 读取指定目录的所有文件
 * 第一个：目录
 * 第二个：是否遍历子级目录
 * 第三个：定义遍历文件规则
 */
const req = require.context('./svg', false, /\.svg$/); //读取结尾为.svg的文件
const requireAll = ((requireContext) => {
    return requireContext.keys().map(requireContext)
})
requireAll(req);