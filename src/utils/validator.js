export default {
  //判断是不是数组
  isArray (param) {
    return Object.prototype.toString.call(param) === '[object Array]'
  },
  //判断是不是数组
  isObject (param) {
    return Object.prototype.toString.call(param) === '[object Object]'
  },
  //判断是不是字符串
  isString (param) {
    return Object.prototype.toString.call(param) === '[object String]'
  },
  //判断是不是数字
  isNumber (param) {
    return Object.prototype.toString.call(param) === '[object Number]'
  },
  //判断是不是布尔
  isBoolean (param) {
    return Object.prototype.toString.call(param) === '[object Boolean]'
  },
  //判断是不是Undefined
  isUndefined (param) {
    return Object.prototype.toString.call(param) === '[object Undefined]'
  },
  //判断是不是Null
  isNull (param) {
    return Object.prototype.toString.call(param) === '[object Null]'
  },
  //判断是不是function
  isFunction (param) {
    return Object.prototype.toString.call(param) === '[object Function]'
  },
  //判断是不是日期类型
  isDate (param) {
    return Object.prototype.toString.call(param) === '[object Date]'
  },
  //判断是不是正则
  isRegExp (param) {
    return Object.prototype.toString.call(param) === '[object RegExp]'
  },
  //判断各种数据类型是不是为空 空对象 空字符串 空数组等等
  isEmpty (param) {
    try {
      //判断是不是null 或者Undefined
      if (this.isNull(param) || this.isUndefined(param)) {
        return false
      }
      //判断数字是不是NAN
      if (this.isNumber(param)) {
        if (isNaN(param)) {
          return false
        } else {
          return true
        }
      }
      //判断是不是布尔 函数 日期 正则 是则返回true
      if (this.isBoolean(param) || this.isFunction(param) || this.isDate(param) || this.isRegExp(param)) {
        return true
      }
      //判断是不是是字符串，去空 长度为o返回false
      if (this.isString(param)) {
        if (param.trim().length == 0) {
          return false
        } else {
          return true
        }
      }
      //判断是否是数组，数组为空返回0
      if (this.isArray(param)) {
        if (param.length == 0) {
          return false
        } else {
          return true
        }
      }
      //判断是否是对象，判断是否是空对象是则返回false
      if (this.isObject(param)) {
        //判断对象属性个数
        if (Object.getOwnPropertyNames(param).length == 0) {
          return false
        } else {
          return true
        }
      }
    } catch (e) {
      console.log(e)
      return false
    }
  },
  /**
 * 
 * @desc   判断是否为邮箱地址
 * @param  {String}  str
 * @return {Boolean} 
 */
  isEmail (str) {
    return /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/.test(str)
  },
  /**
   * 
   * @desc  判断是否为身份证号
   * @param  {String|Number} str 
   * @return {Boolean}
   */
  isIdCard (str) {
    return /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/.test(str)
  },
  /**
  *
  * @desc   判断是否为手机号
  * @param  {String|Number} str
  * @return {Boolean}
  */
  isMobile (str) {
    return /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/.test(str)
  },
  /**
  *
  * @desc   判断是否为身份证号
  * @param  {String|Number} str
  * @return {Boolean}
  */
  isIDNum (idNo) {
    const vcity = {
      11: '北京', 12: '天津', 13: '河北', 14: '山西', 15: '内蒙古',
      21: '辽宁', 22: '吉林', 23: '黑龙江', 31: '上海', 32: '江苏',
      33: '浙江', 34: '安徽', 35: '福建', 36: '江西', 37: '山东', 41: '河南',
      42: '湖北', 43: '湖南', 44: '广东', 45: '广西', 46: '海南', 50: '重庆',
      51: '四川', 52: '贵州', 53: '云南', 54: '西藏', 61: '陕西', 62: '甘肃',
      63: '青海', 64: '宁夏', 65: '新疆', 71: '台湾', 81: '香港', 82: '澳门', 91: '国外'
    }
    //检查号码是否符合规范，包括长度，类型
    const isCardNo = function (card) {
      //身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X
      let reg = /(^\d{17}(\d|X|x)$)/
      if (reg.test(card) === false) {
        return false
      }

      return true
    }
    //取身份证前两位,校验省份
    const checkProvince = function (card) {
      let province = card.substr(0, 2)
      if (vcity[province] == undefined) {
        return false
      }
      return true
    }
    //检查生日是否正确
    const checkBirthday = function (card) {
      let len = card.length
      //身份证15位时，次序为省（3位）市（3位）年（2位）月（2位）日（2位）校验位（3位），皆为数字
      if (len == '15') {
        let re_fifteen = /^(\d{6})(\d{2})(\d{2})(\d{2})(\d{3})$/
        let arr_data = card.match(re_fifteen)
        let year = arr_data[2]
        let month = arr_data[3]
        let day = arr_data[4]
        let birthday = new Date('19' + year + '/' + month + '/' + day)
        return verifyBirthday('19' + year, month, day, birthday)
      }
      //身份证18位时，次序为省（3位）市（3位）年（4位）月（2位）日（2位）校验位（4位），校验位末尾可能为X
      if (len == '18') {
        let re_eighteen = /^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9Xx])$/
        let arr_data = card.match(re_eighteen)
        let year = arr_data[2]
        let month = arr_data[3]
        let day = arr_data[4]
        let birthday = new Date(year + '/' + month + '/' + day)
        return verifyBirthday(year, month, day, birthday)
      }
      return false
    }
    //校验日期
    const verifyBirthday = function (year, month, day, birthday) {
      let now = new Date()
      let now_year = now.getFullYear()
      //年月日是否合理
      if (birthday.getFullYear() == year && (birthday.getMonth() + 1) == month && birthday.getDate() == day) {
        //判断年份的范围（0岁到100岁之间)
        let time = now_year - year
        if (time >= 0 && time <= 100) {
          return true
        }
        return false
      }
      return false
    }
    //校验位的检测
    const checkParity = function (card) {
      //15位转18位
      //card = changeFivteenToEighteen(card)
      let len = card.length
      if (len == '18') {
        let arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2)
        let arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2')
        let arrCh2 = new Array('1', '0', 'x', '9', '8', '7', '6', '5', '4', '3', '2')
        let cardTemp = 0, i, valnum, valnum2
        for (i = 0; i < 17; i++) {
          cardTemp += card.substr(i, 1) * arrInt[i]
        }
        valnum = arrCh[cardTemp % 11]
        valnum2 = arrCh2[cardTemp % 11]
        if (valnum == card.substr(17, 1) || valnum2 == card.substr(17, 1)) {
          return true
        }
        return false
      }
      return false
    }
    //是否为空
    if (idNo === '') {
      return false
    }
    //校验长度，类型
    if (isCardNo(idNo) === false) {
      return false
    }
    //检查省份
    if (checkProvince(idNo) === false) {
      return false
    }
    //校验生日
    if (checkBirthday(idNo) === false) {
      return false
    }
    //检验位的检测
    if (checkParity(idNo) === false) {
      return false
    }

    return true
  }

}