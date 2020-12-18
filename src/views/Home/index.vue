<template>
  <div class="home">
    <div class="header">
      <van-swipe :autoplay="3000" indicator-color="white" @change="swipeChange">
        <van-swipe-item v-for="(image, index) in images" :key="index">
          <img v-lazy="image" />
        </van-swipe-item>
        <template #indicator>
          <div class="custom-indicator">
            <div class="custom-indicator-item" :class="{'custom-indicator-active':current===index}" v-for="(item,index) in images" :key="index"></div>
          </div>
        </template>
      </van-swipe>
    </div>
    <div class="middle">
      <div class="hot">
        <div class="hot-item">
          <div class="pic"></div>
          <div class="text">21332321</div>
        </div>
        <div class="hot-item">
          <div class="pic"></div>
          <div class="text">21332321</div>
        </div>
        <div class="hot-item">
          <div class="pic"></div>
          <div class="text">21332321</div>
        </div>
      </div>
      <div class="extension">
        <div class="extension-item">
          <div class="pic"></div>
          <div class="text">123213</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      current: 0,
      images: [
        'https://img.yzcdn.cn/vant/apple-1.jpg',
        'https://img.yzcdn.cn/vant/apple-2.jpg',
        'https://img.yzcdn.cn/vant/apple-3.jpg',
        'https://img.yzcdn.cn/vant/apple-4.jpg'
      ]
    }
  },
  methods: {
    swipeChange (index) {
      this.current = index
    }
  }
}
</script>

<style lang="less">
.home{
  .header{
    padding-top: 78px;
    width: 750px;
    height: 454px;
    background-image: url('../../assets/home-img/home-bgi.png');
    background-size: cover;
    .van-swipe{
      .van-swipe-item{
        text-align: center;
        img{
          width: 648px;
          height: 265px;
        }
      }
      .van-swipe__indicator{
        width: 16px;
        height: 16px;
      }
      .van-swipe__indicators{
        bottom: 32px;
      }
      .custom-indicator{
        position: absolute;
        bottom: 30px;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        .custom-indicator-item{
          width: 32px;
          height: 8px;
          // background-color: rgba(255, 255, 255, 0.4);
          background-color: #79bcff5e;
          margin: 0 3px;
          &.custom-indicator-active{
            background-color: #409EFF;
          }
        }
      }
    }
  }
  .middle{
    .hot{
      margin-top: 30px;
      width: 100%;
      display: grid;
      padding: 0 25px;
      grid-template-columns: repeat(3, 1fr);
      grid-column-gap: 36px;
      .hot-item{
        .pic{
          margin: 0 auto;
          width: 180px;
          height: 180px;
          border-radius: 180px;
          border: 2px solid #BBBBBB;
        }
        .text{
          margin-top: 30px;
          text-align: center;
          font-size: 22px;
        }
      }
    }
    .extension{
      margin-top: 57px;
      .extension-item{
        padding: 0 48px;
        .pic{
          width: 100%;
          height: 150px;
          background: #000;
        }
        .text{
          font-size: 40px;
        }
      }
    }
  }
}
</style>
