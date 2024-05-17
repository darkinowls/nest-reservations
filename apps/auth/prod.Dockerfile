FROM node:20.12.1-alpine3.19 as build

WORKDIR /app

COPY . .

COPY package.json .
COPY pnpm-lock.yaml .

RUN npm install -g pnpm

RUN pnpm install

RUN npm install @vercel/ncc -g

RUN ncc build apps/auth/src/main.ts -o dist

FROM node:20.12.1-alpine3.19 as production

WORKDIR /app

COPY --from=build /app/dist/index.js /app/dist/index.js