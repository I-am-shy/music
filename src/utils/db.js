// 使用本地数据库存放数据
export default async function DB() {
  const request = indexedDB.open('database', 1);

  let addMusic;
  let delMusic;
  let getMusic;
  let addImg;
  let delImg;
  let getImg;

  request.onupgradeneeded = function (event) {
    const db = event.target.result;
    // 创建一个对象存储空间
    db.createObjectStore('musicStore', { keyPath: 'id', autoIncrement: true });
    db.createObjectStore('imgStore', { keyPath: 'id', autoIncrement: true });
  }
  request.onerror = function (event) {
    console.error('数据库打开失败：', event.target.errorCode);
  }

  return request.onsuccess = (event)=> {
    const db = request.result;
    // 在这里执行数据库操作

    // 添加歌曲
    /**
     * 
     * @param {*} data 
     * data数据格式：
     * cover: 封面图片
     * music_url: 歌曲链接
     * song_name: 歌曲名称
     * song_singer: 歌曲作者
     */
    addMusic = (data) => {
      const transaction = db.transaction(['musicStore'], 'readwrite');
      const store = transaction.objectStore('musicStore');
      const re = store.add(data);
      re.onsuccess = function (event) {
        return '歌曲添加成功';
      }
      re.onerror = function (event) {
        return ('歌曲添加失败：', event.target.errorCode);
      }
    }
    
    // 删除歌曲
    delMusic = (id)=>{
      const transaction = db.transaction(['musicStore'], 'readwrite');
      const store = transaction.objectStore('musicStore');
      const re = store.delete(id);
      re.onsuccess = function (event) {
        return true;
      }
    }

    // 获取歌曲列表
    getMusic = async() => {
      const transaction = db.transaction(['musicStore'], 'readwrite');
      const store = transaction.objectStore('musicStore');
      const re = store.getAll();
      return re;
    }
    // 添加图片
    /**
     * 
     * @param {*} data 
     * data数据格式：
     * base64:图片的base64格式
     */
    addImg = (data) => {
      const transaction = db.transaction(['imgStore'], 'readwrite');
      const store = transaction.objectStore('imgStore');
      const re = store.put({ id: 1, file: data });
      re.onsuccess = function (event) {
        return '图片添加成功';
      }
    }
    // 删除图片
    delImg = () => {
      const transaction = db.transaction(['imgStore'], 'readwrite');
      const store = transaction.objectStore('imgStore');
      const re = store.delete(1);
      re.onsuccess = function (event) {
        return '图片删除成功';
      }
    }

    // 获取图片
    getImg = async() => {
      const transaction = db.transaction(['imgStore'], 'readwrite');
      const store = transaction.objectStore('imgStore');
      const re = store.get(1);
      return re;
    }
    return {
      addMusic,
      getMusic,
      delMusic,
      addImg,
      delImg,
      getImg
    }
  }

}