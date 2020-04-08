FROM node:13-slim

RUN apt-get update && apt-get install -y build-essential git python

WORKDIR /app/server

ENV PATH /app/client/node_modules/.bin:$PATH

COPY package*.json ./

RUN npm ci

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
