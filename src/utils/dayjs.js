import dayjs from 'dayjs'
// 默认选择七天
export const default7Days = () => ({
  "value": [dayjs().add(-6, 'd').format('YYYY-MM-DD 23:59:59'), dayjs().format('YYYY-MM-DD 00:00:00')]
})

export const maxDaysRange = (day) => {
  let beginTime;
  return {
    "data": {
      'disabled-date'(date) {
        if (!beginTime) {
          return new Date(date).getTime() > new Date().getTime()
        } else {
          return new Date(date).getTime() > new Date().getTime() || (dayjs(date).valueOf() > dayjs(beginTime).add(day - 1, 'd').valueOf() || dayjs(date).valueOf() < dayjs(beginTime).add(-(day - 1), 'd').valueOf())
        }
      }
    },
    "change": {
      "calendar-change"(data = []) {
        if (!data[1]) {
          beginTime = data[0]
        } else {
          beginTime = undefined
        }
      }
    }
  }
}