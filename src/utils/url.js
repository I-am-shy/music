// 获取assets静态资源
export default  function (name){
  // 参数，文件名称，自动定位到 assets文件夹下
  const url = new URL(`../assets/${name}`, import.meta.url).href
  // console.log(url)
  return url;
};
// 动态返回静态资源路径