<template>
  <section>
    <div class="userId">
      <input type="text" v-model="userID">
      <button @click="init">初始化</button>
    </div>
    <div class="groupName">
      <button @click="createGroup">创建群聊</button>
    </div>
    <div class="group">
      <input type="text" v-model="groupID">
      <button @click="joinGroup">加入群聊</button>
    </div>
    <div class="sendMessage">
      <input type="text" v-model="text">
      <button @click="sendMessage">发送默认消息</button>
      <button @click="sendMessage1v1('flag')">发送1v1消息</button>
      <button @click="sendCustomMessage">发送自定义消息</button>
    </div>

  </section>
</template>

<script>
import ImClient from '../utils/im-client'
import { genTestUserSig } from '../utils/GenerateTestUserSig'

export default {
  data () {
    return {
      text: '',
      userID: '20220111',
      appId: '1400604513',
      groupID: ''
    }
  },
  mounted () {

  },
  methods: {
    init () {
      const info = genTestUserSig(this.userID)
      ImClient.init(info.SDKAppID)
      ImClient.login({ userID: this.userID, userSig: info.userSig })
    },
    async createGroup () {
      const res = await ImClient.createGroup('test')
      if (res.code === 0) {
        this.groupID = res.data.group.groupID
      }
    },
    sendMessage () {
      ImClient.sendDefaultMessage({ id: this.groupID, text: this.text })
    },
    sendCustomMessage () {
      ImClient.sendCustomMessage({ id: this.groupID, data: this.text, type: 'guangbo' })
    },
    sendMessage1v1 () {
      ImClient.sendDefaultMessage({ id: this.userID, text: this.text }, '1v1')
    },
    async joinGroup () {
      const res = await ImClient.joinGroup(this.groupID)
      console.log(res, 'joinGroup')
    }
  }
}
</script>

<style>

</style>
