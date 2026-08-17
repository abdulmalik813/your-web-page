@echo off
setlocal EnableExtensions EnableDelayedExpansion
title Docker Network SSH Tunnel
color 0A

REM ============================================================
REM CONFIGURATION
REM ============================================================

set "SSH_HOST=ssh.yourwebpage.ca"

REM Maximum life of abandoned proxy container in seconds.
REM 43200 = 12 hours
set "PROXY_MAX_LIFE=43200"

REM Unique proxy name for this run.
set "PROXY_NAME=docker-ssh-tunnel-%RANDOM%-%RANDOM%"

set "TMP_CONTAINERS=%TEMP%\docker-tunnel-containers-%RANDOM%.txt"
set "TMP_NETWORKS=%TEMP%\docker-tunnel-networks-%RANDOM%.txt"
set "TMP_PORTS=%TEMP%\docker-tunnel-ports-%RANDOM%.txt"
set "TMP_PROXY=%TEMP%\docker-tunnel-proxy-%RANDOM%.txt"

set "PROXY_CREATED=0"


REM ============================================================
REM START
REM ============================================================

:START

cls

echo ============================================================
echo  Docker Network SSH Tunnel
echo ============================================================
echo.
echo SSH Host:
echo   %SSH_HOST%
echo.
echo Connecting to server...
echo.


REM ============================================================
REM TEST SSH
REM ============================================================

ssh ^
  -o ConnectTimeout=15 ^
  -o ServerAliveInterval=30 ^
  -o ServerAliveCountMax=3 ^
  "%SSH_HOST%" ^
  "echo connected" >nul

if errorlevel 1 (
    echo ERROR: SSH connection failed.
    echo.
    pause
    goto EXIT_SCRIPT
)

echo SSH connection successful.
echo.


REM ============================================================
REM GET RUNNING CONTAINERS
REM ============================================================

echo Loading running Docker containers...
echo.

ssh "%SSH_HOST%" ^
  "docker ps --format '{{.Names}}|{{.Image}}'" ^
  > "%TMP_CONTAINERS%"

if errorlevel 1 (
    echo ERROR: Could not retrieve Docker containers.
    pause
    goto EXIT_SCRIPT
)


REM ============================================================
REM DISPLAY CONTAINERS
REM ============================================================

set /a CONTAINER_COUNT=0

echo ============================================================
echo  Running Containers
echo ============================================================
echo.

for /f "usebackq tokens=1,* delims=|" %%A in ("%TMP_CONTAINERS%") do (

    set /a CONTAINER_COUNT+=1

    set "CONTAINER_!CONTAINER_COUNT!=%%A"
    set "IMAGE_!CONTAINER_COUNT!=%%B"

    echo !CONTAINER_COUNT!^) %%A
    echo     Image: %%B
    echo.
)

if !CONTAINER_COUNT! EQU 0 (
    echo No running containers found.
    pause
    goto EXIT_SCRIPT
)


REM ============================================================
REM SELECT CONTAINER
REM ============================================================

:SELECT_CONTAINER

set "CONTAINER_CHOICE="

set /p "CONTAINER_CHOICE=Choose container number: "

if "!CONTAINER_CHOICE!"=="" goto BAD_CONTAINER

for /f "delims=0123456789" %%A in ("!CONTAINER_CHOICE!") do goto BAD_CONTAINER

if !CONTAINER_CHOICE! LSS 1 goto BAD_CONTAINER
if !CONTAINER_CHOICE! GTR !CONTAINER_COUNT! goto BAD_CONTAINER

goto CONTAINER_SELECTED


:BAD_CONTAINER

echo Invalid container number.
goto SELECT_CONTAINER


:CONTAINER_SELECTED

for %%A in (!CONTAINER_CHOICE!) do (
    set "CONTAINER=!CONTAINER_%%A!"
    set "IMAGE=!IMAGE_%%A!"
)

cls

echo ============================================================
echo  Selected Container
echo ============================================================
echo.
echo Name:
echo   !CONTAINER!
echo.
echo Image:
echo   !IMAGE!
echo.


REM ============================================================
REM GET NETWORKS
REM ============================================================

ssh "%SSH_HOST%" ^
  "docker inspect '!CONTAINER!' --format '{{range $name,$net := .NetworkSettings.Networks}}{{$name}}|{{$net.IPAddress}}{{println}}{{end}}'" ^
  > "%TMP_NETWORKS%"

if errorlevel 1 (
    echo ERROR: Could not inspect container networks.
    pause
    goto EXIT_SCRIPT
)

set /a NETWORK_COUNT=0

echo ============================================================
echo  Available Networks
echo ============================================================
echo.

for /f "usebackq tokens=1,2 delims=|" %%A in ("%TMP_NETWORKS%") do (

    if not "%%B"=="" (

        set /a NETWORK_COUNT+=1

        set "NETWORK_!NETWORK_COUNT!=%%A"
        set "IP_!NETWORK_COUNT!=%%B"

        echo !NETWORK_COUNT!^) %%A
        echo     IP: %%B
        echo.
    )
)

if !NETWORK_COUNT! EQU 0 (
    echo ERROR: No usable container network found.
    pause
    goto EXIT_SCRIPT
)


REM ============================================================
REM SELECT NETWORK
REM ============================================================

if !NETWORK_COUNT! EQU 1 (

    set "NETWORK_CHOICE=1"

    echo Automatically selected:
    echo   !NETWORK_1!
    echo.

) else (

    goto SELECT_NETWORK
)

goto NETWORK_SELECTED


:SELECT_NETWORK

set "NETWORK_CHOICE="

set /p "NETWORK_CHOICE=Choose network number: "

if "!NETWORK_CHOICE!"=="" goto BAD_NETWORK

for /f "delims=0123456789" %%A in ("!NETWORK_CHOICE!") do goto BAD_NETWORK

if !NETWORK_CHOICE! LSS 1 goto BAD_NETWORK
if !NETWORK_CHOICE! GTR !NETWORK_COUNT! goto BAD_NETWORK

goto NETWORK_SELECTED


:BAD_NETWORK

echo Invalid network number.
goto SELECT_NETWORK


:NETWORK_SELECTED

for %%A in (!NETWORK_CHOICE!) do (
    set "NETWORK=!NETWORK_%%A!"
    set "TARGET_IP=!IP_%%A!"
)

echo Network:
echo   !NETWORK!
echo.
echo Target IP:
echo   !TARGET_IP!
echo.


REM ============================================================
REM GET EXPOSED PORTS
REM ============================================================

ssh "%SSH_HOST%" ^
  "docker inspect '!CONTAINER!' --format '{{range $port,$value := .Config.ExposedPorts}}{{$port}}{{println}}{{end}}'" ^
  > "%TMP_PORTS%"

set /a PORT_COUNT=0

echo ============================================================
echo  Container Ports
echo ============================================================
echo.

for /f "usebackq tokens=1,2 delims=/" %%A in ("%TMP_PORTS%") do (

    if not "%%A"=="" (

        set /a PORT_COUNT+=1

        set "PORT_!PORT_COUNT!=%%A"
        set "PROTO_!PORT_COUNT!=%%B"

        echo !PORT_COUNT!^) %%A/%%B
    )
)

if !PORT_COUNT! EQU 0 (

    echo No declared exposed ports detected.
    echo.

    goto MANUAL_TARGET_PORT
)

set /a MANUAL_CHOICE=!PORT_COUNT!+1

echo !MANUAL_CHOICE!^) Enter port manually
echo.


REM ============================================================
REM SELECT PORT
REM ============================================================

:SELECT_PORT

set "PORT_CHOICE="

set /p "PORT_CHOICE=Choose port: "

if "!PORT_CHOICE!"=="" goto BAD_PORT_CHOICE

for /f "delims=0123456789" %%A in ("!PORT_CHOICE!") do goto BAD_PORT_CHOICE

if !PORT_CHOICE! LSS 1 goto BAD_PORT_CHOICE
if !PORT_CHOICE! GTR !MANUAL_CHOICE! goto BAD_PORT_CHOICE

if !PORT_CHOICE! EQU !MANUAL_CHOICE! goto MANUAL_TARGET_PORT

for %%A in (!PORT_CHOICE!) do (
    set "TARGET_PORT=!PORT_%%A!"
    set "TARGET_PROTOCOL=!PROTO_%%A!"
)

if /I not "!TARGET_PROTOCOL!"=="tcp" (

    echo.
    echo SSH local forwarding supports TCP only.
    echo Selected: !TARGET_PORT!/!TARGET_PROTOCOL!
    echo.

    goto SELECT_PORT
)

goto TARGET_PORT_SELECTED


:BAD_PORT_CHOICE

echo Invalid port selection.
goto SELECT_PORT


REM ============================================================
REM MANUAL TARGET PORT
REM ============================================================

:MANUAL_TARGET_PORT

set "TARGET_PORT="

set /p "TARGET_PORT=Enter container TCP port: "

if "!TARGET_PORT!"=="" goto BAD_TARGET_PORT

for /f "delims=0123456789" %%A in ("!TARGET_PORT!") do goto BAD_TARGET_PORT

if !TARGET_PORT! LSS 1 goto BAD_TARGET_PORT
if !TARGET_PORT! GTR 65535 goto BAD_TARGET_PORT

set "TARGET_PROTOCOL=tcp"

goto TARGET_PORT_SELECTED


:BAD_TARGET_PORT

echo Invalid port. Enter 1-65535.
goto MANUAL_TARGET_PORT


:TARGET_PORT_SELECTED


REM ============================================================
REM CHOOSE LOCAL WINDOWS PORT
REM ============================================================

echo.

:SELECT_LOCAL_PORT

set "LOCAL_PORT="

set /p "LOCAL_PORT=Local Windows port: "

if "!LOCAL_PORT!"=="" goto BAD_LOCAL_PORT

for /f "delims=0123456789" %%A in ("!LOCAL_PORT!") do goto BAD_LOCAL_PORT

if !LOCAL_PORT! LSS 1 goto BAD_LOCAL_PORT
if !LOCAL_PORT! GTR 65535 goto BAD_LOCAL_PORT


REM Check Windows local port.

netstat -ano -p tcp | findstr /R ^
  /C:"127\.0\.0\.1:!LOCAL_PORT! .*LISTENING" ^
  /C:"0\.0\.0\.0:!LOCAL_PORT! .*LISTENING" ^
  /C:"\[::\]:!LOCAL_PORT! .*LISTENING" >nul

if not errorlevel 1 (

    echo.
    echo Port !LOCAL_PORT! is already in use.
    echo.

    goto SELECT_LOCAL_PORT
)

goto LOCAL_PORT_SELECTED


:BAD_LOCAL_PORT

echo Invalid local port. Enter 1-65535.
goto SELECT_LOCAL_PORT


:LOCAL_PORT_SELECTED


REM ============================================================
REM CONFIRM
REM ============================================================

cls

echo ============================================================
echo  Tunnel Configuration
echo ============================================================
echo.
echo Container:
echo   !CONTAINER!
echo.
echo Image:
echo   !IMAGE!
echo.
echo Docker network:
echo   !NETWORK!
echo.
echo Target:
echo   !TARGET_IP!:!TARGET_PORT!
echo.
echo Local Windows:
echo   127.0.0.1:!LOCAL_PORT!
echo.
echo A temporary proxy will be created on:
echo   !NETWORK!
echo.
echo The proxy is automatically removed when this tunnel exits.
echo.
echo An abandoned proxy has a maximum lifetime of:
echo   %PROXY_MAX_LIFE% seconds
echo.

choice /C YN /N /M "Start tunnel? [Y/N]: "

if errorlevel 2 goto EXIT_SCRIPT


REM ============================================================
REM CREATE TEMPORARY NETWORK PROXY
REM ============================================================

cls

echo ============================================================
echo  Creating Temporary Docker Network Proxy
echo ============================================================
echo.

echo Proxy:
echo   %PROXY_NAME%
echo.
echo Network:
echo   !NETWORK!
echo.
echo Target:
echo   !TARGET_IP!:!TARGET_PORT!
echo.

REM
REM Docker automatically assigns a random localhost host port.
REM The proxy itself joins the selected Docker network.
REM
REM --rm:
REM     Automatically removes it when it stops.
REM
REM timeout:
REM     Prevents abandoned proxies from living forever.
REM

ssh "%SSH_HOST%" ^
  "docker run -d --rm --name '%PROXY_NAME%' --network '!NETWORK!' -p 127.0.0.1::!TARGET_PORT! --entrypoint sh alpine/socat -c 'timeout %PROXY_MAX_LIFE% socat TCP-LISTEN:!TARGET_PORT!,fork,reuseaddr TCP:!TARGET_IP!:!TARGET_PORT!'" ^
  > "%TMP_PROXY%"

if errorlevel 1 (

    echo.
    echo ERROR: Failed to create temporary network proxy.
    echo.

    pause
    goto EXIT_SCRIPT
)

set "PROXY_CREATED=1"

echo Temporary proxy started.
echo.


REM ============================================================
REM FIND AUTOMATICALLY ASSIGNED HOST PORT
REM ============================================================

set "REMOTE_PROXY_PORT="

for /f "tokens=2 delims=:" %%A in ('ssh "%SSH_HOST%" "docker port '%PROXY_NAME%' !TARGET_PORT!/tcp"') do (
    set "REMOTE_PROXY_PORT=%%A"
)

if "!REMOTE_PROXY_PORT!"=="" (

    echo.
    echo ERROR: Could not determine temporary proxy port.
    echo.

    goto CLEANUP_PROXY
)

REM Strip spaces

set "REMOTE_PROXY_PORT=!REMOTE_PROXY_PORT: =!"

echo VPS localhost proxy:
echo   127.0.0.1:!REMOTE_PROXY_PORT!
echo.


REM ============================================================
REM VERIFY PROXY FROM VPS
REM ============================================================

echo Testing temporary proxy...

ssh "%SSH_HOST%" ^
  "nc -z -w 5 127.0.0.1 !REMOTE_PROXY_PORT!"

if errorlevel 1 (

    echo.
    echo ERROR: Proxy cannot reach the selected container.
    echo.

    goto CLEANUP_PROXY
)

echo Proxy connection successful.
echo.


REM ============================================================
REM CLEAN TEMP FILES BEFORE LONG-RUNNING SSH
REM ============================================================

del "%TMP_CONTAINERS%" >nul 2>&1
del "%TMP_NETWORKS%" >nul 2>&1
del "%TMP_PORTS%" >nul 2>&1
del "%TMP_PROXY%" >nul 2>&1


REM ============================================================
REM START SSH TUNNEL
REM ============================================================

cls

echo ============================================================
echo  Docker SSH Tunnel ACTIVE
echo ============================================================
echo.
echo Container:
echo   !CONTAINER!
echo.
echo Network:
echo   !NETWORK!
echo.
echo Target:
echo   !TARGET_IP!:!TARGET_PORT!
echo.
echo Temporary VPS proxy:
echo   127.0.0.1:!REMOTE_PROXY_PORT!
echo.
echo Windows endpoint:
echo   127.0.0.1:!LOCAL_PORT!
echo.
echo ------------------------------------------------------------
echo.
echo  Windows
echo  127.0.0.1:!LOCAL_PORT!
echo          ^|
echo          ^| SSH
echo          v
echo  VPS
echo  127.0.0.1:!REMOTE_PROXY_PORT!
echo          ^|
echo          ^| Temporary container on !NETWORK!
echo          v
echo  !TARGET_IP!:!TARGET_PORT!
echo.
echo ------------------------------------------------------------
echo.
echo Press CTRL+C to stop.
echo.

ssh ^
  -N ^
  -o ExitOnForwardFailure=yes ^
  -o ServerAliveInterval=30 ^
  -o ServerAliveCountMax=3 ^
  -L !LOCAL_PORT!:127.0.0.1:!REMOTE_PROXY_PORT! ^
  "%SSH_HOST%"


REM ============================================================
REM SSH ENDED
REM ============================================================

echo.
echo SSH tunnel ended.
echo.
echo Cleaning temporary Docker proxy...
echo.

goto CLEANUP_PROXY


REM ============================================================
REM CLEAN TEMPORARY PROXY
REM ============================================================

:CLEANUP_PROXY

if "!PROXY_CREATED!"=="1" (

    ssh ^
      -o ConnectTimeout=10 ^
      "%SSH_HOST%" ^
      "docker rm -f '%PROXY_NAME%' >/dev/null 2>&1 || true"

    set "PROXY_CREATED=0"
)

echo.
echo Temporary proxy removed.
echo.

goto EXIT_SCRIPT


REM ============================================================
REM EXIT / FILE CLEANUP
REM ============================================================

:EXIT_SCRIPT

del "%TMP_CONTAINERS%" >nul 2>&1
del "%TMP_NETWORKS%" >nul 2>&1
del "%TMP_PORTS%" >nul 2>&1
del "%TMP_PROXY%" >nul 2>&1

echo.
echo Finished.
echo.

endlocal
exit /b