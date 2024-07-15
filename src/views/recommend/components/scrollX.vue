<script setup>//组合式API
import { ref, defineProps, defineEmits, onMounted, onBeforeUpdate } from 'vue';

const props = defineProps({
  width: {
    type: [Number, String],
    default: 1000,
    desc: '外层容器的宽度',
  },
  height: {
    type: [Number, String],
    default: 400,
    desc: '外层容器的高度'
  },
  bgColor: {
    type: [Number, String],
    default: '#fff',
    desc: '外层容器的背景颜色'
  },
  itemH: {
    type: [Number, String],
    default: 400,
    desc: '每个子元素的宽度'
  },
  itemW: {
    type: [Number, String],
    default: 400,
    desc: '每个子元素的高度'
  },
  margin: {
    type: [Number, String],
    default: 0,
    desc: '每个子元素之间的间距'
  }
})

// 定义事件，当最后一个元素到可视区域时触发
const emit = defineEmits(['last'])
const content = ref(null);

const lastItemIn = () => {
  // 判断最后一个元素是否到可视区域,注意组件内开始不能为空
  const lastItem = content.value.children[content.value.children.length - 1];
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].intersectionRatio <= 0) return;
    if (entries[0].isIntersecting >= observer.thresholds[0]) {
      emit('last');// 触发事件
      observer.unobserve(lastItem);// 移除观察者
      return;
    }
  }, {
    root: content.value,
    rootMargin: '0px',
    threshold: 0.5
  })
  observer.observe(lastItem)
}

onMounted(() => {
  lastItemIn()
})
onBeforeUpdate(() => {
  lastItemIn()
})

</script>

<template>
  <!-- 视口层 -->
  <div class="scrollX"
    :style="`--h: ${props.height}px;--w:${props.width}px;--bg:${props.bgColor};--itemH:${props.itemH}px;--itemW:${props.itemW}px;--margin:${props.margin}px;`">
    <!-- 滚动层 -->
    <div class="content" ref="content">
      <!-- 子元素 -->
      <slot />
    </div>
  </div>
</template>

<style scoped lang="scss">
/* 当 <style> 标签带有 scoped attribute 的时候，它的 CSS 只会影响当前组件的元素 */
.scrollX {
  width: var(--w);
  height: var(--h);

  // border: 1px dashed;
  .content {
    width: var(--h);
    height: var(--w);
    background: var(--bg);
    display: flex;
    flex-direction: column;
    justify-content: start;
    align-items: end;
    overflow-y: auto;
    transition: 2s;
    transform: rotateZ(-90deg) translateY(calc(var(--h) * -1));
    transform-origin: var(--h) 0px;

    >* {
      display: inline-block;
      position: relative;
      width: var(--itemW);
      height: var(--itemH);
      margin-bottom: calc(var(--itemW) - var(--itemH) + var(--margin));
      transform: rotateZ(90deg);
      transition: 2s;
      object-fit: cover;

      &:nth-last-child(1) {
        margin-bottom: 0; //清除间距
      }
    }

    &::-webkit-scrollbar {
      display: none;
    }
  }
}
</style>