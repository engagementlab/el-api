##########  Step 1: Set up environment  ########################################

FROM node:12-slim as build

WORKDIR /app

RUN yarn global add lerna

##########  Step 2: Set up files  #######################################

RUN ls 
COPY package.json lerna.json yarn.lock ./

COPY packages/core ./packages/core
COPY packages/engagement-lab-home ./packages/engagement-lab-home

# ENV MONGO_HOST "host.docker.internal"
ENV NODE_ENV production

##########  Step 2: Bootstrap  #######################################

RUN yarn run bootstrap

RUN yarn run start