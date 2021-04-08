FROM node:12-alpine

WORKDIR /app

COPY app/* ./

COPY build ./build

RUN npm install

CMD ["node", "start.js"]