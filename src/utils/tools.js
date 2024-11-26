import clone from 'clone'
import dayjs from 'dayjs'
import { ElMessage } from 'element-plus';

// 将树结构转化为 list，通过 parentId 关联起来
export const handleTreeToList = (tree, value = 'id', parentId = 0) => {
  const residueTree = clone(tree, false)
  const list = []
  const forEachTree = (residueTree, parentId) => {
    residueTree.forEach(item => {
      if (item.children && item.children.length) {
        forEachTree(item.children, item[value])
      }
      const target = {
        ...item,
        parentId
      }
      delete target.children
      list.push(target)
    })
  }
  forEachTree(residueTree, parentId)
  return list
}

export const getLastTowMonth = () => {
  return [dayjs().subtract(60, 'd').format('YYYY-MM-DD 00:00:00'), dayjs().format('YYYY-MM-DD 23:59:59')]
}

export function getFileExtension(filename) {
  const match = filename.match(/\.([^.]*)$/)
  return match ? match[1] : ''
}

export const createUUId = (len, radix) => {
  let chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('')
  let uuid = []
  let i = 0
  let r = 0
  radix = radix || chars.length
  if (len) {
    for (i = 0; i < len; i++) {
      uuid[i] = chars[0 | (Math.random() * radix)]
    }
  } else {
    uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-'
    uuid[14] = '4'
    for (i = 0; i < 36; i++) {
      if (!uuid[i]) {
        r = 0 | (Math.random() * 16)
        uuid[i] = chars[i === 19 ? (r & 0x3) | 0x8 : r]
      }
    }
  }
  return uuid.join('')
}

export const getLabel = (data, variables) => {
  let result = data
  if (typeof data === 'object') {
    if (data.length && variables.length) {
      result = data.map(x => variables.find(y => y.value === x)?.label).join(',')
    }
  } else if (typeof data === 'string' || typeof data === 'number') {
    if (variables.length) {
      result = variables.find(x => x.value === data)?.label
    }
  }
  return result
}

export function arrayDiff(a, b) {
  return a.concat(b).filter(v => !a.includes(v) || !b.includes(v))
}

export function pwCheck(value) {
  const length = value.length
  return length >= 8 && length <= 12 && /\d+/g.test(value) && /[a-z]+/g.test(value) && /[A-Z]+/g.test(value) && /[@$!%*?&]/g.test(value) && !/\s/g.test(value)
}

export const copy = (value) => {
    let inputEl = document.createElement('input');
    document.body.appendChild(inputEl);
    inputEl.setAttribute('value', value);
    inputEl.select();
    document.execCommand('copy');
    ElMessage.success('复制成功');
    inputEl.remove();
};

export const formatSeconds = (second) => {
  let seconds = second / 1000;
  let hours = Math.floor(seconds / 3600);
  let minutes = Math.floor((seconds % 3600) / 60);
  let remainingSeconds = seconds % 60;
  let result = hours.toString().padStart(2, '0') + ':' + minutes.toString().padStart(2, '0') + ':' + parseInt(remainingSeconds).toString().padStart(2, '0');
  return result;
};

// 判断是否为图片
export const isImage = fileName => {
  return /\.(jpg|jpeg|png|gif|webp|svg|bmp|ico)$/.test(fileName.toLowerCase())
}



// 处理文件key和code关系
export const KeyCode = {
  idcardFront: 101,  // 身份证正面
  idcardback: 102,  // 身份证反面
  resume: 104,  // 简历
  bankCardFront: 109, // 银行卡正面
  bankCardback: 110, // 银行卡反面面
  degreeCertificate: 103, // 学历证明
  criminalRecord: 105, // 无犯罪证明
  creditReport: 106, // 征信报告
  mediatorCertificate: 107, // 调解员证书
  healthExamination: 108, // 体检表
  contract: 111,  // 合同
  avatar: 301 // 头像
}

export const  educationLevelKeyCode = {
  1: '博士研究生',
  2: '硕士研究生',
  3: '本科',
  4: '专科',
  5: '中专',
  6: '高中',
  7: '初中',
  8: '小学',
}

export const  degreeLevelKeyCode = {
  3: '博士',
  2: '硕士',
  1: '学士',
  0: '无',
}

/*==========================离职资料=============================================== */
// DIMISSION_CONFIRMATION_FORM(201, "离职申请确认表", DocumentTypeEnum.DIMISSION, true),
// TERMINATION_AGREEMENT(202, "解除协议", DocumentTypeEnum.DIMISSION, true),
// ATTENDANCE_CONFIRMATION(203, "考勤确认表", DocumentTypeEnum.DIMISSION, false),
// DIMISSION_CERTIFICATE_STUB(204, "离职证明存根表", DocumentTypeEnum.DIMISSION, false),
// DIMISSION_HANDOVER_FORM(205, "离职交接表", DocumentTypeEnum.DIMISSION, false)
// CONTRACT(111, "合同", DocumentTypeEnum.ONBOARDING, true)

export const dimissionKeyCode = {
  confirmationOfDimissionApplication: 201, // 离职申请确认表
  terminationOfAgreement: 202, // 解除协议
  resignationCertificateStub: 204, // 离职证明存根表
  healthCheckupForm: 203, // 体检表
  handoverForm: 205, // 离职交接表
}

export function getFileNameFromURL(url) {
  if (!url) return;
  try {
    const urlObject = new URL(url);

    // 获取路径名部分
    const pathname = urlObject.pathname;

    // 从路径名中提取文件名（最后一个部分）
    const fileName = pathname.split('/').pop();

    return fileName;
      // 创建一个 URL 对象
  } catch (error) {
      console.error('Invalid URL');
      return undefined;
  }
}
