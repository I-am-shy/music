<script setup>//组合式API
import player from './components/player.vue'
import left from './components/left.vue'
import { ref } from 'vue'
import { useSongStore, useAudio } from '@/stores/song';

const songStore = useSongStore();
const Audio = useAudio();

const isOpen = ref(null);

const open = (params) => {
  isOpen.value = params;
  console.log(params);
}

const select = (id) => {
  songStore.play(id);
  Audio.playing = true;
}

const del = (id) => {
  songStore.deleteSong(id);
}

</script>

<template>
  <v-app class="bg">
    <v-navigation-drawer v-model="isOpen" temporary :scrim="false" :persistent="true" location="right" width="400"
      elevation="4" style="height : 80vh;margin-top: 10vh;border-radius: 10px;">
      <div style="display: flex; justify-content: space-between; position: absolute; width: 100%;height: 70px;box-shadow: 2px 1px 3px #ccc; border-radius:10px 10px 0 0 ;">
        <span class="title">播放列表</span>
        <v-btn icon="mdi-close" variant="text" style="width: 50px;height: 50px; top:10px;right: 0px;z-index: 1000;"
          @click="isOpen = !isOpen"></v-btn>
      </div>

      <div class="playingList">
        <v-empty-state v-if="songStore.playSongList.length === 0" title="什么也没有找到" image="/empty.svg"
          style="margin-top: 150px;"></v-empty-state>
        <div class="playSongList" v-else>
          <v-card class="songItem" v-for="item, index in songStore.playSongList" :key="index" :title="item.song_name"
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
        <player @v-open="open"></player>
      </div>

    </div>
  </v-app>

  <!-- 底部栏，侧边栏 -->


</template>

<style scoped lang="scss">
/* 当 <style> 标签带有 scoped attribute 的时候，它的 CSS 只会影响当前组件的元素 */
.bg {
  background-color: rgb(255, 255, 255);
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
        background: rgb(45, 45, 45);
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