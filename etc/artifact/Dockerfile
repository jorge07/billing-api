FROM node:13.12-buster-slim as base

ENV NODE_ENV dev

FROM base as build

ENV NODE_ENV CI

WORKDIR /tmp

COPY package.json .
COPY yarn.lock .
COPY tsconfig.json .

RUN yarn install --no-cache

COPY src/ src/
COPY tests/ tests/
COPY config/ config/
COPY bin.ts .

RUN yarn build

FROM base as production

ENV NODE_ENV production

WORKDIR /app

COPY package.json .
COPY yarn.lock .
COPY tsconfig.json .

RUN yarn install --productions

COPY --from=build /tmp/build .

RUN chmod +x bin.js \
	&& ln -s /app/bin.js /usr/local/bin/api

CMD [ "api", "http" ]
