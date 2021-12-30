<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/>
    <van-button type="primary">主要按钮</van-button>
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
  }
}
</script>
<style lang="less" scoped>
.box{
  font-size: 40px;
}
</style>
