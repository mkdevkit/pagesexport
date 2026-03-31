# 安装说明

## 系统要求

- Node.js: v18.x 或更高版本（推荐 v20.x）
- npm: v8.x 或更高版本
- 操作系统: Windows, macOS, Linux

## 依赖安装

```bash
npm install
```

## 如果遇到原生模块编译问题

### 问题：`better-sqlite3` 版本不匹配

如果遇到以下错误：
```
was compiled against a different Node.js version using NODE_MODULE_VERSION 119
```

### 解决方案

**方案 1：重新编译**
```bash
npm rebuild better-sqlite3
```

**方案 2：重新安装**
```bash
npm install better-sqlite3@latest
```

**方案 3：完全清理后重装**
```bash
# Windows
Remove-Item -Recurse -Force node_modules
Remove-Item -Force package-lock.json
npm cache clean --force
npm install

# Mac/Linux
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

## 新增依赖

- `@uiw/react-md-editor`: Markdown 编辑器
- `lucide-react`: 图标库
- `better-sqlite3`: SQLite 数据库（原生模块）

## 运行项目

### 开发模式
```bash
npm run dev
```

访问 `http://localhost:3000`

### Electron 模式

**构建并运行**
```bash
npm run build          # 构建 Next.js
npm run export         # 导出静态文件
npm run electron       # 运行 Electron
```

**一键构建运行**
```bash
npm run electron:build
```

**打包应用**
```bash
npm run electron:build  # 安装包在 dist 目录
```

## Electron 安装问题

如果 Electron 安装失败，请参考 `ELECTRON_FIX.md` 文件。

