# Patrones de Diseño en StudIA

Este documento detalla los patrones de diseño identificados en el proyecto, su propósito, cómo se implementan en el código actual y referencias bibliográficas para su estudio.

## 1. Patrón Estrategia (Strategy)

- **Referencia en el código**: Archivo `backend/src/services/ai.service.js` (Objetos `EstrategiaDocx`, `EstrategiaPptx`, `EstrategiaNativaGemini` y la función delegadora `extraerTextoSiEsNecesario`).
- **Descripción**: Permite definir una familia de algoritmos, encapsular cada uno de ellos (en este caso, en objetos separados) y hacerlos intercambiables, de modo que el algoritmo varíe independientemente de los clientes que lo utilizan.
- **Cómo funciona en esta práctica**: En el servicio de inteligencia artificial, el sistema debe extraer el texto de un documento. Dependiendo de la extensión del archivo (`.docx`, `.pptx` o formatos nativos como `.pdf`), el código delega el procesamiento al "Objeto Estrategia" correspondiente. Todos estos objetos comparten una misma "interfaz" lógica (los métodos `soporta(ext)` y `extraerTexto(filePath)`). Por ejemplo, `EstrategiaDocx` utiliza la librería `mammoth`, mientras que `EstrategiaNativaGemini` delega el trabajo nativamente a la IA. La función principal agrupa estas estrategias en una colección y ejecuta la adecuada de forma dinámica mediante polimorfismo.
- **Fuentes bibliográficas**:
  - _Design Patterns: Elements of Reusable Object-Oriented Software_ (Gang of Four) - Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides.
  - _Head First Design Patterns_ - Eric Freeman, Elisabeth Robson.

## 2. Patrón Fachada (Facade)

- **Referencia en el código**: Archivos en `frontend/src/services/` (ej. `authService.js`).
- **Descripción**: Proporciona una interfaz unificada y simplificada a un conjunto de interfaces más complejas en un subsistema.
- **Cómo funciona en esta práctica**: Los componentes de la interfaz (Vue) no realizan peticiones HTTP directas con `axios` manipulando cabeceras, manejo de errores o rutas crudas de la API. En su lugar, utilizan archivos como `authService.js` que actúan como una "fachada", exponiendo métodos sencillos como `iniciarSesion(correo, contraseña)`. Esto oculta toda la complejidad del manejo de red al resto de la aplicación web.
- **Fuentes bibliográficas**:
  - _Design Patterns: Elements of Reusable Object-Oriented Software_ (Gang of Four) - Erich Gamma, et al.
  - _Clean Architecture: A Craftsman's Guide to Software Structure and Design_ - Robert C. Martin.

## 3. Patrón Singleton (Instancia Única)

- **Referencia en el código**: Archivo `backend/src/database/db.js`.
- **Descripción**: Garantiza que una clase o componente tenga una única instancia durante todo el ciclo de vida de la aplicación y proporciona un punto de acceso global a ella.
- **Cómo funciona en esta práctica**: En la configuración de la base de datos en `db.js`, se crea y exporta un gestor de conexiones utilizando el módulo `mssql`. Cuando los distintos servicios necesitan acceder a la base de datos, importan este módulo compartiendo así la misma configuración y evitando la sobrecarga de crear un pool de conexiones de red nuevo por cada consulta.
- **Fuentes bibliográficas**:
  - _Design Patterns: Elements of Reusable Object-Oriented Software_ (Gang of Four) - Erich Gamma, et al.

## 4. Patrón Observador (Observer)

- **Referencia en el código**: Reactividad en los componentes de Vue.js (`frontend/src/views` y `frontend/src/components`).
- **Descripción**: Define una dependencia de uno-a-muchos entre objetos, de manera que cuando un objeto cambia su estado, todos sus dependientes son notificados y actualizados automáticamente.
- **Cómo funciona en esta práctica**: Vue.js basa todo su sistema de estado reactivo en este patrón (implementado mediante Proxies en Vue 3). Cuando los datos (estado) de una tarjeta de flashcard o la lista de materias cambian, los componentes visuales subscritos u observando esos datos se actualizan automáticamente en la interfaz web (el DOM) sin requerir re-renderizados manuales.
- **Fuentes bibliográficas**:
  - _Design Patterns: Elements of Reusable Object-Oriented Software_ (Gang of Four) - Erich Gamma, et al.
  - _Learning JavaScript Design Patterns_ - Addy Osmani.
