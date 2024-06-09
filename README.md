### Proceso de Instalación

**Pasos para la Instalación:**

1. **Clonar el Repositorio:**
   ```bash
   git clone https://github.com/juanschezmor/bubbly.git
   cd bubbly
   ```
2. **Configurar Variables de Entorno del Cliente:**
Navegue al directorio del cliente y edite (o cree) el archivo .env para configurar la URL del backend:
 ```bash
    cd client
    echo "VITE_BACKEND_URL=http://localhost:5000" > .env
  ```
3. **Volver al Directorio Principal del Proyecto:**
   ```bash
    cd ..
   ```
3. **Iniciar los Servicios con Docker Compose:**
    ```bash
    docker-compose up --build
   ```
4. **Ve a http://localhost:3000**
   
