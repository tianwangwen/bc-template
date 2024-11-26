import { createRouter, createWebHistory } from 'vue-router'
import commonRouter from './common.router'
import store from '@/store'

const router = createRouter({
  history: createWebHistory(),
  routes: commonRouter
})

router.beforeEach((to, from, next) => {
  next();
  // 记录需要缓存页面的滚动条高度
  if (from.meta.keepScroll) {
    const $content = document.querySelector(from.meta.scrollEl || "#main");
    const scrollTop = $content ? $content.scrollTop : 0;
    store.commit('app/setScrollList', { name: from.name, value: scrollTop })
  }
});

export default router
