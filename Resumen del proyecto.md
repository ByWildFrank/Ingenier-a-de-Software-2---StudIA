# Resumen del Proyecto: StudIA

## 1. Introducción
**StudIA** es una plataforma educativa web diseñada para revolucionar la forma en que los estudiantes organizan su material, estudian y se evalúan. Aprovecha el poder de la Inteligencia Artificial para automatizar la creación de herramientas de estudio personalizadas a partir de los propios apuntes del alumno.

## 2. Objetivo Principal
Proporcionar un entorno de estudio integral, intuitivo y moderno que optimice el tiempo del estudiante, transformando documentos estáticos (como PDFs o archivos de Word) en material interactivo de autoevaluación (Flashcards y Exámenes de prueba).

## 3. Funcionalidades Clave del Sistema
El sistema se centra en las siguientes áreas principales:

*   **Gestión de Materias y Apuntes:** Permite a los usuarios organizar sus asignaturas y almacenar o clasificar los documentos de estudio correspondientes a cada una.
*   **Generación de Flashcards con IA:** A partir de un documento subido por el usuario, el sistema procesa el texto mediante Inteligencia Artificial para extraer los conceptos más importantes y generar automáticamente tarjetas de estudio (Flashcards).
*   **Generación de Exámenes Personalizados:** El usuario puede subir material de lectura y configurar parámetros (como cantidad de preguntas y nivel de dificultad) para que la IA genere un examen de prueba ("Mock Exam") a medida.
*   **Interfaz de Autoevaluación:** Un módulo dedicado para repasar las Flashcards y realizar los exámenes generados, permitiendo una retroalimentación inmediata.
*   **Dashboard Estadístico:** Un panel principal que brinda al estudiante un resumen de su progreso y rendimiento.

## 4. Arquitectura y Tecnologías
El proyecto está construido bajo una arquitectura cliente-servidor robusta, segura y escalable, dividida claramente en Frontend, Backend y Base de Datos:

### Frontend (Cliente)
*   **Tecnologías:** Desarrollado con **Vue.js 3** y empaquetado con **Vite**.
*   **Enfoque:** Se ha puesto especial énfasis en lograr un diseño UI/UX *premium*, moderno y altamente reactivo, centrado en componentes reutilizables.
*   **Vistas principales:** Dashboard, Gestión de Materias, Interfaz de Flashcards, y Generador de Exámenes.

### Backend (Servidor API)
*   **Tecnologías:** Desarrollado en **Node.js** utilizando el framework **Express**.
*   **Arquitectura:** Sigue un diseño en capas (Controladores, Rutas y Servicios), logrando una excelente separación de responsabilidades:
    *   **Controladores:** Validan peticiones HTTP.
    *   **Rutas:** Definen los *endpoints* (API REST).
    *   **Servicios:** Contienen la lógica de negocio pura.

### Base de Datos
*   **Tecnologías:** Motor de base de datos relacional **SQL Server**.
*   **Seguridad y Rendimiento:** Toda la interacción entre el Backend y la Base de Datos está encapsulada mediante **Procedimientos Almacenados (Stored Procedures)**. Esta decisión arquitectónica:
    1.  Protege contra ataques de Inyección SQL.
    2.  Centraliza y optimiza las consultas de manipulación de datos (CRUD) y cálculo de estadísticas complejas.
    3.  Desacopla la lógica de negocio de la estructura directa de las tablas.

## 5. Flujo General de Funcionamiento
Para una defensa, el flujo principal se puede resumir así:
1.  **Interacción:** El usuario interactúa con la interfaz visual (Vue.js), por ejemplo, solicitando generar un examen a partir de un apunte en PDF.
2.  **Petición al Servidor:** El Frontend envía el archivo y los parámetros (dificultad, cantidad) al Backend vía una petición HTTP REST.
3.  **Procesamiento:** El Controlador del Backend recibe la petición y se la pasa a la Capa de Servicios.
4.  **IA y Persistencia:** El Servicio se encarga de:
    *   Manejar la integración con el motor de IA para procesar el texto y generar las preguntas/flashcards.
    *   Comunicarse con SQL Server (mediante un Procedimiento Almacenado) para guardar los resultados generados en la base de datos de forma segura.
5.  **Respuesta:** El Backend devuelve los datos procesados al Frontend, el cual se actualiza de forma reactiva para mostrar al usuario su nuevo material de estudio listo para usar.
