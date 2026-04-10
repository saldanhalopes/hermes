# Hermes Startup Script (Portable Postgres + Spring Boot)

$projectRoot = $PSScriptRoot
$pgDir = "$projectRoot\pgsql"
$pgData = "$pgDir\data"
$pgBin = "$pgDir\bin"
$env:JAVA_HOME = "$projectRoot\oracleJdk-21"

Write-Host "--- Iniciando Ambiente Hermes ---" -ForegroundColor Cyan

# 1. Verificar/Iniciar PostgreSQL
if (Test-Path "$pgBin\pg_ctl.exe") {
    Write-Host "[Postgres] Verificando status..."
    $pgStatus = & "$pgBin\pg_ctl.exe" status -D $pgData 2>$null
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[Postgres] Iniciando servidor..." -ForegroundColor Yellow
        & "$pgBin\pg_ctl.exe" start -D $pgData -l "$pgDir\log.txt" -w
        if ($LASTEXITCODE -ne 0) {
            Write-Host "[ERRO] Falha ao iniciar PostgreSQL. Verifique pgsql\log.txt" -ForegroundColor Red
            exit 1
        }
    } else {
        Write-Host "[Postgres] Já está rodando." -ForegroundColor Green
    }
    
    # 2. Criar Banco 'hermes' se não existir
    Write-Host "[Postgres] Verificando banco 'hermes'..."
    $dbList = & "$pgBin\psql.exe" -U postgres -t -c "SELECT 1 FROM pg_database WHERE datname='hermes'"
    if ($dbList -ne "1") {
        Write-Host "[Postgres] Criando banco de dados 'hermes'..." -ForegroundColor Yellow
        & "$pgBin\createdb.exe" -U postgres hermes
    }
} else {
    Write-Host "[AVISO] Binários do Postgres não encontrados em \pgsql. Continuando sem DB local." -ForegroundColor Gray
}

# 3. Iniciar Aplicação
Write-Host "[App] Iniciando Hermes EQM..." -ForegroundColor Cyan
.\mvnw.cmd spring-boot:run
