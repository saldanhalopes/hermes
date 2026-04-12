@echo off
set JAVA_HOME=c:\Users\35670\OneDrive - Eurofarma Laboratorios\Projetos\Hermes\oracleJdk-21
set PATH=%JAVA_HOME%\bin;%PATH%
echo Starting Postgres...
start /B cmd /c "pgsql\bin\pg_ctl.exe start -D pgsql\data -l pgsql\log.txt -w"
echo Starting Spring Boot Backend...
call mvnw.cmd spring-boot:run
pause
