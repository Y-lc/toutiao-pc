import axios from 'axios'
import store from '@/store'
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
