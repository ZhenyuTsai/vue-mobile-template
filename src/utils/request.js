import axios from 'axios'
import store from '../store'
import { Toast } from 'vant'
axios.defaults.headers.post['Content-Type'] = 'application/json charset=UTF-8'

// request拦截器
axios.interceptors.request.use(
  config => {
    if (store.getters.getToken) {
      config.headers.token = store.getters.getToken
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// respone拦截器  //拦截响应response，并做一些错误处理
axios.interceptors.response.use(
  response => {
    const data = response.data
    if (data && data.code === 0) {
      return response.data.content
    } else if (response.data instanceof Blob) {
      return response.data
    } else {
      // 处理错误
      if (data.code === 40002) {
        Toast('此接口没有授权 由于您长时间未操作本次登陆失效，请重新登录')
      } else if (data.code === 5001) {
        Toast('本次操作请求超时，请重新操作')
      } else {
        Toast('请求系统出现异常，请重新打开')
      }
    }
  },
  error => {
    if (error.message.indexOf('timeout') !== -1) {
      error.message = '本次操作请求超时，请重新操作'
    }
    Toast(error.message)
    return Promise.reject(error)
  }
)

export default {
  get (url, params = {}) {
    params.t_request = Math.random()
    return axios.get(url, {
      params: params
    })
  },
  post (url, params = {}) {
    return axios.post(url, params)
  },
  put (url, data = {}) {
    return axios.put(url, data)
  },
  delete (url, data = {}) {
    return axios.delete(url, { data })
  }
}
