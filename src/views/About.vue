<template>
  <div class="about">
    <div>This is an about page</div>
  </div>
</template>

<script>
export default {
  mounted () {
    // 关闭全局遮罩
    const timer = setTimeout(() => {
      this.closeLoading()
      clearTimeout(timer)
    }, 1000)
  }
}
</script>
