# Usage : .\start.ps1          (configuration + démarrage)
#         .\start.ps1 -Reset   (efface d'abord les données des bases)
param([switch]$Reset)

$ErrorActionPreference = 'Stop'
Set-Location $PSScriptRoot

if ($Reset) {
    docker compose down -v --remove-orphans
}

docker compose run --rm setup
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

# Nouvelle commande : relit le .env tout juste écrit par le setup
docker compose up --build --remove-orphans --detach --wait
if ($LASTEXITCODE -ne 0) {
    docker compose logs --tail 50
    exit $LASTEXITCODE
}

Write-Host "`nApp ready : http://localhost"
Write-Host "Logs : docker compose logs -f    to stop : docker compose down"