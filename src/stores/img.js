import { defineStore } from 'pinia'
import { ref} from 'vue'

export const useImgStore = defineStore('img', () => {
  const imgList = ref([]);
  const imgShow = ref(true);

  const addImg = (img) => {
    // 判断是否已经存在
    const index = imgList.value.findIndex(item => item === img);
    if(index === -1){
      imgList.value.push(img);
    }
    
  }

  const delImg = (img)=>{
    const index = imgList.value.findIndex(item => item === img);
    if(index !== -1){
      imgList.value.splice(index, 1);
    }
  }

  return{
    imgList,
    imgShow,
    addImg,
    delImg
  }
},
{
  persist: true
})