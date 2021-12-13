FROM node:17

ADD . /opt/build/node/
WORKDIR /opt/build/node/

RUN npm install
EXPOSE 8081
EXPOSE 8082
EXPOSE 8083

CMD npm run start-backend