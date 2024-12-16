import axios from 'axios'
import { ElNotification, ElMessageBox, ElMessage, ElLoading } from 'element-plus'
let downloadLoadingInstance
// 是否显示重新登录
export let isRelogin = { show: false }
axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8'
// 创建axios实例
const service = axios.create({
  // axios中请求配置有baseURL选项，表示请求URL公共部分
  baseURL: '/',
  // 超时
  timeout: 600000
})



// 响应拦截器
service.interceptors.response.use(
  (res) => {
    const code = res.data.code || 200
    // 未设置状态码则默认成功状态
    // 获取错误信息
    const msg = res.data.message
    if (code == 200 || code == 0) {
      return Promise.resolve(res.data)
    } else {
      ElNotification.error({ title: msg })
      return Promise.reject('error')
    }
    // if (code === 601) {
    //   ElMessage({ message: msg, type: 'warning' })
    //   return Promise.reject(new Error(msg))
    // } else if (code !== 200) {
    //   ElNotification.error({ title: msg })
    //   return Promise.reject('error')
    // } else {
    //   return Promise.resolve(res.data)
    // }
  },
  (error) => {
    console.log(error)
    let { message, response } = error
    if (response.status == 401) {
      ElMessage.error('登录已过期，请重新登录')
      removeToken()
      window.location.href = '/'
      // useUserStore()
      //   .logOut()
      //   .then(() => {
      //     window.location.href = 'login'
      //   })
      //   .catch((err) => {
      //     window.location.href = 'login'
      //   })
    }

    if (message == 'Network Error') {
      message = '后端接口连接异常'
      ElMessage.error(message)
    } else if (message.includes('timeout')) {
      message = '系统接口请求超时'
      ElMessage.error(message)
    }
    //  else if (message.includes('Request failed with status code')) {
    //   message = '系统接口' + message.substr(message.length - 3) + '异常'
    // }
    // ElMessage({
    //   message: response.data.error_msg || message,
    //   type: 'error',
    //   duration: 5 * 1000
    // })
    return Promise.reject(error)
  }
)

export default service
