# Usar una imagen base de Node.js
FROM node:21.7.3-alpine as builder

# Establecer un directorio de trabajo
WORKDIR /app

# Copiar los archivos de paquetes e instalar las dependencias
COPY package*.json .

RUN npm install

# Copiar el resto de los archivos del cliente
COPY . .

RUN npm run build

# Fase de ejecución
FROM nginx:1.19.0

WORKDIR /usr/share/nginx/html

RUN rm -rf ./*

# Copiar los artefactos de construcción de la etapa de construcción
COPY --from=builder /app/dist .

# Configurar el entrypoint
ENTRYPOINT ["nginx", "-g", "daemon off;"]
