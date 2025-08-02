import { ElMessageBox } from 'element-plus'

export const confirm = (message: string, okfun: Function, failfun: Function) => {
  ElMessageBox.confirm(message, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'info'
  })
    .then(() => {
      if (okfun) {
        okfun()
      }
    })
    .catch(() => {
      if (failfun) {
        failfun()
      }
    })
}
