FROM node:18-alpine

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm i

COPY . .

COPY next.config.ts ./next.config.ts

CMD [ "npm", "run", "dev" ]
