import validator from '@/utils/validator'
import store from '@/store'
import $wx from '@/utils/weixin'
export default {
  getUserAgentType () {
    let ua = navigator.userAgent.toLowerCase()
    let isMiniprogram = store.getters.getAliminiFlag
    console.log(navigator.userAgent)
    if (ua.indexOf('app_ios') != -1) {
      if (ua.indexOf('ghapp_ios_v2') != -1) {
        return 'ios_v2'
      } else {
        return 'ios'
      }
    } else if (ua.indexOf('app_android') != -1) {
      if (ua.indexOf('ghapp_android_v2') != -1) {
        return 'android_v2'
      } else {
        return 'android'
      }
    } else if (ua.match(/MicroMessenger/i) == 'micromessenger') {
      if (ua.indexOf('wxwork') != -1) {
        return 'wxwork'
      } else {
        return 'wx'
      }
    } else if (ua.match(/AlipayClient/i) == 'alipayclient') {
      return isMiniprogram ? 'alimini' : 'alipay'
    } else {
      return 'page'
    }
  },
  // isMiniprogram () {
  //   return new Promise((res) => {
  //     if (navigator.userAgent.indexOf('AlipayClient') > -1) {
  //       window.my.getEnv(function (content) {
  //         console.log('content.miniprogram' + content.miniprogram) // true
  //         res(content.miniprogram)
  //       })
  //     } else {
  //       res(true)
  //     }
  //     if (navigator.userAgent.indexOf('micromessenger') > -1) {
  //       wx.miniProgram.getEnv(function (content) {
  //         console.log(content.miniprogram) // true
  //         res(content.miniprogram)
  //       })
  //     } else {
  //       res(false)
  //     }
  //   })
  // },
  getDomain () {
    return window.location.host
  },
  getUrlCode () { // 截取url中的code方法
    var url = window.location.search
    this.winUrl = url
    var theRequest = new Object()
    if (url.indexOf('?') != -1) {
      var str = url.substr(1)
      var strs = str.split('&')
      for (var i = 0; i < strs.length; i++) {
        theRequest[strs[i].split('=')[0]] = (strs[i].split('=')[1])
      }
    }
    return theRequest
  },
  formatDate (date, fmt) {
    /**
     * date:需要格式化的日期Date()类型
     * fmt：日期格式 yyyy-MM-dd
     * @param  {[Date,str]} y [description]
     * @return {[type]}   [description]
     */
    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
    }
    let o = {
      'M+': date.getMonth() + 1,
      'd+': date.getDate(),
      'h+': date.getHours(),
      'm+': date.getMinutes(),
      's+': date.getSeconds()
    }
    for (let k in o) {
      if (new RegExp(`(${k})`).test(fmt)) {
        let str = o[k] + ''
        fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? str : ('00' + str).substr(str.length))
      }
    }
    return fmt
  },
  formatNumber (number, decimals, dec_point, thousands_sep) {
    /*
     * 参数说明：
     * number：要格式化的数字
     * decimals：保留几位小数
     * dec_point：小数点符号
     * thousands_sep：千分位符号
     * */
    number = (number + '').replace(/[^0-9+-Ee.]/g, '')
    let n = !isFinite(+number) ? 0 : +number,
      prec = !isFinite(+decimals) ? 2 : Math.abs(decimals),
      sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
      dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
      s = '',
      toFixedFix = function (n, prec) {
        let k = Math.pow(10, prec)
        return '' + Math.ceil(n * k) / k
      }

    s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.')
    let re = /(-?\d+)(\d{3})/
    while (re.test(s[0])) {
      s[0] = s[0].replace(re, '$1' + sep + '$2')
    }

    if ((s[1] || '').length < prec) {
      s[1] = s[1] || ''
      s[1] += new Array(prec - s[1].length + 1).join('0')
    }
    return s.join(dec)
  },
  getAgeByBirthday (strBirthday) {
    /**
     *参数strBirthday已经是正确格式的2017-12-12这样的日期字符串  
     */
    let returnAge = null
    let strBirthdayArr = strBirthday.split('-')
    let birthYear = strBirthdayArr[0]
    let birthMonth = strBirthdayArr[1]
    let birthDay = strBirthdayArr[2]

    let d = new Date()
    let nowYear = d.getFullYear()
    let nowMonth = d.getMonth() + 1
    let nowDay = d.getDate()

    if (nowYear == birthYear) {
      returnAge = 0 //同年 则为0岁
    } else {
      let ageDiff = nowYear - birthYear //年之差
      if (ageDiff > 0) {
        if (nowMonth == birthMonth) {
          let dayDiff = nowDay - birthDay //日之差
          if (dayDiff < 0) {
            returnAge = ageDiff - 1
          } else {
            returnAge = ageDiff
          }
        } else {
          let monthDiff = nowMonth - birthMonth //月之差
          if (monthDiff < 0) {
            returnAge = ageDiff - 1
          } else {
            returnAge = ageDiff
          }
        }
      } else {
        returnAge = -1 //返回-1 表示出生日期输入错误 晚于今天
      }
    }
    return returnAge //返回周岁年龄
  },
  /**
   * @param idCard
   */
  getBirthdayByIdNo (idCard) {
    let birthday = ''
    if (idCard != null && idCard != '') {
      if (idCard.length == 15) {
        birthday = '19' + idCard.slice(6, 12)
      } else if (idCard.length == 18) {
        birthday = idCard.slice(6, 14)
      }
      birthday = birthday.replace(/(.{4})(.{2})/, '$1-$2-')
      //通过正则表达式来指定输出格式为:1990-01-01
    }
    return birthday
  },
  /**
   * @param idCard
   * '0' 男
   * '1' 女
   */
  getSexByBirthday (idCard) {
    let sexStr = ''
    if (parseInt(idCard.slice(-2, -1)) % 2 == 1) {
      sexStr = '0'
    } else {
      sexStr = '1'
    }
    return sexStr
  },
  setSeesionStore (key, value) {
    let system = store.getters.getSystem
    let type = store.getters.getType
    window.sessionStorage.setItem(system + '_' + type + '_redirect_' + key, JSON.stringify(value))
  },
  getSessionStore (key) {
    let system = store.getters.getSystem
    let type = store.getters.getType
    let sessionStoreObj = window.sessionStorage.getItem(system + '_' + type + '_redirect_' + key)
    return validator.isEmpty(sessionStoreObj) ? JSON.parse(sessionStoreObj) : null
  },
  removeSeesionStore (key) {
    let system = store.getters.getSystem
    let type = store.getters.getType
    window.sessionStorage.removeItem(system + '_' + type + '_redirect_' + key)
  },
  setLocalStore (key, value) {
    let system = store.getters.getSystem
    let type = store.getters.getType
    window.localStorage.setItem(system + '_' + type + '_local_' + key, JSON.stringify(value))
  },
  getLocalStore (key) {
    let system = store.getters.getSystem
    let type = store.getters.getType
    let localStoreObj = window.localStorage.getItem(system + '_' + type + '_local_' + key)
    return validator.isEmpty(localStoreObj) ? JSON.parse(localStoreObj) : null
  },
  removeLocalStore (key) {
    let system = store.getters.getSystem
    let type = store.getters.getType
    window.localStorage.removeItem(system + '_' + type + '_local_' + key)
  },
  // 全局遮罩方法
  openGlobalMask () {
    // 打开遮罩
    store.commit('GLOBALMASK_OPEN')
  },
  closeGlobalMask () {
    // 关闭遮罩
    store.commit('GLOBALMASK_CLOSE')
  },
  // 加载遮罩方法
  openGlobalLoding () {
    // 打开遮罩
    store.commit('GLOBALLODING_OPEN')
  },
  closeGlobalLoding () {
    // 关闭遮罩
    store.commit('GLOBALLODING_CLOSE')
  },
  // 设置title
  setTitle (title) {
    /* eslint-disable */
    Vue.nextTick(function () {
      // DOM 更新了
      window.document.title = title || '国华人寿'
      store.commit('SET_TITLE', { title })
    })
  },

  /**
   * 根据年龄和年龄单位计算日期 年龄单位默认岁 年龄默认0
   * @param {*} age 年龄
   * @param {*} ageFlag 年龄单位  目前只支持岁和天 根据后期需要可添加
   */
  getBirthdayByAge (age = 0, ageFlag = 'A') {
    let d = new Date()
    if (validator.isEmpty(age)) {
      switch (ageFlag) {
        case 'A': //岁
          d.setFullYear(d.getFullYear() - (age - 0))
          break
        case 'D': //天
          d.setDate(d.getDate() - (age - 0))
          break
      }
    }
    return d
  },
  getAgeDayByBirthday (birthday) {
    if (validator.isEmpty(birthday)) {
      return parseInt(
        (new Date().getTime() - new Date(birthday).setHours(0)) / 1000 / 3600 / 24
      )
    } else {
      return 0
    }
  },
  /**
    * 微信通用分享方法
    * @param {} shareInfos
    * @param {*} comid
    */
  wxShare (shareInfos, comid, shareUrl) {
    shareUrl = shareUrl || window.location.href
    if (shareUrl.indexOf('?code=') != -1 || shareUrl.indexOf('&code=') != -1) {
      shareUrl = shareUrl.substring(0, shareUrl.indexOf(shareUrl.indexOf('?code=') != -1 ? '?code=' : '&code='))
      console.log('HR-Share 分享连接中存在CODE-已使用规则移除-移除结果->', shareUrl)
    }
    let params = {
      title: shareInfos[0].title,
      desc: shareInfos[0].desc,
      link: shareInfos[0].shareUrl || shareUrl,
      imgUrl: shareInfos[0].imgUrl
    }
    if (validator.isEmpty(comid)) {
      for (let i = 0; i < shareInfos.length; i++) {
        let share = shareInfos[i]
        if (share.channel == comid) {
          params.title = share.title
          params.desc = share.desc
          params.link = share.shareUrl || shareUrl
          params.imgUrl = share.imgUrl
          break
        }
      }
    }
    $wx.share(params)
  },
}
export {
  validator
}