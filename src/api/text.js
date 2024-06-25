import {re} from '@/utils/request'

// 获取评论
export const getTextAPI = ()=>{
  return re({
    url:'/wyyrp.php',
    method:'get'
  })
}

// 获取图片
export const getImgAPI = ()=>{
  return re({
    url:'/ksxjj.php',
    method:'get'
  })
}

// 获取说说
export const getTalkAPI = ()=>{
  return re({
    url:'/pyq.php',
    method:'get'
  })
}