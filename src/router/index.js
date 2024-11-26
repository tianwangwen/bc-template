import { createRouter, createWebHistory } from 'vue-router';

import store from '@/store';
import commonRouter from './common.router';
import { getToken } from '@/utils/auth';

const router = createRouter({
  history: createWebHistory(),
  routes: commonRouter
});

router.beforeEach((to, from, next) => {
  // 不需要登录
  if (!to.meta.needLogin) {
    // 如果是跳转的为登录页面，则直接跳转到公共登录页
    if(to.path === '/login' || to.path === '/username-login'){
      window.location.href = 'https://admin.huixtj.com/login'
    }else {
      next();
    }
  } else {// 需要登录
    if (getToken()) {
      const menuLoad = store.state.user.menuLoad;
      const perms = store.state.user.perms;
      if (menuLoad && !perms.includes(to.meta.code)) {
        next({
          path: '/403'
        });
      } else {
        next();
      }
    } else {
      next();
    }
  }
});

export default router;
