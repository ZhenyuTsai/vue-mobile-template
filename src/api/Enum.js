/**
 * @Version
 * @Author ZhenYuTsai
 * @Descripttion
 * @Date 2022-01-24 17:51:21
 * @LastEditors ZhenYuTsai
 */
import http from '../utils/request'
const URL = process.env.VUE_APP_BASE_RESTFUL
export default {
  getArea (params) {
    return http.get(URL + '/data/area.json', params)
  }
}
