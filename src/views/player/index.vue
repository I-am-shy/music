<script setup>//组合式API
import lyric from './lyric.vue';
import { ref,onMounted } from 'vue';
import { getSQSongAPI } from '@/api/music';
import { useSongStore } from '@/stores/song';


const songStore = useSongStore();
const downloadUrl = ref('');


const getSQSong = async () => {
  const res = await getSQSongAPI(songStore.song.id, songStore.song.playName);
  // console.log(res);
  downloadUrl.value = res.data.data.music_url;
}

onMounted(() => {
  getSQSong();
})


</script>

<template>
  
  <div class="player">
    <div class="bg":style="`background-image: url(${songStore.playSong.cover});`"></div>
    <div class="img">
      <img :src="songStore.playSong.cover" alt="">
    </div>
    <div class="lyric">
      <div class="content">
        <lyric :lyric="songStore.playSong.lyric"></lyric>
      </div>
    </div>
    <div class="download">
      <a :href="songStore.playSong.music_url">普通下载</a>
      <a :href="downloadUrl">高品质下载</a>
    </div>
    
  </div>
</template>

<style scoped>
/* 当 <style> 标签带有 scoped attribute 的时候，它的 CSS 只会影响当前组件的元素 */
.player {
  position: relative;
  display: flex;
  justify-content: space-around;
  align-items: center;
  min-width: 1200px;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  .bg{
    position: absolute;
    width: 100%;
    height: 100%;
    top:0;
    left: 0;
    z-index: 0;
    background-size: cover;
    opacity: 0.8;
    filter: blur(50px);
  }
  .img{
    width: 300px;
    height: 300px;
    border-radius: 50%;
    overflow: hidden;
    border: 2px solid #fff;
    box-shadow: 0 0 1px black,
    inset 0 0 1px black;
    z-index: 1;
    img{
      object-fit: contain;
    }
  }
  .lyric{
    /* margin-left: 100px; */
    height: 100%;
    z-index: 1;
    .content{
      height: 100%;
    }
  }
  .download{
    width: 300px;
    display: flex;
    justify-content: space-around;
    position: absolute;
    left: 50px;
    top: 80%;
    a{
      display: inline-block;
      width: 100px;
      height: 40px;
      text-decoration: none;
      text-align: center;
      line-height: 40px;
      color: #fff;
      box-shadow: 0 0 1px rgba(255, 255, 255, 0.6);
      transition: 0.2s;
      &:hover{
        color:#00ff1e;
        box-shadow: 0 0 4px #00ff1e;
      }
    }
  }
}
</style>