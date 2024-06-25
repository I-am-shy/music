<script setup>//组合式API
import { defineProps, onBeforeUpdate, onMounted,onUnmounted,ref, } from 'vue';
import { useAudio,useSongStore } from '@/stores/song';

const props = defineProps({
  lyric: {
    type: String,
    default: ''
  }
})
const songStore=useSongStore();
const Audio = useAudio();
const container = ref();//容器
const body = ref();//获取dom的父级容器
const title = ref({});//标题
const content = ref([]);//歌词主体
const isLrc = ref(true);//有歌词
let isScroll = false;// 是否已经滚动,默认没有滚动


let timer = setTimeout(() => {
  isScroll = false;
}, 4000);

// 处理歌词
const takeLrc = (lrc) => {
  // 1.分离标题，和歌词主体
  let titleArr = lrc.split("[offset:0]");

  let titleMain = titleArr[0];// 标题
  let lrcMain = titleArr[1];

  // 2.分离[]中的时间和歌词部分
  const titleArray = titleMain.match(/\[(.*?)\:(.*?)\]/g);// 正则式
  const titleObject = {};// 标题对象
  titleArray.map(item => {// 分离键值对，在放入对象
    let key = item.match(/\[(.*?)\:/)[1];
    let value = item.match(/\:(.*?)\]/)[1];
    titleObject[key] = value;
  });


  // 匹配时间和文本的正则表达式
  const pattern = /\[(\d{2}:\d{2}\.\d{2})\](.*)/g;
  // 匹配结果存储数组
  const matches = [...lrcMain.matchAll(pattern)];
  // 整理结果为对象数组
  const result = matches.map(match => ({ t: match[1], c: match[2].trim() }));
  // 输出结果
  // console.log(result);
  // 匹配时间和文本的正则表达式

  title.value = titleObject;
  content.value = result;
}

//将字符串时间转成整数s
function timeToDecimal(time) {
  const [minutes, seconds] = time.split(':').map(parseFloat);
  return Math.floor(minutes * 60 + seconds);
}


onMounted(() => {
  if (!props.lyric) {
    isLrc.value = false;
  }else {
    isLrc.value = true;
    takeLrc(props.lyric);
  } 
  container.value.onscroll = () => {
    // console.log(container.value.scrollTop);
    // 主动滚动歌词时不让歌词连续滚动
    isScroll = true;
    clearTimeout(timer);// 重置定时器
    timer = setTimeout(() => {
      isScroll = false;
    }, 3000);
  }
})
onBeforeUpdate(() => {
  // console.log(props.lyric)
  if (props.lyric) {
    isLrc.value = true;
    takeLrc(props.lyric);
  } else {
    isLrc.value = false;
  }
  Audio.audio.ontimeupdate = () => {
    if (isLrc.value) {
      content.value.forEach((item, index, arr) => {
        if (item.c !== '') {
          // 当前播放的时间比本句歌词的时间大，并且比下一句歌词的时间小
          if (index == arr.length - 1 && parseInt(Audio.audio.currentTime) >= timeToDecimal(arr[index].t)) {//最后一句
            let nlrc = body.value.children[index];
            nlrc.classList.add('active');
            // 这个方法会一直触发滚动，应该让歌词滚动一次后在几秒后在触发滚动
            // 添加一个变量判断是否已经滚动
            if (!isScroll) {
              container.value.scrollTop = nlrc.offsetTop - 300;// 歌词滚动
            }
            arr.forEach((item, i) => {//将其他歌词颜色去除
              if (i != index) {
                let olrc = body.value.children[i];
                olrc.classList.remove('active');
              }
            })
            console.log(item.c);
          }
          else if (parseInt(Audio.audio.currentTime) >= timeToDecimal(arr[index].t) && parseInt(Audio.audio.currentTime) < timeToDecimal(arr[index + 1].t)) {
            let nlrc = body.value.children[index];
            nlrc.classList.add('active');
            if (!isScroll) {
              container.value.scrollTop = nlrc.offsetTop - 300;// 歌词滚动
            }
            arr.forEach((item, i) => {//将其他歌词颜色去除
              if (i != index) {
                let olrc = body.value.children[i];
                olrc.classList.remove('active');
              }
            })
            // console.log(item.c);
          }
        }

      })
    }
    Audio.currentTime = parseInt(Audio.audio.currentTime);
    if(Audio.currentTime == parseInt( Audio.audio.duration)){
      songStore.playNext();
    }
    // console.log(Audio.currentTime)
  }
})
onUnmounted(()=>{
  Audio.audio.ontimeupdate = ()=>{//组件销毁后重置播放时的事件
    Audio.currentTime = parseInt(Audio.audio.currentTime);
    if(Audio.currentTime == parseInt( Audio.audio.duration)){
      songStore.playNext();
    }
  }
})



</script>

<template>
  <p id="container" ref="container">
  <div class="top">
    <p>{{ title.ti ? title.ti : '暂无' }}</p>
    <p>歌手:{{ title.ar ? title.ar : '暂无' }}</p>
    <p>专辑:{{ title.al ? title.al : '暂无' }}</p>
  </div>
  <div class="body" ref="body">
    <div v-for="item in content" :key="item" style="margin-top: 20px" v-if="isLrc">
      <p class="lrc" v-if="item.c !== ''" @click="Audio.audio.currentTime = timeToDecimal(item.t)">{{ item.c }}<span
          class="show">{{ item.t }}</span></p>
    </div>
    <div v-else><span>暂无歌词</span></div>
  </div>
  </p>
</template>

<style scoped lang='scss'>
/* 当 <style> 标签带有 scoped attribute 的时候，它的 CSS 只会影响当前组件的元素 */

#container {
  margin: 0 auto;
  font-size: 30px;
  font-family: "楷体";
  overflow-y: auto;
  width: 800px;
  height: 100%;
  text-shadow: 0 0 2px black;
  color: #ffffff;
  /* 平滑滚动 */
  scroll-behavior: smooth;
}

#container::-webkit-scrollbar {
  display: none;
}

#container .top {
  margin-left: 20px;
}

#container .top :nth-child(1) {
  font-size: 1.4em;
}

#container .body {
  margin-left: 20px;
  margin-top: 40px;
}

#container .body p {
  position: relative;

  cursor: pointer;
  text-align: left;
}

#container .body p span {
  display: none;
  position: absolute;
  right: 20px;
  font-size: 20px;
  bottom: 10px;
}

#container .body p:hover span {
  display: inline-block;
}

#container .body p:hover {
  color: #00ff1e;
  text-shadow: 0 0 20px #00ff1e9e;
}

.active {
  color: #00ff1e;

  .show {
    display: inline-block !important;
  }
}
</style>