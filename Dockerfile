FROM node:16

WORKDIR /usr/app

COPY ./package.json .

RUN npm i -s

COPY ./dist ./dist

EXPOSE 3000

CMD [ "npm", "start" ]
