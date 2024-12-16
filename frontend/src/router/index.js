import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'

// hash: createWebHashHistory
// history: createWebHistory

const router = createRouter({
  history: createWebHashHistory(), 
  routes: [
    {
      path: '/',
      component: () => import('@/views/index.vue')
    }
  ]
})

export default router
