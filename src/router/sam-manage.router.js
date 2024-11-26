const configRoutes = [
  {
    path: 'sam',
    name: 'SamManage',
    meta: { title: '坐席管理', code: 'HRM_USER_ADMIN', icon: 'Config', level: 1 },
    children: [
      {
        path: '/resource',
        name: 'ResourceManage',
        component: () => import('@/views/sma-manage/resource/index.vue'),
        meta: { title: '资料管理', code: 'HRM_USER_ADMIN_RESOURCE', needLogin: true, level: 2 }
      },
    ]
  }
]

export default configRoutes
