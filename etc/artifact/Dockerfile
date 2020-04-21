FROM node:13.12-buster-slim as base

ENV NODE_ENV dev

FROM base as build

ENV NODE_ENV CI

WORKDIR /tmp

COPY package.json .
COPY yarn.lock .
COPY tsconfig.json .

RUN yarn install --no-cache

COPY . .

RUN yarn build

FROM base as production

ENV NODE_ENV production

WORKDIR /app

COPY package.json .
COPY tsconfig.json .

RUN yarn install

COPY --from=build /tmp/build .

CMD [ "node", "-r", "tsconfig-paths/register", "./src/ui/http/index.js" ]
