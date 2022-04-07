FROM node:8-alpine

WORKDIR /usr/app

COPY ./backend/package.json .

RUN npm install 

COPY ./backend .

CMD ["node", "index.js"]