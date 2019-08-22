@echo off
call npm run watch
if %ERRORLEVEL% gtr 0 pause
