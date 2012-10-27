@echo off

:: current file directory
pushd "%~dp0"

:: all options are passed to build script
:: node must be in your path.
node build %*