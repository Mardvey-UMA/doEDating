# Этап 1: Сборка React приложения
FROM node:18-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm ci && npm install
COPY . .
RUN npm run build

# Этап 2: Запуск приложения с помощью nginx
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
# Удаляем стандартную конфигурацию nginx и добавляем свою
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
