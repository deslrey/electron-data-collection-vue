import { app, shell, BrowserWindow, ipcMain, session } from 'electron'
import path, { join } from 'path'
import fs from 'fs'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { exec } from 'child_process'

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      webviewTag: true
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// 监听渲染进程的消息
ipcMain.handle('run-user-crawl', async () => {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(process.cwd(), 'src/userScripts/user-crawl-3.js')
    exec(`node "${scriptPath}"`, (error, stdout, stderr) => {
      if (error) {
        resolve({ success: false, error: stderr || error.message })
      } else {
        // 尝试解析 JSON
        try {
          const data = JSON.parse(stdout)
          resolve({ success: true, data })
        } catch (e) {
          const match = stdout.match(/===JSON_START===(.*?)===JSON_END===/s)
          if (match) {
            const jsonStr = match[1].trim()
            const data = JSON.parse(jsonStr)
            resolve({ success: true, data })
          } else {
            resolve({ success: false, error: '未找到有效的JSON: ' + stdout })
          }
        }
      }
    })
  })
})

ipcMain.handle('save-session-data', async (event, { url, storage }) => {
  const cookies = await session.defaultSession.cookies.get({ url })
  fs.writeFileSync('cookies.json', JSON.stringify(cookies, null, 2))
  fs.writeFileSync('storage.json', JSON.stringify(storage, null, 2))
  return { success: true }
})
