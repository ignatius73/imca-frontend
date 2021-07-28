FROM node:latest

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

FROM nginx:latest

COPY --from=0 /usr/src/app/build/ /usr/share/nginx/html