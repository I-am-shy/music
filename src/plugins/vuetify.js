import 'vuetify/styles'
import { createVuetify } from 'vuetify'

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
    defaultTheme: 'dark', // 默认主题
    themes: {
      myCustomTheme, // 自定义主题
    }
  }
})

export const myCustomTheme = {// 自定义主题配置
  light: {
    primary: '#1976D2',
    secondary: '#424242',
    accent: '#82B1FF',
    error: '#FF5252',
    info: '#2196F3',
    success: '#4CAF50',
    warning: '#FB8C00',
    dark: '#000000'
  },
  dark: {
    primary: '#1976D2',
    secondary: '#424242',
    accent: '#82B1FF',
    error: '#FF5252',
    info: '#2196F3',
    success: '#4CAF50',
    warning: '#FB8C00',
    dark: '#000000'
  }
}