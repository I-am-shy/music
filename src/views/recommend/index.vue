<script setup>//组合式API
import { ref, onMounted } from 'vue';
import { getImgAPI, getTextAPI } from '@/api/text';
import { getSongAPI } from '@/api/music';
import { useSongStore,useAudio } from '@/stores/song';
import { useImgStore } from '@/stores/img';

const songStore = useSongStore();
const Audio = useAudio();
const imgStore = useImgStore();

const text = ref('');
const gm = ref('');
const img = ref('');
const show = ref(true);
const imgShow = ref(true);
const songShow = ref(true);
const dialog = ref(false)
const newSong = ref({})

// 从评论中获取歌名
const getGM = (str) => {
  let result = str.match(/《([^》]+)》/);
  if (result[1]) {
    // console.log(result[1]);
    return result[1];
  } else {
    return '暂无推荐歌曲';
  }
}

// 获取推荐歌曲评论
const getText = async () => {
  const res = await getTextAPI();
  // console.log(res.data);
  text.value = res.data.text;
  gm.value = getGM(text.value);
  getSong(gm.value)
}

// 获取推荐图片
const getImg = async () => {
  const res = await getImgAPI();
  // console.log(res.data);
  img.value = res.data.imgurl;
  imgShow.value = false;
}

// 获取推荐歌曲
const getSong = async (name) => {
  const res = await getSongAPI(1, name);
  // console.log(res.data);
  newSong.value = res.data.data;
  songShow.value = false;
}

// 播放歌曲
const playSong = ()=>{
  songStore.addNext(newSong.value) ;//将歌曲添加到列表
  songStore.play(songStore.playSongIndex + 1);//播放最后一个歌曲
  Audio.playing = true;
}

onMounted(() => {
  getText();
  getImg();
})

const change = () => {
  imgShow.value = true;
  songShow.value = true;
  getImg();
  getText();
}

const saveImg = ()=>{
  imgStore.addImg(img.value)
  dialog.value = true;
}

</script>

<template>
  <div class="recommend">
    <div class="title">
      <h1>听歌推荐</h1>
    </div>

    <div class="card">
      <v-card :width="!show ? 300 : 600" hover :loading="imgShow" style="display: flex;transition: 0.3s;">
        <div class="left">
          <v-img cover :src="img" width="300px" height="500px" @click="saveImg"></v-img>
          <v-card-title>
            <span style="margin-right: 10px; font-size: 16px;">推荐歌曲:</span>
            <span >{{ gm }}</span>
          </v-card-title>
          <v-card-actions>
            <v-btn color="blue-lighten-2" text="刷新内容" :loading="imgShow" @click="change"></v-btn>
            <v-spacer></v-spacer>
            <v-btn color="blue-lighten-2" :text="show ? '收起' : '展开'" @click="show = !show"></v-btn>
          </v-card-actions>
        </div>
        <v-divider vertical :thickness="2" opacity="0.2" style="margin-left: 0.5px;"></v-divider>
        <div class="right">
          <v-card v-if="show" width="300px" height="600px"  elevation="0">
            <v-card width="300px" :loading="songShow" elevation="0">
        <v-img :src="newSong.cover" width="300px" height="200px" cover></v-img>
        <v-card-text>
          <div style="display: flex; justify-content: space-between;">
            <div style="display:flex;flex-direction: column;">
              <span style="margin-right: 0px; font-size: 20px;">{{ gm }}</span>
            <span style="font-size: 12px;">{{ newSong.song_singer }}</span>
            </div>
            
            <v-btn @click="playSong" text="播放" color="blue-lighten-2" variant="text" style="font-size: 20px;"></v-btn>
          </div>
        </v-card-text>
      </v-card>
      <v-divider></v-divider>
            <v-card-text>
              <h2>歌曲热评</h2>
              <v-divider></v-divider>
              <p style="margin-top: 10px; text-align: justify;text-indent: 2em;height: 250px;overflow: auto;  font-size: 1.5em;">{{ text }}</p>
            </v-card-text>
          </v-card>
        </div>
      </v-card>

      <v-card width="500px" :loading="songShow" hover style="margin-left: 100px;">
        <v-img :src="newSong.cover" height="500px" ></v-img>
        <v-card-text>
          <div style="display: flex; justify-content: space-between;">
            <div class="info">
              <span>{{ newSong.song_singer }}</span>
            </div>
            <v-btn @click="playSong" text="播放" color="blue-lighten-2" variant="text" style="font-size: 20px;margin-top: 20px;"></v-btn>
          </div>
        </v-card-text>
      </v-card>
    </div>

    <v-dialog v-model="dialog" width="400">
      <v-img :src="img"></v-img>
    </v-dialog>
  </div>
</template>

<style scoped>
/* 当 <style> 标签带有 scoped attribute 的时候，它的 CSS 只会影响当前组件的元素 */
.recommend {
  min-width: 1000px;
  padding-top: 10px;
  padding-left: 10px;
  height: calc(100% - 60px);

}

.title {
  display: inline-block;
  margin-bottom: 20px;
  border-bottom: 5px solid;
}

.card {
  display: flex;
  .left{
    overflow: hidden;
  }
  .info {
    display: flex;
    flex-direction: column;

    span {
      text-wrap: nowrap;
      overflow: hidden;
      font-size: 1em;
      margin-left: 10px;
    }

    span:nth-child(1) {
      font-size: 1.8em;
    }
  }
}
</style>