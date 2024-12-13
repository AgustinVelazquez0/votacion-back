# Proyecto **To-Do List** con React, MongoDB y PostgreSQL

---

## Descripción del Proyecto

Este proyecto consiste en una aplicación de **To-Do List** que permite a los usuarios gestionar sus tareas de manera eficiente. Está dividido en dos partes:

1. **Frontend**: Desarrollado en **React** y configurado con **Vite**. Permite agregar, marcar como completadas y eliminar tareas.
2. **Backend**: Implementado con **Node.js**, **Express.js**, y **MongoDB** para gestionar las tareas. Además, se ha integrado **PostgreSQL** para la gestión de usuarios, utilizando **Docker** para contenerización.

Puedes consultar el repositorio del backend [aquí](https://github.com/AgustinVelazquez0/Todo_List_Back).

### Características del Proyecto

- **Añadir Tareas**: Los usuarios pueden agregar tareas a la lista.
- **Marcar Completadas**: Las tareas pueden ser marcadas como completadas.
- **Eliminar Tareas**: Permite eliminar tareas individuales.
- **Autenticación de Usuarios**: Gestión de usuarios utilizando PostgreSQL con JWT para autenticación.
- **Interfaz de Usuario Intuitiva**: La aplicación es fácil de usar y es completamente responsiva.

### Requisitos Previos

Para ejecutar este proyecto, asegúrate de tener instalados los siguientes programas:

- **Node.js**: [Descargar aquí](https://nodejs.org/)
- **Docker**: [Descargar aquí](https://www.docker.com/products/docker-desktop)
- **npm**: Node Package Manager (ya incluido con Node.js).
- **PostgreSQL**: Para la base de datos de usuarios.
- **MongoDB**: Para la base de datos de las tareas.

### Instrucciones de Instalación

#### 1. **Clonar el Repositorio del Frontend:**

```bash
git clone https://github.com/AgustinVelazquez0/Todo_List_Front.git
```

#### 2. **Clonar el Repositorio del Backend:**

```bash
git clone git@github.com:AgustinVelazquez0/Todo_List_Back.git
```

#### 3. **Configuración de Docker** (para la base de datos):

Asegúrate de tener Docker instalado y ejecutando en tu máquina. Luego, dentro del directorio del backend, configura las bases de datos utilizando Docker con los siguientes comandos:

```bash
docker-compose up
```

Esto iniciará los contenedores para MongoDB (tareas) y PostgreSQL (usuarios).

#### 4. **Instalar Dependencias del Backend:**

Navega al directorio del backend y ejecuta:

```bash
cd Todo_List_Back
npm install
```

#### 5. **Iniciar el Backend:**

Una vez que las dependencias estén instaladas, inicia el servidor con:

```bash
npm start
```

El servidor debería estar corriendo en `http://localhost:5000`.

#### 6. **Instalar Dependencias del Frontend:**

Navega al directorio del frontend y ejecuta:

```bash
cd ReactToDoList
npm install
```

#### 7. **Ejecutar el Frontend:**

Inicia la aplicación en el frontend con:

```bash
npm run dev
```

Luego, abre `http://localhost:3000` en tu navegador para ver la aplicación en funcionamiento.

## Estructura del Proyecto

- **Frontend (React)**

  - **`src/`**: Contiene todos los archivos de la aplicación.
    - **`components/`**: Componentes como `AddTodoForm`, `TodoContext`, `TodoList`, `TodoItem` y `EditTodoForm`.
    - **`App.jsx`**: Componente principal.
    - **`main.jsx`**: Punto de entrada.

- **Backend (Node.js, Express, PostgreSQL, MongoDB)**
  - **`models/`**: Modelos para MongoDB (tareas) y PostgreSQL (usuarios).
  - **`routes/`**: Endpoints REST para CRUD de tareas y usuarios.
  - **`controllers/`**: Lógica para manejar las solicitudes.
  - **`app.js`**: Archivo principal del servidor.

## Tecnologías Utilizadas

- **React**: Librería para la interfaz de usuario.
- **Node.js**: Entorno de ejecución para el backend.
- **Express.js**: Framework para manejar rutas en el backend.
- **MongoDB**: Base de datos para almacenar las tareas.
- **PostgreSQL**: Base de datos para gestionar los usuarios.
- **Docker**: Contenerización de las bases de datos.
- **JWT**: JSON Web Tokens para la autenticación de usuarios.

## Próximas Mejoras

- **Filtros Avanzados**: Implementar filtros para tareas (por fecha, completadas, etc.).
- **Mejoras en la Seguridad**: Refuerzo de la seguridad en las rutas y autenticación.
- **Interfaz Mejorada**: Rediseñar la UI para una experiencia más fluida.

## Contribución

Las contribuciones son bienvenidas. Si deseas contribuir, haz un **fork** del repositorio, realiza tus cambios y envía un **pull request**.
