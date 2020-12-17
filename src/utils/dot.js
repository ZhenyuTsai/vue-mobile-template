/* eslint-disable */
import store from '@/store'

let _APPID = ''
let _URL = ''
let _TOKEN = ''
let _THIRDTOKEN = ''
let _threadTimer = null
let _ALL_MONITOR = true
let _toPath
let _fromPath
let currentPageRule = {}

const _ajax = function ( options ) {
  var params = {
    url : '' ,
    type : 'get' ,
    data : {} ,
    success : function ( data ) {
    } ,
    error : function ( err ) {
    } ,
  }
  
  options = Object.assign ( params , options )
  
  if ( options.url ) {
    var xhr = XMLHttpRequest ? new XMLHttpRequest () : new ActiveXObject ( 'Microsoft.XMLHTTP' )
    var url = options.url ,
      type = options.type.toUpperCase () ,
      data = options.data ,
      dataArr = []
    //需要加随机数
    for ( let key in data ) {
      let value = key + '=' + data[ key ]
      dataArr.push ( value )
    }
    
    xhr.addEventListener ( "load" , function ( e ) {
      //console.log('load...'+e.target.responseText)
      var resObj = null
      try {
        resObj = JSON.parse ( e.target.responseText )
        options.success ( resObj )
      } catch ( e ) {
        resObj = null
        console.log ( 'catch...' )
      }
      
    } , false )
    
    xhr.addEventListener ( "error" , function ( e ) {
      console.log ( 'error...' )
      console.log ( e )
    } , false )
    
    xhr.addEventListener ( "abort" , function () {
      console.log ( 'abort...' )
    } , false )
    
    if ( type === 'GET' ) {
      url = url + '?' + dataArr.join ( '&' )
      xhr.open ( type , url , true )
      xhr.send ()
    }
    
    if ( type === 'POST' ) {
      xhr.open ( type , url , true )
      xhr.setRequestHeader ( 'Content-type' , 'application/jsoncharset=UTF-8' )
      xhr.send ( params.data ? JSON.stringify ( params.data ) : {} )
    }
  }
}

const _api = {
  collect ( {
              appid ,
              pageCode , //页面标识  没有走默认
              pageName , //页面名称 没有走默认
              actionCode , //页面动标示code
              actionType , //动作类型
              currentUrl , //当前访问链接
              fromUrl , //来源链接
              timestamp , //上传时间戳 Trigger 元素 进入，出去
              eventType , //上报事件类型  进入，离开（页面级别）点击，获取（动作级别）
              elementTag , //上报元素tagName
              elementValue , //上报事件触发的元素  页面级别：title）非页面级别为 元素内容
              elementContent , //上报元素内容
              businessData //上报业务数据
            } ) {
    return new Promise ( ( resolve ) => {
      _ajax ( {
        url : _URL + '/analysis/collect' ,
        type : 'post' ,
        data : {
          appid : appid || _APPID , //系统id 系统标示id
          token : _TOKEN ,
          thirdToken : _THIRDTOKEN ,
          pageCode : pageCode , //页面标识  没有走默认
          pageName : pageName , //页面名称 没有走默认
          actionCode , //页面动标示code
          actionType , //动作类型
          currentUrl : currentUrl , //当前访问链接
          fromUrl : fromUrl , //来源链接
          timestamp , //上传时间戳 Trigger 元素 进入，出去
          eventType , //上报事件类型  进入，离开（页面级别）点击，获取（动作级别）
          elementValue , //上报事件触发的元素  页面级别：title）非页面级别为 元素内容
          elementTag , //上报元素tagName
          elementContent , //上报元素内容
          businessData
        } ,
        success : resolve ,
        error : resolve ,
      } )
    } )
  }
}

//分析组装节点
const _analysisNode = function ( path = [] , target ) {
  let tagName = _ElementUtil.getValidTagName ( target.tagName )
  let _an = []
  Array.prototype.map.call ( path , ( item ) => {
    const _node_attr = _getNodeAttr ( item )
    if ( currentPageRule && currentPageRule.actionRules && currentPageRule.actionRules.length > 0 ) {
      for ( let i = 0 ; i < currentPageRule.actionRules.length ; i++ ) {
        const ar = currentPageRule.actionRules[ i ]
        if ( ar.rule && Object.keys ( ar.rule ).length > 0 && ar.rule.type && ar.rule.type.toLocaleLowerCase () == "id" ) {
          if ( new RegExp ( ar.rule.value ).test ( _node_attr[ "id" ] ) ) {
            _an.push ( { node : item , actionRule : ar } )
          }
        } else if ( ar.rule && Object.keys ( ar.rule ).length > 0 && ar.rule.type && ar.rule.type.toLocaleLowerCase () == "class" ) {
          if ( _hasClass ( _node_attr[ "class" ] , ar.rule.value ) ) {
            _an.push ( { node : item , actionRule : ar } )
          }
        } else {
          let classMatch = currentPageRule.classMatch
          if ( new RegExp ( classMatch ).test ( _node_attr[ "class" ] ) ) {
            _an.push ( { node : item } )
          }
        }
      }
    } else {
      let classMatch = currentPageRule.classMatch
      if ( new RegExp ( classMatch ).test ( _node_attr[ "class" ] ) ) {
        _an.push ( { node : item } )
      }
    }
    return null
  } )
  
  if ( !( _an.length > 0 && _an.find ( n => {
    if ( n ) return n
  } ) ) && !_ALL_MONITOR ) {
    return null
  }
  let params = {
    actionCode : '' ,
    actionName : '' ,
    elementValue : '' ,
    elementContent : ''
  }
  let _anItem = _an.find ( n => {
    if ( n && n.actionRule ) return n
  } )
  if ( _anItem ) {
    params.actionCode = _anItem.actionRule.code
    params.actionName = _anItem.actionRule.actionName
  }
  
  params.elementValue = new XMLSerializer ().serializeToString ( target )
  
  if ( tagName === 'input' || tagName === 'textarea' || tagName === 'select' ) {
    var value = target.value
    if ( target.type !== 'radio' && target.type !== 'checkbox' && value ) {
      params.elementContent = value
    } else if ( target.checked ) {
      params.elementContent = target.checked
    }
  }
  if ( tagName === 'canvas' ) {
    params.elementContent = target.toDataURL ()
  }
  if ( tagName === 'audio' || tagName === 'video' ) {
    params.elementContent = target.paused ? 'paused' : 'played'
  }
  return params
}

const _getNodeAttr = function ( n ) {
  var _node_attr = {}
  if ( Object.prototype.toString.call ( n ) != "[object HTMLBodyElement]" && Object.prototype.toString.call ( n ) != "[object HTMLDocument]" && Object.prototype.toString.call ( n ) != "[object Window]" ) {
    for ( var _i = 0 , _a = Array.from ( n.attributes ) ; _i < _a.length ; _i++ ) {
      var _b = _a[ _i ] , name = _b.name , value = _b.value
      _node_attr[ name ] = _ElementUtil.transformAttribute ( document , name , value )
    }
  }
  console.log ( _node_attr )
  return _node_attr
}

const _Queue = function () {
  let timer = null
  let _taskList = []
  this.push = function ( task ) {
    if ( Object.prototype.toString.call ( task ) === '[object Array]' ) {
      for ( const item of task ) {
        if ( Object.prototype.toString.call ( item ) === '[object Object]' ) {
          if ( item.hasOwnProperty ( 'callFunc' ) && Object.prototype.toString.call ( item[ 'callFunc' ] ) === '[object Function]' ) {
            _taskList.push ( item )
          }
        }
      }
    } else if ( Object.prototype.toString.call ( task ) === '[object Object]' ) {
      if ( task.hasOwnProperty ( 'callFunc' ) && Object.prototype.toString.call ( task[ 'callFunc' ] ) === '[object Function]' ) {
        _taskList.push ( task )
      }
    }
    
    if ( _taskList.length > 0 && !timer ) {//任务列表长度大于0并且没有定时器
      timer = setInterval ( () => {
        if ( _taskList.length <= 0 ) {//任务列表长度为0 清除计时器
          clearInterval ( timer )
          return timer = null
        }
        let task = _taskList.shift ()
        task.callFunc ( task.args )
      } , 0 )
    }
  }
}

const _ElementUtil = {
  syAndNumrRegex : RegExp ( '[^a-z1-6-]' ) ,
  URL_IN_CSS_REF : /url\((?:'([^']*)'|"([^"]*)"|([^)]*))\)/gm ,
  RELATIVE_PATH : /^(?!www\.|(?:http|ftp)s?:\/\/|[A-Za-z]:\\|\/\/).*/ ,
  DATA_URI : /^(data:)([\w\/\+\-]+);(charset=[\w-]+|base64).*,(.*)/i ,
  
  getValidTagName : function ( tagName ) {
    var processedTagName = tagName.toLowerCase ().trim ()
    if ( _ElementUtil.syAndNumrRegex.test ( processedTagName ) ) {
      return 'div'
    }
    return processedTagName
  } ,
  
  getUrlParam : function ( url , name ) {
    var paramIndex = url.indexOf ( '?' )
    var paramsUrl = paramIndex === -1 ? '' : url.slice ( paramIndex )
    if ( null !== paramsUrl && '' !== paramsUrl ) {
      if ( name ) {
        var reg = new RegExp ( "(^|&)" + name + "=([^&]*)(&|$)" )
        var r = paramsUrl.substr ( 1 ).match ( reg )
        if ( r !== null ) {
          return decodeURI ( r[ 2 ] )
        }
      } else {
        var theRequest = {}
        var strs = paramsUrl.split ( "&" )
        for ( var i = 0 ; i < strs.length ; i++ ) {
          theRequest[ strs[ i ].split ( "=" )[ 0 ] ] = ( strs[ i ].split ( "=" )[ 1 ] )
        }
        return theRequest
      }
    }
    return null
  } ,
  
  absoluteToStylesheet : function ( cssText , href ) {
    return ( cssText || '' ).replace ( _ElementUtil.URL_IN_CSS_REF , function ( origin , path1 , path2 , path3 ) {
      var filePath = path1 || path2 || path3
      if ( !filePath ) {
        return origin
      }
      if ( !_ElementUtil.RELATIVE_PATH.test ( filePath ) ) {
        return "url('" + filePath + "')"
      }
      if ( _ElementUtil.DATA_URI.test ( filePath ) ) {
        return "url(" + filePath + ")"
      }
      if ( filePath[ 0 ] === '/' ) {
        return "url('" + ( extractOrigin ( href ) + filePath ) + "')"
      }
      var stack = href.split ( '/' )
      var parts = filePath.split ( '/' )
      stack.pop ()
      for ( var _i = 0 , parts_1 = parts ; _i < parts_1.length ; _i++ ) {
        var part = parts_1[ _i ]
        if ( part === '.' ) {
          continue
        }
        else if ( part === '..' ) {
          stack.pop ()
        }
        else {
          stack.push ( part )
        }
      }
      return "url('" + stack.join ( '/' ) + "')"
    } )
  } ,
  
  getAbsoluteSrcsetString : function ( doc , attributeValue ) {
    if ( attributeValue.trim () === '' ) {
      return attributeValue
    }
    var srcsetValues = attributeValue.split ( ',' )
    var resultingSrcsetString = srcsetValues
      .map ( function ( srcItem ) {
        var trimmedSrcItem = srcItem.trimLeft ().trimRight ()
        var urlAndSize = trimmedSrcItem.split ( ' ' )
        if ( urlAndSize.length === 2 ) {
          var absUrl = absoluteToDoc ( doc , urlAndSize[ 0 ] )
          return absUrl + " " + urlAndSize[ 1 ]
        }
        else if ( urlAndSize.length === 1 ) {
          var absUrl = absoluteToDoc ( doc , urlAndSize[ 0 ] )
          return "" + absUrl
        }
        return ''
      } )
      .join ( ',' )
    return resultingSrcsetString
  } ,
  absoluteToDoc : function ( doc , attributeValue ) {
    if ( !attributeValue || attributeValue.trim () === '' ) {
      return attributeValue
    }
    var a = doc.createElement ( 'a' )
    a.href = attributeValue
    return a.href
  } ,
  isSVGElement : function ( el ) {
    return el.tagName === 'svg' || el instanceof SVGElement
  } ,
  
  transformAttribute : function ( doc , name , value ) {
    if ( name === 'src' || ( name === 'href' && value ) ) {
      return _ElementUtil.absoluteToDoc ( doc , value )
    }
    else if ( name === 'srcset' && value ) {
      return _ElementUtil.getAbsoluteSrcsetString ( doc , value )
    }
    else if ( name === 'style' && value ) {
      return _ElementUtil.absoluteToStylesheet ( value , location.href )
    }
    else {
      return value
    }
  }
  
}

const _EventUtil = {
  addHandler : function ( element , type , handler ) {
    if ( element.addEventListener ) {
      element.addEventListener ( type , handler , { capture : true } )
    } else if ( element.attachEvent ) {
      element.attachEvent ( "on" + type , handler )
    } else {
      element[ "on" + type ] = handler
    }
  } ,
  // 移除事件
  removeEvent : function ( element , type , handler ) {
    if ( element.removeEventListener ) {
      element.removeEventListener ( type , handler , false )
    } else if ( element.datachEvent ) {
      element.detachEvent ( 'on' + type , handler )
    } else {
      element[ 'on' + type ] = null
    }
  } ,
  // 获取事件目标
  getTarget : function ( event ) {
    return event.target || event.srcElement
  } ,
  // 获取event对象的引用，取到事件的所有信息，确保随时能使用event；
  getEvent : function ( e ) {
    var ev = e || window.event
    if ( !ev ) {
      var c = this.getEvent.caller
      while ( c ) {
        ev = c.arguments[ 0 ]
        if ( ev && Event == ev.constructor ) {
          break
        }
        c = c.caller
      }
    }
    return ev
  }
}

function _hasClass ( classNames , className ) {
  if ( !classNames ) return
  return classNames.split ( " " ).some ( n => {
    return new RegExp ( className ).test ( n )
  } )
}

//自定义上报
const dispatch = function ( data ) {
  console.log ( 'dispatch start' )
  let params = {
    pageCode : currentPageRule.code , //页面标识  没有走默认
    pageName : currentPageRule.name , //页面名称 没有走默认
    currentUrl : _toPath , //当前访问链接
    fromUrl : _fromPath , //来源链接
    timestamp : new Date ().getTime () , //上传时间戳 Trigger 元素 进入，出去
    eventType : 'data' , //上报事件类型  进入，离开（页面级别）点击，获取（动作级别）
    businessData : null
  }
  //放入上报  直接发送
  _api.collect ( params )
}

const _queue = new _Queue ()

let _beforeCollectCallBack

let _afterCollectCallBack

let beforeCollect = function ( callBack = () => {
} ) {
  _beforeCollectCallBack = callBack
}

let afterCollect = function ( callBack = () => {
} ) {
  _afterCollectCallBack = callBack
}
const _pageHandler = function ( e , eventType ) {
  let n = e.target
  let tagName = _ElementUtil.getValidTagName ( n.tagName )
  let an = _analysisNode ( e.path , e.target )
  if ( !an ) return
  let params = {
    pageCode : currentPageRule.code , //页面标识  没有走默认
    pageName : currentPageRule.name , //页面名称 没有走默认
    actionCode : an.actionCode , //页面动标示code
    actionName : an.actionName ,
    actionType : '0' , //非js调用
    currentUrl : _toPath , //当前访问链接
    fromUrl : _fromPath , //来源链接
    timestamp : new Date ().getTime () , //上传时间戳 Trigger 元素 进入，出去
    eventType : eventType , // 进入页面，离开页面   停留时间
    elementValue : an.elementValue , //上报事件触发的元素  页面级别：title）非页面级别为 元素内容   根据不通获取值不通
    elementTag : tagName ,
    elementContent : an.elementContent ,
    businessData : null
  }
  
  let setData = function ( obj = {} ) {
    let keys = Object.keys ( obj )
    if ( keys.length <= 0 ) return
    for ( const key in obj ) {
      if ( obj.hasOwnProperty ( key ) ) {
        params[ key ] = obj[ key ]
      }
    }
  }
  //配置到  页面  级别
  if ( Object.prototype.toString.call ( _beforeCollectCallBack ) === '[object Function]' ) {
    _beforeCollectCallBack ( e , setData )
  }
  
  if ( $_dot_push_before_fun.length > 0 ) {
    $_dot_push_before_fun.forEach ( ( e ) => {
      e.do ( $_dot_path_this , params )
    } )
  }
  
  _queue.push ( { callFunc : _api.collect , args : params } )
  
  if ( Object.prototype.toString.call ( _afterCollectCallBack ) === '[object Function]' ) {
    _afterCollectCallBack ( e )
  }
}
const _clickHandler = function ( e ) {
  _pageHandler ( e , 'click' )
}
const _blurHandler = function ( e ) {
  _pageHandler ( e , 'blur' )
}
const _errorHandler = function ( e ) {
  console.log ( 'errorPageHandler...' );
  console.log ( e );
}

// todo
//1.进入页面 事件，离开页面事件
//2.回调事件  配置级别
//3.失去焦点添加测试
//4.异常处理

//5.添加  token。thirdtoken 等
//6.参数配置到dev 环境
//7.初始化事件方式，和绑定优化
let $_dot_path_this = null
let $_dot_push_before_fun = []
const init = function ( appid , url ) {
  console.log ( "初始化" )
  _APPID = appid
  _URL = url
  Vue.mixin ( {
    beforeRouteEnter ( to , from , next ) {
      //进入路由
      console.log ( '进入路由' )
      //获取token、thirdToken
      _TOKEN = store.getters.getToken
      _THIRDTOKEN = store.getters.getThirdToken
      //刷新上报前置钩子和后置钩子
      _beforeCollectCallBack = null
      _afterCollectCallBack = null
      $_dot_push_before_fun = []
      
      if ( to.meta && to.meta.dot && to.meta.dot.pushBefore && to.meta.dot.pushBefore.length > 0 ) {
        to.meta.dot.pushBefore.forEach ( ( e ) => {
          $_dot_push_before_fun.push ( require ( '@/dot/' + e ).default )
        } )
      }
      console.log ( $_dot_push_before_fun )
      
      clearTimeout ( _threadTimer )
      if ( !( to.meta && to.meta.dot ) ) return next ()
      _threadTimer = setTimeout ( () => {
        //获取埋点配置
        currentPageRule = to.meta.dot
        _toPath = to.path
        _fromPath = from.path
        _ALL_MONITOR = currentPageRule.allMonitor
        //进入页面事件上报
        let params = {
          pageCode : currentPageRule.code , //页面标识  没有走默认
          pageName : currentPageRule.name , //页面名称 没有走默认
          currentUrl : _toPath , //当前访问链接
          fromUrl : _fromPath , //来源链接
          timestamp : new Date ().getTime () , //上传时间戳 Trigger 元素 进入，出去
          eventType : 'load' , //上报事件类型  进入，离开（页面级别）点击，获取（动作级别）
          businessData : null
        }
        _queue.push ( { callFunc : _api.collect , args : params } )
        
        // 注册事件监听
        next ( vm => {
          $_dot_path_this = vm
          _EventUtil.addHandler ( document , 'click' , _clickHandler )
          _EventUtil.addHandler ( document , 'blur' , _blurHandler )
          _EventUtil.addHandler ( window , "error" , _errorHandler )
          if ( currentPageRule.browseTime ) {
            setTimeout ( () => {
              //浏览时间上报
              let params = {
                pageCode : currentPageRule.code , //页面标识  没有走默认
                pageName : currentPageRule.name , //页面名称 没有走默认
                currentUrl : _toPath , //当前访问链接
                fromUrl : _fromPath , //来源链接
                timestamp : new Date ().getTime () , //上传时间戳 Trigger 元素 进入，出去
                eventType : 'browse' , //上报事件类型  进入，离开（页面级别）点击，获取（动作级别）
                businessData : null
              }
              _queue.push ( { callFunc : _api.collect , args : params } )
            } , currentPageRule.browseTime * 1000 )
          }
        } )
      } , 0 )
    } ,
    beforeRouteLeave ( to , from , next ) {
      //离开路由
      console.log ( '离开路由' )
      let params = {
        pageCode : currentPageRule.code , //页面标识  没有走默认
        pageName : currentPageRule.name , //页面名称 没有走默认
        currentUrl : _toPath , //当前访问链接
        fromUrl : _fromPath , //来源链接
        timestamp : new Date ().getTime () , //上传时间戳 Trigger 元素 进入，出去
        eventType : 'unload' , //上报事件类型  进入，离开（页面级别）点击，获取（动作级别）
        businessData : null
      }
      _queue.push ( { callFunc : _api.collect , args : params } )
      //卸载监听
      _EventUtil.removeEvent ( document , 'click' , _clickHandler )
      _EventUtil.removeEvent ( document , 'blur' , _blurHandler )
      _EventUtil.removeEvent ( window , "error" , _errorHandler )
      next ()
    }
  } )
}

export default { init , dispatch , beforeCollect , afterCollect }
