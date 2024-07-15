<script setup>//组合式API
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getImgAPI, getTextAPI } from '@/api/text';
import { getSongAPI, getSongListAPI } from '@/api/music';
import { useSongStore, useAudio } from '@/stores/song';
import { useImgStore } from '@/stores/img';
import scrollX from './components/scrollX.vue';
import loader from '@/components/loader.vue'

// // 异步加载组件
// const scrollX = defineAsyncComponent({
//     loader: () => import('./components/scrollX.vue'),//异步组件
//     delay: 1000,//延迟加载组件时间
//     loadingComponent: () => import('@/components/loader.vue'),//等待异步组件加载时展示的组件
//     // errorComponent: () => import('@/components/error.vue'),// 加载超时后的组件
//     timeout: 3000,//加载超时时间
// })

const router = useRouter();
const songStore = useSongStore();
const Audio = useAudio();
const imgStore = useImgStore();
const pageLoader = ref(false);//判断页面是否加载完成
const dialog = ref({
  src: '',
  show: false
})
const musicCardList = ref([].fill(0))
const musicCard = {
  text: '',
  gm: '',
  img: '',
  show: true,
  imgShow: true,
  songShow: true,
  newSong: {}
}


const getSongList = async (name) => {
  if (name == '') {
    return
  }
  songStore.song.searchName = name;
  router.push('/search')
  songStore.selectedSearchName(name)
  const res = await getSongListAPI(name);
  songStore.getList(res.data.data);
}

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
  musicCard.text = res.data.text;
  musicCard.gm = getGM(musicCard.text);
  await getSong(musicCard.gm)
}

// 获取推荐图片
const getImg = async () => {

  const res = await getImgAPI();
  // console.log(res.data);
  musicCard.img = res.data.imgurl;
  musicCard.imgShow = false;
}

// 获取推荐歌曲
const getSong = async (name) => {
  const res = await getSongAPI(1, name);
  // console.log(res.data);
  musicCard.newSong = res.data.data;
  musicCard.songShow = false;
}

// 播放歌曲
const playSong = (item) => {
  songStore.addNext(item.newSong);//将歌曲添加到列表
  songStore.play(songStore.playSongIndex + 1);//播放最后一个歌曲
  Audio.playing = true;
}


onMounted(async () => {
  await getNewMusicCard();
  await getNewMusicCard();
  pageLoader.value = true;
})

const change = async (index) => {
  // 属性置空
  for (let key in musicCardList.value[index]) {
    if (key != 'imgShow' || key != 'songShow' || key != 'show') {
      musicCardList.value[index][key] = ''
    }else{
      musicCardList.value[index][key] = true;
    }
  }

  await getText();
  await getImg();
  musicCardList.value[index] = { ...musicCard }
  // console.log(musicCardList.value[index])
}

const saveImg = (item) => {
  imgStore.addImg(item.img)
  dialog.value.src = item.img
  dialog.value.show = true
}

const getNewMusicCard = async () => {
  await getText();
  await getImg();
  musicCardList.value.push({ ...musicCard });
  console.log(musicCardList.value);
}
</script>

<template>
  <div class="recommend">
    <div class="title">
      <h1>听歌推荐</h1>
    </div>

    <!-- 动态组件
    <component :is="pageLoader? scrollX:loader" width="1500" height="650" itemH="600" itemW="600" :margin="100" @last="getNewMusicCard"
    style="margin-top: -10px;" bgColor="transparent"></component> -->

    <loader v-if="!pageLoader"></loader>

    <scrollX v-else width="1500" height="650" itemH="600" itemW="600" :margin="100" @last="getNewMusicCard"
      style="margin-top: -10px;" bgColor="transparent" >

      <!-- <div class="card">
        <v-card :width="!musicCard.show ? 300 : 600" hover :loading="musicCard.imgShow" class="text-default"
          style="display: flex;transition: 0.3s;background: transparent; ">
          <div class="left">
            <v-img cover :src="musicCard.img" width="300px" height="500px" @click="saveImg()"></v-img>
            <v-card-title>
              <span style="margin-right: 10px; font-size: 16px;">推荐歌曲:</span>
              <v-btn variant="text" color="blue-lighten-2" @click="getSongList(musicCard.gm)"><span>{{ musicCard.gm
                  }}</span></v-btn>
            </v-card-title>
            <v-card-actions>
              <v-btn color="blue-lighten-2" text="刷新内容" :loading="musicCard.imgShow" @click="change"></v-btn>
              <v-spacer></v-spacer>
              <v-btn color="blue-lighten-2" :text="musicCard.show ? '收起' : '展开'"
                @click="musicCard.show = !musicCard.show"></v-btn>
            </v-card-actions>
          </div>
          <v-divider vertical :thickness="2" opacity="0.2" style="margin-left: 0.5px;"></v-divider>
          <div class="right">
            <v-card v-if="musicCard.show" width="300px" height="600px" elevation="0" class="text-default"
              style="background: transparent;">
              <v-card width="300px" :loading="musicCard.songShow" elevation="0" class="text-default"
                style="background: transparent;">
                <v-img :src="musicCard.newSong.cover" width="300px" height="200px" cover></v-img>
                <v-card-text>
                  <div style="display: flex; justify-content: space-between;">
                    <div style="display:flex;flex-direction: column;">
                      <span style="margin-right: 0px; font-size: 20px;">{{ musicCard.gm }}</span>
                      <span style="font-size: 12px;">{{ musicCard.newSong.song_singer }}</span>
                    </div>

                    <v-btn @click="playSong" text="播放" color="blue-lighten-2" variant="text"
                      style="font-size: 20px;"></v-btn>
                  </div>
                </v-card-text>
              </v-card>
              <v-divider></v-divider>
              <v-card-text>
                <h2>歌曲热评</h2>
                <v-divider></v-divider>
                <p
                  style="margin-top: 10px; text-align: justify;text-indent: 2em;height: 250px;overflow: auto;  font-size: 1.5em;">
                  {{ musicCard.text }}</p>
              </v-card-text>
            </v-card>
          </div>
        </v-card>
      </div> -->


      <div class="card" v-for="item, index in musicCardList" :key="index">
        <v-card :width="!item.show ? 300 : 600" hover :loading="item.imgShow" class="text-default"
          style="display: flex;transition: 0.3s;background: transparent;">
          <div class="left">
            <v-img cover :src="item.img" width="300px" height="500px" @click="saveImg(item)"></v-img>
            <v-card-title>
              <span style="margin-right: 10px; font-size: 16px;">推荐歌曲:</span>
              <v-btn variant="text" color="blue-lighten-2" @click="getSongList(item.gm)"><span>{{ item.gm}}</span></v-btn>
            </v-card-title>
            <v-card-actions>
              <v-btn color="blue-lighten-2" text="刷新内容" :loading="item.imgShow" @click="change(index)"></v-btn>
              <v-spacer></v-spacer>
              <v-btn color="blue-lighten-2" :text="item.show ? '收起' : '展开'" @click="item.show = !item.show"></v-btn>
            </v-card-actions>
          </div>
          <v-divider vertical :thickness="2" opacity="0.2" style="margin-left: 0.5px;"></v-divider>
          <div class="right">
            <v-card v-if="item.show" width="300px" height="600px" elevation="0" class="text-default"
              style="background: transparent;">
              <v-card width="300px" :loading="item.songShow" elevation="0" class="text-default"
                style="background: transparent;">
                <v-img :src="item.newSong.cover" width="300px" height="200px" cover></v-img>
                <v-card-text>
                  <div style="display: flex; justify-content: space-between;">
                    <div style="display:flex;flex-direction: column;">
                      <span style="margin-right: 0px; font-size: 20px;">{{ item.gm }}</span>
                      <span style="font-size: 12px;">{{ item.newSong.song_singer }}</span>
                    </div>

                    <v-btn @click="playSong(item)" text="播放" color="blue-lighten-2" variant="text"
                      style="font-size: 20px;"></v-btn>
                  </div>
                </v-card-text>
              </v-card>
              <v-divider></v-divider>
              <v-card-text>
                <h2>歌曲热评</h2>
                <v-divider></v-divider>
                <p
                  style="margin-top: 10px; text-align: justify;text-indent: 2em;height: 250px;overflow: auto;  font-size: 1.5em;">
                  {{ item.text }}</p>
              </v-card-text>
            </v-card>
          </div>
        </v-card>
      </div>

    </scrollX>

    <v-dialog v-model="dialog.show" width="400">
      <v-img :src="dialog.src"></v-img>
    </v-dialog>


  </div>
</template>

<style scoped lang="scss">
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
  background: transparent;

  .left {
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