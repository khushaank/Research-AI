@echo off
echo Updating Research Hub...
python scripts/generate_index.py
if %errorlevel% neq 0 (
    echo Error running script. Make sure Python is installed and in your PATH.
    pause
    exit /b 1
)
echo Success! Website index updated.
pause
