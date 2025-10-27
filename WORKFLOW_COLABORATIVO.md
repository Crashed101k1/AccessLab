# 🤝 Guía de Workflow Colaborativo Git - AccessLab

## 📋 Configuración Inicial (Solo una vez por desarrollador)

### 1. Configurar Git (Cada desarrollador en su máquina)
```bash
# Configurar identidad
git config --global user.name "Tu Nombre"
git config --global user.email "tu.email@ejemplo.com"

# Configurar editor (opcional)
git config --global core.editor "code --wait"

# Ver configuración
git config --list
```

### 2. Clonar el Repositorio
```bash
# Clonar el proyecto
git clone https://github.com/Crashed101k1/AccessLab.git
cd AccessLab

# Verificar remoto
git remote -v
```

---

## 🌅 Rutina Diaria - ANTES de empezar a trabajar

### Paso 1: Actualizar tu rama local
```bash
# Ir a la rama principal
git checkout main

# Descargar últimos cambios
git pull origin main

# Verificar estado
git status
```

### Paso 2: Crear rama para tu feature/tarea

## 🌳 ESTRATEGIA DE RAMAS PARA ACCESSLAB (2 DESARROLLADORES)

### Estructura Recomendada:
```
main (código en producción)
├── feature/auth-system (funcionalidad de autenticación)
├── feature/laboratory-crud (gestión de laboratorios)
├── feature/dashboard-admin (panel administrativo)
├── bugfix/login-validation (corrección de bugs)
└── enhancement/ui-responsive (mejoras de interfaz)
```

### Comandos para crear ramas:
```bash
# Crear y cambiar a nueva rama POR FUNCIONALIDAD (no por desarrollador)
git checkout -b feature/nombre-descriptivo

# Ejemplos de nombres de ramas para AccessLab:
git checkout -b feature/user-authentication
git checkout -b feature/laboratory-management  
git checkout -b feature/admin-dashboard
git checkout -b feature/reports-system
git checkout -b bugfix/login-validation
git checkout -b enhancement/ui-improvements
git checkout -b hotfix/security-patch
```

### ⚠️ IMPORTANTE:
- **NO crear ramas por desarrollador** (dev/juan, dev/maria)
- **SÍ crear ramas por funcionalidad** (feature/auth-system)
- Ambos desarrolladores pueden trabajar en ramas diferentes simultáneamente
- Coordinarse para no trabajar en la misma funcionalidad al mismo tiempo

---

## 💻 Durante el Desarrollo

### Guardar cambios frecuentemente
```bash
# Ver qué archivos cambiaron
git status

# Ver diferencias específicas
git diff

# Agregar archivos específicos
git add ruta/del/archivo.js

# O agregar todos los cambios
git add .

# Hacer commit con mensaje descriptivo
git commit -m "feat: agregar validación de formulario de login"

# Ejemplos de mensajes de commit:
# git commit -m "fix: corregir bug en autenticación"
# git commit -m "style: mejorar estilos de dashboard admin"
# git commit -m "docs: actualizar README con nuevas funcionalidades"
```

### Subir cambios a GitHub
```bash
# Primera vez que subes la rama
git push -u origin feature/nombre-descriptivo

# Siguientes veces
git push
```

---

## 🔄 Sincronización Regular (Varias veces al día)

### Mantener tu rama actualizada
```bash
# Cambiar a main
git checkout main

# Actualizar main
git pull origin main

# Volver a tu rama de trabajo
git checkout feature/nombre-descriptivo

# Integrar cambios de main a tu rama
git merge main

# O usar rebase (más limpio)
git rebase main
```

### Si hay conflictos en el merge/rebase:
```bash
# 1. Git te mostrará los archivos en conflicto
# 2. Edita manualmente los archivos para resolver conflictos
# 3. Marca como resueltos
git add archivo-resuelto.js

# 4. Continuar el merge/rebase
git commit  # Si fue merge
git rebase --continue  # Si fue rebase
```

---

## ✅ Al Terminar una Funcionalidad

### Paso 1: Preparar para integración
```bash
# Asegurar que tienes los últimos cambios
git checkout main
git pull origin main

# Volver a tu rama
git checkout feature/nombre-descriptivo

# Integrar cambios recientes
git rebase main

# Subir cambios finales
git push origin feature/nombre-descriptivo
```

### Paso 2: Crear Pull Request
1. Ve a GitHub.com → tu repositorio
2. Click en "Compare & pull request"
3. Describe los cambios realizados
4. Asigna al compañero para revisión
5. Click "Create pull request"

### Paso 3: Después de aprobación y merge
```bash
# Cambiar a main
git checkout main

# Actualizar
git pull origin main

# Eliminar rama local (ya no necesaria)
git branch -d feature/nombre-descriptivo

# Eliminar rama remota (opcional)
git push origin --delete feature/nombre-descriptivo
```

---

## 🚨 Comandos de Emergencia

### Ver estado actual
```bash
git status
git log --oneline -10
git branch -a
```

### Deshacer cambios
```bash
# Descartar cambios no guardados
git checkout -- nombre-archivo.js
git checkout .  # Todos los archivos

# Deshacer último commit (mantener cambios)
git reset --soft HEAD~1

# Deshacer último commit (perder cambios)
git reset --hard HEAD~1
```

### Recuperar archivos
```bash
# Ver historial de commits
git log --oneline

# Recuperar archivo de commit específico
git checkout HASH-COMMIT -- ruta/archivo.js
```

### Cambiar de rama con cambios sin guardar
```bash
# Guardar temporalmente
git stash

# Cambiar de rama
git checkout otra-rama

# Volver y recuperar cambios
git checkout mi-rama
git stash pop
```

---

## 📅 Rutina Semanal de Mantenimiento

### Lunes (Inicio de semana)
```bash
git checkout main
git pull origin main
git branch -d $(git branch --merged | grep -v main)  # Limpiar ramas locales
```

### Viernes (Final de semana)
```bash
# Revisar ramas abiertas
git branch -a

# Hacer backup local
git bundle create backup-$(date +%Y%m%d).bundle --all
```

---

## 🎯 Mejores Prácticas

### Nombres de Ramas
- `feature/nueva-funcionalidad`
- `bugfix/corregir-error`
- `hotfix/error-crítico`
- `enhancement/mejora-ui`

### Mensajes de Commit
- `feat:` nueva funcionalidad
- `fix:` corrección de bug
- `style:` cambios de estilo/formato
- `docs:` cambios en documentación
- `refactor:` refactorización de código
- `test:` agregar o modificar pruebas

### Frecuencia de Commits
- Commit pequeños y frecuentes
- Un commit por funcionalidad lógica
- Nunca commits con código que no funciona

### Comunicación
- Revisar Pull Requests del compañero diariamente
- Comunicar cambios importantes en chat/email
- Planificar quién trabaja en qué para evitar conflictos

---

## 🆘 Situaciones Comunes y Soluciones

### "Mi compañero hizo cambios y no puedo hacer push"
```bash
git pull origin main
# Resolver conflictos si los hay
git push
```

### "Accidentalmente trabajé en main"
```bash
# Crear rama con tus cambios
git checkout -b feature/mis-cambios

# Volver main al estado original
git checkout main
git reset --hard origin/main
```

### "No sé qué cambió mi compañero"
```bash
# Ver diferencias entre tu main y el remoto
git diff main origin/main

# Ver commits nuevos
git log main..origin/main --oneline
```

### "Quiero ver el trabajo de mi compañero"
```bash
# Descargar todas las ramas remotas
git fetch origin

# Ver ramas remotas
git branch -r

# Cambiar a la rama de tu compañero
git checkout -b local-copy origin/feature/rama-compañero
```

---

## � Coordinación Entre Desarrolladores

### División de Trabajo Sugerida para AccessLab:

#### **Desarrollador A** podría enfocarse en:
- `feature/backend-api` (APIs y servicios)
- `feature/user-authentication` (sistema de login/registro)
- `feature/laboratory-management` (CRUD laboratorios)
- `bugfix/backend-issues` (correcciones del backend)

#### **Desarrollador B** podría enfocarse en:
- `feature/frontend-ui` (interfaces de usuario)
- `feature/admin-dashboard` (panel administrativo)
- `feature/reports-system` (sistema de reportes)
- `enhancement/ui-improvements` (mejoras visuales)

### Reglas de Coordinación:
1. **Comunicar** en qué rama vas a trabajar antes de crearla
2. **No duplicar** trabajo - revisar ramas activas antes de empezar
3. **Planificar** semanalmente qué funcionalidades desarrollará cada uno
4. **Avisar** cuando termines una funcionalidad para que el otro pueda revisarla

### Comando para ver ramas activas:
```bash
# Ver todas las ramas (locales y remotas)
git branch -a

# Ver ramas remotas con último commit
git for-each-ref --format='%(refname:short) - %(authorname) (%(committerdate))' refs/remotes
```

---

## �📞 Flujo de Comunicación Diario

### Mañana (9:00 AM)
1. Revisar mensajes del compañero
2. Actualizar repositorio: `git pull origin main`
3. Comunicar qué vas a trabajar hoy

### Medio día (12:00 PM)
1. Hacer push de avances: `git push`
2. Revisar si hay Pull Requests pendientes

### Tarde (5:00 PM)
1. Hacer commit final del día
2. Hacer push: `git push`
3. Comunicar estado y pendientes para mañana

---

## 🔧 Herramientas Recomendadas

### Extensiones VS Code
- GitLens
- Git Graph  
- Git History

### Comandos útiles de PowerShell
```powershell
# Crear alias para comandos frecuentes
Set-Alias -Name gs -Value "git status"
Set-Alias -Name gp -Value "git pull"
Set-Alias -Name gpu -Value "git push"
```

---

## 📊 Checklist Diario

### ✅ Al empezar el día:
- [ ] `git checkout main`
- [ ] `git pull origin main`
- [ ] Crear nueva rama para tu trabajo
- [ ] Comunicar plan del día

### ✅ Durante el trabajo:
- [ ] Commits frecuentes y descriptivos
- [ ] Push regularmente
- [ ] Revisar Pull Requests del compañero

### ✅ Al terminar el día:
- [ ] Commit final
- [ ] Push de todos los cambios
- [ ] Comunicar progreso y pendientes

---

*💡 Recuerda: La comunicación constante es clave para el éxito del trabajo colaborativo.*