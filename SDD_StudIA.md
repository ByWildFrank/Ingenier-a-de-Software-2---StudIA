# Documento de Diseño de Software (SDD): StudIA 🚀

Este documento detalla la visión, arquitectura, especificaciones técnicas y el plan de ejecución para la reconstrucción del ecosistema **StudIA**.

---

## 1. Propuesta: El "Qué" y el "Por Qué"

### ¿Qué es StudIA?
**StudIA** es una plataforma educativa inteligente que transforma documentos estáticos (PDF, Word, PPT) en herramientas interactivas de aprendizaje. Utiliza Inteligencia Artificial para "leer" el material del estudiante y generar automáticamente flashcards, cuestionarios y exámenes de práctica.

### ¿Por qué existe?
El estudio tradicional suele ser pasivo (releer notas), lo cual es ineficiente. La ciencia del aprendizaje demuestra que el **Active Recall** (recuerdo activo) y la **Repetición Espaciada** son las técnicas más efectivas. StudIA automatiza la creación de estos materiales, eliminando la fricción de preparar el estudio y permitiendo que el estudiante se enfoque directamente en aprender.

---

## 2. Diseño: Stack Técnico y Decisiones Arquitectónicas

### Stack Tecnológico
| Capa | Tecnología | Razón de la decisión |
| :--- | :--- | :--- |
| **Frontend** | Vue.js 3 + Vite | Reactividad superior, ecosistema moderno y rapidez de desarrollo. |
| **Estilos** | CSS Moderno (Glassmorphism) | Estética premium y profesional que mejora la experiencia del usuario. |
| **Backend** | Node.js + Express | Manejo eficiente de peticiones asíncronas y gran soporte para integración de IA. |
| **Base de Datos**| SQL Server | Robustez empresarial y manejo seguro de datos relacionales complejos. |
| **Inteligencia Artificial** | Google Gemini (1.5 Flash) | Velocidad extrema en procesamiento de archivos y bajo costo por token. |

### Decisiones de Diseño Clave
1.  **Stored Procedures (Procedimientos Almacenados):** Toda la lógica de persistencia reside en la base de datos. Esto garantiza:
    *   **Seguridad:** Blindaje contra SQL Injection.
    *   **Rendimiento:** Ejecución optimizada en el servidor de base de datos.
    *   **Mantenibilidad:** La lógica de datos está centralizada y separada del código de la API.
2.  **Arquitectura en Capas:** Backend dividido en Rutas (Endpoints), Controladores (Validación) y Servicios (Lógica de Negocio/IA).
3.  **Procesamiento Híbrido de Archivos:**
    *   Los archivos nativos (PDF, TXT, Imágenes) se envían directamente a la API de Gemini.
    *   Los archivos de Office (DOCX, PPTX) se pre-procesan en el servidor para extraer el texto antes del envío.

---

## 3. Especificaciones: Comportamiento de la Búsqueda Inteligente

La búsqueda es una funcionalidad crítica para que el usuario localice rápidamente sus materiales en un repositorio creciente.

### Comportamiento Esperado:
*   **Alcance Global:** Debe filtrar simultáneamente Materias, Apuntes y Flashcards.
*   **Tiempo Real (Debounced):** Los resultados se actualizan mientras el usuario escribe (con un retraso de 300ms para evitar sobrecarga).
*   **Filtros Inteligentes:**
    *   `Por Nombre`: Coincidencia parcial en títulos de materias y archivos.
    *   `Por Contenido`: Búsqueda de palabras clave dentro de las preguntas de las flashcards generadas.
    *   `Por Dificultad`: Filtrar flashcards según el nivel (1-5) asignado por la IA.
*   **Interfaz Visual:** Los resultados deben aparecer en un *overlay* o lista desplegable bajo el input de búsqueda, con iconos distintivos por tipo de contenido.

---

## 4. Tareas: Hoja de Ruta para la Construcción

### Fase 1: Infraestructura y Base de Datos
- [ ] Configurar servidor SQL Server.
- [ ] Crear esquema de tablas (Usuarios, Materias, Apuntes, Flashcards, Progreso).
- [ ] Programar Procedimientos Almacenados para CRUD y Estadísticas.

### Fase 2: Backend Core (API)
- [ ] Inicializar proyecto Node.js con Express.
- [ ] Configurar conexión con SQL Server (mssql).
- [ ] Implementar sistema de autenticación (JWT).
- [ ] Desarrollar Servicio de IA (Integración con Gemini API).
- [ ] Crear controladores para gestión de Materias y Apuntes (Multer para uploads).

### Fase 3: Frontend y Diseño UI
- [ ] Inicializar proyecto Vue.js 3 con Vite.
- [ ] Implementar Sistema de Diseño (Variables CSS, Glassmorphism, Animaciones).
- [ ] Desarrollar Sidebar y Navegación principal.
- [ ] Crear vistas de Dashboard (Stats) y Gestión de Materias.
- [ ] Implementar componentes de carga y estados vacíos.

### Fase 4: Integración y Funcionalidades IA
- [ ] Conectar interfaz de "Crear Flashcards" con el servicio de Gemini.
- [ ] Desarrollar el motor de "Examen/Repaso" con lógica de calificación.
- [ ] Implementar el sistema de búsqueda global especificado en la Sección 3.
- [ ] Realizar pruebas de estrés en el procesamiento de documentos extensos.

### Fase 5: Pulido y Despliegue
- [ ] Optimizar tiempos de respuesta de la IA.
- [ ] Refactorizar nombres a español (Consistencia lingüística).
- [ ] Configurar variables de entorno (.env) para producción.
