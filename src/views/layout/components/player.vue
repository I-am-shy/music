<script setup>//组合式API
import { ref, watch, onMounted, defineEmits } from 'vue';
import { useSongStore, useAudio } from '@/stores/song';
import { useMySongStore } from '@/stores/my';
import { useThemeStore } from '@/stores/theme';

const emit = defineEmits(['v-open'])

const songStore = useSongStore();
const Audio = useAudio();
const mySongStore = useMySongStore();
const themeStore = useThemeStore();
const audio = ref();
const songTime = ref(0);//歌曲总时长
const openList = ref(false);//默认不展示播放列表
const active = ref(false);


onMounted(() => {
  Audio.audio = audio.value;
  audio.value.oncanplay = () => {
    // console.log(audio.value.duration);
    songTime.value = parseInt(audio.value.duration);
    // Audio.playing = true;
  }
  audio.value.ontimeupdate = () => {
    Audio.currentTime = parseInt(audio.value.currentTime);
  }
  audio.value.onended = () => {//播放完毕
    next();
  }
  // audio.value.onwaiting = () => {// 不能播放时，歌曲没有载入
  //   songTime.value = 0;
  //   Audio.playing = false;
  // }
})

watch([Audio,audio], () => {
  if (Audio.playing) {
    audio.value.play();
  } else {
    audio.value.pause();
  }
}, {
  deep: true
})

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
// 上一首
const pre = () => {
  songStore.playPrev();
  // Audio.playing = false;
  songTime.value = 0;
}
// 下一首
const next = () => {
  songStore.playNext();
  // Audio.playing = false;
  songTime.value = 0;
}
//收藏当前播放歌曲
const save = async () => {
  mySongStore.addMySong(songStore.playSong);
  active.value = true;
}

// 秒转换时分钟00:00:00时分秒格式：
function timeToMinute(times) {
  let t;
  if (times > -1) {
    let hour = Math.floor(times / 3600);
    let min = Math.floor(times / 60) % 60;
    let sec = times % 60;
    if (hour < 10) {
      t = '0' + hour + ":";
    } else {
      t = hour + ":";
    }

    if (min < 10) {
      t += "0";
    }
    t += min + ":";
    if (sec < 10) {
      t += "0";
    }
    t += sec.toFixed(2);
  }
  if (t) {
    t = t.substring(0, t.length - 3);// 对t判断是否非空，否则会产生一个错误（不影响实际使用）
  }
  return t;
}

// 更新进度条
const updateRange = () => {
  audio.value.currentTime = Audio.currentTime;
  // console.log(currentTime.value);
}

// 打开/关闭播放列表
const open = () => {
  openList.value = true;
  emit('v-open', openList.value);//向父组件传递值
}


</script>

<template>
  <div class="player">
    <div class="img">
      <router-link to="/player">
        <img width="50" :src="songStore.playSong.cover" alt="">
      </router-link>
    </div>

    <div class="info">
      <span>{{ songStore.playSong.song_name }}</span>
      <span>{{ songStore.playSong.song_singer }}</span>
    </div>

    <div class="audio">
      <div class="controls">
        <v-btn variant="text" size="small" icon="" @click="pre">
          <v-icon size="x-large" icon="mdi-skip-previous-circle-outline"></v-icon>
        </v-btn>
        <v-btn variant="text" size="small" icon="" @click="onPlay">
          <v-icon size="x-large" icon="mdi-play-circle-outline" v-if="!Audio.playing"></v-icon>
          <v-icon size="x-large" icon="mdi-pause-circle-outline" v-else></v-icon>
        </v-btn>
        <v-btn variant="text" size="small" icon="" @click="next">
          <v-icon size="x-large" icon="mdi-skip-next-circle-outline"></v-icon>
        </v-btn>
        <v-btn variant="text" size="small" icon="mdi-cards-heart-outline" @click="save">
          <v-icon size="x-large" icon="mdi-cards-heart-outline"></v-icon>
        </v-btn>

      </div>
      <div class="time">{{ timeToMinute(Audio.currentTime) + '/' + timeToMinute(songTime ? songTime : 0) }}</div>
      <v-slider :max="songTime" :min="0" :step="1" id="range" width="120%" thumb-size="10" v-model="Audio.currentTime"
        :color="themeStore.isDark ? 'rgb(230, 230, 230)' : '#3a3a3a'" @end="updateRange"></v-slider>
    </div>

    <div class="list">
      <v-btn variant="text" @click="open" size="large">
        <v-icon icon="mdi-playlist-music-outline" size="50px"></v-icon>
      </v-btn>

    </div>

    <v-snackbar v-model="active" :timeout="2000" color="rgba(196, 255, 201, 0.5)" width="200px" location="top right">
      <span color="#3a3a3a">已添加到我的歌单</span>
    </v-snackbar>

    <audio :src="songStore.playSong.music_url" autoplay ref="audio"></audio>

  </div>

</template>

<style scoped lang='scss'>
/* 当 <style> 标签带有 scoped attribute 的时候，它的 CSS 只会影响当前组件的元素 */
.player {
  display: flex;
  justify-content: start;

  .img {
    width: 50px;
    height: 50px;
    margin: 4px;
    display: inline-block;
    background: url(@/assets/Music.png);
    background-size: cover;
    box-shadow: inset 1px 1px 1px #e8e8e8,
      inset -1px -1px 1px #e8e8e8;
  }

  .info {
    display: flex;
    flex-direction: column;
    width: 200px;

    span {
      width: 200px;
      text-wrap: nowrap;
      overflow: hidden;
      font-size: 0.8em;
      margin-left: 10px;
    }

    span:nth-child(1) {
      font-size: 1.4em;
    }

  }

  .audio {
    width: 800px;
    height: 60px;
    margin-left: 10px;
    position: relative;
    .controls {
      width: 800px;
      height: 30px;
      display: flex;
      justify-content: start;

      .icon {
        margin-top: 5px;
      }
    }

    .time {
      display: inline-block;
      position: absolute;
      width: 100px;
      height: 20px;
      top: 10px;
      right: -100px;
    }
  }

  .list {
    width: 80px;
    height: 60px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-left: 300px;

    i {
      width: 40px;
      height: 40px;
      border-radius: 3px;

      .icon {
        margin-left: 5px;
        margin-top: 5px;
      }
    }
  }
}
</style>