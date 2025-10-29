# Solución de Problemas - Pestañas de Usuarios

## Problema Reportado
Las pestañas de usuarios activos/inactivos no cambian correctamente al hacer clic.

## Diagnóstico Realizado

### 🔍 **Causas Identificadas:**
1. **Función JavaScript**: La función `switchTab()` original podría no estar ejecutándose
2. **Event Listeners**: Los onclick en HTML podrían no estar funcionando
3. **Elementos DOM**: Los IDs de elementos podrían no coincidir
4. **CSS**: Las clases `.active` podrían no estar aplicándose correctamente

### ⚡ **Soluciones Implementadas:**

#### **1. Función Alternativa Más Robusta:**
```javascript
function changeTab(tabName) {
    // Usa display: none/block además de clases CSS
    // Método más directo y compatible
}
```

#### **2. Event Listeners de Respaldo:**
```javascript
function initializeTabs() {
    // Añade addEventListener además de onclick
    // Doble seguridad para activación
}
```

#### **3. Funciones Globales:**
```javascript
window.switchTab = switchTab;
window.changeTab = changeTab;
```

#### **4. Debug Console:**
```javascript
console.log('Switching to tab:', tabName);
console.log('Tab switched successfully');
```

## Instrucciones de Prueba

### 🧪 **Para Verificar la Solución:**

1. **Abrir DevTools** (F12) en el navegador
2. **Ir a pestaña Console** para ver mensajes de debug
3. **Hacer clic en "Usuarios Inactivos"**
4. **Verificar en Console** que aparece: "Switching to tab: inactivos"
5. **Confirmar cambio visual** de la tabla

### 🔧 **Si Aún No Funciona:**

#### **Opción A - Prueba Manual en Console:**
```javascript
changeTab('inactivos')  // Debería cambiar a inactivos
changeTab('activos')    // Debería cambiar a activos
```

#### **Opción B - Verificar Elementos:**
```javascript
console.log(document.getElementById('activosTab'));
console.log(document.getElementById('inactivosTab'));
console.log(document.getElementById('activosContent'));
console.log(document.getElementById('inactivosContent'));
```

#### **Opción C - CSS Override Manual:**
```css
.tab-content {
    display: none !important;
}

.tab-content.active {
    display: block !important;
}
```

## Cambios Realizados

### 📄 **Archivos Modificados:**

#### **GestionUsuarios.html:**
- Cambio de `onclick="switchTab('...')"` a `onclick="changeTab('...')"`
- Mantiene estructura de IDs intacta

#### **gestion-usuarios.js:**
- Función `changeTab()` más robusta añadida
- Función `initializeTabs()` para configuración inicial
- Event listeners de respaldo
- Debug console logs
- Funciones disponibles globalmente

### 🎯 **Resultado Esperado:**

1. **Click en "Usuarios Inactivos"** → Tabla cambia a mostrar usuarios inactivos
2. **Click en "Usuarios Activos"** → Tabla cambia a mostrar usuarios activos  
3. **Pestañas visuales** se actualizan con clase `.active`
4. **Contadores** se mantienen correctos (7 activos, 5 inactivos)
5. **Console logs** confirman funcionamiento

La implementación ahora tiene múltiples métodos de respaldo para asegurar que las pestañas funcionen correctamente en todos los navegadores y situaciones.