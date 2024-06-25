import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css' 
import { createVuetify } from 'vuetify'
import { aliases, mdi } from 'vuetify/iconsets/mdi'



export default createVuetify({
  defaults: {
    global: {
      ripple: true,// 默认开启波纹效果
    },
    VSheet: {
      elevation: 4,//阴影深度
    },
  },
  theme: {
    defaultTheme: 'light', // 默认主题
    themes: {
      
    }
  },
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
    },
  },
})

