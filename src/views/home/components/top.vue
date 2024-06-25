<script setup>//组合式API
import { ref, reactive, onMounted } from 'vue';
import { getSongListAPI } from "@/api/music"
import { useSongStore } from '@/stores/song'
import { useRouter } from 'vue-router';

const msg = ref("");
const songStore = useSongStore();
const router = useRouter();

onMounted(() => {
  msg.value = songStore.song.searchName;
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
        <v-text-field label="输入歌曲或歌手名称" variant="underlined" v-model="msg"></v-text-field>
      </div>
      <div class="btn">
        <v-btn variant="text" size="large"   @click="getSongList(msg)">
          <v-icon icon="mdi-magnify" size="large"></v-icon>
          <span>搜索</span>
        </v-btn>
      </div>
    </div>
    <div class="user">
      <div class="img">
        <img src="" alt="">
      </div>
      <div class="name">
        <span>用户</span>
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
  .user{
    width: 200px;
    height: 55px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 50px;
    border-radius: 5px;
  }
  .img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    overflow: hidden;
    background-image: url("@/assets/Music.png");
    background-size: cover;
    img {
      width: 40px;
    }
  }

  .name {
    font-size: 20px;
    margin-left: 50px;
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