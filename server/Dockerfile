# Usar una imagen base de Python
FROM python:3.11-slim

# Establecer un directorio de trabajo
WORKDIR /app

# Copiar los archivos de requisitos e instalar las dependencias
COPY requirements.txt ./
RUN pip install -r requirements.txt

# Copiar el resto de los archivos del servidor
COPY . .

# Exponer el puerto en el que se ejecutará el servidor
EXPOSE 5000

# Comando para ejecutar la aplicación
CMD ["python3", "server.py"]
