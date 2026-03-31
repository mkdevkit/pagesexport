const { app, BrowserWindow, Menu, ipcMain } = require('electron')
const path = require('path')
const fs = require('fs')
const { spawn } = require('child_process')

// 加载 preload 脚本
let preloadPath = null
try {
  preloadPath = path.join(__dirname, 'preload.js')
} catch (e) {
  console.log('Preload script not found')
}

let mainWindow
let nextServerProcess

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: false, // 允许访问本地文件
      preload: preloadPath,
    },
  })

  // 隐藏菜单栏
  Menu.setApplicationMenu(null)

  // 检查构建文件是否存在
  const buildPath = path.join(__dirname, 'out')

  if (fs.existsSync(buildPath)) {
    // 启动 Next.js 服务器
    const isWindows = process.platform === 'win32'
    const nodePath = process.execPath // 使用当前 Node.js 路径
    const nextBinPath = path.join(__dirname, 'node_modules', 'next', 'dist', 'bin', 'next')
    
    console.log('Starting Next.js server...')
    
    if (isWindows) {
      // Windows 使用 cmd 执行
      nextServerProcess = spawn('cmd', ['/c', `chcp 65001 >nul && "${nodePath}" "${nextBinPath}" start -p 3000`], {
        cwd: __dirname,
        stdio: 'inherit',
        shell: true,
      })
    } else {
      // Linux/Mac 使用 npx
      nextServerProcess = spawn(nodePath, [nextBinPath, 'start', '-p', '3000'], {
        cwd: __dirname,
        stdio: 'inherit',
      })
    }

    nextServerProcess.on('error', (error) => {
      console.error('Failed to start Next.js server:', error)
      showError(error.message)
    })

    nextServerProcess.on('close', (code) => {
      console.log(`Next.js server process exited with code ${code}`)
    })

    // 等待服务器启动后加载应用
    setTimeout(() => {
      mainWindow.loadURL('http://localhost:3000')
    }, 2000)
  } else {
    // 如果构建文件不存在，显示提示
    console.error('Build files not found. Please run: npm run build')
    showError('构建文件不存在<br>请先运行: npm run build')
  }

  mainWindow.on('closed', () => {
    mainWindow = null
    // 关闭窗口时停止 Next.js 服务器
    if (nextServerProcess) {
      nextServerProcess.kill()
    }
  })
}

function showError(message) {
  if (mainWindow) {
    mainWindow.loadURL('about:blank')
    mainWindow.webContents.executeJavaScript(`
      document.body.innerHTML = '<h1 style="padding: 40px;">错误</h1><p style="padding: 0 40px;">${message}</p>'
    `)
  }
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

app.on('before-quit', () => {
  // 应用退出前停止 Next.js 服务器
  if (nextServerProcess) {
    nextServerProcess.kill()
  }
})

// IPC: 读取配置文件
ipcMain.handle('read-config', async () => {
  const configPath = path.join(__dirname, 'config.ini')
  try {
    const content = fs.readFileSync(configPath, 'utf-8')
    return { success: true, content }
  } catch (error) {
    return { success: false, error: error.message }
  }
})

// IPC: 保存配置文件
ipcMain.handle('save-config', async (event, content) => {
  const configPath = path.join(__dirname, 'config.ini')
  try {
    fs.writeFileSync(configPath, content, 'utf-8')
    return { success: true }
  } catch (error) {
    return { success: false, error: error.message }
  }
})

// IPC: 打开配置文件所在文件夹
ipcMain.handle('open-config-folder', async () => {
  const configPath = path.join(__dirname, 'config.ini')
  try {
    const { shell } = require('electron')
    shell.showItemInFolder(configPath)
    return { success: true }
  } catch (error) {
    return { success: false, error: error.message }
  }
})
