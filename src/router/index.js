import { createRouter, createWebHashHistory } from 'vue-router'
import layout from '@/views/layout/index.vue'


const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'layout',
      component: layout,
      children:[
        {
          path: '',
          name: 'home',
          component: ()=>import('@/views/home/index.vue'),
          children:[
            {
              path: '',
              name: 'recommend',
              component: ()=>import('@/views/recommend/index.vue')
            },{
              path: '/user',
              name: 'user',
              component: ()=>import('@/views/user/index.vue')
            },
            {
              path: '/search',
              name: 'search',
              component: ()=>import('@/views/search/index.vue')
            },
            {
              path: '/player',
              name: 'player',
              component: ()=>import('@/views/player/index.vue')
            },
            {
              path:'/setting',
              name:'setting',
              component:()=>import('@/views/setting/index.vue')
            },
            {
              path:'/about',
              name:'about',
              component:()=>import('@/views/about/index.vue')
            },
          ]
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: ()=>import('@/views/login/index.vue')
    }
  ],
  
})

export default router
