# set this : 
# $env:TAURI_SIGNING_PRIVATE_KEY="Path or content of your private key"
# <# optionally also add a password #>
# $env:TAURI_SIGNING_PRIVATE_KEY_PASSWORD=""

# You can get get those from the .env file
# this is a ps1 file

# Load environment variables from .env file if it exists
if (Test-Path ".env") {
    Get-Content ".env" | ForEach-Object {
        if ($_ -match "^\s*TAURI_SIGNING_PRIVATE_KEY\s*=\s*(.*)\s*$") {
            $value = $matches[1].Trim()
            $value = $value -replace '^"(.*)"$', '$1'
            $value = $value -replace "^'(.*)'$", '$1'
            $env:TAURI_SIGNING_PRIVATE_KEY = $value
            Write-Host "Set TAURI_SIGNING_PRIVATE_KEY" -ForegroundColor Green
        }
        
        if ($_ -match "^\s*TAURI_SIGNING_PRIVATE_KEY_PASSWORD\s*=\s*(.*)\s*$") {
            $value = $matches[1].Trim()
            $value = $value -replace '^"(.*)"$', '$1'
            $value = $value -replace "^'(.*)'$", '$1'
            $env:TAURI_SIGNING_PRIVATE_KEY_PASSWORD = $value
            Write-Host "Set TAURI_SIGNING_PRIVATE_KEY_PASSWORD" -ForegroundColor Green
        }
    }
    Write-Host "`nTauri signing keys loaded!" -ForegroundColor Cyan
} else {
    Write-Host ".env file not found. Please create one with your Tauri signing keys." -ForegroundColor Yellow
}
