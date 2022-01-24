<template>
  <section class="tab-bar">
    <van-icon name="wap-home-o" @click="$router.push('/')" :color="$route.path==='/'?'#1989fa':'inherit'"/>
    <van-icon name="apps-o" @click="$router.push('/about')" :color="$route.path==='/about'?'#1989fa':'inherit'" />
    <van-icon name="user-o" @click="$router.push('/test')" :color="$route.path==='/test'?'#1989fa':'inherit'" />
  </section>
</template>

<script>
import { Icon } from 'vant'
export default {
  components: {
    [Icon.name]: Icon
  }
}
</script>

.<style lang="less" scoped>
.tab-bar{
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 10;
  height: 80px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  background-color: #fff;
  border-top: 1px solid #e7e7e7;
  border-bottom: 1px solid #f8f8f8;
}
</style>
