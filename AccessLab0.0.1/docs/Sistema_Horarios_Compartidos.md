# Sistema de Horarios Compartidos - AccessLab

## Funcionalidades Implementadas

### 1. **Detección de Conflictos de Horarios**
- **Algoritmo de solapamiento**: Convierte horarios a minutos y detecta solapamientos
- **Validación cruzada**: Verifica conflictos entre todos los profesores y laboratorios
- **Feedback específico**: Muestra exactamente qué profesor y horario entra en conflicto

### 2. **Visualización de Disponibilidad de Laboratorios**
- **Estado "Disponible"**: Laboratorio completamente libre (verde)
- **Estado "Parcialmente Ocupado"**: Algunos horarios tomados, otros disponibles (naranja)  
- **Estado "Ocupado"**: Laboratorio completamente reservado (rojo)

### 3. **Configuración Visual de Horarios**
- **Slots ocupados**: Se muestran los horarios ya asignados con el nombre del profesor
- **Indicadores visuales**: Colores distintivos para identificar disponibilidad
- **Información contextual**: Tooltips y detalles de cada asignación

### 4. **Validación Inteligente**
- **Verificación en tiempo real**: Alerta inmediata de conflictos al configurar horarios
- **Sugerencias**: El sistema sugiere horarios disponibles
- **Prevención de errores**: No permite guardar asignaciones con conflictos

## Características Técnicas

### Funciones Principales Implementadas:

1. **`hasScheduleConflict(teacherId, labId, newSchedule)`**
   - Detecta conflictos de horarios entre profesores
   - Compara minuto a minuto para precisión exacta
   - Retorna información detallada del conflicto

2. **`timeToMinutes(timeString)`**
   - Convierte formato HH:MM a minutos desde medianoche
   - Permite comparaciones numéricas precisas

3. **`getOccupiedTimeSlots(labId, excludeTeacherId)`**
   - Obtiene todos los horarios ocupados de un laboratorio
   - Excluye al profesor actual para permitir modificaciones
   - Retorna array con slots ocupados y nombres de profesores

4. **`updateTimeSelectorsWithConflicts(labId)`**
   - Actualiza visualmente los selectores de tiempo
   - Deshabilita horarios en conflicto
   - Añade indicadores visuales de disponibilidad

### Datos de Ejemplo Creados:

**Professor María García (prof_002)** - Laboratorio de Automatización:
- Lunes: 08:00 - 09:00
- Martes: 09:00 - 11:00  
- Viernes: 07:00 - 09:00

**Professor Ana Martínez (prof_004)** - Laboratorio de Redes:
- Miércoles: 10:00 - 11:00
- Jueves: 14:00 - 16:00

## Flujo de Usuario

### Escenario 1: Asignación Nueva
1. Seleccionar profesor sin asignaciones
2. Elegir laboratorio disponible (estado verde)
3. Configurar horarios libremente
4. Guardar sin conflictos

### Escenario 2: Laboratorio Parcialmente Ocupado
1. Seleccionar profesor para asignación
2. Elegir laboratorio con estado naranja (parcialmente ocupado)
3. Ver horarios ocupados con nombres de profesores
4. Configurar horarios en slots disponibles
5. El sistema previene conflictos automáticamente

### Escenario 3: Detección de Conflicto
1. Intentar asignar horario ya ocupado
2. Sistema muestra alerta específica: "Conflicto detectado"
3. Indica profesor y horario en conflicto
4. Sugiere horarios alternativos disponibles

## Beneficios del Sistema

### Para Administradores:
- **Visibilidad completa**: Ve todos los laboratorios y su disponibilidad de un vistazo
- **Prevención de errores**: Imposible crear conflictos de horarios
- **Eficiencia**: Asignación rápida con información clara
- **Flexibilidad**: Permite compartir laboratorios de manera inteligente

### Para la Institución:
- **Optimización de recursos**: Máximo aprovechamiento de laboratorios
- **Reducción de conflictos**: Sistema automatizado previene problemas
- **Escalabilidad**: Soporta múltiples profesores por laboratorio
- **Trazabilidad**: Historial completo de asignaciones

## Integración con el Sistema AccessLab

El sistema de horarios compartidos está completamente integrado con:

- **Modo de Asignación**: Solo funciona durante períodos de transición académica
- **Gestión de Usuarios**: Utiliza la base de datos de profesores existente
- **Sistema de Laboratorios**: Conectado con el inventario de laboratorios
- **Configuración de Admin**: Activación/desactivación desde panel de configuración

Este sistema representa una evolución significativa en la gestión de laboratorios, permitiendo un uso más eficiente y colaborativo de los recursos académicos.