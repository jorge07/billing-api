FROM node:13.12-buster-slim as base

ENV NODE_ENV dev

FROM base as build

ENV NODE_ENV CI

WORKDIR /tmp

COPY package.json .
COPY yarn.lock .
COPY tsconfig.json .

RUN yarn install --no-cache

COPY config/ config/
COPY src/ src/
COPY tests/ tests/

RUN yarn build

FROM base as production

ENV NODE_ENV production

WORKDIR /app

COPY package.json .
COPY yarn.lock .
COPY tsconfig.json .

RUN yarn install --production

COPY --from=build /tmp/build .

RUN chmod +x src/ui/bin.js \
	&& ln -s /app/src/ui/bin.js /usr/local/bin/api

CMD [ "api", "http" ]
