<script setup>//组合式API
import { ref, reactive, onMounted } from 'vue';
import { getSongListAPI } from "@/api/music"
import { useSongStore } from '@/stores/song'
import { useImgStore } from '@/stores/img';
import { useMyStore } from '@/stores/my';
import { useRouter } from 'vue-router';
import { useThemeStore } from '@/stores/theme';


const songStore = useSongStore();
const imgStore = useImgStore();
const myStore = useMyStore();
const themeStore = useThemeStore();
const router = useRouter();
const msg = ref('');

onMounted(() => {
  msg.value = songStore.song.searchName;
  myStore.getImage();
})

const getSongList = async (name) => {
  router.push('/search')
  if (name == '') {
    return
  }
  songStore.selectedSearchName(name)
  const res = await getSongListAPI(name);
  songStore.getList(res.data.data);
}
</script>

<template>
  <div class="content">
    <div class="search">
      <div class="input">
        <v-text-field label="输入歌曲或歌手名称" variant="underlined" v-model="msg" @keydown.enter="getSongList(msg)"></v-text-field>
      </div>
      <div class="btn">
        <v-btn variant="text" size="large" @click="getSongList(msg)">
          <v-icon icon="mdi-magnify" size="large"></v-icon>
          <span>搜索</span>
        </v-btn>
      </div>
    </div>
    <div class="user">
      <v-btn @click="themeStore.toggleTheme()" style="background: transparent" class="text-default" elevation="1" icon="mdi-theme-light-dark"></v-btn>

      <v-menu open-on-hover>
        <template v-slot:activator="{ props }">
          <router-link to="/user">
            <v-avatar size="50" color="rgb(40, 255, 200)" style="margin: 10px" v-bind="props">
            <v-img :src="myStore.myInfo.imgUrl"></v-img>
          </v-avatar>
          </router-link>
        </template>
        <v-list style="opacity: 0.8;">
          
          <v-list-item @click="$router.push('/setting')">修改信息</v-list-item>
          <v-list-item @click="imgStore.imgShow=true">查看图集</v-list-item>
        </v-list>
      </v-menu>

      <div class="name">
        <span>{{ myStore.myInfo.name }}</span>
      </div>
    </div>
  </div>

</template>

<style scoped lang='scss'>
/* 当 <style> 标签带有 scoped attribute 的时候，它的 CSS 只会影响当前组件的元素 */

.content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  backdrop-filter: blur(10px);
  width: 100%;
  .user {
    width: 200px;
    height: 55px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 10px;
  }

  .name {
    font-size: 20px;
    text-wrap: nowrap;
    margin-left: 10px;
    height: 40px;
    line-height: 40px;
  }
}

.search {
  width: 500px;
  display: flex;
  justify-content: space-between;

  .input {
    margin-left: 50px;
    width: 100%;
    height: 60px;
  }

  .btn {
    margin-left: -80px;
    margin-top: 10px;
  }
}
</style>