# Container used to build/deploy the app
# from ubuntu:latest

# ENV DEBIAN_FRONTEND=noninteractive

# RUN apt update && apt install -y curl make openjdk-8-jdk libvips-dev
# RUN curl -fsSL https://deb.nodesource.com/setup_lts.x | bash -
# RUN apt install -y nodejs
# RUN npm install --global yarn

# WORKDIR /opt
# COPY . .

# RUN yarn add turtle-cli && yarn turtle setup:android --sdk-version "41.0.0" && rm -rf ./*

FROM node:lts-alpine3.13

RUN apk add libvorbis vips python3 build-base

WORKDIR /opt
COPY . .

RUN yarn
