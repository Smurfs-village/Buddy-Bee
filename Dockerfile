# Frontend build stage
FROM node:20 AS build-frontend
WORKDIR /app
COPY frontend/package.json frontend/package-lock.json ./
COPY frontend/.env ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Backend build stage
FROM node:20
WORKDIR /app
COPY server/package.json server/package-lock.json ./
COPY server/.env ./
RUN npm install
COPY server/ ./
COPY --from=build-frontend /app/build ./public
CMD ["node", "server.js"]
