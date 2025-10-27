# 🌳 Estrategia de Ramas - AccessLab

## 📋 Estructura de Ramas Recomendada

```
AccessLab Repository
│
├── main (🔒 SOLO para código listo para producción)
│
├── feature/user-authentication (🔐 Sistema de login/registro)
├── feature/laboratory-management (🏭 CRUD laboratorios)  
├── feature/admin-dashboard (👨‍💼 Panel administrativo)
├── feature/reports-system (📊 Sistema de reportes)
├── feature/bitacoras-system (📝 Sistema de bitácoras)
├── feature/solicitudes-management (📋 Gestión solicitudes)
│
├── bugfix/login-validation (🐛 Correcciones)
├── bugfix/form-validation (🐛 Validaciones)
│
├── enhancement/ui-responsive (✨ Mejoras UI)
├── enhancement/performance (⚡ Optimizaciones)
│
└── hotfix/security-patch (🚨 Parches urgentes)
```

## 🎯 Convenciones de Nombres

### Prefijos de Ramas:
- **`feature/`** - Nuevas funcionalidades
- **`bugfix/`** - Corrección de errores
- **`hotfix/`** - Parches urgentes en producción  
- **`enhancement/`** - Mejoras de funcionalidades existentes
- **`refactor/`** - Refactorización de código
- **`docs/`** - Cambios en documentación

### Ejemplos Específicos para AccessLab:
```bash
# Funcionalidades principales
git checkout -b feature/user-authentication
git checkout -b feature/laboratory-crud
git checkout -b feature/admin-dashboard
git checkout -b feature/bitacoras-management
git checkout -b feature/solicitudes-system
git checkout -b feature/reports-generation

# Mejoras de UI/UX
git checkout -b enhancement/login-design
git checkout -b enhancement/dashboard-layout
git checkout -b enhancement/responsive-tables

# Correcciones
git checkout -b bugfix/form-validation
git checkout -b bugfix/authentication-error
git checkout -b bugfix/data-display

# Parches críticos
git checkout -b hotfix/security-vulnerability
git checkout -b hotfix/login-crash
```

## 👥 División de Trabajo Sugerida

### 🅰️ **Desarrollador A** (Backend/Lógica):
- `feature/user-authentication`
- `feature/laboratory-management` 
- `feature/bitacoras-system`
- `feature/api-endpoints`
- `bugfix/backend-issues`

### 🅱️ **Desarrollador B** (Frontend/UI):
- `feature/admin-dashboard`
- `feature/reports-system`
- `feature/solicitudes-management`
- `enhancement/ui-improvements`
- `enhancement/responsive-design`

## 📅 Flujo de Trabajo Semanal

### **Lunes - Planificación:**
1. Revisar ramas activas: `git branch -a`
2. Decidir qué funcionalidades desarrollar esta semana
3. Comunicar plan al compañero
4. Crear ramas necesarias

### **Martes a Jueves - Desarrollo:**
1. Trabajar en ramas individuales
2. Commits frecuentes
3. Push diario
4. Sincronizar con main regularmente

### **Viernes - Integración:**
1. Terminar funcionalidades
2. Crear Pull Requests
3. Revisar código del compañero
4. Hacer merge a main

## 🔄 Comandos de Gestión de Ramas

### Crear y trabajar en rama:
```bash
# Crear nueva rama desde main actualizado
git checkout main
git pull origin main
git checkout -b feature/nueva-funcionalidad

# Trabajar normalmente
git add .
git commit -m "feat: implementar X funcionalidad"
git push -u origin feature/nueva-funcionalidad
```

### Sincronizar rama con main:
```bash
# Actualizar main
git checkout main
git pull origin main

# Volver a tu rama e integrar cambios
git checkout feature/mi-rama
git merge main
# O usar rebase: git rebase main

# Subir cambios actualizados
git push
```

### Ver estado de ramas:
```bash
# Ramas locales
git branch

# Todas las ramas (locales y remotas)
git branch -a

# Ramas con último commit y autor
git for-each-ref --format='%(refname:short) - %(authorname) (%(committerdate:short))' refs/remotes

# Ramas ya mergeadas (pueden eliminarse)
git branch --merged
```

### Limpiar ramas terminadas:
```bash
# Eliminar rama local (después del merge)
git branch -d feature/funcionalidad-terminada

# Eliminar rama remota
git push origin --delete feature/funcionalidad-terminada

# Limpiar referencias remotas obsoletas
git remote prune origin
```

## 🚫 Reglas Importantes

### ❌ **NO hacer NUNCA:**
- Trabajar directamente en `main`
- Crear ramas personales como `dev/tu-nombre`
- Hacer force push: `git push --force`
- Mergear sin revisión del compañero

### ✅ **SÍ hacer SIEMPRE:**
- Crear ramas por funcionalidad específica
- Hacer Pull Request para mergear a main
- Revisar código del compañero antes de aprobar
- Mantener ramas actualizadas con main
- Comunicar en qué trabajas

## 📊 Ejemplo de Semana Típica

### **Desarrollador A:**
```bash
# Lunes
git checkout -b feature/laboratory-crud

# Martes-Jueves  
git add . && git commit -m "feat: agregar formulario laboratorio"
git push

# Viernes
git checkout main && git pull
git checkout feature/laboratory-crud && git rebase main
git push
# Crear Pull Request
```

### **Desarrollador B:**
```bash  
# Lunes
git checkout -b enhancement/dashboard-layout

# Martes-Jueves
git add . && git commit -m "style: mejorar diseño dashboard"
git push

# Viernes  
git checkout main && git pull
git checkout enhancement/dashboard-layout && git rebase main
git push
# Crear Pull Request
```

## 🎯 Metas de Calidad

- **Máximo 3-4 ramas activas** por desarrollador
- **Máximo 1 semana** de vida por rama
- **Mínimo 1 revisión** antes del merge
- **100% de funcionalidades** deben pasar por Pull Request

---

**💡 Recuerda: Una rama = Una funcionalidad = Una semana máximo**