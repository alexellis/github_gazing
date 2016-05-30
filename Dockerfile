FROM mhart/alpine-node:4

ADD package.json ./
RUN npm i

ADD *.js ./
ADD ./key.json ./
ADD ./config.json ./

CMD ["npm", "start"]
