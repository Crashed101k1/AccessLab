# ⚡ Comandos Git Rápidos - AccessLab

## 🌅 INICIO DEL DÍA
```bash
git checkout main
git pull origin main
git checkout -b feature/nombre-funcionalidad
```

## 🌳 CREAR RAMAS POR FUNCIONALIDAD
```bash
# Ejemplos para AccessLab:
git checkout -b feature/user-authentication
git checkout -b feature/laboratory-management
git checkout -b feature/admin-dashboard
git checkout -b bugfix/login-validation
git checkout -b enhancement/ui-improvements
```

## 💾 GUARDAR TRABAJO (Varias veces al día)
```bash
git add .
git commit -m "descripción clara del cambio"
git push
```

## 🔄 SINCRONIZAR (2-3 veces al día)
```bash
git checkout main
git pull origin main
git checkout feature/mi-rama
git merge main
```

## ✅ TERMINAR FUNCIONALIDAD
```bash
git checkout main
git pull origin main
git checkout feature/mi-rama
git rebase main
git push origin feature/mi-rama
# Crear Pull Request en GitHub
```

## 🧹 LIMPIEZA SEMANAL
```bash
git checkout main
git pull origin main
git branch -d $(git branch --merged | grep -v main)
```

## 🚨 EMERGENCIAS

### Deshacer cambios no guardados
```bash
git checkout .
```

### Ver qué cambió
```bash
git status
git diff
```

### Guardar trabajo temporalmente
```bash
git stash
git stash pop
```

### Recuperar archivo borrado
```bash
git checkout HEAD -- archivo.js
```

## 📱 Comandos de Estado
```bash
git status              # Ver estado actual
git log --oneline -5    # Ver últimos 5 commits
git branch -a           # Ver todas las ramas
git remote -v           # Ver repositorios remotos
```

## 🌳 Gestión de Ramas
```bash
# Ver qué ramas existen
git branch -a

# Ver ramas con último commit
git for-each-ref --format='%(refname:short) - %(authorname)' refs/remotes

# Cambiar de rama
git checkout nombre-rama

# Eliminar rama local (después de merge)
git branch -d feature/rama-terminada

# Eliminar rama remota
git push origin --delete feature/rama-terminada
```

## 🎯 Plantillas de Mensajes de Commit
```bash
git commit -m "feat: agregar nueva funcionalidad de X"
git commit -m "fix: corregir bug en validación de Y"  
git commit -m "style: mejorar diseño de componente Z"
git commit -m "docs: actualizar documentación de API"
git commit -m "refactor: optimizar función de búsqueda"
```

---
*Para más detalles, consulta WORKFLOW_COLABORATIVO.md*