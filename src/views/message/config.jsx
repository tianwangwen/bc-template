import { getLastTowMonth } from '@/utils/tools'
import dayjs from 'dayjs'

export default {
  apis: {
    searchApi: {
      method: 'post',
      url: '/admin/hrm/messageCenter/pageList',
      handleParams(params) {
        return {
          ...params,
          startTime: dayjs(params.startTime).format('YYYY-MM-DD 00:00:00'),
          endTime: dayjs(params.endTime).format('YYYY-MM-DD 23:59:59'),
          hasRead: this.pageNode.unreadOnly.value ? 0 : 1,
          mediateCenterId: 0,
          appId: 0,
          seatsId: 0,
        }
      },
      handleResult(result) {
        const data = result.code === 0 ? (result.result || {}).data || [] : []
        if (data.filter(x => x.hasRead === 0).length) {
          this.sendApi(
            {
              url: '/admin/hrm/messageCenter/read',
              success() {
                this.sendApi({
                  url: '/admin/hrm/messageCenter/unreadCount',
                  success(result) {
                    if (result.code === 0) {
                      this.$store.commit('app/setMessageNum', result.result.unReadCount || 0)
                    }
                  }
                })
              }
            },
            {
              ids: data.filter(x => x.hasRead === 0).map(x => x.id)
            }
          )
        }
        return result
      }
    }
  },
  tableConfig: {
    columns: [
      {
        prop: 'msgTypeDesc',
        label: '消息种类',
        colType: 'jsx',
        jsx(h, { row }) {
          return <span className={row.hasRead === 0 ? 'msg-unread' : ''}>{row.msgTypeDesc}</span>
        }
      },
      {
        prop: 'content',
        label: '消息类型',
        colType: 'jsx',
        jsx(h, { row }) {
          return <span className='msg-content' v-html={row.content} />
        }
      },
      {
        prop: 'inserttime',
        label: '消息时间'
      }
    ],
    config: {
      other: {
        height: 'calc(100vh - 270px)'
      }
    }
  },
  buttons: {},
  forms: {
    searchForm: {
      formItemWidth: 120,
      key: 'searchForm',
      data: [
        {
          key: 'content',
          data: {
            placeholder: '消息内容',
            clearable: true
          }
        },
        {
          key: 'msgTypes',
          type: 'Select',
          data: {
            placeholder: '消息种类',
            clearable: true,
            multiple: true,
            collapseTags: true,
            collapseTagsTooltip: true,
            style: {
              width: '200px'
            }
          },
          getOptionsFromVariables: {
            variableKey: 'msgTypeVariable'
          }
        },
        {
          label: '消息时间',
          useFormItemConfig: 'datetimerange',
          data: {
            value: getLastTowMonth(),
            'start-placeholder': '开始日期',
            'end-placeholder': '结束日期',
            type: 'daterange',
            'value-format': 'YYYY-MM-DD',
            style: {
              width: '260px'
            }
          }
        }
      ]
    }
  },
  buttonGroup: ['searchButton'],
  dialogs: {},
  variables: {}
}
