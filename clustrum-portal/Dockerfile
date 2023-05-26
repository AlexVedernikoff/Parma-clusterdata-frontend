FROM node:16-alpine
WORKDIR /app
COPY . .

RUN npm i --force --legacy-peer-deps
RUN npm run build:dev

ENV NODE_ENV dev

EXPOSE 8090

CMD ["npm", "run", "run"]