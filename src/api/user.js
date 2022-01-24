/**
 * @Version
 * @Author ZhenYuTsai
 * @Descripttion
 * @Date 2022-01-24 17:51:31
 * @LastEditors ZhenYuTsai
 */
import http from '../utils/request'
const URL = process.env.VUE_APP_BASE_RESTFUL
export default {
  checkToken (params) {
    return http.get(URL + '/public/checkToken', params)
  },
  getDemoToken (params) {
    return http.get(URL + '/demoLogin', params)
  }
}
