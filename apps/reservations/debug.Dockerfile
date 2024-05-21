FROM node:20.12.1-alpine3.19 as build

WORKDIR /app

COPY apps/reservations apps/reservations
COPY libs libs

#RUN rm -rf node_modules
#RUN rm -rf dist

COPY package.json .
COPY pnpm-lock.yaml .
COPY tsconfig.json .
COPY nest-cli.json .

RUN npm install -g pnpm


RUN pnpm install

RUN pnpm run build reservations



FROM node:20.12.1-alpine3.19 as production

WORKDIR /app

COPY package.json .
COPY pnpm-lock.yaml .

RUN npm install -g pnpm

COPY --from=build /app/dist /app/dist

RUN pnpm install --prod
