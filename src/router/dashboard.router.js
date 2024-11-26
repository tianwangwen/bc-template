const configRoutes = [
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/views/dashboard/index.vue'),
    meta: { title: '首页', code: 'HRM_INDEX', icon: 'Monitor', level: 1 },
  }
]

export default configRoutes
