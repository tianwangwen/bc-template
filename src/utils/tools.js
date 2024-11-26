import clone from 'clone'
import { useRoute } from 'vue-router'
import store from '@/store'
/*
  将扁平数组通过 parentId 关联成树形结构
    默认顶级 parentId 为0
    默认关联子集的字段名为 children
  @params list <Array>
  @params label <String> 在树中展示字段
  @params value <String> list item 中 parentId 指向的字段名
  
  例子：
  原数据 = [
    {
      orgId: 1,
      orgName: '信也',
      parentId: 0,
      status: true
    },
    {
      orgId: 2,
      orgName: '铂锌',
      parentId: 0,
      status: true
    },
    {
      orgId: 3,
      orgName: '业务中台',
      parentId: 1,
      status: true
    }
  ]

  转化后 = [
    {
      orgId: 1,
      orgName: '信也',
      label: '信也',
      parentId: 0,
      status: true,
      children: [
        {
          orgId: 3,
          orgName: '业务中台',
          label: '业务中台',
          parentId: 1,
          status: true
        }
      ]
    },
    {
      orgId: 2,
      orgName: '铂锌',
      parentId: 0,
      status: true,
      children: []
    },
  ]
*/
export const findMinParentId = (data = []) => {
  let minParentId = Infinity
  data.forEach((item) => {
    minParentId = minParentId > item.parentId ? item.parentId : minParentId
  })
  return minParentId || 0
}

export const handleListToTree = (list, label = 'name', value = 'id', parentId = 0) => {
  const residueList = clone(list, false);
  const tree = [];
  const getChildList = (parentsList, residueList, parentId) => {
    if (!residueList.length) return;
    residueList.forEach((item, index) => {
      if (parentId === item.parentId) {
        const targetData = {
          ...item,
          label: item[label],
          value: item[value],
          children: [],
        };
        parentsList.push(targetData);
        const r = clone(residueList, false);
        r.splice(index, 1);
        getChildList(targetData.children, r, item[value]);
      }
    })
  };
  getChildList(tree, residueList, parentId);
  return tree;
}

// 将树结构转化为 list，通过 parentId 关联起来
export const handleTreeToList = (tree, value = 'id', parentId = 0) => {
  const residueTree = clone(tree, false);
  const list = [];
  const forEachTree = (residueTree, parentId) => {
    residueTree.forEach((item) => {
      if (item.children && item.children.length) {
        forEachTree(item.children, item[value]);
      }
      const target = {
        ...item,
        parentId
      }
      delete target.children
      list.push(target)
    })
  }
  forEachTree(residueTree, parentId);
  return list;
}

// 从树结构中筛选出目标值，仍保留树结构
export const filterTree = (tree, values, key = 'id', label = 'name') => {
  const parentId = 0;
  const list = handleTreeToList(tree, key)
  const targetList = []
  // const fn2 = (id) => {
  //   const t = list.filter((i) => i.parentId === id)
  //   if (!t || !t.length) return
  //   targetList.push(...t)
  //   t.forEach((item) => {
  //     fn2(item.id)
  //   })
  // }
  const fn = (id) => {
    // fn2(id)
    const t = list.find((i) => i[key] === id)
    if (!t) return
    if (t.parentId !== parentId) {
      fn(t.parentId)
    }
    targetList.push(t)
  }
  values.forEach((item) => {
    fn(item[key])
  })
  return handleListToTree([...new Set(targetList)], label, key)
}

export const clearTabs = () => {
  localStorage.removeItem(TABSKEY)
}

export function formatNumberStripEndZero(amount, num) {
  if (!amount) return amount
  if (isNaN(Number(amount))) return amount
  amount = num ? String(Number(amount).toFixed(num)) : String(amount)
  let isNegative = amount.startsWith('-')
  amount = isNegative ? amount.substring(1, amount.length) : amount
  let iAmount = amount.split('.')[0]
  let dAmount = amount.split('.')[1]
  let reversedAmount = iAmount.split('').reverse()
  let computedArr = []
  for (let i = 0; i < reversedAmount.length; i++) {
    computedArr.unshift(reversedAmount[i])
    if (i % 3 === 2 && i !== reversedAmount.length - 1) {
      computedArr.unshift(',')
    }
  }
  let returnStr = computedArr.join('') + (dAmount ? '.' + dAmount : '')
  return isNegative ? '-' + returnStr : returnStr
}

export const getScroll = () => {
  const route = useRoute()
  const scrollTop = store.state.app.scrollList[route.name] || 0;
  const $content = document.querySelector(route.meta.scrollEl || '#main');
  if (scrollTop && $content) {
    $content.scrollTop = scrollTop;
  }
};
