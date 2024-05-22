FROM node:20.12.1-alpine3.19 as build

WORKDIR /app

COPY . /app

RUN npm install -g pnpm

RUN pnpm install
