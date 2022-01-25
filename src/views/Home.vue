<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/>
    <van-button type="primary">主要按钮</van-button>
    <van-button type="info">信息按钮</van-button>
    <van-field
      v-model="fieldValue"
      is-link
      readonly
      label="省市区"
      placeholder="请选择所在地区"
      @click="show = true"
    />
    <van-popup v-model="show" round position="bottom">
      <van-cascader
        v-model="cascaderValue"
        title="请选择所在地区"
        :options="areaList"
        @close="show = false"
        @finish="onFinish"
      />
    </van-popup>
  </div>
</template>
<script>
// @ is an alias to /src
import { Button, Field, Cascader, Popup } from 'vant'
import HelloWorld from '@/components/HelloWorld.vue'
import Enum from '../api/Enum'
export default {
  name: 'Home',
  components: {
    HelloWorld,
    [Button.name]: Button,
    [Field.name]: Field,
    [Cascader.name]: Cascader,
    [Popup.name]: Popup
  },
  data () {
    return {
      show: false,
      fieldValue: '',
      cascaderValue: '',
      areaList: []
    }
  },
  created () {
    this.getAreaList()
  },
  mounted () {
    // 关闭全局遮罩
    const timer = setTimeout(() => {
      this.closeLoading()
      clearTimeout(timer)
    }, 1000)
  },
  methods: {
    async getAreaList () {
      const res = await Enum.getArea()
      if (res.result === '0') {
        this.areaList = res.data
      }
    },
    // 全部选项选择完毕后，会触发 finish 事件
    onFinish ({ selectedOptions }) {
      this.show = false
      this.fieldValue = selectedOptions.map((option) => option.text).join('/')
    }
  }
}
</script>
<style lang="less" scoped>
.home{
  text-align: center;
}
.van-button + .van-button{
  margin-left: 10px;
}
</style>
