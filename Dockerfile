
FROM node:16


WORKDIR /usr/src/app


COPY package*.json ./


RUN npm install && npm install -g nodemon


COPY . .


EXPOSE 5000


CMD ["npm", "start"]
