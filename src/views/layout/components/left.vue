<script setup>//组合式API
import { watch } from 'vue';
import { ref, reactive, onMounted } from 'vue';
import { useRouter,useRoute } from 'vue-router';

const count = ref([{
  id:0,
  title: "听歌推荐",
  path: "/"
}, {
  id:1,
  title: "个人中心",
  path: "/user"
}, {
  id:2,
  title: "播放页",
  path: "/player"
}, {
  id:3,
  title: "搜索",
  path: "/search"
},{
  id:4,
  title: "设置",
  path: "/setting"
},{
  id:5,
  title: "关于",
  path: "/about"
}]);

const router = useRouter();
const route = useRoute();
const index = ref(0);

const linkTo = (path) => {
  router.push(path);
}

onMounted(() => {
  if(route.path == "/"){
    index.value = 0;
  }else if(route.path == "/user"){
    index.value = 1;
  }else if(route.path == "/player"){
    index.value = 2;
  }else if(route.path == "/search"){
    index.value = 3;
  }else if(route.path == "/setting"){
    index.value = 4;
  }else if(route.path == "/about"){
    index.value = 5;
  }
})

watch(route,()=>{
  if(route.path == "/"){
    index.value = 0;
  }else if(route.path == "/user"){
    index.value = 1;
  }else if(route.path == "/player"){
    index.value = 2;
  }else if(route.path == "/search"){
    index.value = 3;
  }else if(route.path == "/setting"){
    index.value = 4;
  }else if(route.path == "/about"){
    index.value = 5;
  }
  // console.log(route.path)
})


</script>

<template>
  <div class="left">
    <router-link to="/">
      <div class="logo text-default">
        <svg t="1718872357738" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
          p-id="7004" width="70" height="60">
          <path
            d="M462.038 270.297L344.81 132.972h-132.3l116.67 137.325h132.86z m343.313 0l-116.67-137.325H556.379L673.05 270.297h132.301z m-171.935 0L516.745 132.972H384.444l116.67 137.325h132.302z m221.618-137.325H727.757l116.67 137.325h61.964v-85.968c0.559-29.028-21.77-51.357-51.357-51.357z m-682.16 0h-5.024c-29.029 0-51.358 22.329-51.358 51.357v85.968h173.61L172.875 132.972z m-56.382 704.49c0 29.027 22.33 51.357 51.358 51.357h687.184c29.028 0 51.357-22.33 51.357-51.358V304.907H116.492v532.554z m274.65-377.924c0-29.028 24.005-42.984 51.358-42.984 8.374 0 18.98 1.675 27.353 6.699l195.94 113.32c34.61 18.98 34.61 66.989 0 85.969l-195.94 113.32c-8.373 5.025-17.305 6.7-27.353 6.7-27.353 0-51.357-13.956-51.357-42.984v-240.04z m0 0"
            fill="rgb(0, 255, 150)" p-id="7005" data-spm-anchor-id="a313x.search_index.0.i39.241f3a81KYCTb8" class=""></path>
        </svg>
        <span>音乐播放器</span>
      </div>
    </router-link>
    <div class="list">
      <v-list lines="three" style="background: transparent;">
        <v-list-item class="item text-default" v-model="index" :class="i.id == index?`active${i.id+1}`:''" v-for="i in count" :key="i.id" :title="i.title" @click="linkTo(i.path)"
          :ripple="false"></v-list-item>
        <div class="bar"></div>
      </v-list>
    </div>

  </div>
</template>

<style scoped lang='scss'>
/* 当 <style> 标签带有 scoped attribute 的时候，它的 CSS 只会影响当前组件的元素 */
.left {

  a {
    text-decoration: none;
  }

  .logo {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100px;

    .icon {
      display: inline-block;
    }

    span {
      font-size: 1.5em;
      font-family: '仿宋';
      font-weight: 600;
      text-align: center;
      text-shadow: 0 1px #0000008b;
    }
  }

  .list {
    
    .item {
      z-index: 1;
    }

    @for $i from 0 through 5{
      &:has(.item:nth-child(#{$i+1}):hover)::after{
        transform: translateY(#{$i*88}px);
      } 
      &:has(.active#{$i+1})::after{
        transform: translateY(#{$i*88}px);
      }
    }
    
    &::after{
      content: '';
      display: inline-block;
      position: absolute;
      top: 125px;
      left: 10px;
      width: 100px;
      height: 50px;
      border-radius: 5px;
      background: linear-gradient(135deg, rgb(149, 255, 156) 30%, rgb(93, 255, 125), rgb(9, 255, 157));
      opacity: 0.5;
      z-index: 0;
      transition: 0.5s;
    }
    
    
  }
}
</style>