# 安装说明

## 系统要求

- Node.js: v24.14.1 或更高版本（内置 SQLite 支持）
- npm: v8.x 或更高版本
- 操作系统: Windows, macOS, Linux

## 依赖安装

```bash
npm install
```

## 新增依赖

- `@uiw/react-md-editor`: Markdown 编辑器
- `lucide-react`: 图标库
- `node:sqlite`: SQLite 数据库（Node.js 24+ 内置）

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

