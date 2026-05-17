@echo off
echo ========================================
echo   WSL2 升级工具 — 以管理员身份运行
echo ========================================
echo.

:: 检查是否已管理员权限
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo [*] 正在请求管理员权限...
    powershell -Command "Start-Process '%~f0' -Verb RunAs"
    exit /b
)

echo [1/4] 启用虚拟机平台...
dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart
echo.

echo [2/4] 设置 WSL2 为默认版本...
wsl --set-default-version 2
echo.

echo [3/4] 打开 WSL2 内核更新包下载页面...
start https://aka.ms/wsl2kernel
echo.

echo.
echo ========================================
echo  操作完成！请完成以下步骤：
echo ========================================
echo.
echo  1. 关闭本窗口
echo  2. 安装下载的 wsl_update_x64.msi
echo  3. 安装后回到终端，执行：
echo.
echo     wsl --set-version Ubuntu 2
echo.
echo  4. 重启 WSL 终端即可
echo.
pause
