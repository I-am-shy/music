import { defineStore } from "pinia";
import { ref } from "vue";
import DB from '@/utils/db';


const db = DB();

export const useMyStore = defineStore("my", () => {
  const myInfo = ref({
    name: '',
    des: '',
    imgUrl: ''
  })

  const setName = (name) => {
    myInfo.value.name = name
  }
  const setDes = (des) => {
    myInfo.value.des = des
  }
  const getImage = ()=>{
    db.then(res => {
      res().getImg().then(data => {
        data.onsuccess = () => {
          const blob = new Blob([data.result.file], { type: 'image/jpeg' })
          const url = URL.createObjectURL(blob)
          myInfo.value.imgUrl = url
        }
      })
    })
  }


  return { myInfo, setName, setDes ,getImage}
}, {
  persist: true, // 开启持久化
})

export const useMySongStore = defineStore("mySong", () => {
  const mySongList = ref([]);// 存储收藏的歌单
  const localSongList = ref([]);// 存储本地的歌单
  // const localSong = ref({
  //   cover: '',
  //   lyric: '',
  //   music_url: '',
  //   song_name: '',
  //   song_singer: ''
  // })

  const addMySong = (data) => {
    const index = mySongList.value.findIndex(item => item.song_singer == data.song_singer && item.song_name == data.song_name);
    if (index === -1) {
      mySongList.value.push(data)
    }
  }

  const delMySong = (id) => {
    mySongList.value.splice(id, 1)
  }

  const addLocalSong = () => {
    db.then(res => {
      res().getMusic().then(data => {
        data.onsuccess = () => {
          localSongList.value = [];
          data.result.forEach(item => {
            const blob = new Blob([item.file], { type: 'image/jpeg' })
            const url = URL.createObjectURL(blob);
            localSongList.value.push({
              id: item.id,
              cover: '',
              lyric: item.lyric,
              music_url: url,
              song_name: item.file.name.split('.')[0],
              song_singer: '未知艺人',
            })
          })
        }
      })
    })
    localSongList.value.push()
  }

  const delLocalSong = (id) => {
    console.log(localSongList.value[id].id)
    db.then(res => {
      res().delMusic(localSongList.value[id].id);//删除本地歌曲
      addLocalSong();//重新获取本地歌曲列表
    })
  }


  return { mySongList, localSongList, addMySong, delMySong, addLocalSong, delLocalSong }
}, {
  persist: true, // 开启持久化
})