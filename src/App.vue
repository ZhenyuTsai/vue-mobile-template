<template>
  <div id="app" :class="!$route.meta.hideTabBar?'tab-bar-eara':''">
    <router-view/>
    <tab-bar v-if="!$route.meta.hideTabBar"></tab-bar>
  </div>
</template>
<script>
import TabBar from './components/TabBar'
export default {
  components: {
    TabBar
  }
}
</script>
<style lang="less" scoped>
.tab-bar-eara{
  margin-bottom: 100px;
}
</style>
