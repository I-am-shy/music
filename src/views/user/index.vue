<script setup>//组合式API
import { ref, reactive, onMounted } from 'vue';
import { getTalkAPI } from '@/api/text';
import { useImgStore } from '@/stores/img';

const talk = ref('');
const textShow = ref(true);
const index = ref(0);
const dialog = ref(false);
const imgStore = useImgStore();

// 获取每日文案
const getTalk = async () => {
  const res = await getTalkAPI();
  // console.log(res.data);
  talk.value = res.data.text;
  textShow.value = false;
}

const delImg = (item)=>{
  imgStore.delImg(item);
}

onMounted(() => {
  getTalk();
  
})
</script>

<template>
  <div class="user">
    <v-card width="200px" height="auto" max-height="300px" hover :loading="textShow">
      <v-card-title>
        <h3>每日一句</h3>
      </v-card-title>
      <v-card-text>
        <p style="font-size: 16px; text-indent: 2em;">{{ talk }}</p>
      </v-card-text>
    </v-card>

    <v-card width="350px" height="600px">
      <v-carousel v-model="index" hide-delimiters interval="8000" height="500px" style="width: 350px;" show-arrows="hover" cycle progress>
      <v-carousel-item v-for="(item,i) in imgStore.imgList" :key="i" :src="item" cover  @click="dialog=true"></v-carousel-item>
    </v-carousel>
    <v-card-title>
      <h4>看过的图片</h4>
    </v-card-title>
    <v-card-actions>
      <v-btn color="red" variant="text" text="删除" @click="delImg(imgStore.imgList[index])"></v-btn>
      <v-spacer></v-spacer>
      <v-btn color="blue" variant="text" text="查看" @click="dialog=true"></v-btn>
    </v-card-actions>
    </v-card>

    <v-dialog v-model="dialog" max-width="400px">
      <v-img :src="imgStore.imgList[index]"></v-img>
    </v-dialog>
  </div>
</template>

<style scoped>
/* 当 <style> 标签带有 scoped attribute 的时候，它的 CSS 只会影响当前组件的元素 */
.user {
  padding-top: 10px;
  padding-left: 10px;
  height: 100%;
  display: flex;
  justify-content: space-evenly;
}
</style>