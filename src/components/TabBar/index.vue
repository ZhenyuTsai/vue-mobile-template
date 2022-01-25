<template>
  <van-tabbar class="tab-bar" route>
    <van-tabbar-item :to="{name:'Home'}" icon="home-o">首页</van-tabbar-item>
    <van-tabbar-item :to="{name:'About'}" icon="search">搜索</van-tabbar-item>
    <van-tabbar-item :to="{name:'Error'}" icon="setting-o">设置</van-tabbar-item>
  </van-tabbar>
</template>

<script>
import { Tabbar, TabbarItem, Icon } from 'vant'

export default {
  components: {
    [Icon.name]: Icon,
    [Tabbar.name]: Tabbar,
    [TabbarItem.name]: TabbarItem
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
