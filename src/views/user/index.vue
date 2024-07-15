<script setup>//组合式API
import { ref, reactive, onMounted } from 'vue';
import { getTalkAPI } from '@/api/text';
import { useSongStore, useAudio } from '@/stores/song';
import { useImgStore } from '@/stores/img';
import { useMyStore, useMySongStore } from '@/stores/my';
import DB from '@/utils/db';
import getUrl from '@/utils/url'


const talk = ref('');
const textShow = ref(true);
const index = ref(0);
const dialog = ref(false);
const db = DB();
const songStore = useSongStore();
const Audio = useAudio();
const imgStore = useImgStore();
const myStore = useMyStore();
const mySongStore = useMySongStore();
const tab = ref()


// 获取每日文案
const getTalk = async () => {
  const res = await getTalkAPI();
  // console.log(res.data);
  talk.value = res.data.text;
  textShow.value = false;
}

const delImg = (item) => {
  imgStore.delImg(item);
}

// 播放歌曲
const playSong = (item) => {
  songStore.addSong(item);//将歌曲添加到列表
  songStore.play(songStore.playSongList.length - 1);//播放最后一个歌曲
  Audio.playing = true;
}

// 添加歌曲到播放列表
const addSong = (item) => {
  songStore.addNext(item);//将歌曲添加到列表
}

// 删除歌曲
const delSong = (index) => {
  mySongStore.delMySong(index);
}

// 上传本地歌曲
const uploadSong = (e) => {
  // console.log('上传本地歌曲');
  console.log(e.target.files[0])
  let file = e.target.files[0];
  if(file.type == 'audio/mpeg'){//识别到歌曲
    db.then(res=>{
      res().addMusic({file});
      mySongStore.addLocalSong()
    })
  }
}

const delMusic = (id)=>{
  mySongStore.delLocalSong(id);
}

onMounted(() => {
  getTalk();
  mySongStore.addLocalSong();//更新blob：url
})
</script>

<template>
  <div class="user ">
    <v-card class="main" elevation="1">
      <div class="userCard">
        <v-avatar size="200" color="rgb(40, 255, 200)" style="margin: 10px">
          <v-img :src="myStore.myInfo.imgUrl"></v-img>
        </v-avatar>
        <v-card elevation="0" width="30%" class=" text-default" style="background-color: transparent;">
          <v-card-title>
            <h1 style="font-size: 3em;">{{ myStore.myInfo.name }}</h1>
          </v-card-title>
          <v-card-text>
            <h3>个性签名:</h3>
            <p style="margin-top: 10px;">{{ myStore.myInfo.des }}</p>
          </v-card-text>
        </v-card>
        <v-card class=" text-default"
          style="background-color: transparent; display: inline-block; margin-left: auto; width:300px;" hover
          :loading="textShow">
          <v-card-title>
            <h3>随机一言</h3>
          </v-card-title>
          <v-card-text>
            <p style="font-size: 16px; text-indent: 2em;overflow-y: auto;height: 100%;">{{ talk }}</p>
          </v-card-text>
        </v-card>

      </div>
      <v-divider style="margin-top: 20px;"></v-divider>
      <v-card class="mySong  text-default">
        <v-card-title class="card-title">
          <div class="sub-title">
            <span class="title">我的歌单</span>
            <v-tooltip text="上传本地歌曲" location="start">
              <template v-slot:activator="{ props }">
                  <v-btn icon="mdi-plus" elevation="1" class=" text-default" style="background-color: transparent;" v-bind="props">
                    <label for="upload"> <v-icon icon="mdi-plus"></v-icon></label>
                  </v-btn>
                <input type="file" id="upload" style="display: none;" @change="uploadSong" />
              </template>
            </v-tooltip>
          </div>

          <v-tabs bg-color="transparent" v-model="tab" :hide-slider="true">
            <v-tab value="1" selected-class="active1" class="item text-default" :ripple="false">
              <span>我的收藏</span>
            </v-tab>
            <v-tab value="2" selected-class="active2" class="item text-default" :ripple="false">
              <span>本地歌曲</span>
            </v-tab>
          </v-tabs>
        </v-card-title>

        <v-card-text>
          <v-tabs-window v-model="tab">
            <v-tabs-window-item value="1">
              <v-empty-state title="什么也没有找到" class="empty" v-if="mySongStore.mySongList.length === 0">
                <template v-slot:media>
                  <v-img :src="getUrl('empty.svg')" height="200px"></v-img>
                </template>
              </v-empty-state>
              <div class="mySongList" v-else>
                <v-card class="songItem  text-default" v-for="item, index in mySongStore.mySongList" :key="index"
                  :title="item.song_name" :text="item.song_singer" @click="playSong(item)">
                  <v-btn variant="text" elevation="1" icon="mdi-close" position="absolute" style="top:20px;right: 0px;"
                    @click.stop="delSong(index)">
                  </v-btn>
                  <v-btn variant="text" elevation="1" icon="mdi-plus" position="absolute" style="top:20px;right: 60px;"
                    @click.stop="addSong(item)">
                  </v-btn>
                </v-card>
              </div>
            </v-tabs-window-item>
            <v-tabs-window-item value="2">
              <v-empty-state title="什么也没有找到" class="empty" v-if="mySongStore.localSongList.length === 0">
                <template v-slot:media>
                  <v-img :src="getUrl('empty.svg')" height="200px"></v-img>
                </template>
              </v-empty-state>
              <div class="mySongList" v-else>
                <v-card class="songItem  text-default" v-for="item, index in mySongStore.localSongList" :key="index"
                  :title="item.song_name" :text="item.song_singer" @click="playSong(item)">
                  <v-btn variant="text" elevation="1" icon="mdi-close" position="absolute" style="top:20px;right: 0px;"
                    @click.stop="delMusic(index)">
                  </v-btn>
                  <v-btn variant="text" elevation="1" icon="mdi-plus" position="absolute" style="top:20px;right: 60px;"
                    @click.stop="addSong(item)">
                  </v-btn>
                </v-card>
              </div>
            </v-tabs-window-item>
          </v-tabs-window>


        </v-card-text>

      </v-card>
    </v-card>

    <div class="imgList" v-if="imgStore.imgShow">
      <v-card width="350px" height="100%" hover style="background-color: transparent;">
        <v-empty-state title="什么也没有找到" v-if="imgStore.imgList.length === 0">
          <template v-slot:media>
            <v-img :src="getUrl('empty.svg')" height="200px"></v-img>
          </template>
        </v-empty-state>
        <v-carousel v-model="index" hide-delimiters interval="8000" height="600px" style="width: 350px;"
          show-arrows="hover" cycle progress v-else>
          <v-carousel-item v-for="(item, i) in imgStore.imgList" :key="i" :src="item" cover
            @click="dialog = true"></v-carousel-item>
        </v-carousel>
        <v-card-title>
          <h5>看过的图片</h5>
        </v-card-title>
        <v-card-actions>
          <v-btn color="pink" variant="text" text="删除" @click="delImg(imgStore.imgList[index])"></v-btn>
          <v-spacer></v-spacer>
          <v-btn color="blue" variant="text" text="查看" @click="dialog = true"></v-btn>
          <v-btn color="#bababa" variant="text" text="隐藏" @click="imgStore.imgShow = false"></v-btn>
        </v-card-actions>
      </v-card>

      <v-dialog v-model="dialog" max-width="400px">
        <v-img :src="imgStore.imgList[index]"></v-img>
      </v-dialog>
    </div>

  </div>
</template>

<style scoped lang="scss">
/* 当 <style> 标签带有 scoped attribute 的时候，它的 CSS 只会影响当前组件的元素 */
.user {
  padding-top: 10px;
  padding-left: 10px;
  height: 100%;
  display: flex;
  justify-content: space-between;

  .main {
    width: 100%;
    height: 100%;
    margin-right: 20px;
    background-color: transparent;

    .userCard {
      height: 30%;
      display: flex;
      justify-content: space-between;
    }

    .mySong {
      height: 70%;
      overflow: auto;
      background-color: transparent;

      .card-title {
        position: sticky;
        top: 0;
        z-index: 10;
        backdrop-filter: blur(10px);

        .sub-title {
          display: flex;
          justify-content: space-between;

        }

        &:has(.active1)::after {
          transform: translateX(0px);
        }

        &:has(.active2)::after {
          transform: translateX(90px);
        }

        &:has(.item:nth-child(1):hover)::after {
          transform: translateX(0px);
        }

        &:has(.item:nth-child(2):hover)::after {
          transform: translateX(90px);
        }

        &::after {
          content: '';
          display: inline-block;
          position: absolute;
          top: 72px;
          left: 20px;
          width: 90px;
          height: 40px;
          border-radius: 5px;
          background: linear-gradient(135deg, rgb(149, 255, 156) 30%, rgb(93, 255, 125), rgb(9, 255, 157));
          opacity: 0.5;
          z-index: -1;
          transition: 0.5s;
        }
      }

      .title {
        display: inline-block;
        width: 100px;
        height: 40px;
        border-bottom: 4px solid;
        font-size: 1.2em;
        font-weight: 600;
        text-shadow: 1px 1px rgb(170, 170, 170);
        font-family: '楷书';
        margin: 10px;
        z-index: 100;
      }

      .empty {
        background-color: transparent;
      }

      .mySongList {
        background-color: transparent;
        padding-top: 10px;
        padding-left: 10px;

        .songItem {
          display: flex;
          flex-direction: column;
          background: transparent;

          &::after {
            content: '';
            display: inline-block;
            position: absolute;
            top: calc(100% - 8px);
            height: 4px;
            width: 150px;
            background: rgb(129, 129, 129);
            transition: 0.5s;
          }

          &:hover::after {
            background: $text;
            width: 100%;
          }

          &:hover {
            box-shadow: 1px 2px 4px rgba(0, 0, 0, 0.5);
            transform: translateY(-2px);
          }
        }
      }
    }
  }

  .imgList {

    background-color: transparent;
  }
}
</style>