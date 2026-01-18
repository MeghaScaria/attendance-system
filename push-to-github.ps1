# PowerShell script to push code to GitHub
# Run this after creating your GitHub repository

Write-Host "🚀 GitHub Push Script" -ForegroundColor Cyan
Write-Host ""

# Get repository URL from user
$repoUrl = Read-Host "Enter your GitHub repository URL (e.g., https://github.com/username/repo-name.git)"

if ($repoUrl -eq "") {
    Write-Host "❌ No URL provided. Exiting." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "📦 Adding GitHub remote..." -ForegroundColor Yellow
git remote add origin $repoUrl

if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  Remote might already exist. Trying to set URL..." -ForegroundColor Yellow
    git remote set-url origin $repoUrl
}

Write-Host ""
Write-Host "📤 Pushing code to GitHub..." -ForegroundColor Yellow
Write-Host "You'll be asked for your GitHub username and password/token" -ForegroundColor Cyan
Write-Host ""

git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Success! Your code has been pushed to GitHub! 🎉" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "❌ Push failed. Common reasons:" -ForegroundColor Red
    Write-Host "   1. Incorrect repository URL" -ForegroundColor Red
    Write-Host "   2. Authentication failed (use Personal Access Token)" -ForegroundColor Red
    Write-Host "   3. Repository doesn't exist or you don't have access" -ForegroundColor Red
    Write-Host ""
    Write-Host "💡 Tip: Use a Personal Access Token instead of password" -ForegroundColor Cyan
    Write-Host "   Get one at: https://github.com/settings/tokens" -ForegroundColor Cyan
}
