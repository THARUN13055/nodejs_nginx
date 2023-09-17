FROM node:20-alpine3.17

WORKDIR /usr/src/app

COPY ./package*.json /usr/src/app/

RUN npm install 

COPY ./ /usr/src/app/

EXPOSE 3030

CMD [ "node", "index.js" ]

