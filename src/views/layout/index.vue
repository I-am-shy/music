<script setup>//组合式API
import { ref,reactive,onMounted } from 'vue';

</script>

<template>
  <div>顶部导航</div>
  <RouterLink to="/">主页</RouterLink>
  <RouterLink to="/recommend">推荐</RouterLink>
  <RouterLink to="/search">搜索</RouterLink>
  <RouterLink to="/user">用户</RouterLink>
  <RouterLink to="/player">播放</RouterLink>
  <RouterLink to="/login">登录</RouterLink>
  <router-view></router-view>
</template>

<style scoped>
/* 当 <style> 标签带有 scoped attribute 的时候，它的 CSS 只会影响当前组件的元素 */

</style>