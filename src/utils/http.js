/* eslint-disable */
import store from '../store'
import qs from 'qs'
import app from '@/utils/app'
import app_v2 from '@/utils/app_v2'
import axios from 'axios'
import {
  Dialog,
  Toast
} from 'mand-mobile'

axios.defaults.timeout = 600000
axios.defaults.baseURL = process.env.VUE_APP_API_ROOT
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
    console.log(response)
    // 通用逻辑，请求出错，全屏弹层提示
    if (process.env.VUE_APP_USE_MOCK === 'true' && !response.data) {
      return response
    }

    const data = response.data

    if (data && data.code === 0) {
      return response.data.content
    } else {
      // 处理错误
      if (data.code === 40002) { // 此接口没有授权 由于您长时间未操作本次登陆失效，请点击重新登录
        alertReloadMessage('由于您长时间未操作本次登陆失效，请点击重新登录')
      } else if (data.code === 5001) { // 此次请求ajax超时  本次操作请求超时，请重新操作
        alertMessage('本次操作请求超时，请重新操作')
      } else {
        alertMessage('系统请求异常，请重新打开')
      }
    }
  },
  error => {
    if (error.message.indexOf('timeout') != -1) {
      error.message = '本次操作请求超时，请重新操作'
    } else {
      error.message = '系统请求异常'
    }
    alertMessage(error.message)
    // return Promise.reject(error)
  }
)

function alertReloadMessage (message) {
  Dialog.alert({
    content: message,
    confirmText: '重新登录',
    onConfirm: () => {
      // 进行登陆处理
      const visitType = store.getters.getVisitType
      if (visitType == 'app') {
        // 调用APP的getToken方法处理
        app.getToken().then((res) => {
          if (res.nativeData && res.nativeData.token && res.nativeData.token != '') {
            async function setToken () {
              store.dispatch('setToken', res.nativeData.token)
            }
            setToken().then(() => {
              window.location.reload()
            })
          } else {
            alertReloadMessage(message)
          }
        })
      } else if (visitType == 'app_v2') {
        // 调用APP的getToken方法处理
        app_v2.getToken().then(res => {
          if (res.token && res.token != '') {
            async function setToken () {
              store.dispatch('setToken', res.token)
            }
            setToken().then(() => {
              window.location.reload()
            })
          } else {
            alertReloadMessage(message)
          }
        })
      } else {
        window.location.reload()
      }
    }
  })
}

function alertMessage (message) {
  Toast.failed(message, 3000, true)
}

export default {
  get (url, params = {}) {
    var data = params || {}
    data.sendTime = new Date().getTime()
    return axios.get(url, {
      params: data
    })
  },
  post (url, params = { data: {}, contentType: '' }) {
    if (params.contentType && params.contentType == 'form') {
      return axios.post(url, qs.stringify(params.data), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })
    } else {
      return axios.post(url, params.data || params)
    }
  },
  getFile (url, params = {}) {
    var data = params || {}
    data.sendTime = new Date().getTime()
    return axios.get(url, {
      responseType: 'blob',
      params: data
    })
  },
  getCache (url, params = {}) {
    var data = params || {}
    return axios.get(url, {
      params: data
    })
  }
}
