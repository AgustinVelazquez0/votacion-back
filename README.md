# Backend - Proyecto **To-Do List** con Node.js, Express, MongoDB y PostgreSQL

---

## Descripción del Proyecto

Este es el backend de la aplicación **To-Do List**. Está construido con **Node.js**, **Express.js** y las bases de datos **MongoDB** para las tareas y **PostgreSQL** para la autenticación de usuarios. Además, utiliza **JWT** para la autenticación segura de usuarios.

El backend proporciona rutas RESTful para interactuar con las tareas y los usuarios, y se ejecuta en un servidor local.

### Requisitos Previos

Asegúrate de tener instalados los siguientes programas:

- **Node.js**: [Descargar aquí](https://nodejs.org/)
- **Docker**: [Descargar aquí](https://www.docker.com/products/docker-desktop)
- **PostgreSQL**: Base de datos para usuarios.
- **MongoDB**: Base de datos para tareas.

### Instrucciones de Instalación

#### 1. **Clonar el Repositorio del Backend:**

```bash
git clone git@github.com:AgustinVelazquez0/Todo_List_Back.git
```

#### 2. **Configurar Docker para las Bases de Datos**:

Asegúrate de tener Docker instalado. Luego, dentro del directorio del backend, ejecuta:

```bash
docker-compose up
```

Esto levantará los contenedores de **MongoDB** y **PostgreSQL** para que el backend pueda interactuar con ellas.

#### 3. **Instalar Dependencias del Backend:**

Navega al directorio del backend y ejecuta:

```bash
cd Todo_List_Back
npm install
```

#### 4. **Iniciar el Servidor del Backend:**

Una vez que las dependencias estén instaladas, ejecuta:

```bash
npm start
```

El servidor debería estar corriendo en `http://localhost:5000`.

### Estructura del Proyecto

- **`models/`**: Modelos para MongoDB (tareas) y PostgreSQL (usuarios).
- **`routes/`**: Rutas RESTful para tareas y usuarios.
- **`controllers/`**: Lógica de negocio para gestionar las tareas y los usuarios.
- **`app.js`**: Archivo principal para la configuración del servidor.

### Tecnologías Utilizadas

- **Node.js** y **Express.js**: Para el backend y manejo de rutas.
- **MongoDB**: Para la base de datos de tareas.
- **PostgreSQL**: Para la base de datos de usuarios.
- **JWT**: Para autenticación de usuarios.
- **Docker**: Para contenerizar las bases de datos.
