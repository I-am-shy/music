<script setup>//组合式API
import lyric from './lyric.vue';
import { ref, onMounted, onBeforeUpdate } from 'vue';
import { getSQSongAPI,getSongLyricAPI } from '@/api/music';
import { useSongStore, useAudio } from '@/stores/song';
import getUrl from '@/utils/url'

const songStore = useSongStore();
const Audio = useAudio();
const downloadUrl = ref('');
const lrc = ref('');
const player = ref(null);
const full = ref(false);//默认非全屏

const getSQSong = async () => {
  const res = await getSQSongAPI(songStore.song.id,songStore.playSong.song_name);
  // console.log(res);
  downloadUrl.value = res.data.data.music_url;
}

const getSongLyric = async() =>{
  const res = await getSongLyricAPI(songStore.playSong.song_name);
  // console.log(res.data);
  lrc.value = res.data;
}

// 播放/暂停
const onPlay = () => {
  if (Audio.playing) {
    // audio.value.pause();
    Audio.playing = false;
  } else {
    // audio.value.play();
    Audio.playing = true;

  }
}

// 全屏
const fullScreen = () => {
  if (full.value == false) {
    player.value.requestFullscreen();
    full.value = true;
  } else {
    document.exitFullscreen();
    full.value = false;
  }
}

onMounted(() => {
  if(!songStore.playSong.lyric && songStore.playSong.song_name){//如果没有歌词且列表有歌曲，则获取歌词
    getSongLyric()
  }
  if (!songStore.playSong.id && songStore.playSong.music_url != '') {
    getSQSong();
  }
  player.value.addEventListener('fullscreenchange', () => {
    if (document.fullscreenElement) {
      full.value = true;
    } else {
      full.value = false;
    }
  });
})
onBeforeUpdate(()=>{// 歌曲更换时更新歌词
  if(!songStore.playSong.lyric && songStore.playSong.song_name){//如果没有歌词，则获取歌词
    getSongLyric()
  }
})

</script>

<template>

  <div class="player" ref="player">
    <div class="bg" :style="`background-image: url(${songStore.playSong.cover?songStore.playSong.cover:getUrl('Music.png')});`"></div>
    <v-tooltip :text="Audio.playing ? '暂停' : '播放'" location="center">
      <template v-slot:activator="{ props }">
        <div class="img" :style="Audio.playing ? '--play:running' : '--play:paused'" v-bind="props" @click="onPlay">
          <img :src="songStore.playSong.cover?songStore.playSong.cover:getUrl('Music.png')" style="object-fit: cover;width: 300px;" alt="">
        </div>
      </template>
    </v-tooltip>

    <div class="lyric">
      <div class="content">
        <lyric :lyric="songStore.playSong.lyric?songStore.playSong.lyric:lrc"></lyric>
      </div>
    </div>
    <div class="download">
      <a :href="songStore.playSong.music_url" :download="songStore.playSong.song_name + '.mp3'">普通下载</a>
      <a :href="downloadUrl" v-if="downloadUrl">高品质下载</a>
    </div>
    <!-- 全屏按钮 -->
    <v-btn icon="" elevation="0" variant="text" @click.stop="fullScreen"
      style="position: absolute;top:0;right: 0;" class="text-default">
      <v-icon icon="mdi-fullscreen" v-if="full == false"></v-icon>
      <v-icon icon="mdi-fullscreen-exit" v-else></v-icon>
    </v-btn>
  </div>
</template>

<style scoped lang="scss">
/* 当 <style> 标签带有 scoped attribute 的时候，它的 CSS 只会影响当前组件的元素 */
.player {
  position: relative;
  display: flex;
  justify-content: space-around;
  align-items: center;
  min-width: 1200px;
  height: 100%;
  background-color: transparent;
  background-size: cover;
  overflow: hidden;

  .bg {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 0;
    background-size: cover;
    background-color: transparent;
    opacity: 0.8;
    // backdrop-filter: blur(100px);
    opacity: 0.8;
    filter: blur(1.5em);
  }

  .img {
    width: 300px;
    height: 300px;
    border-radius: 50%;
    overflow: hidden;
    border: 2px solid #fff;
    box-shadow: 0 0 1px black,
      inset 0 0 1px black;
    z-index: 1;
    animation: circle 50s infinite linear forwards;
    animation-play-state: var(--play);

    img {
      object-fit: contain;
    }
  }

  .lyric {
    /* margin-left: 100px; */
    height: 100%;
    z-index: 1;
    display: flex;
    align-items: center;

    .content {
      height: 80%;
    }
  }

  .download {
    width: 300px;
    display: flex;
    justify-content: space-around;
    position: absolute;
    left: 50px;
    top: 80%;

    a {
      display: inline-block;
      width: 100px;
      height: 40px;
      text-decoration: none;
      text-align: center;
      line-height: 40px;
      color: #fff;
      box-shadow: 0 0 1px rgba(255, 255, 255, 0.6);
      transition: 0.2s;

      &:hover {
        color: #00ff1e;
        box-shadow: 0 0 4px #00ff1e;
      }
    }
  }
}


@keyframes circle {
  100% {
    transform: rotate(360deg);
  }
}
</style>