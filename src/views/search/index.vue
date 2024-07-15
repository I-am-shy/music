<script setup>//组合式API
import { ref, reactive, onMounted } from 'vue';
import { getSongListAPI, getSongAPI } from "@/api/music"
import { useSongStore, useAudio } from '@/stores/song'
import { useMySongStore } from '@/stores/my';
import { useRouter } from 'vue-router';

const songStore = useSongStore();
const mySongStore = useMySongStore();
const Audio = useAudio();
const router = useRouter();
const active = ref(false);// 消息条初始不可见

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

const save = async () => {
  const res = await getSongAPI(songStore.song.id, songStore.song.searchName);
  mySongStore.addMySong(res.data.data);
  // console.log(res.data);
  active.value = true;
}

onMounted(() => {
  if (songStore.song.searchName !== '') {
    getSongList(songStore.song.searchName);
  }
})

</script>

<template>
  <div class="songList">
    <v-card class="songItem  text-default" v-for="item in songStore.songList" :key="item.n" :title="item.song_title"
      :text="item.song_singer"  @click="selectSong(item.n)">
      <v-btn variant="text" icon="" position="absolute" class="item" @click.stop="save">
        <v-btn icon="mdi-cards-heart-outline" class=" text-default" style="background: transparent;"></v-btn>
      </v-btn>
      <v-btn variant="text" icon="" position="absolute" class="item" @click.stop="add(item.n)">
        <v-btn icon="mdi-plus" class=" text-default" style="background: transparent;"></v-btn>
      </v-btn>
    </v-card>
    <v-snackbar v-model="active" :timeout="2000"  color="rgba(196, 255, 201, 0.5)"  width="200px" location="top right">
      <span color="#3a3a3a">已添加到我的歌单</span>
    </v-snackbar>
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
    background: transparent;
    &::after {
      content: '';
      display: inline-block;
      position: absolute;
      top: calc(100% - 8px);
      height: 4px;
      width: 120px;
      background: rgb(129, 129, 129);
      transition: 0.5s;
    }

    &:hover::after {
      background: $text;
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
      background: transparent;
      ~.item {
        right: 5px;
        background: transparent;
      }
    }
  }

}

</style>