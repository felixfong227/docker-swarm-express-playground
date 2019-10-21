FROM node

WORKDIR /app

COPY ./package.json /app

RUN npm i --production

ENV NODE_ENV=production

COPY . /app

CMD ["npm", "start"]

EXPOSE 8080