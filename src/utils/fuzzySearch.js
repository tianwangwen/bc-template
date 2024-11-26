const findNumberRanger = (numbers, value) => {
  if (!numbers || ((numbers[0] === undefined || numbers[0] === '') && (numbers[1] === undefined || numbers[1] === ''))) return true
  if (!value && value !== 0) return false
  if ((numbers[0] !== undefined && numbers[0] !== '') && Number(numbers[0]) > value) return false
  if ((numbers[1] !== undefined && numbers[1] !== '') && Number(numbers[1]) < value) return false
  return true
}

const findNumber = (number, data) => {
  return Object.keys(data).find((item) => {
    return (typeof data[item] === 'string' || typeof data[item] === 'number') ? Number(data[item]) === number : false
  })
}

const findString = (str, data) => {
  if (!str) return data
  return Object.keys(data).find((item) => {
    return typeof data[item] === 'string' ? data[item].indexOf(str.trim()) > -1 : (typeof data[item] === 'number' ? Number(str) ===  data[item]: false)
  })
}

const findBoolean = (bool, data) => {
  if (!bool && bool !== false) return data
  return Object.keys(data).find((item) => {
    return typeof data[item] === 'boolean' ? data[item] === bool : false
  })
}

/*
  @params
    value: 输入字符 或 对象 或 数组
      ex: { type: 'string', value: userAddress, key: 'userAddress' },
          { type: 'number', value: userAge, key: 'userAge' },
          { type: 'range', value: [dunAmountStart, dunAmountEnd], key: 'dunAmount' }
          { type: 'string', value: '测试', key: ['test1', 'test2'] }
          { type: 'map', value: userAddress, key: 'userAddress', map: [] },
          { type: 'string', value: userAddress, excludeKey: 'userAddress', map: [] },
    data: 数组
*/
export default (value, data) => {
  if (!value || !data || !Array.isArray(data)) return data
  const t = Array.isArray(value) ? value : [value]
  if (!t.length) return data
  const target = data.filter((item) => {
    if (!item) return
    const d = t.every((i) => {
      if (i.value === null || i.value === '' || i.value === undefined) return true
      if (typeof i === 'string') return findString(i, item)
      if (typeof i === 'object') {
        let targetItem = {}
        if (i.key) {
          Object.keys(item).forEach((j) => {
            if ((typeof i.key === 'string') ? j === i.key : i.key.includes(j)) {
              targetItem[j] = item[j]
            }
          })
        } else if (i.excludeKey) {
          Object.keys(item).filter((j) => {
            if ((typeof i.key === 'string') ? j !== i.excludeKey : !i.key.includes(j)) {
              targetItem[j] = item[j]
            }
          })
        } else {
          targetItem = item
        }
        if (i.type === 'string') {
          return findString(i.value, targetItem)
        } else if (i.type === 'number') {
          return findNumber(Number(i.value), targetItem)
        } else if (i.type === 'boolean') {
          return findBoolean(i.value, targetItem)
        } else if (i.type === 'range') {
          return findNumberRanger(i.value, targetItem[i.key])
        }
      }
    })
    return d
  })
  return target
}