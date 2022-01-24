<template>
  <div id="app">
    <router-view/>
    <tab-bar></tab-bar>
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
<style lang="less">
#app {
  margin-bottom: 80px;
}

#nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60px;
  padding: 30px;
  a {
    font-weight: bold;
    color: #2c3e50;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
