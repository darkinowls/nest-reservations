FROM node:20.12.1-alpine3.19

WORKDIR /app

COPY specs specs
COPY package.json .
COPY pnpm-lock.yaml .
COPY tsconfig.json .
COPY jest.config.js .

RUN npm install
