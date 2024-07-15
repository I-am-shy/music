<script setup>//组合式API
import top from "./components/top.vue"


</script>

<template>
  <!-- 顶部栏 -->
  <div class="top">
    <top></top>
  </div>
  <div class="main">
    <router-view></router-view>
  </div>

</template>

<style scoped lang="scss">
/* 当 <style> 标签带有 scoped attribute 的时候，它的 CSS 只会影响当前组件的元素 */
.top {
  position: fixed;
  width: calc(100% - 200px);
  border-left: none;
  z-index: 100;
  &::after {
    content: '';
    display: inline-block;
    position: absolute;
    width: 100%;
    height: 1px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.5);
    bottom: 0;
    z-index: 10;
    border-radius: 10px;
  }
}

.main{
  height: calc(100% - 60px);
  margin-top: 60px;
}
</style>