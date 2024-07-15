import { defineStore } from "pinia";
import { ref } from "vue";

export const useThemeStore = defineStore("theme", () => {
  const isDark = ref(false);

  const toggleTheme = () => {
    isDark.value = !isDark.value; 
    if(isDark.value){//暗主题
      document.body.style.setProperty('--text','rgb(230, 230, 230)');
    }else{
      document.body.style.setProperty('--text','#3a3a3a');
    }
    
  }
  
  return { isDark, toggleTheme };
},{
  persist: true
});