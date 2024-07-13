FROM node:18.20.4


COPY package.json package-lock.json .

RUN npm install

COPY . .

ENTRYPOINT node server.js