# 1. 设置国内高速镜像（解决下载失败）
$env:ELECTRON_MIRROR="https://npmmirror.com/mirrors/electron/"
$env:NPM_CONFIG_ELECTRON_MIRROR="https://npmmirror.com/mirrors/electron/"

# 2. 直接执行你的打包命令
npm.cmd run electron:build