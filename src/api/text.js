import {re} from '@/utils/request'

// 获取评论
export const getTextAPI = ()=>{
  return re({
    url:'/wyyrp.php',
    method:'get',
    params:{
      _t: new Date().valueOf()
    }
  })
}

// 获取图片
export const getImgAPI = ()=>{
  return re({
    url:'/ksxjj.php',
    method:'get',
    params:{
      _t: new Date().valueOf()
    }
  })
}

// 获取说说
export const getTalkAPI = ()=>{
  return re({
    url:'/pyq.php',
    method:'get',
    params:{
      _t: new Date().valueOf()
    }
  })
}