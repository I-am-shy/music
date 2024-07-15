<script setup>//组合式API
import { ref, reactive, onMounted } from 'vue';
import DB from '@/utils/db';
import { useMyStore } from '@/stores/my';

const db = DB();
const myStore = useMyStore();
const file = ref(null);
const isShow = ref(false);
const info = ref({
  name: '',
  des: ''
});


const changeInfo = () => {
  if (info.value.des && info.value.name) {// 数据不为空
    isShow.value = false;
    myStore.setName(info.value.name);
    myStore.setDes(info.value.des);
    info.value.name = '';
    info.value.des = '';
  }else{
    isShow.value = true;
  }

}

onMounted(() => {
  file.value.onchange = () => {
    console.log(file.value.files[0]);
    db.then(res => {
      res().addImg(file.value.files[0]);
      myStore.getImage();//更新头像
    })
    // const reader = new FileReader();
    // reader.readAsDataURL(file.value.files[0]);
    // reader.onload = (e)=>{
    //   // console.log(e.target.result);
    //   db.then(res=>{
    //     res().addImg(e.target.result);
    //   })
    // }

  }
})

</script>

<template>

  <div class="setting text-default">

    <v-card class="form" hover variant="text">
      <label for="file" class="label">
        <div class="box" ref="box">
          <span>点击上传头像</span>
        </div>
        <input type="file" id="file" ref="file">
      </label>

      <v-text-field label="昵称" v-model="info.name"></v-text-field>
      <v-text-field label="个性签名" v-model="info.des"></v-text-field>
      <v-card-actions>
        <v-btn variant="text" text="修改" size="large" class="text-default" @click="changeInfo"></v-btn>
      </v-card-actions>
      <v-alert closable text="请输入完整的信息" v-model="isShow" type="warning"></v-alert>
    </v-card>

  </div>


</template>

<style scoped lang='scss'>
/* 当 <style> 标签带有 scoped attribute 的时候，它的 CSS 只会影响当前组件的元素 */
.setting {
  position: relative;
  width: 100%;
  padding-top: 10px;
  padding-left: 10px;
  height: 100%;
  overflow: auto;

  .form {
    display: flex;
    flex-direction: column;
    background-color: transparent;
    width: 50%;

    .label {
      align-self: center;
    }
  }

  input {
    width: 10px;
    opacity: 0; //透明度为0，隐藏input file
  }
}

.box {
  width: 300px;
  height: 200px;
  border: 1px dashed $text;
  display: flex;
  justify-content: center;
  align-items: center;

  span {
    display: inline-block;
    font-size: 2em;
    color: $text;
    opacity: 0.8;
    user-select: none; //不可选中文字
  }
}
</style>