import axios from "axios";


export default axios.create({
  baseURL:"https://www.hhlqilongzhu.cn/api",
  params:{
    num : 60,
    type : "json"
  },
  timeout:5000,
})

//图片和评论
export const re = axios.create({
  baseURL:'https://api.suyanw.cn/api',
  params:{
    type:'json',
    return:'json'
  },
  timeout:5000,
})

