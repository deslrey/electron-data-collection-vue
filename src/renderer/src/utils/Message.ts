import { ElNotification } from 'element-plus'

const showMessage = (
  message: string,
  type: 'success' | 'error' | 'warning' | 'info',
  callback?: Function
) => {
  ElNotification({
    title:
      type === 'error'
        ? '错误'
        : type === 'success'
          ? '成功'
          : type === 'warning'
            ? '警告'
            : '提示',
    message,
    type,
    duration: 2000,
    showClose: true,
    offset: 50,
    onClose: () => {
      if (callback) {
        callback()
      }
    }
  })
}

const message = {
  error: (message: string, callback?: Function) => {
    showMessage(message, 'error', callback)
  },
  success: (message: string, callback?: Function) => {
    showMessage(message, 'success', callback)
  },
  warning: (message: string, callback?: Function) => {
    showMessage(message, 'warning', callback)
  },
  info: (message: string, callback?: Function) => {
    showMessage(message, 'info', callback)
  }
}

export default message
