<script setup>//组合式API
import getUrl from '@/utils/url'

</script>

<template>
  <div class="about">

    <h1>关于本站</h1>
    <p>
      本站是一款免费开源的在线音乐网站，支持搜索、播放、下载音乐，也可以上传自己的音乐进行播放；
      提供播放列表，收藏歌曲，所有数据均保留于本地，下次点开网站继续听歌，
      无广告，随时随地点开链接即可畅听音乐
    </p>

    <h1>技术框架</h1>
    <p><a href="https://cn.vitejs.dev/" target="_blank">vite</a> 下一代的前端工具链,为开发提供极速响应</p>
    <p><a href="https://cn.vuejs.org/" target="_blank">vue3</a> 渐进式JavaScript 框架,易学易用，性能出色，适用场景丰富的 Web 前端框架。</p>
    <p><a href="https://vuetifyjs.com/" target="_blank">vuetify</a> 一个无需设计技能的开源 UI 库，具有精美的手工制作的 Vue 组件</p>

    <h1>数据支持</h1>
    <p><a href="https://www.hhlqilongzhu.cn/" target="_blank">龙珠API</a>，是一个免费在线API测试服务，稳定可靠的站点!</p>
    <p><a href="https://api.suyanw.cn/" target="_blank">素颜Api</a>，稳定、快速、免费的 API 接口服务</p>

    <h1>网页分享</h1>
    <img :src="getUrl('qrcode.png')" alt="二维码链接">

    <span> 本站所有内容仅供学习交流使用，不用于任何商业用途</span>

  </div>
</template>

<style scoped lang='scss'>
/* 当 <style> 标签带有 scoped attribute 的时候，它的 CSS 只会影响当前组件的元素 */
.about {
  position: relative;
  width: 100%;
  padding-top: 10px;
  padding-left: 10px;
  height: 100%;
  overflow: auto;
  font-family: '楷体';
  p {
    width: 80%;
    font-size: 1.3rem;
    text-indent: 2rem;
    a{
      text-decoration: none;
      color: rgb(37, 109, 60);
      font-size: 1.5rem;
      text-shadow: 2px 2px 1px rgba(0, 0, 0,0.2),
      1px 1px 1px rgba(255, 255, 255, 0.2);
    }
  }

  span {

    position: absolute;
    bottom: 10px;
    right: 10px;
    font-size: 0.8ssrem;
  }
}
</style>