FROM mhart/alpine-node:4

ADD package.json ./
RUN npm i

ADD *.js ./
ADD ./lib/ ./lib/
ADD ./notify/ ./notify/
ADD ./test/ ./test/

ADD ./key.json ./
ADD ./config.json ./

CMD ["npm", "start"]
