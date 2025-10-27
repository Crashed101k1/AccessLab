# 🌳 Creación de Ramas - AccessLab

## 📋 ¿Cuándo Crear una Rama?

### ✅ **CREAR RAMA cuando vas a:**
- Desarrollar una nueva funcionalidad
- Corregir un bug
- Mejorar algo existente
- Hacer refactorización de código
- Agregar documentación importante

### ❌ **NO CREAR RAMA para:**
- Cambios mínimos (typos, comentarios)
- Pruebas rápidas
- Cambios experimentales muy pequeños

---

## 🎯 Tipos de Ramas y Cuándo Usarlas

### 🆕 **feature/** - Nueva Funcionalidad
**Cuándo crear:**
- Vas a agregar algo nuevo al sistema
- Implementar una función completa
- Desarrollar un módulo entero

**Ejemplos:**
```bash
git checkout -b feature/user-authentication    # Sistema de login
git checkout -b feature/laboratory-management  # CRUD laboratorios
git checkout -b feature/admin-dashboard        # Panel administrativo
git checkout -b feature/reports-system        # Sistema de reportes
git checkout -b feature/bitacoras-crud        # Gestión bitácoras
```

### 🐛 **bugfix/** - Corrección de Errores
**Cuándo crear:**
- Hay un error que necesitas corregir
- Algo no funciona como debería
- Validaciones que fallan

**Ejemplos:**
```bash
git checkout -b bugfix/login-validation       # Arreglar validación login
git checkout -b bugfix/form-submission       # Corregir envío formularios
git checkout -b bugfix/data-display         # Arreglar mostrar datos
git checkout -b bugfix/authentication-error # Corregir error de auth
```

### ✨ **enhancement/** - Mejoras
**Cuándo crear:**
- Mejorar algo que ya existe
- Optimizar rendimiento
- Mejorar diseño/UX

**Ejemplos:**
```bash
git checkout -b enhancement/ui-responsive     # Hacer responsive
git checkout -b enhancement/performance      # Optimizar velocidad
git checkout -b enhancement/user-experience  # Mejorar UX
git checkout -b enhancement/loading-states   # Agregar loaders
```

### 🚨 **hotfix/** - Parches Urgentes
**Cuándo crear:**
- Error crítico en producción
- Problema de seguridad
- Bug que impide usar el sistema

**Ejemplos:**
```bash
git checkout -b hotfix/security-patch        # Parche de seguridad
git checkout -b hotfix/critical-error       # Error que rompe todo
git checkout -b hotfix/login-crash          # Login no funciona
```

### 🔧 **refactor/** - Refactorización
**Cuándo crear:**
- Reorganizar código sin cambiar funcionalidad
- Limpiar código legacy
- Mejorar estructura

**Ejemplos:**
```bash
git checkout -b refactor/auth-service        # Refactorizar servicio auth
git checkout -b refactor/database-queries   # Optimizar consultas
git checkout -b refactor/component-structure # Reorganizar componentes
```

---

## 🛠️ Cómo Crear Ramas

### **Comando Base:**
```bash
# 1. Ir a main y actualizar
git checkout main
git pull origin main

# 2. Crear nueva rama
git checkout -b tipo/nombre-descriptivo
```

### **Proceso Completo:**
```bash
# Paso 1: Preparar
git checkout main              # Ir a main
git pull origin main          # Actualizar con últimos cambios

# Paso 2: Crear rama
git checkout -b feature/nueva-funcionalidad

# Paso 3: Verificar
git branch                    # Ver que estás en la nueva rama
git status                   # Confirmar estado limpio

# Paso 4: Trabajar
# ... hacer tus cambios ...

# Paso 5: Guardar
git add .
git commit -m "feat: implementar nueva funcionalidad"

# Paso 6: Subir por primera vez
git push -u origin feature/nueva-funcionalidad
```

---

## 📝 Reglas para Nombres de Ramas

### **Formato:**
```
tipo/descripción-corta-con-guiones
```

### **Buenas Prácticas:**
- **Usar minúsculas**
- **Separar palabras con guiones** (no espacios ni underscore)
- **Ser descriptivo pero conciso**
- **Incluir el tipo** (feature/, bugfix/, etc.)

### **Ejemplos Buenos:**
```bash
feature/user-authentication
bugfix/login-validation  
enhancement/responsive-design
hotfix/security-patch
refactor/api-structure
```

### **Ejemplos Malos:**
```bash
mi-rama                    # No dice qué hace
feature/Fix Bug            # Mayúsculas y vago
nueva_funcionalidad        # Underscore en lugar de guión
feature/hacer algo nuevo   # Espacios (no funciona)
```

---

## 🎯 Casos Específicos para AccessLab

### **Frontend (UI/UX):**
```bash
git checkout -b feature/admin-dashboard
git checkout -b enhancement/login-design
git checkout -b bugfix/form-validation
git checkout -b feature/responsive-tables
```

### **Backend (Lógica/API):**
```bash
git checkout -b feature/auth-api
git checkout -b feature/laboratory-crud
git checkout -b bugfix/database-connection
git checkout -b enhancement/api-performance
```

### **Sistema Completo:**
```bash
git checkout -b feature/reports-system
git checkout -b feature/bitacoras-management
git checkout -b enhancement/security-improvements
git checkout -b refactor/code-organization
```

---

## ⚡ Comandos Rápidos

### **Ver ramas existentes:**
```bash
git branch -a              # Todas las ramas
git branch                 # Solo locales
```

### **Cambiar de rama:**
```bash
git checkout nombre-rama   # Cambiar a rama existente
git checkout main         # Volver a main
```

### **Eliminar rama (cuando termine):**
```bash
git branch -d feature/rama-terminada      # Local
git push origin --delete feature/rama-terminada  # Remota
```

---

## 🚦 Checklist Antes de Crear Rama

- [ ] ¿Estoy en `main` y actualizado? (`git pull origin main`)
- [ ] ¿El nombre describe claramente lo que voy a hacer?
- [ ] ¿Usé el prefijo correcto? (feature/, bugfix/, etc.)
- [ ] ¿No existe ya una rama similar?
- [ ] ¿Comuniqué al equipo lo que voy a desarrollar?

---

**💡 Recuerda: Una rama = Una tarea específica = Máximo 1 semana de trabajo**