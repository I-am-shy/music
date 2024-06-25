<script setup>//组合式API
import { ref, reactive, onMounted } from 'vue';
import { getSongListAPI, getSongAPI } from "@/api/music"
import { useSongStore, useAudio } from '@/stores/song'
import { useRouter } from 'vue-router';

const songStore = useSongStore();
const Audio = useAudio();
const router = useRouter();

const getSongList = async (name) => {
  const res = await getSongListAPI(name);
  songStore.getList(res.data.data);
}

const selectSong = async (id) => {
  songStore.selectedId(id);
  router.push("/player");
  const res = await getSongAPI(songStore.song.id, songStore.song.searchName);
  // console.log(res.data);
  songStore.addSong(res.data.data);//将歌曲添加到列表
  songStore.play(songStore.playSongList.length - 1);//播放最后一个歌曲
  Audio.playing = true;
}

const add = async (id) => {
  songStore.selectedId(id);
  const res = await getSongAPI(songStore.song.id, songStore.song.searchName);
  songStore.addNext(res.data.data);//将歌曲添加到列表
}

onMounted(() => {
  if (songStore.song.searchName !== '') {
    getSongList(songStore.song.searchName);
  }
})
</script>

<template>
  <div class="songList">
    <v-card class="songItem" v-for="item in songStore.songList" :key="item.n" :title="item.song_title"
      :text="item.song_singer"  @click="selectSong(item.n)">
      <v-btn variant="text" icon="" position="absolute" class="item" @click.stop="">
        <v-btn icon="mdi-cards-heart-outline"></v-btn>
      </v-btn>
      <v-btn variant="text" icon="" position="absolute" class="item" @click.stop="add(item.n)">
        <v-btn icon="mdi-plus"></v-btn>
      </v-btn>
    </v-card>
  </div>
</template>

<style scoped lang="scss">
/* 当 <style> 标签带有 scoped attribute 的时候，它的 CSS 只会影响当前组件的元素 */
.songList {
  position: relative;
  width: 100%;
  padding-top: 10px;
  padding-left: 10px;
  height: 100%;
  overflow: auto;

  .songItem {
    display: flex;
    flex-direction: column;

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
      background: rgb(45, 45, 45);
      width: 100%;
    }
    &:hover{
      box-shadow: 1px 2px 4px rgba(0, 0, 0, 0.5);
      transform: translateY(-2px);
    }
    .item {
      top: 20px;
      right: 70px;
      z-index: 1000;
      font-size: 1.2em;

      ~.item {
        right: 5px;
      }
    }
  }

}
</style>