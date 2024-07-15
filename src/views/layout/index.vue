<script setup>//组合式API
import player from './components/player.vue'
import left from './components/left.vue'
import getUrl from '@/utils/url'
import { onMounted, ref } from 'vue'
import { useSongStore, useAudio } from '@/stores/song';
import { useThemeStore } from '@/stores/theme';

const songStore = useSongStore();
const Audio = useAudio();
const themeStore = useThemeStore();

const isOpen = ref(null);

const open = (params) => {
  isOpen.value = params;
  // console.log(params);
}

const select = (id) => {
  songStore.play(id);
  Audio.playing = true;
}

const del = (id) => {
  songStore.deleteSong(id);
}

onMounted(()=>{
  // 初始化主题颜色
  if(themeStore.isDark){//暗主题
      document.body.style.setProperty('--text','rgb(230, 230, 230)');
    }else{
      document.body.style.setProperty('--text','#3a3a3a');
    }
})

</script>

<template>
  <v-app class="bg  text-default" :class="themeStore.isDark?'bgColor-dark':'bgColor-default'">
    <v-navigation-drawer v-model="isOpen" temporary :scrim="false" :persistent="true" location="right" width="400" class=" text-default"
      elevation="4" style="height : 80vh;margin-top: 10vh;border-radius: 10px; background:transparent;backdrop-filter: blur(30px);">
      <div class="list-title">
        <span class="title">播放列表</span>
        <v-btn icon="mdi-close" variant="text" style="width: 50px;height: 50px; top:10px;right: 0px;z-index: 1000;"
          @click="isOpen = !isOpen"></v-btn>
      </div>

      <div class="playingList">
        <v-empty-state v-if="songStore.playSongList.length === 0" title="什么也没有找到" :image="getUrl('empty.svg')"
          style="margin-top: 150px;"></v-empty-state>
        <div class="playSongList" v-else>
          <v-card class="songItem  text-default" v-for="item, index in songStore.playSongList" :key="index" :title="item.song_name"
            :text="item.song_singer" @click="select(index)">
            <v-btn variant="plain" icon="mdi-close" position="absolute" style="top:20px;right: 0px;"
              @click.stop="del(index)">
            </v-btn>
          </v-card>
        </div>
      </div>
    </v-navigation-drawer>

    <div class="container">
      <div class="left">
        <left></left>
      </div>
      <div class="content">
        <router-view></router-view>
      </div>
      <div class="bottom">
        <v-divider></v-divider>
        <player @v-open="open"></player>
      </div>

    </div>
  </v-app>

  <!-- 底部栏，侧边栏 -->


</template>

<style scoped lang="scss">
/* 当 <style> 标签带有 scoped attribute 的时候，它的 CSS 只会影响当前组件的元素 */
.bg {
  transition: 0.8s;
  .list-title {
    display: flex;
    justify-content: space-between;
    position: absolute;
    width: 100%;
    height: 70px;
    box-shadow: 2px 1px 3px #ccc;
    border-radius: 10px 10px 0 0;
    backdrop-filter: blur(5px);
    z-index: 10;
  }
}

.title {
  display: inline-block;
  width: 100px;
  height: 40px;
  border-bottom: 5px solid;
  font-size: 1.5em;
  font-weight: 600;
  text-shadow: 1px 1px rgb(170, 170, 170);
  font-family: '楷书';
  margin: 10px;
  z-index: 100;
}

.playingList {
  width: 100%;
  margin-top: 70px;
  .playSongList {
    padding-top: 10px;
    padding-left: 10px;

    .songItem {
      display: flex;
      flex-direction: column;
      background:transparent;
      z-index: 1;
      &::after {
        content: '';
        display: inline-block;
        position: absolute;
        top: calc(100% - 8px);
        height: 4px;
        width: 100px;
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

.container {
  display: flex;
  height: 100vh;
}

.left {

  position: fixed;
  height: 100%;
  width: 200px;
  &::after {
    content: '';
    display: inline-block;
    position: absolute;
    width: 1px;
    height: calc(100% - 60px);
    top:0px;
    left: 100%;
    box-shadow:  1px 0px 4px rgba(0, 0, 0, 0.2);
    bottom: 0;
    z-index: 10;
    border-radius: 10px;
  }
}

.content {
  position: relative;
  width: calc(100% - 200px);
  min-width: 1000px;
  left: 200px;
  height: calc(100vh - 60px);
}

.bottom {
  position: fixed;
  top: calc(100% - 60px);
  height: 60px;
  width: 100%;
}
</style>