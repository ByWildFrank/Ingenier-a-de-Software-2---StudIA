# Documentación Completa de Casos de Uso: StudIA - Flashcards

Este documento detalla los flujos lógicos de las funcionalidades de Flashcards, basándose en la implementación técnica de los componentes `FlashcardsIA.vue`, `ExamenFlashcards.vue` y el servicio `flashcards.service.js`.

```mermaid
useCaseDiagram
    actor Usuario
    actor "Servicio IA (Gemini)" as IA
    actor "Base de Datos" as DB

    package "Sistema StudIA" {
        usecase "CU1: Crear flashcard a partir de un apunte" as CU1
        usecase "CU2: Usar Flashcards (Estudio)" as CU2
        usecase "CU3: Revisar flashcards previamente generadas" as CU3
    }

    Usuario --> CU1
    Usuario --> CU2
    Usuario --> CU3
    
    CU1 ..> IA : <<include>>
    CU1 ..> DB : <<include>>
    CU2 ..> DB : <<include>>
    CU3 ..> DB : <<include>>
```

---

## CU1: Crear flashcard a partir de un apunte

**Descripción:** Proceso de generación automatizada de contenido de estudio mediante el procesamiento de documentos con IA.

### 1.1 Acción: Seleccionar o crear materia
*   **Curso Normal:** El usuario despliega la lista de materias cargadas desde la DB y selecciona una.
*   **Curso Alternativo:** El usuario selecciona "+ Añadir nueva materia", ingresa el nombre y el sistema la registra en la DB mediante `sp_Materia_Crear` antes de continuar.

### 1.2 Acción: Carga de archivo (Apunte)
*   **Curso Normal:** El usuario selecciona un archivo compatible (.pdf, .docx, .ppt, imágenes). El sistema lo sube al servidor (carpeta `/uploads`) y guarda el registro del apunte en la DB.
*   **Curso Alternativo:** El archivo excede el tamaño permitido o el formato es inválido; el frontend muestra una alerta y detiene la subida.

### 1.3 Acción: Procesamiento con IA (Google Gemini)
*   **Curso Normal:** El backend lee el archivo físico, extrae el texto y lo envía a Gemini. La IA devuelve un JSON estructurado con preguntas, respuestas correctas, distractores y nivel de dificultad.
*   **Curso Alternativo:** La IA no puede leer el archivo (ej. PDF protegido o imagen ilegible) o el servicio falla. El sistema lanza una excepción y notifica al usuario: "Error generando flashcards mediante IA".

### 1.4 Acción: Persistencia de tarjetas
*   **Curso Normal:** El sistema inicia una transacción SQL. Ejecuta `sp_Flashcard_Crear` para cada tarjeta y `sp_Respuesta_Crear` para sus opciones. Al finalizar, realiza un `commit`.
*   **Curso Alternativo:** Si falla el guardado de una respuesta o hay un error de conexión, se ejecuta un `rollback` de la transacción completa para evitar datos inconsistentes.

---

## CU2: Usar Flashcards (Sesión de Estudio)

**Descripción:** Interfaz de examen donde el usuario responde tarjetas y el sistema mide su desempeño.

### 2.1 Acción: Configuración de la sesión
*   **Curso Normal:** El usuario selecciona la materia. El sistema recupera las flashcards (con sus respuestas) mezclando el orden de las tarjetas y el orden de las opciones (A, B, C, D).
*   **Curso Alternativo:** La materia seleccionada no tiene flashcards vinculadas. El sistema deshabilita el botón de inicio y sugiere crearlas.

### 2.2 Acción: Responder tarjeta
*   **Curso Normal:** El usuario elige la opción correcta. El sistema marca el botón en verde, suma un acierto al contador y habilita el botón "Siguiente".
*   **Curso Alternativo:** El usuario elige una opción incorrecta. El sistema marca el botón en rojo, vibra la tarjeta (efecto shake), muestra cuál era la correcta y suma un error.

### 2.3 Acción: Registro de progreso final
*   **Curso Normal:** Al completar la última tarjeta, el sistema calcula el puntaje porcentual y ejecuta `sp_Progreso_Crear`. Se muestra el resumen con el trofeo y la animación del puntaje.
*   **Curso Alternativo:** Falla la conexión al guardar el progreso en la DB. El sistema muestra los resultados en pantalla pero advierte que el avance no pudo ser registrado en el historial.

---

## CU3: Revisar flashcards previamente generadas (Biblioteca)

**Descripción:** Consulta estática de los pares pregunta-respuesta de una materia.

### 3.1 Acción: Carga de biblioteca
*   **Curso Normal:** El usuario pulsa "Ver todas las respuestas". El sistema solicita todas las tarjetas de la materia vía `GET /api/flashcards/materia/:id`.
*   **Curso Alternativo:** El usuario intenta acceder a la biblioteca sin haber seleccionado una materia previa. El sistema mantiene la biblioteca oculta.

### 3.2 Acción: Visualización de contenido
*   **Curso Normal:** Se despliega un grid con tarjetas que muestran la pregunta, la respuesta correcta destacada en un recuadro verde y la lista de distractores abajo.
*   **Curso Alternativo:** El apunte asociado a las tarjetas fue borrado, pero las tarjetas persisten. El sistema muestra las flashcards pero con una advertencia de que el material de origen no está disponible.
