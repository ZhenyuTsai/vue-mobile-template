/**
 * @Version
 * @Author ZhenYuTsai
 * @Descripttion
 * @Date 2022-01-11 11:30:01
 * @LastEditors ZhenYuTsai
 */
import moment from 'moment'
export default (Vue) => {
  Vue.filter('formatDate', (val) => {
    return moment(val).format('YYYY-MM-DD')
  })
  Vue.filter('formatDateTime', (val) => {
    return moment(val).format('YYYY-MM-DD HH:mm:ss')
  })
}
