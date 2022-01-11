/**
 * @Version
 * @Author ZhenYuTsai
 * @Descripttion
 * @Date 2022-01-11 12:21:51
 * @LastEditors ZhenYuTsai
 */
import Vue from 'vue'
import TIM from 'tim-js-sdk'
import TIMUploadPlugin from 'tim-upload-plugin'
export default new Vue({
  data () {
    return {
      tim: null
    }
  },
  methods: {
    // 初始化
    init (options) {
      // 接入时需要将0替换为您的即时通信 IM 应用的 SDKAppID
      let params = { SDKAppID: options }
      if (options instanceof Object) {
        params = options
      }
      // 创建 SDK 实例，`TIM.create()`方法对于同一个 `SDKAppID` 只会返回同一份实例
      this.tim = TIM.create(params)

      // 设置 SDK 日志输出级别，详细分级请参见 <a href="https://web.sdk.qcloud.com/im/doc/zh-cn//SDK.html#setLogLevel">setLogLevel 接口的说明</a>
      this.tim.setLogLevel(0) // 普通级别，日志量较多，接入时建议使用
      // tim.setLogLevel(1); // release 级别，SDK 输出关键信息，生产环境时建议使用

      // 注册腾讯云即时通信 IM 上传插件
      this.tim.registerPlugin({ 'tim-upload-plugin': TIMUploadPlugin })
      this.messageEventCallback()
    },
    // 登录
    login ({ userID, userSig }) {
      this.tim.login({ userID, userSig })
    },
    // 登出
    logout () {
      this.tim.logout()
    },
    // 消息事件监听回调
    messageEventCallback () {
      const that = this
      // 监听事件，例如：
      this.tim.on(TIM.EVENT.SDK_READY, function (event) {
        // 收到离线消息和会话列表同步完毕通知，接入侧可以调用 sendMessage 等需要鉴权的接口
        // event.name - TIM.EVENT.SDK_READY
        console.log(event, 'TIM.EVENT.SDK_READY')
      })
      this.tim.on(TIM.EVENT.MESSAGE_RECEIVED, function (event) {
        // 收到推送的单聊、群聊、群提示、群系统通知的新消息，可通过遍历 event.data 获取消息列表数据并渲染到页面
        // event.name - TIM.EVENT.MESSAGE_RECEIVED
        // event.data - 存储 Message 对象的数组 - [Message]
        const MessageList = event.data
        const JoinGroupList = MessageList.filter(item => item.conversationType === TIM.TYPES.GRP_TIP_MBR_JOIN)
        const GroupMessageList = MessageList.filter(item => item.conversationType === TIM.TYPES.CONV_GROUP)
        const C2cMessageList = MessageList.filter(item => item.conversationType === TIM.TYPES.CONV_C2C)
        that.$emit('MESSAGE_JOIN', JoinGroupList)
        that.$emit('MESSAGE_GROUP', GroupMessageList)
        that.$emit('MESSAGE_C2C', C2cMessageList)
      })
    },
    // 发送普通消息模板
    sendDefaultMessage ({ id, text, file }, sendtype = 'group') {
      // 1. 创建消息实例
      const message = this.tim.createTextMessage({
        to: id,
        conversationType: sendtype === 'group' ? TIM.TYPES.CONV_GROUP : TIM.TYPES.CONV_C2C,
        payload: {
          text,
          file
        },
        onProgress: function (event) { console.log('file uploading:', event) }
      })
      // 2. 发送消息
      const promise = this.tim.sendMessage(message)
      promise.then(function (imResponse) {
        // 发送成功
        console.log(imResponse, 'sendDefaultMessage')
      }).catch(function (imError) {
        // 发送失败
        console.warn('sendMessage error:', imError)
      })
    },
    // 发送自定义消息模板
    sendCustomMessage ({ id, data, description, extension }, sendtype = 'group') {
      // 1. 创建消息实例
      const message = this.tim.createCustomMessage({
        to: id,
        conversationType: sendtype === 'group' ? TIM.TYPES.CONV_GROUP : TIM.TYPES.CONV_C2C,
        // 消息优先级，用于群聊（v2.4.2起支持）。如果某个群的消息超过了频率限制，后台会优先下发高优先级的消息，详细请参考 消息优先级与频率控制
        // 支持的枚举值：TIM.TYPES.MSG_PRIORITY_HIGH, TIM.TYPES.MSG_PRIORITY_NORMAL（默认）, TIM.TYPES.MSG_PRIORITY_LOW, TIM.TYPES.MSG_PRIORITY_LOWEST
        // priority: TIM.TYPES.MSG_PRIORITY_HIGH,
        payload: {
          data: data, // 用于标识该消息类型消息
          description: description, // 用于写入内容
          extension: extension
        }
      })
      // 3. 发送消息
      const promise = this.tim.sendMessage(message)
      promise.then(function (imResponse) {
        // 发送成功
        console.log(imResponse)
      }).catch(function (imError) {
        // 发送失败
        console.warn('sendMessage error:', imError)
      })
    },
    // 创建群聊
    createGroup (name) {
      return this.tim.createGroup({
        name,
        type: TIM.TYPES.GRP_AVCHATROOM
      })
    },
    // 解散群聊
    dismissGroup (groupID) {
      this.tim.dismissGroup(groupID)
    },
    // 加入群聊
    joinGroup (groupID) {
      return this.tim.joinGroup({
        groupID,
        type: TIM.TYPES.GRP_AVCHATROOM
      })
    },
    // 更新个人资料
    updateMyProfile (options) {
      return this.tim.updateMyProfile(options)
    },
    // 获取我的个人资料
    getMyProfile () {
      return this.tim.getMyProfile()
    },
    // 获取其他用户资料
    getUserProfile (userID) {
      let userIDList = [userID]
      if (userID instanceof Array) {
        userIDList = userID
      }
      return this.tim.getUserProfile({ userIDList })
    },
    // 获取群成员列表
    getGroupMemberList (groupID) {
      return this.tim.getGroupMemberList({
        groupID,
        count: 100
      })
    },
    // 获取群成员资料
    getGroupMemberProfile (groupID, userIDList) {
      return this.tim.getGroupMemberProfile({ groupID, userIDList })
    },
    // 获取群在线人数，此接口只用于查询直播群在线人数
    getGroupOnlineMemberCount (groupID) {
      return this.tim.getGroupOnlineMemberCount(groupID)
    }
  }
})
