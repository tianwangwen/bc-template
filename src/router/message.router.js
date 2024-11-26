const configRoutes = [
  {
    path: '/message',
    name: 'Message',
    component: () => import('@/views/message/index.vue'),
    meta: { title: '消息中心', noTab: false,  needLogin: false},
    hidden: true
  },
]

export default configRoutes
