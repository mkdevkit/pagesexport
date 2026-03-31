# Electron 修复说明

## 方法 1：使用修复脚本（推荐）

双击运行 `fix-electron.bat` 文件，它会自动执行以下操作：
1. 删除旧的 Electron
2. 清理 npm 缓存
3. 使用国内镜像重新安装
4. 恢复 npm 源

## 方法 2：手动修复

### 步骤 1：删除 Electron
```cmd
rmdir /s /q node_modules\electron
rmdir /s /q node_modules\.bin
```

### 步骤 2：清理缓存
```cmd
npm cache clean --force
```

### 步骤 3：使用镜像安装
```cmd
npm config set registry https://registry.npmmirror.com
npm install
npm config set registry https://registry.npmjs.org
```

## 方法 3：完全重装

```cmd
rmdir /s /q node_modules
del package-lock.json
npm cache clean --force
npm install
```

## 如果以上方法都不行

### 尝试使用 yarn 代替 npm

```cmd
npm install -g yarn
yarn install
yarn electron
```

### 或者手动下载 Electron

1. 访问 https://registry.npmmirror.com/-/binary/electron/v26.6.0/electron-v26.6.0-win32-x64.zip
2. 下载后解压到 `node_modules/electron/dist/`
3. 运行 `npm run electron`

## 降级版本

如果 26.6.0 版本仍然有问题，尝试更旧的版本：

编辑 `package.json`，将 `"electron": "^26.6.0"` 改为：
- `"electron": "^25.9.0"`
- 或 `"electron": "^24.8.0"`

然后重新运行：
```cmd
npm install
```

## 验证安装

运行以下命令检查 Electron 是否正确安装：
```cmd
node node_modules/electron/cli.js --version
```

如果返回版本号，说明安装成功。
