# PowerShell Script pentru crearea structurii complete de foldere și fișiere
# Salvează ca create-structure.ps1 și rulează cu: .\create-structure.ps1

Write-Host "🚀 Creating folder structure for Volunteer Management App..." -ForegroundColor Green

# Funcție pentru crearea folderelor
function New-DirectoryIfNotExists {
    param([string]$Path)
    if (-not (Test-Path $Path)) {
        New-Item -ItemType Directory -Path $Path -Force | Out-Null
    }
}

# Funcție pentru crearea fișierelor
function New-FileIfNotExists {
    param([string]$Path)
    if (-not (Test-Path $Path)) {
        New-Item -ItemType File -Path $Path -Force | Out-Null
    }
}

# Creează directoarele principale
Write-Host "📁 Creating main directories..." -ForegroundColor Yellow

# Creează toate folderele pas cu pas
New-Item -ItemType Directory -Path "src\components" -Force | Out-Null
New-Item -ItemType Directory -Path "src\components\common" -Force | Out-Null
New-Item -ItemType Directory -Path "src\components\layout" -Force | Out-Null
New-Item -ItemType Directory -Path "src\components\volunteer" -Force | Out-Null
New-Item -ItemType Directory -Path "src\components\project" -Force | Out-Null
New-Item -ItemType Directory -Path "src\components\organization" -Force | Out-Null

# Components - Common
New-Item -ItemType Directory -Path "src\components\common\Button" -Force | Out-Null
New-Item -ItemType Directory -Path "src\components\common\Card" -Force | Out-Null
New-Item -ItemType Directory -Path "src\components\common\Badge" -Force | Out-Null
New-Item -ItemType Directory -Path "src\components\common\Avatar" -Force | Out-Null
New-Item -ItemType Directory -Path "src\components\common\StarRating" -Force | Out-Null
New-Item -ItemType Directory -Path "src\components\common\SearchFilter" -Force | Out-Null

# Components - Layout
New-Item -ItemType Directory -Path "src\components\layout\Header" -Force | Out-Null
New-Item -ItemType Directory -Path "src\components\layout\Sidebar" -Force | Out-Null
New-Item -ItemType Directory -Path "src\components\layout\Navigation" -Force | Out-Null

# Components - Volunteer
New-Item -ItemType Directory -Path "src\components\volunteer\VolunteerCard" -Force | Out-Null
New-Item -ItemType Directory -Path "src\components\volunteer\VolunteerList" -Force | Out-Null
New-Item -ItemType Directory -Path "src\components\volunteer\VolunteerProfile" -Force | Out-Null
New-Item -ItemType Directory -Path "src\components\volunteer\VolunteerStats" -Force | Out-Null

# Components - Project
New-Item -ItemType Directory -Path "src\components\project\ProjectCard" -Force | Out-Null
New-Item -ItemType Directory -Path "src\components\project\ProjectList" -Force | Out-Null
New-Item -ItemType Directory -Path "src\components\project\ProjectDetails" -Force | Out-Null
New-Item -ItemType Directory -Path "src\components\project\TaskList" -Force | Out-Null
New-Item -ItemType Directory -Path "src\components\project\TaskItem" -Force | Out-Null

# Components - Organization
New-Item -ItemType Directory -Path "src\components\organization\OrganizationCard" -Force | Out-Null
New-Item -ItemType Directory -Path "src\components\organization\OrganizationProfile" -Force | Out-Null

# Pages directories
New-Item -ItemType Directory -Path "src\pages\Dashboard" -Force | Out-Null
New-Item -ItemType Directory -Path "src\pages\VolunteerManagement" -Force | Out-Null
New-Item -ItemType Directory -Path "src\pages\ProjectManagement" -Force | Out-Null
New-Item -ItemType Directory -Path "src\pages\OrganizationProfile" -Force | Out-Null

# Services directories
New-Item -ItemType Directory -Path "src\services" -Force | Out-Null
New-Item -ItemType Directory -Path "src\services\api" -Force | Out-Null
New-Item -ItemType Directory -Path "src\services\firebase" -Force | Out-Null

# Other directories
New-Item -ItemType Directory -Path "src\context" -Force | Out-Null

Write-Host "✅ All directories created!" -ForegroundColor Green

Write-Host "📄 Creating component files..." -ForegroundColor Yellow

# Creează fișierele pentru componente comune
$commonComponents = @("Button", "Card", "Badge", "Avatar", "StarRating", "SearchFilter")
foreach ($component in $commonComponents) {
    New-FileIfNotExists -Path "src\components\common\$component\$component.jsx"
    New-FileIfNotExists -Path "src\components\common\$component\$component.module.css"
    New-FileIfNotExists -Path "src\components\common\$component\index.js"
}
New-FileIfNotExists -Path "src\components\common\index.js"

# Creează fișierele pentru componente layout
$layoutComponents = @("Header", "Sidebar", "Navigation")
foreach ($component in $layoutComponents) {
    New-FileIfNotExists -Path "src\components\layout\$component\$component.jsx"
    New-FileIfNotExists -Path "src\components\layout\$component\$component.module.css"
    New-FileIfNotExists -Path "src\components\layout\$component\index.js"
}
New-FileIfNotExists -Path "src\components\layout\index.js"

# Creează fișierele pentru componente volunteer
$volunteerComponents = @("VolunteerCard", "VolunteerList", "VolunteerProfile", "VolunteerStats")
foreach ($component in $volunteerComponents) {
    New-FileIfNotExists -Path "src\components\volunteer\$component\$component.jsx"
    New-FileIfNotExists -Path "src\components\volunteer\$component\$component.module.css"
    New-FileIfNotExists -Path "src\components\volunteer\$component\index.js"
}
New-FileIfNotExists -Path "src\components\volunteer\index.js"

# Creează fișierele pentru componente project
$projectComponents = @("ProjectCard", "ProjectList", "ProjectDetails", "TaskList", "TaskItem")
foreach ($component in $projectComponents) {
    New-FileIfNotExists -Path "src\components\project\$component\$component.jsx"
    New-FileIfNotExists -Path "src\components\project\$component\$component.module.css"
    New-FileIfNotExists -Path "src\components\project\$component\index.js"
}
New-FileIfNotExists -Path "src\components\project\index.js"

# Creează fișierele pentru componente organization
$organizationComponents = @("OrganizationCard", "OrganizationProfile")
foreach ($component in $organizationComponents) {
    New-FileIfNotExists -Path "src\components\organization\$component\$component.jsx"
    New-FileIfNotExists -Path "src\components\organization\$component\$component.module.css"
    New-FileIfNotExists -Path "src\components\organization\$component\index.js"
}
New-FileIfNotExists -Path "src\components\organization\index.js"

# Index principal pentru componente
New-FileIfNotExists -Path "src\components\index.js"

Write-Host "📱 Creating pages..." -ForegroundColor Yellow

# Creează fișierele pentru pagini
$pages = @("Dashboard", "VolunteerManagement", "ProjectManagement", "OrganizationProfile")
foreach ($page in $pages) {
    New-FileIfNotExists -Path "src\pages\$page\$page.jsx"
    New-FileIfNotExists -Path "src\pages\$page\$page.module.css"
    New-FileIfNotExists -Path "src\pages\$page\index.js"
}
New-FileIfNotExists -Path "src\pages\index.js"

Write-Host "🎣 Creating hooks..." -ForegroundColor Yellow

# Creează hooks
$hooks = @("useVolunteers.js", "useProjects.js", "useOrganizations.js", "useTasks.js", "useAuth.js", "index.js")
foreach ($hook in $hooks) {
    New-FileIfNotExists -Path "src\hooks\$hook"
}

Write-Host "🔧 Creating services..." -ForegroundColor Yellow

# Creează servicii API
$apiServices = @("volunteers.js", "projects.js", "organizations.js", "tasks.js", "auth.js", "index.js")
foreach ($service in $apiServices) {
    New-FileIfNotExists -Path "src\services\api\$service"
}

# Creează servicii Firebase
$firebaseServices = @("config.js", "firestore.js", "auth.js", "index.js")
foreach ($service in $firebaseServices) {
    New-FileIfNotExists -Path "src\services\firebase\$service"
}
New-FileIfNotExists -Path "src\services\index.js"

Write-Host "📊 Creating models..." -ForegroundColor Yellow

# Creează modele
$models = @("Volunteer.js", "Organization.js", "Project.js", "Task.js", "TimeLog.js", "index.js")
foreach ($model in $models) {
    New-FileIfNotExists -Path "src\models\$model"
}

Write-Host "🎨 Creating styles..." -ForegroundColor Yellow

# Creează fișiere de stiluri
$styles = @("globals.css", "variables.css", "colors.css", "typography.css", "layout.css", "components.css", "index.css")
foreach ($style in $styles) {
    New-FileIfNotExists -Path "src\styles\$style"
}

Write-Host "🛠️ Creating utils..." -ForegroundColor Yellow

# Creează utilitare
$utils = @("constants.js", "helpers.js", "validators.js", "formatters.js", "index.js")
foreach ($util in $utils) {
    New-FileIfNotExists -Path "src\utils\$util"
}

Write-Host "🔐 Creating context..." -ForegroundColor Yellow

# Creează context
$contexts = @("AuthContext.js", "AppContext.js", "index.js")
foreach ($context in $contexts) {
    New-FileIfNotExists -Path "src\context\$context"
}

# Calculează statistici
$totalDirs = (Get-ChildItem -Path "src" -Directory -Recurse).Count + 1
$totalFiles = (Get-ChildItem -Path "src" -File -Recurse -Include "*.js", "*.jsx", "*.css").Count

Write-Host ""
Write-Host "✅ Folder structure created successfully!" -ForegroundColor Green
Write-Host "📁 Total directories created: $totalDirs" -ForegroundColor Cyan
Write-Host "📄 Total files created: $totalFiles" -ForegroundColor Cyan
Write-Host ""
Write-Host "🚀 Next steps:" -ForegroundColor Magenta
Write-Host "1. Run: npm install firebase" -ForegroundColor White
Write-Host "2. Start implementing components" -ForegroundColor White
Write-Host "3. Configure Firebase in src\services\firebase\config.js" -ForegroundColor White
Write-Host ""
Write-Host "Happy coding! 🎉" -ForegroundColor Green