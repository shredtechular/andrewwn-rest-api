FROM node:12-alpine

RUN apk add --no-cache python3 py3-pip make g++

ENV PORT=4000
ENV NEW_RELIC_NO_CONFIG_FILE=true

WORKDIR /usr/src/app

# Install dependencies
COPY package.json /usr/src/app/
RUN npm install

# Copy source
COPY server.js /usr/src/app

EXPOSE $PORT
CMD [ "npm", "start" ]
