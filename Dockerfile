FROM node:16

WORKDIR /usr/app

COPY . .

RUN npm i -s

EXPOSE 3000

CMD [ "npm", "run", "dev" ]
