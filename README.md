# Astro Content Manager

一个用于管理 Astro 站点内容并导出 Astro 文件的工具。

## 功能特性

1. **配置管理**: 通过 `config.ini` 配置文件管理路径
2. **分类管理**: 支持分类的增删改查,中英文命名
3. **标签管理**: 支持标签的增删改查,中英文命名
4. **文章管理**: 支持文章的增删改查,带分页功能
5. **图片管理**: 支持上传图片到草稿目录,发布时自动复制到导出目录
6. **文章发布**: 支持将草稿文章发布,自动导出为 Astro 文件
7. **批量导出**: 支持一键导出所有已发布文章
8. **Electron 打包**: 支持打包为桌面应用

## 安装和运行

### 开发模式

```bash
# 安装依赖
npm install

# 运行开发服务器
npm run dev
```

访问 `http://localhost:3000` 查看应用。

### Electron 模式

```bash
# 启动 Electron 应用
npm run electron
```

### 打包应用

```bash
# 打包 Electron 应用
npm run electron:build
```

## 配置说明

编辑 `config.ini` 文件配置路径:

```ini
[config]
astro_export_dir = ./astro_export
sqlite_db_dir = ./data
draft_root_dir = ./drafts
```

- `astro_export_dir`: Astro 文件导出目录
- `sqlite_db_dir`: SQLite 数据库目录
- `draft_root_dir`: 草稿根目录

## Astro 文件导出格式

导出的文件格式如下:

```yaml
---
title:
  en: "Mahjong Triple 3D Tile Match"
  zh-CN: "欢乐小球"
address: https://example.com/game
thumbnail: "https://example.com/thumb.jpg"
preview: "https://example.com/preview.jpg"
description:
  en: "English description"
  zh-CN: "中文描述"
categories: ["Casual", "Agility"]
tags: ["Physics", "High Score"]
date: 2024-03-30
---

# DESCRIPTION

Article content...
```

## 项目结构

```
pagesexport/
├── app/
│   ├── api/              # API 路由
│   │   ├── articles/     # 文章相关 API
│   │   ├── categories/   # 分类相关 API
│   │   ├── tags/         # 标签相关 API
│   │   ├── upload/       # 图片上传 API
│   │   ├── export/       # 导出 API
│   │   └── stats/        # 统计 API
│   ├── articles/         # 文章管理页面
│   ├── categories/       # 分类管理页面
│   ├── tags/             # 标签管理页面
│   ├── layout.tsx        # 根布局
│   ├── page.tsx          # 首页
│   └── globals.css       # 全局样式
├── lib/
│   ├── db.ts             # 数据库操作
│   ├── config.ts         # 配置管理
│   ├── export.ts         # 导出逻辑
│   ├── file-utils.ts     # 文件工具
│   └── ini.ts            # INI 解析
├── types/
│   └── index.ts          # 类型定义
├── config.ini            # 配置文件
├── main.js               # Electron 主进程
└── package.json          # 项目配置
```

## 技术栈

- **前端框架**: Next.js 14 (App Router)
- **数据库**: SQLite (better-sqlite3)
- **UI**: Tailwind CSS
- **桌面应用**: Electron
- **Markdown 处理**: gray-matter

## 使用流程

1. 配置 `config.ini` 文件
2. 运行应用
3. 创建分类和标签
4. 创建新文章,填写信息
5. 上传图片到草稿目录
6. 发布文章(会自动复制文件并导出 Astro 文件)
7. 或使用"导出所有文章"功能批量导出
