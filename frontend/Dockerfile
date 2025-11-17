# STAGE 1 - BUILD
FROM registry.gitlab.com/av1o/base-images/node:lts

RUN mkdir -p /home/somebody/build
WORKDIR /home/somebody/build

# disable spammy donation messages
ENV DISABLE_OPENCOLLECTIVE=true
ENV GATSBY_TELEMETRY_DISABLED 1

COPY package*.json ./
RUN npm ci

COPY . .

RUN npm run build

# STAGE 2 - RUN
FROM registry.gitlab.com/av1o/base-images/nginx:stable-alpine

# download the nginx conf
COPY --chown=somebody:0 ./nginx.conf /app/nginx.conf

WORKDIR /var/www/html

COPY --chown=somebody:0 --from=0 /home/somebody/build/dist/ .

RUN chmod 664 /app/nginx.conf
VOLUME ["/var/cache/nginx", "/var/run", "/tmp"]
EXPOSE 8080

# start nginx
CMD ["nginx", "-c", "/app/nginx.conf", "-g", "daemon off;"]
