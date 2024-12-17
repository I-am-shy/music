## 按需导入vuetify

1. 安装插件[vite-plugin-vuetify](https://www.npmjs.com/package/vite-plugin-vuetify)

``` bash
npm i vite-plugin-vuetify
```

2. 在vite.config.js中配置

``` js
import vuetify from 'vite-plugin-vuetify'

export default defineConfig({
  plugins: [
    vuetify({ autoImport: true }), // Enabled by default
  ],
})
```


> **注意：**
> 打包后的文件位置问题，public下的文件名称（指纹）和路径不会改变

优化处理：  
复用的数据存入本地，减少网路请求

已知bug:  
当前歌曲无法播放，按下一首会中断播放（图标和音频状态不匹配）
