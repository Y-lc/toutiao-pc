import axios from 'axios'
import store from '@/store'
// 转换数据
import JSONBIG from 'json-bigint'
// 默认配置  转换响应数据
axios.defaults.transformResponse = [data => {
  // 对data（后台的原始数据）进行转换
  // 但是 有一些接口  没有任何响应内容
  // JSONBIG.parse(null)  报错
  try {
    return JSONBIG.parse(data)
  } catch (e) {
    return data
  }
}]

axios.defaults.baseURL = 'http://ttapi.research.itcast.cn/mp/v1_0'
// 拦截器
axios.interceptors.request.use((config) => {
// 拦截成功
  config.headers.Authorization = 'Bearer ' + store.getUser().token
  return config
}, (err) => {
// 失败
  return Promise.reject(err)
})
export default axios
