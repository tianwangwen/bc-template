const configRoutes = [
  {
    path: 'sms',
    name: 'Sms',
    code: 'DD_STP_SMS_MANAGE',
    meta: { title: '短信管理', icon: 'Message' },
    children: [
      {
        path: 'batch-sms',
        name: 'BatchSms',
        code: 'DDSTP_OWNER_BATCH_SEND_SMS',
        component: () => import('@/views/sms/batch-sms/index.vue'),
        meta: { title: '短信批量发送' }
      },
    ]
  }
]

export default configRoutes
