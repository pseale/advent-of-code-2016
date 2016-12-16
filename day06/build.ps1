tsc; 
if ($LASTEXITCODE -eq 0) {
  tslint --project .\tsconfig.json
} else { Write-Host -ForegroundColor Yello "Skipping TSLINT because of compiler errors."}
