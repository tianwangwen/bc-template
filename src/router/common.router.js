import Layout from '@/layout/index.vue';
import dashboardRoutes from './dashboard.router';
import samManageRoutes from './sam-manage.router';
import messageRoutes from './message.router';
import Page403 from '@/views/403.vue';
import Page404 from '@/views/404.vue';

const commonRoutes = [
  {
    path: '/403',
    name: '403',
    component: Page403,
    meta: { title: '403', noTab: true, needLogin: false },
    hidden: true
  },
  {
    path: '/',
    name: 'Layout',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: '/:pathMatch(.*)*',
        name: '404',
        component: Page404,
        meta: { title: '404', noTab: true, needLogin: false },
        hidden: true
      },
      ...dashboardRoutes,
      ...samManageRoutes,
      ...messageRoutes,
    ]
  }
];

export default commonRoutes;
