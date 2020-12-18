<template>
  <div id="app" :class="{'app-booter':$route.path!=='/login'}">
    <router-view/>
    <div class="navBar" v-if="$route.path!=='/login'">
      <div class="navBar-item" :class="{active:$route.path==='/home'}" @click="$router.push('/home')">
        <div>
          <span class="iconfont icon-home"></span>
        </div>
        <div>
          主页
        </div>
      </div>
      <div class="navBar-item" :class="{active:$route.path==='/mall'}" @click="$router.push('/mall')">
        <span class="iconfont icon-shop"></span>
        <div>商城</div>
      </div>
      <div class="navBar-item" :class="{active:$route.path==='/my'}" @click="$router.push('/my')">
        <span class="iconfont icon-my"></span>
        <div>我的</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  mounted () {

  },
  watch: {
    $route: (val) => {
      // console.log(val)
    }
  }
}
</script>

<style lang="less">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
.app-booter{
  padding-bottom: 104px;
}
.navBar{
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: grid;
  grid-template-columns: repeat(3, 33.33%);
  border-top: 1.5px solid #F0F0F0;
  background-color: #f9f9f9;
  .navBar-item{
    padding-top: 14px;
    text-align: center;
    font-size: 22px;
    user-select:none;
    .iconfont{
      font-size: 40px;
    }
    &.active{
      color:#11d183;
    }
  }
}
</style>
