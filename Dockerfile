FROM harbor.parmalogica.ru/base/node:18 as builder
WORKDIR /app
COPY . ./
RUN ls -lah
WORKDIR /app/clustrum-portal
RUN rm -rf ./.npmrc && npm config set registry https://nexus.parmalogica.ru/repository/sed-group && npm cache clean --force && npm i --legacy-peer-deps && npm run build:prod

FROM harbor.parmalogica.ru/base/node:18

RUN mkdir -p /opt/clustrum-portal

COPY devops/docker-entrypoint.sh /docker-entrypoint.sh
COPY clustrum-portal/environment/.env.tpl /opt/clustrum-portal/


COPY --from=builder /app/clustrum-portal/dist/ /opt/clustrum-portal/
RUN ls -lah /opt/clustrum-portal/
WORKDIR /opt/clustrum-portal
RUN npm install express ejs dotenv http-proxy && apt update && apt install gettext-base && apt clean && set -eux && chmod 0755 /docker-entrypoint.sh
ENV PORT=8090
ENTRYPOINT ["/docker-entrypoint.sh"]
