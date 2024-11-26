import Layout from '@/layout/index.vue'
import Home from '@/views/dashboard/index.vue'
import messageRoutes from './message.router'
import smsRoutes from './sms.router'
import Page404 from '@/views/404.vue'

const commonRoutes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
    meta: { title: '登录', icon: 'icon-ic_shouye', noTab: true },
    hidden: true
  },
  {
    path: '/update-password',
    name: 'UpdatePassword',
    component: () => import('@/views/login/update-password.vue'),
    meta: { title: '修改密码', icon: 'icon-ic_shouye', noTab: true },
    hidden: true
  },
  {
    path: '/forget-password',
    name: 'ForgetPassword',
    component: () => import('@/views/login/forget-password.vue'),
    meta: { title: '忘记密码', icon: 'icon-ic_shouye', noTab: true },
    hidden: true
  },
  {
    path: '/:pathMatch(.*)*',
    name: '404',
    component: Page404,
    hidden: true
  },
  {
    path: '/',
    name: 'Home',
    component: Layout,
    redirect: '/home',
    meta: { title: '我的首页', icon: 'eye' },
    children: [
      {
        path: 'home',
        name: 'Dashboard',
        code: 'DD_STP_HOME',
        meta: { title: '我的首页', icon: 'Odometer', collapseTitle: false },
        component: Home
      },
      ...messageRoutes,
      ...smsRoutes,
    ]
  },
]

export default commonRoutes
