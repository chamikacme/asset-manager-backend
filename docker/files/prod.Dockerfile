FROM node:18-alpine As development

WORKDIR /usr/src/app

COPY --chown=node:node ./app/package*.json ./

RUN npm i

COPY --chown=node:node ./app/ ./

USER node

FROM node:18-alpine As build

WORKDIR /usr/src/app

COPY --chown=node:node /app/package*.json ./

COPY --chown=node:node --from=development /usr/src/app/node_modules ./node_modules

COPY --chown=node:node ./app/ ./

RUN npm run build

ENV NODE_ENV production

RUN npm ci --omit=dev && npm cache clean --force

USER node

FROM node:18-alpine As production

COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/dist ./dist

CMD [ "node", "dist/src/main.js" ]
