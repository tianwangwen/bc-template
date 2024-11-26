const configRoutes = [
  {
    path: 'message',
    name: 'Message',
    code: 'Message',
    meta: { title: '消息中心', icon: 'Setting' },
    children: [
      {
        path: '/message-list',
        name: 'MessageList',
        code: 'MessageList',
        component: () => import('@/views/message/index.vue'),
        meta: { title: '消息中心' }
      },
    ]
  }
]

export default configRoutes
