FROM node:20-alpine

RUN apk update
RUN apk add rsync

WORKDIR /npm-cache
COPY package*.json .
RUN npm install

WORKDIR /app
COPY . .
EXPOSE 3000
ENTRYPOINT ["./entrypoint.sh"]