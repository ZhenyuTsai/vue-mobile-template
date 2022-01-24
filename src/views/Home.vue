<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/>
    <van-button type="primary" @click="closeLoading">主要按钮</van-button>
    <van-button type="info">信息按钮</van-button>
    <div class="box">45545454545454</div>
  </div>
</template>
<script>
// @ is an alias to /src
import { Button } from 'vant'
import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'Home',
  components: {
    HelloWorld,
    [Button.name]: Button
  },
  created () {
    // 打开全局遮罩
    this.openLoading()
  },
  mounted () {
    // 关闭全局遮罩
    const timer = setTimeout(() => {
      this.closeLoading()
      clearTimeout(timer)
    }, 1000)
  }
}
</script>
<style lang="less" scoped>
.box{
  font-size: 40px;
}
</style>
