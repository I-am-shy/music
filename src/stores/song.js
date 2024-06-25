import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useSongStore = defineStore('songId', () => {
  const song = ref({
    id: 0,//搜索歌曲的id
    searchName: ''//搜索的歌曲名
  });
  const songList = ref([]);//歌曲列表
  const playSongList = ref([]);// 当前播放的歌曲列表
  const playSongIndex = ref(0);// 当前播放的歌曲索引

  const playSong = computed(() => playSongList.value[playSongIndex.value] ? playSongList.value[playSongIndex.value] : {
    cover: '',
    lyric: '',
    music_url: '',
    song_name: '',
    singer_name: '未知'
  });// 当前播放的歌曲

  // 添加歌曲到播放列表
  const addSong = (data) => {
    // 判断是否已经存在
    const index = playSongList.value.findIndex(item => item.song_singer == data.song_singer && item.song_name == data.song_name);
    if (index === -1) {
      playSongList.value.push(data);
    }

  }

  // 添加到下一首播放
  const addNext = (data) => {
    // 判断是否已经存在
    const index = playSongList.value.findIndex(item => item.song_singer == data.song_singer && item.song_name == data.song_name);
    if (index === -1) {
      playSongList.value.splice(playSongIndex.value + 1, 0, data);
    }
  }

  // 删除歌曲
  const deleteSong = (id) => {
    playSongList.value.splice(id, 1);
    // 删除后，如果当前播放的歌曲被删除，则播放下一首
    if (playSongIndex.value == id) {
      playNext();
    }
    // 如果删除的歌曲在当前播放的歌曲之前，则播放上一首
    if (playSongIndex.value > id) {
      playSongIndex.value--;
    }
  }

  // 清空歌曲列表
  const clearSongList = () => {
    playSongList.value.length = 0;
  }

  // 播放歌曲
  const play = (id) => {
    playSongIndex.value = id;
    if (playSongIndex.value >= playSongList.value.length) {
      playSongIndex.value = 0;
    }
  }

  // 播放下一首
  const playNext = () => {
    playSongIndex.value++;
    if (playSongIndex.value >= playSongList.value.length) {
      playSongIndex.value = 0;
    }
  }

  // 播放上一首
  const playPrev = () => {
    playSongIndex.value--;
    if (playSongIndex.value < 0) {
      playSongIndex.value = playSongList.value.length - 1;
    }
  }

  const selectedId = (id) => {
    song.value.id = id;
  }
  const selectedSearchName = (name) => {
    song.value.searchName = name;
  }
  const getList = (arr) => {
    songList.value = arr;
  }
  return {
    song,
    songList,
    playSongList,
    playSongIndex,
    playSong,
    addSong,
    addNext,
    deleteSong,
    clearSongList,
    play,
    playNext,
    playPrev,
    selectedId,
    selectedSearchName,
    getList
  }
},
{
  persist: true
})

export const useAudio = defineStore('audio', () => {
  const audio = ref(null);
  const playing = ref(false);//记录歌曲是否正在播放
  const currentTime = ref(0);//记录歌曲正在播放的时间
  return { audio, playing, currentTime }
})