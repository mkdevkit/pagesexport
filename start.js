#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// 从命令行参数获取配置文件路径
const configPathArg = process.argv.find(arg => arg.startsWith('--config='));
const customConfigPath = configPathArg ? configPathArg.split('=')[1] : null;

// 从命令行参数获取端口
const portArg = process.argv.find(arg => arg.startsWith('--port='));
const port = portArg ? parseInt(portArg.split('=')[1], 10) : 3000;

// 如果指定了自定义配置文件路径，设置环境变量
if (customConfigPath) {
  if (!fs.existsSync(customConfigPath)) {
    console.error(`配置文件不存在: ${customConfigPath}`);
    process.exit(1);
  }
  // 设置环境变量，让应用使用自定义的配置文件
  process.env.CONFIG_FILE_PATH = path.resolve(customConfigPath);
  console.log(`使用自定义配置文件: ${path.resolve(customConfigPath)}`);
}

// 启动 Next.js 服务器
const nodePath = process.execPath;
const nextBinPath = path.join(__dirname, 'node_modules', 'next', 'dist', 'bin', 'next');

console.log('正在启动 Next.js 服务器...');
console.log(`Node.js 版本: ${process.version}`);
console.log(`环境: ${process.env.NODE_ENV || 'development'}`);
console.log(`端口: ${port}`);

const args = ['start', '-p', String(port)];

// 如果是生产环境，添加相关参数
if (process.env.NODE_ENV === 'production') {
  console.log('生产模式');
}

const child = spawn(nodePath, [nextBinPath, ...args], {
  stdio: 'inherit',
  cwd: __dirname,
  env: {
    ...process.env,
    NODE_ENV: process.env.NODE_ENV || 'development',
  },
});

child.on('error', (err) => {
  console.error('启动 Next.js 服务器失败:', err);
  process.exit(1);
});

child.on('close', (code) => {
  console.log(`Next.js 服务器已停止，退出码: ${code}`);
  process.exit(code || 0);
});

// 处理退出信号
process.on('SIGINT', () => {
  console.log('\n正在停止服务器...');
  child.kill('SIGINT');
});

process.on('SIGTERM', () => {
  console.log('\n正在停止服务器...');
  child.kill('SIGTERM');
});
