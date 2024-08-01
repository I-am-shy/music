
// 监听页面变化
export default async function(){
  let timer;
  window.addEventListener('resize',(e)=>{
    clearTimeout(timer);//清除上次的定时器
    timer = setTimeout(()=>{
      // console.log(document.body.clientWidth)
      if(document.body.clientWidth < 500){
        // console.log('移动端')
      }else{
        // console.log('pc端')
      }
    },500)
    
  })
}