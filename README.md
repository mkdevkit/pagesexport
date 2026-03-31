# Astro Content Manager

Astro 网站内容管理工具，用于管理文章、分类、标签，并导出为 Markdown 格式供 Astro 使用。

## 功能特性

- 📝 文章管理：创建、编辑、删除文章
- 🏷️ 分类和标签管理
- 🖼️ 图片上传和管理
- 📤 导出到 Astro：生成带 frontmatter 的 Markdown 文件
- 🌐 支持中英双语

## 安装

```bash
npm install
```

## 使用方法

### 开发模式

```bash
npm run dev
```

访问 http://localhost:3000

### 生产模式

```bash
# 构建
npm run build

# 启动（使用默认配置文件 config.ini）
npm start

# 或使用自定义配置文件
npm start -- --config=/path/to/your/config.ini
```

## 配置文件 (config.ini)

配置文件必须包含以下配置项：

```ini
[config]
astro_export_dir = ./astro_export  # Astro 文件导出目录
sqlite_db_dir = ./data           # SQLite 数据库目录
draft_root_dir = ./drafts         # 草稿根目录
image_url_prefix = /uploads        # 图片 URL 前缀（可选）
```

## 项目结构

```
.
├── app/                    # Next.js 应用目录
│   ├── api/               # API 路由
│   │   ├── articles/       # 文章相关 API
│   │   ├── categories/     # 分类相关 API
│   │   ├── tags/          # 标签相关 API
│   │   └── config/        # 配置管理 API
│   ├── articles/          # 文章页面
│   ├── categories/        # 分类页面
│   ├── tags/             # 标签页面
│   └── config/           # 配置管理页面
├── lib/                  # 工具库
│   ├── db.ts            # 数据库操作
│   ├── config.ts        # 配置管理
│   ├── export.ts        # 导出功能
│   └── file-utils.ts    # 文件操作工具
├── types/               # TypeScript 类型定义
├── config.ini           # 配置文件
└── start.js            # 启动脚本
```

## 导出格式

导出的 Markdown 文件包含以下 frontmatter：

```yaml
---
title:
  en: "Article Title"
  zh-CN: "文章标题"
address: 123
thumbnail: "/uploads/image.jpg"
preview: "Preview text"
description:
  en: "Description"
  zh-CN: "描述"
categories: ["category1", "category2"]
tags: ["tag1", "tag2"]
date: 2026-03-31
---

Article content in Markdown format...
```

## 开发

### 添加新功能

1. 在 `lib/` 中添加工具函数
2. 在 `app/api/` 中创建 API 路由
3. 在 `app/` 中创建页面组件

### 类型定义

类型定义位于 `types/index.ts`：

- `Article`: 文章模型
- `Category`: 分类模型
- `Tag`: 标签模型
- `ArticleWithRelations`: 包含关联数据的文章模型

## 故障排除

### 数据库错误

如果遇到数据库错误，请检查：
1. `config.ini` 中的 `sqlite_db_dir` 配置
2. 目录是否有写入权限
3. 是否有其他进程正在使用数据库文件

### 导出失败

如果导出失败，请检查：
1. `config.ini` 中的 `astro_export_dir` 配置
2. 目录是否存在且有写入权限
3. 文章是否已发布状态

## 许可证

MIT
