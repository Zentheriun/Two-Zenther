# Two-Zenther Project

<div align="center">
  <img src="https://github.com/Zentheriun/Zentheriun/blob/main/Resources/.IMGs/Web%20-%20Studio%20Zentheriun.png" alt="Studio Zentheriun Preview" width="350"/>
  <img src="https://github.com/Zentheriun/Zentheriun/blob/main/Resources/.IMGs/Web%20-%20Proxima%20B.png" alt="Proxima B Preview" width="350"/>
  <br>
  <em>Una plataforma que unifica la exploración espacial y la gestión de proyectos, impulsada por tecnología de vanguardia.</em>
</div>

<div align="center">
  
  [![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
  [![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
  [![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
  [![SCSS](https://img.shields.io/badge/SCSS-CC6699?style=for-the-badge&logo=sass&logoColor=white)](https://sass-lang.com/)
  [![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
  [![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
  [![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
  
</div>

---

## 🚀 Resumen del Proyecto

**Two-Zenther** es una innovadora plataforma de **Full Stack** que combina dos conceptos distintos pero complementarios: "Studio Zentheriun" para la gestión de proyectos y "Proxima B" para la exploración espacial. Este proyecto demuestra la capacidad de construir aplicaciones web complejas, interactivas y escalables, integrando tecnologías de frontend y backend para ofrecer una experiencia de usuario única y funcional.

La aplicación está construida con **JavaScript (ES6+)**, **HTML5**, **CSS3**, y **SCSS** en el frontend, y **Node.js**, **Express.js**, y **MongoDB** en el backend. Se enfoca en la modularidad, la eficiencia y una interfaz de usuario intuitiva para ambos módulos.

---

## ✨ Características Clave

* **Doble Funcionalidad**: Integra una plataforma de gestión de proyectos ("Studio Zentheriun") y una de exploración espacial ("Proxima B").
* **Interfaz de Usuario Intuitiva**: Diseños limpios y organizados para una navegación sencilla y eficiente en ambos módulos.
* **Desarrollo Full Stack**: Implementación completa de frontend y backend, incluyendo persistencia de datos.
* **Diseño Responsivo**: Experiencia de usuario optimizada para cualquier dispositivo y tamaño de pantalla.
* **Tecnologías Modernas**: Construido con Vanilla JavaScript, HTML5, CSS3, SCSS, Node.js, Express.js y MongoDB, demostrando habilidades sólidas en el desarrollo web.
* **Manejo de Datos en Tiempo Real**: Gestión y visualización de datos dinámicos para proyectos y simulación de exploración espacial (si aplica, describe cómo se manejan estos datos).

---

## 🛠️ Tecnologías Utilizadas

### Frontend
* **HTML5**: Para la estructura semántica de la aplicación.
* **CSS3**: Para un diseño moderno y responsivo.
* **SCSS**: Preprocesador CSS para una organización y mantenimiento de estilos más eficientes.
* **JavaScript (ES6+)**: Para la lógica interactiva y la manipulación del DOM.

### Backend
* **Node.js**: Entorno de ejecución para JavaScript del lado del servidor.
* **Express.js**: Framework web para Node.js, utilizado para construir APIs robustas y eficientes.
* **MongoDB**: Base de datos NoSQL para el almacenamiento de datos.

---

## 🚀 Cómo Ejecutar el Proyecto Localmente

Para configurar y ejecutar Two-Zenther en tu entorno local, sigue estos pasos:

1.  **Clonar el repositorio**:
    ```bash
    git clone [https://github.com/Zentheriun/Two-Zenther.git](https://github.com/Zentheriun/Two-Zenther.git)
    ```
2.  **Navegar al directorio del proyecto**:
    ```bash
    cd Two-Zenther
    ```
3.  **Instalar dependencias del frontend**:
    ```bash
    cd frontend
    npm install
    ```
4.  **Instalar dependencias del backend**:
    ```bash
    cd ../backend
    npm install
    ```
5.  **Configurar variables de entorno (Backend)**:
    * Crea un archivo `.env` en el directorio `backend`.
    * Define tus variables de entorno, como la cadena de conexión de MongoDB (ej: `MONGO_URI=mongodb://localhost:27017/twozenther`).
6.  **Iniciar el servidor backend**:
    ```bash
    cd backend
    npm start # o node server.js
    ```
7.  **Compilar SCSS (si tus archivos SCSS aún no están compilados a CSS)**:
    * Si utilizas un compilador SCSS (ej. Sass CLI o una extensión de VS Code como Live Sass Compiler), asegúrate de compilar tus archivos `.scss` a `.css` en el directorio `frontend/css`.
    * Si tu `index.html` ya incluye el CSS compilado, puedes omitir este paso.
8.  **Abrir `index.html` en tu navegador (usando un servidor local)**:
    * Para que las solicitudes a la API funcionen correctamente debido a las políticas de CORS, es altamente recomendado usar un servidor local.
    * **Opciones para un servidor local:**
        * **Live Server (Extensión de VS Code):** Si usas Visual Studio Code, instala la extensión "Live Server" y haz clic derecho en `index.html` para "Open with Live Server".
        * **Python Simple HTTP Server:** En tu terminal, dentro del directorio `frontend`, ejecuta:
            ```bash
            python -m http.server 8000
            ```
            Luego navega a `http://localhost:8000/index.html` en tu navegador.
        * **Node.js (http-server):** Si tienes Node.js, instala `http-server` globalmente:
            ```bash
            npm install -g http-server
            ```
            Luego, desde el directorio `frontend`, ejecuta:
            ```bash
            http-server
            ```
            Y navega a la URL proporcionada.

---

## 📈 Rendimiento y Compatibilidad

Two-Zenther está optimizado para la velocidad y el rendimiento. Ha sido probado en los principales navegadores web y dispositivos para asegurar una experiencia consistente y fluida.

---

## 🤝 Contribuyendo

Este proyecto es principalmente para propósitos educativos y de portafolio. Sin embargo, los comentarios y sugerencias son bienvenidos:

1.  Haz un "fork" del repositorio.
2.  Crea una rama para tu nueva característica (`git checkout -b feature/mejora`).
3.  Realiza tus cambios (`git commit -am 'Añadir nueva característica'`).
4.  Empuja a la rama (`git push origin feature/mejora`).
5.  Abre un "Pull Request".

---

## 📄 Licencia

Este proyecto está bajo la [Licencia Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International](http://creativecommons.org/licenses/by-nc-nd/4.0/).

© 2025 Santiago Yate — Todos los derechos reservados.

---

## 👨‍💻 Autor

**Santiago Yate** - *Desarrollador Full Stack*

* GitHub: [@Zentheriun](https://github.com/Zentheriun)
* LinkedIn: [Santiago Yate](https://www.linkedin.com/in/zentheriun/)

---

## 🙏 Agradecimientos

* **MDN Web Docs** por la documentación exhaustiva de desarrollo web.
* **The developer community** por el aprendizaje e inspiración continuos.

---

<div align="center">
  <strong>⭐ ¡Dale una estrella a este repositorio si lo encontraste útil!</strong>
  <br>
  <em>Este proyecto demuestra habilidades de desarrollo Full Stack a nivel profesional utilizando JavaScript, HTML5, CSS3, SCSS, Node.js, Express.js y MongoDB.</em>
</div>
