FROM node:10-alpine

ENV HOME=/usr/src

WORKDIR $HOME/app

COPY package.json $HOME/app/

RUN npm cache verify && \
    npm install --silent --progress=false

COPY . $HOME/app/

EXPOSE 3000

CMD ["npm", "start"]