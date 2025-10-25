@echo off
chcp 65001 >nul
echo ========================================
echo   启动前端开发服务器
echo ========================================
echo.

echo [1/2] 检查依赖...
if not exist "node_modules\" (
    echo 依赖未安装，正在安装...
    call npm install
    if errorlevel 1 (
        echo 依赖安装失败！
        pause
        exit /b 1
    )
)

echo [2/2] 启动开发服务器...
echo.
echo 服务器启动中，请稍候...
echo 启动成功后请访问: http://localhost:3000
echo.
echo 按 Ctrl+C 可以停止服务器
echo ========================================
echo.

npm run dev

pause

