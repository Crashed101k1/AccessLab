# Plantilla Base - AccessLab

Esta plantilla base proporciona la estructura estándar para todas las vistas del sistema AccessLab.

## 📁 Archivos incluidos

- `plantilla-base.html` - Estructura HTML base
- `plantilla-base.css` - Estilos base para header, footer y elementos comunes

## 🎯 Características incluidas

### ✅ Header completo:
- Logo de AccessLab
- Título personalizable
- Iconos de navegación (Regresar, Inicio, Notificaciones, Cerrar Sesión)
- Diseño que ocupa todo el ancho de la pantalla
- Funcionalidad JavaScript incluida

### ✅ Footer completo:
- Información de derechos reservados
- Logo de la UTM
- Alineación en extremos izquierdo y derecho
- Diseño responsivo

### ✅ Estructura responsiva:
- Optimizada para desktop, tablet y móvil
- Breakpoints en 768px y 480px
- Diseño flexible y adaptable

## 🚀 Cómo usar esta plantilla

### 1. Copiar los archivos base
```bash
# Copiar la plantilla HTML
cp plantilla-base.html nueva-vista.html

# Crear CSS específico (opcional)
cp plantilla-base.css nueva-vista.css
```

### 2. Personalizar el HTML
```html
<!-- Cambiar el título de la página -->
<title>AccessLab - [Tu Nueva Vista]</title>

<!-- Cambiar el título del header -->
<h1 class="welcome-text">[Título de tu Vista]</h1>

<!-- Agregar CSS específico si es necesario -->
<link rel="stylesheet" href="../css/nueva-vista.css">
```

### 3. Agregar contenido específico
```html
<main class="main-content">
    <div class="content-container">
        <!-- Tu contenido aquí -->
        <h2 class="section-title">Mi Nueva Sección</h2>
        
        <!-- Formularios, tablas, cards, etc. -->
        
    </div>
</main>
```

### 4. Agregar JavaScript específico (si es necesario)
```html
<!-- Al final del body -->
<script src="../js/nueva-vista.js"></script>
```

## 📋 Elementos marcados para personalizar

### En el HTML:
- `[Título de la Vista]` - Cambiar por el título real
- `[Tu Nueva Vista]` - Cambiar por el nombre de la vista
- Sección de contenido principal - Agregar tu contenido específico

### En el CSS (si creas uno específico):
- Importar o extender los estilos base
- Agregar estilos específicos de tu vista
- Mantener la consistencia con el sistema de diseño

## 🎨 Clases CSS disponibles

### Estructura:
- `.content-container` - Contenedor con ancho limitado (1200px max)
- `.section-title` - Título de sección estándar
- `.main-content` - Contenedor principal del contenido

### Utilidades:
- `.text-center` - Texto centrado
- `.mt-4`, `.mb-4` - Márgenes superior e inferior
- `.btn-primary` - Botón primario del sistema

### Layout:
- Usa Bootstrap 5 para grid system
- Clases responsivas incluidas

## 🔧 Funcionalidad JavaScript incluida

- `goBack()` - Navegar hacia atrás
- `navigateTo('route')` - Navegar a una ruta específica
- `logout()` - Función de cerrar sesión

## 📱 Responsive Design

### Desktop (>768px):
- Header con padding 30px lateral
- Contenido con ancho máximo 1200px
- Footer con elementos en extremos

### Tablet (≤768px):
- Header en columna
- Padding reducido
- Footer en columna centrado

### Mobile (≤480px):
- Elementos más compactos
- Padding mínimo (10-15px)
- Iconos y textos más pequeños

## 🎯 Ejemplo de uso completo

```html
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AccessLab - Gestión de Usuarios</title>
    <!-- ... otros enlaces ... -->
    <link rel="stylesheet" href="../css/plantilla-base.css">
    <link rel="stylesheet" href="../css/usuarios.css">
</head>
<body>
    <!-- Header con título personalizado -->
    <h1 class="welcome-text">Gestión de Usuarios</h1>
    
    <!-- Contenido específico -->
    <main class="main-content">
        <div class="content-container">
            <h2 class="section-title">Lista de Usuarios</h2>
            <!-- Tu tabla, formularios, etc. -->
        </div>
    </main>
    
    <!-- Scripts -->
    <script src="../js/usuarios.js"></script>
</body>
</html>
```

¡Esta plantilla está lista para usar y garantiza consistencia en todo el sistema AccessLab!