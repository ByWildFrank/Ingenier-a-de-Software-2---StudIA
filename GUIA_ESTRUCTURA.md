# Guía de Estructura del Proyecto: StudIA

Este documento explica la organización y el propósito de cada directorio en el proyecto, facilitando la navegación y el mantenimiento del sistema.

---

## 🖥️ Backend (Node.js + Express)

El backend sigue una arquitectura de capas (MVC + Capa de Servicio) para separar las responsabilidades de red, lógica de negocio y persistencia.

### `backend\src\controllers`
Contiene los **Controladores**. Son los encargados de recibir las peticiones HTTP (req) y enviar las respuestas (res). 
- **Función**: Validan los datos de entrada y llaman a los servicios correspondientes.
- **Ejemplo**: `auth.controller.js` maneja el login y el registro.

### `backend\src\database`
Configuración de la **Conexión a la Base de Datos**.
- **Función**: Contiene el archivo `db.js` donde se configura el pool de conexiones a SQL Server. Es la puerta de enlace a la data.

### `backend\src\models`
Definición de **Modelos de Datos**.
- **Función**: Representan las entidades del sistema (Usuario, Materia, Flashcard). En este proyecto se usan para estructurar los datos antes de guardarlos o después de consultarlos.

### `backend\src\routes`
Definición de **Rutas (Endpoints)**.
- **Función**: Mapean las URLs (ej. `/api/materias`) con sus respectivos controladores. Es el "menú" de la API.

### `backend\src\services`
Capa de **Servicio (Lógica de Negocio)**.
- **Función**: Aquí reside la lógica principal y las consultas SQL. Es donde se procesan los datos, se calculan estadísticas y se interactúa directamente con la base de datos.
- **Ejemplos**: `flashcards.service.js` contiene la lógica para cargar, filtrar y contar tarjetas.

### `backend\src\utils`
**Utilidades y Helpers**.
- **Función**: Funciones genéricas que se usan en varias partes del proyecto.
- **Ejemplos**: `upload.js` configura **Multer** para la subida de archivos, y `errorHandler.js` centraliza el manejo de errores.

### `backend\uploads`
**Almacenamiento Físico**.
- **Función**: Carpeta donde se guardan los archivos PDF/Docx que suben los usuarios antes de ser procesados por la IA.

---

## 🎨 Frontend (Vue.js 3 + Vite)

El frontend está construido sobre Vue.js, enfocado en una interfaz moderna, reactiva y centrada en componentes.

### `frontend\public`
**Archivos Estáticos Públicos**.
- **Función**: Archivos que se sirven tal cual al navegador, como el `favicon.ico` o recursos que no necesitan ser procesados por el compilador de Vue.

### `frontend\src\assets`
**Recursos Globales**.
- **Función**: Contiene el archivo `index.css` (estilos globales) y otros recursos como imágenes o iconos que se usan en toda la aplicación.

### `frontend\src\components`
**Componentes Reutilizables**.
- **Función**: Piezas de interfaz que se usan en múltiples páginas.
- **Ejemplo**: `Sidebar.vue` es el menú lateral que persiste en toda la navegación.

### `frontend\src\router`
**Enrutamiento del Frontend**.
- **Función**: Define qué vista (View) se debe mostrar según la URL del navegador. También incluye los *Guards* de seguridad para proteger rutas privadas.

### `frontend\src\services`
**Cliente de API (Servicios de Red)**.
- **Función**: (Si se usa) Centraliza las llamadas de `axios` al backend para evitar repetir URLs y configuraciones en los componentes.

### `frontend\src\views`
**Vistas (Páginas del Sistema)**.
- **Función**: Son los componentes de "alto nivel" que representan una página completa.
- **Ejemplos**: 
    - `Dashboard.vue`: Resumen de estadísticas.
    - `Materias.vue`: Gestión de materias y apuntes.
    - `ExamenFlashcards.vue`: Interfaz de estudio y biblioteca.

---

## Resumen de Flujo
1. El usuario interactúa con una **View** en el Frontend.
2. La View usa un **Service** (o Axios) para llamar a una **Route** del Backend.
3. La Route llama a un **Controller**.
4. El Controller pide los datos o el procesamiento a un **Service** del Backend.
5. El Service consulta la **Database** y devuelve la respuesta hacia arriba.
