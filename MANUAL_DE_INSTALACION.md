# Manual de Instalación — StudIA

Versión del documento: 1.0
Fecha: Junio 2026
Proyecto: StudIA — Plataforma Educativa con Inteligencia Artificial
Repositorio: https://github.com/ByWildFrank/Ingenier-a-de-Software-2---StudIA


## 1. Introducción

StudIA es una plataforma educativa web diseñada para transformar documentos estáticos (PDF, Word, PowerPoint) en herramientas interactivas de aprendizaje mediante Inteligencia Artificial. El sistema permite a los estudiantes organizar sus materias, subir apuntes y generar automáticamente flashcards y exámenes de práctica a partir del contenido de sus documentos, utilizando la API de Google Gemini (modelo 1.5 Flash).

La arquitectura del proyecto se divide en tres capas principales:

- Frontend: Vue.js 3 + Vue CLI — Interfaz de usuario moderna y reactiva.
- Backend: Node.js + Express 5 — API REST con arquitectura en capas (Controladores, Servicios, Rutas).
- Base de Datos: SQL Server Express — Motor relacional con Procedimientos Almacenados para toda la persistencia.
- Inteligencia Artificial: Google Gemini (1.5 Flash) — Procesamiento de documentos y generación automática de contenido educativo.


## 2. Objetivo de este Manual

Este manual tiene como propósito guiar de forma clara y paso a paso la instalación, configuración y puesta en marcha del sistema StudIA en un entorno local de desarrollo. Al finalizar el proceso descrito, el usuario será capaz de:

- Tener el código fuente completo del proyecto clonado en su máquina.
- Contar con un servidor de base de datos SQL Server configurado con la estructura completa de tablas, procedimientos almacenados y roles de seguridad.
- Ejecutar el backend (API REST) y el frontend (interfaz web) de forma simultánea.
- Verificar que todos los módulos del sistema funcionan correctamente.


## 3. Dirigido a

Este manual está dirigido a:

- Desarrolladores que se incorporan al equipo de desarrollo de StudIA y necesitan preparar su entorno local.
- Docentes evaluadores de la cátedra de Ingeniería de Software II (UNNE) que necesiten desplegar el sistema para su revisión y corrección.
- Estudiantes colaboradores que deseen clonar el proyecto para contribuir, realizar pruebas o estudiar el código fuente.


## 4. Lo que deben conocer

Antes de comenzar con la instalación, se recomienda que el usuario posea conocimientos básicos en las siguientes áreas:

- Sistema operativo Windows (Nivel: Básico): Navegación de archivos, ejecución de programas, uso de variables de entorno.
- Terminal / Línea de comandos (Nivel: Básico): Manejo de una consola (PowerShell o CMD) para ejecutar comandos como cd, npm, node.
- Git y GitHub (Nivel: Básico): Conceptos de clonar un repositorio, ramas y commits. Uso de GitHub Desktop o Git CLI.
- SQL Server / Bases de datos (Nivel: Básico): Comprensión de qué es una base de datos relacional, cómo conectarse a un motor SQL, y qué es un login/usuario de base de datos.
- Node.js y npm (Nivel: Básico): Entender que "npm install" descarga dependencias y que "node server.js" inicia un servidor.

Nota: No es necesario ser un experto en ninguna de estas tecnologías. Este manual guía cada paso con instrucciones detalladas de cada proceso.


## 5. Especificaciones Técnicas

### 5.1. Requisitos de Hardware (Mínimos recomendados)

- Procesador: Intel Core i3 / AMD Ryzen 3 (o superior)
- Memoria RAM: 8 GB
- Almacenamiento: 5 GB de espacio libre en disco
- Conexión a Internet: Requerida (para clonar el repositorio, descargar dependencias y comunicación con la API de Gemini)

### 5.2. Requisitos de Software

- Windows 10 u 11 (64-bit) — Sistema operativo.
- SQL Server Express 2019 o superior — Motor de base de datos relacional.
- SQL Server Management Studio (SSMS) 19.x o superior — Herramienta gráfica para administrar SQL Server.
- Node.js v18.x o superior (recomendado: v24.x LTS) — Entorno de ejecución para el backend.
- npm v9.x o superior (viene incluido con Node.js) — Gestor de paquetes para dependencias de JavaScript.
- GitHub Desktop (última versión estable) — Cliente gráfico para operaciones Git.
- Navegador web moderno: Chrome, Edge o Firefox (últimas versiones) — Para acceder a la interfaz de usuario.

### 5.3. Dependencias del Proyecto

#### Dependencias del Backend (backend/package.json)

- express (^5.2.1): Framework web para la API REST.
- mssql (^12.3.1): Driver de conexión a SQL Server.
- @google/generative-ai (^0.24.1): SDK oficial de Google Gemini para IA.
- cors (^2.8.6): Habilitación de solicitudes Cross-Origin.
- dotenv (^17.4.2): Carga de variables de entorno desde archivo .env.
- multer (^2.1.1): Manejo de subida de archivos (multipart/form-data).
- mammoth (^1.12.0): Extracción de texto desde archivos .docx.
- adm-zip (^0.5.17): Lectura de archivos comprimidos (.pptx y similares).
- jest (^30.4.2): (Dev) Framework de testing unitario.

#### Dependencias del Frontend (frontend/package.json)

- vue (^3.2.13): Framework reactivo para la interfaz de usuario.
- vue-router (^4.6.4): Navegación/enrutamiento entre vistas.
- axios (^1.15.1): Cliente HTTP para comunicación con el backend.
- core-js (^3.8.3): Polyfills para compatibilidad con navegadores.
- @vue/cli-service (~5.0.0): (Dev) Herramienta de compilación y servidor de desarrollo.

### 5.4. Puertos utilizados

- Backend (API): Puerto 3000 — URL de acceso: http://localhost:3000
- Frontend (Vue): Puerto 8080 — URL de acceso: http://localhost:8080
- SQL Server: Puerto 1433 — Conexión interna vía TCP/IP


## 6. Instalación y Configuración del Sistema

### Paso 1 — Instalar SQL Server Express

IMPORTANTE: SQL Server Express es el motor de base de datos gratuito de Microsoft. Es indispensable para almacenar toda la información del sistema.

1. Descargar SQL Server 2022 Express desde:
   https://www.microsoft.com/es-es/sql-server/sql-server-downloads

2. Ejecutar el instalador y seleccionar la opción "Básica" (Basic).

3. Aceptar los términos de licencia y completar la instalación con los valores predeterminados.

4. Habilitar la autenticación de modo mixto (SQL Server y Windows):
   - Durante la instalación, cuando se le pregunte el modo de autenticación, seleccionar "Modo mixto (autenticación de SQL Server y de Windows)".
   - Si ya está instalado, se puede cambiar desde SSMS: Click derecho sobre el servidor → Propiedades → Seguridad → Seleccionar "Modo de autenticación de SQL Server y Windows" → Reiniciar el servicio de SQL Server.

5. Habilitar el protocolo TCP/IP en el puerto 1433:
   - Abrir SQL Server Configuration Manager.
   - Ir a Configuración de red de SQL Server → Protocolos de SQLEXPRESS.
   - Hacer doble click en TCP/IP → Pestaña Protocolo → Poner Habilitado = Sí.
   - Pestaña Direcciones IP → En la sección IPAll, establecer Puerto TCP = 1433.
   - Reiniciar el servicio de SQL Server desde la sección Servicios de SQL Server.


### Paso 2 — Instalar SQL Server Management Studio (SSMS)

1. Descargar SSMS desde:
   https://learn.microsoft.com/es-es/sql/ssms/download-sql-server-management-studio-ssms

2. Ejecutar el instalador y seguir los pasos predeterminados.

3. Una vez instalado, abrir SSMS y conectarse al servidor:
   - Nombre del servidor: localhost o .\SQLEXPRESS
   - Autenticación: Autenticación de Windows (para la configuración inicial)


### Paso 3 — Crear la Base de Datos y ejecutar el script SQL

IMPORTANTE: El archivo STUDIATABLASPROCE.sql contiene la estructura completa de la base de datos: las 9 tablas, sus relaciones (Foreign Keys), restricciones, y los 53 Procedimientos Almacenados que utiliza el sistema.

1. En SSMS, conectarse al servidor SQL.

2. Crear la base de datos:
   - Click derecho en "Bases de datos" → "Nueva base de datos..."
   - Nombre: StudIA
   - Click en "Aceptar".

3. Ejecutar el script de estructura:
   - En SSMS, ir a Archivo → Abrir → Archivo...
   - Navegar hasta la raíz del proyecto y abrir el archivo: STUDIATABLASPROCE.sql
   - Asegurarse de que en la barra superior esté seleccionada la base de datos StudIA.
   - Presionar F5 o el botón Ejecutar para ejecutar todo el script.

4. Verificar la instalación:
   En el panel izquierdo (Object Explorer), expandir StudIA → Tablas. Deben aparecer las siguientes 9 tablas:

   1. dbo.Apunte
   2. dbo.Examen
   3. dbo.Flashcard
   4. dbo.Materia
   5. dbo.Pomodoro
   6. dbo.Progreso
   7. dbo.Respuesta
   8. dbo.TipoUsuario
   9. dbo.Usuario

   Expandir Programación → Procedimientos almacenados. Deben aparecer 53 procedimientos (con prefijo sp_).


### Paso 4 — Crear los roles de seguridad para la Base de Datos

ADVERTENCIA: El backend se conecta a SQL Server usando autenticación SQL (no Windows). Es obligatorio crear un Login a nivel de servidor y un Usuario a nivel de base de datos con los permisos correctos.

#### A) Crear el Login del servidor (studia_user)

1. En SSMS, expandir el nodo raíz del servidor.
2. Expandir Seguridad → Click derecho en Inicios de sesión → Nuevo inicio de sesión...
3. Completar los campos:
   - Nombre de inicio de sesión: studia_user
   - Seleccionar "Autenticación de SQL Server"
   - Contraseña: 1234
   - Desmarcar la opción "Exigir directivas de contraseña" (para entorno de desarrollo).
   - Base de datos predeterminada: StudIA
4. Click en "Aceptar".

Alternativamente, ejecutar el siguiente script SQL en una nueva ventana de consulta:

    USE [master]
    GO
    CREATE LOGIN [studia_user]
        WITH PASSWORD = '1234',
        DEFAULT_DATABASE = [StudIA],
        CHECK_POLICY = OFF,
        CHECK_EXPIRATION = OFF;
    GO

#### B) Crear el Usuario de la base de datos y asignar los roles

1. En SSMS, expandir Bases de datos → StudIA → Seguridad.
2. Click derecho en Usuarios → Nuevo usuario...
3. Completar:
   - Nombre de usuario: studia_user
   - Nombre de inicio de sesión: studia_user
4. En la sección "Pertenencia a roles de la base de datos", marcar:
   - db_datareader — Permite leer datos de todas las tablas.
   - db_datawriter — Permite insertar, actualizar y eliminar datos en todas las tablas.
5. Click en "Aceptar".

Alternativamente, ejecutar el siguiente script SQL:

    USE [StudIA]
    GO
    CREATE USER [studia_user] FOR LOGIN [studia_user];
    GO
    ALTER ROLE [db_datareader] ADD MEMBER [studia_user];
    GO
    ALTER ROLE [db_datawriter] ADD MEMBER [studia_user];
    GO
    -- Permiso para ejecutar los 53 Procedimientos Almacenados:
    GRANT EXECUTE TO [studia_user];
    GO

ADVERTENCIA: No olvide otorgar el permiso GRANT EXECUTE al usuario. Sin este permiso, el backend no podrá ejecutar ningún Procedimiento Almacenado y todas las operaciones del sistema fallarán.


### Paso 5 — Instalar Node.js

1. Descargar Node.js (LTS) desde:
   https://nodejs.org/es

2. Ejecutar el instalador con las opciones predeterminadas.
   Asegurarse de que la opción "Add to PATH" esté seleccionada.

3. Verificar la instalación abriendo una terminal (PowerShell o CMD):

   node -v
   (Debe mostrar: v18.x.x o superior, recomendado v24.x)

   npm -v
   (Debe mostrar: v9.x.x o superior)


### Paso 6 — Instalar GitHub Desktop

1. Descargar GitHub Desktop desde:
   https://desktop.github.com/

2. Instalar y abrir la aplicación.

3. Iniciar sesión con una cuenta de GitHub (o crear una si no se posee).


### Paso 7 — Clonar el Repositorio

Opción A: Usando GitHub Desktop

1. Abrir GitHub Desktop.
2. Ir a File → Clone Repository...
3. En la pestaña URL, pegar:
   https://github.com/ByWildFrank/Ingenier-a-de-Software-2---StudIA.git
4. Seleccionar la carpeta de destino local deseada.
5. Click en "Clone".

Opción B: Usando la línea de comandos (Git CLI)

   git clone https://github.com/ByWildFrank/Ingenier-a-de-Software-2---StudIA.git
   cd Ingenier-a-de-Software-2---StudIA

Estructura resultante del proyecto:

Una vez clonado, la estructura del proyecto será:

   Ingenier-a-de-Software-2---StudIA/
   │
   ├── backend/                        ← API REST (Node.js + Express)
   │   ├── src/
   │   │   ├── controllers/            ← Controladores HTTP
   │   │   ├── database/               ← Configuración de conexión a SQL Server
   │   │   ├── models/                 ← Modelos de datos
   │   │   ├── routes/                 ← Definición de endpoints
   │   │   ├── services/               ← Lógica de negocio y consultas SQL
   │   │   ├── utils/                  ← Utilidades (Multer, Error Handler)
   │   │   └── app.js                  ← Configuración de Express
   │   ├── tests/                      ← Tests unitarios (Jest)
   │   ├── uploads/                    ← Archivos subidos por los usuarios
   │   ├── .env                        ← Variables de entorno (a configurar)
   │   ├── package.json                ← Dependencias del backend
   │   └── server.js                   ← Punto de entrada del servidor
   │
   ├── frontend/                       ← Interfaz de usuario (Vue.js 3)
   │   ├── public/                     ← Archivos estáticos
   │   ├── src/
   │   │   ├── assets/                 ← Estilos globales (CSS)
   │   │   ├── components/             ← Componentes reutilizables (Sidebar)
   │   │   ├── router/                 ← Configuración de rutas
   │   │   ├── services/               ← Servicios de comunicación con la API
   │   │   ├── views/                  ← Vistas/Páginas del sistema
   │   │   ├── App.vue                 ← Componente raíz
   │   │   └── main.js                 ← Punto de entrada de Vue
   │   └── package.json                ← Dependencias del frontend
   │
   ├── STUDIATABLASPROCE.sql           ← Script completo de la BD (tablas + SPs)
   ├── GUIA_ESTRUCTURA.md              ← Guía de estructura del proyecto
   ├── Resumen del proyecto.md         ← Resumen general del proyecto
   └── SDD_StudIA.md                   ← Documento de Diseño de Software


### Paso 8 — Crear y configurar el archivo .env del Backend

IMPORTANTE: El archivo .env contiene las variables de entorno sensibles (como claves de API). Este archivo está incluido en el .gitignore y no se sube al repositorio. Cada desarrollador debe crearlo manualmente.

1. Navegar a la carpeta backend/ del proyecto.

2. Crear un archivo llamado .env (sin nombre, solo extensión).

3. Agregar el siguiente contenido:

   GEMINI_API_KEY=TU_API_KEY_DE_GEMINI_AQUI

4. Obtener una API Key de Google Gemini:
   - Ir a https://aistudio.google.com/app/apikey
   - Iniciar sesión con una cuenta de Google.
   - Click en "Create API Key".
   - Copiar la clave generada y pegarla en el archivo .env en el lugar de TU_API_KEY_DE_GEMINI_AQUI.

ADVERTENCIA: Nunca compartir ni subir la API Key al repositorio. Es una credencial personal y su exposición puede generar cargos no autorizados en la cuenta de Google.


### Paso 9 — Instalar las dependencias del proyecto

El proyecto requiere instalar las dependencias de dos directorios separados: backend/ y frontend/. Se debe ejecutar npm install en cada uno.

A) Instalar dependencias del Backend

Abrir una terminal y ejecutar:

   cd backend
   npm install

Esto descargará e instalará los siguientes paquetes en backend/node_modules/:
express, mssql, @google/generative-ai, cors, dotenv, multer, mammoth, adm-zip, jest (dev).

B) Instalar dependencias del Frontend

Abrir otra terminal (o navegar) y ejecutar:

   cd frontend
   npm install

Esto descargará e instalará los siguientes paquetes en frontend/node_modules/:
vue, vue-router, axios, core-js, @vue/cli-service, eslint y sus plugins (dev).

Nota: Si se presentan errores de dependencias obsoletas, se puede intentar con: npm install --legacy-peer-deps


### Paso 10 — Ejecutar el sistema

IMPORTANTE: Se necesitan dos terminales separadas ejecutándose simultáneamente: una para el backend y otra para el frontend.

A) Iniciar el Backend (API)

   cd backend
   node server.js

Salida esperada:
   Servidor corriendo en http://localhost:3000

B) Iniciar el Frontend (Interfaz Web)

   cd frontend
   npm run serve

Salida esperada:
   App running at:
   - Local:   http://localhost:8080/
   - Network: http://192.168.x.x:8080/

C) Acceder a la aplicación

Abrir el navegador web y navegar a:

   http://localhost:8080

Se debería visualizar la pantalla de Login de StudIA. Desde allí se puede registrar una nueva cuenta y comenzar a utilizar el sistema.


## 7. Verificación de la Instalación

Una vez que el sistema está corriendo, realizar las siguientes verificaciones:

1. Conexión a la BD: Acceder a http://localhost:3000/api/test-db desde el navegador. Resultado esperado: respuesta JSON indicando conexión exitosa.

2. Frontend cargando: Acceder a http://localhost:8080. Resultado esperado: pantalla de Login visible.

3. Registro de usuario: Crear una cuenta desde la pantalla de Registro. Resultado esperado: redirección al Login con mensaje de éxito.

4. Inicio de sesión: Ingresar con las credenciales creadas. Resultado esperado: acceso al Dashboard principal.

5. Tests unitarios: Ejecutar "npm test" en la carpeta backend/. Resultado esperado: los tests deben ejecutarse sin errores.


## 8. Solución de Problemas Frecuentes

### Error: "ConnectionError: Failed to connect to localhost:1433"

Causa: SQL Server no está escuchando en el puerto 1433 o el servicio no está activo.

Solución:
1. Verificar que el servicio de SQL Server esté corriendo (abrir services.msc → buscar "SQL Server (SQLEXPRESS)" → debe estar en estado "En ejecución").
2. Verificar que TCP/IP está habilitado en SQL Server Configuration Manager (ver Paso 1, punto 5).
3. Reiniciar el servicio de SQL Server después de cualquier cambio de configuración.


### Error: "Login failed for user 'studia_user'"

Causa: El login no fue creado, la contraseña es incorrecta, o el modo de autenticación no es mixto.

Solución:
1. Verificar que el modo de autenticación es mixto (SQL Server y Windows).
2. Verificar que el login studia_user existe en Seguridad → Inicios de sesión del servidor.
3. Verificar que la contraseña sea 1234 (o la que se haya configurado en backend/src/database/db.js).


### Error: "Could not find stored procedure 'sp_...'"

Causa: El script SQL no se ejecutó correctamente o se ejecutó sobre la base de datos incorrecta.

Solución:
1. En SSMS, seleccionar la base de datos StudIA en la barra superior antes de ejecutar el script.
2. Re-ejecutar el archivo STUDIATABLASPROCE.sql completo.
3. Verificar que existen los 53 procedimientos en StudIA → Programación → Procedimientos almacenados.


### Error: "GEMINI_API_KEY is not defined" o falla la generación de flashcards

Causa: El archivo .env no existe o la variable no está correctamente definida.

Solución:
1. Verificar que existe el archivo backend/.env
2. Verificar que contiene la línea GEMINI_API_KEY=tu_clave_aqui sin espacios alrededor del signo =.
3. Reiniciar el backend después de modificar el .env.


### Error: "EACCES" o problemas de permisos con npm

Causa: Permisos insuficientes en la carpeta de instalación.

Solución:
- Ejecutar la terminal como Administrador.
- O bien, ejecutar: npm install --legacy-peer-deps


### El frontend no se conecta al backend

Causa: El backend no está corriendo o los puertos no coinciden.

Solución:
1. Verificar que el backend esté corriendo en el puerto 3000.
2. Verificar que ambos servicios (backend y frontend) estén ejecutándose simultáneamente en terminales separadas.
3. Si se cambió el puerto del backend, actualizar todas las URLs http://localhost:3000 en los archivos de las vistas del frontend (src/views/).
