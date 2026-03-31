@echo off
echo 正在修复 Electron 安装问题...

echo.
echo 1. 删除旧的 Electron...
rmdir /s /q node_modules\electron 2>nul
rmdir /s /q node_modules\.bin 2>nul

echo.
echo 2. 清理 npm 缓存...
call npm cache clean --force

echo.
echo 3. 安装 Electron（使用镜像）...
call npm config set registry https://registry.npmmirror.com

echo.
echo 4. 重新安装依赖...
call npm install

echo.
echo 5. 恢复 npm 源...
call npm config set registry https://registry.npmjs.org

echo.
echo 完成！请运行 npm run electron 测试
pause
