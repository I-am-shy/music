import { defineStore } from "pinia";
import { ref } from "vue";

export const useCardStore = defineStore('cardList',()=>{
  const musicCardList = ref([]);

  return{
    musicCardList
  }
}) 