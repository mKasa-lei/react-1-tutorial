FROM node:14.12.0-alpine3.12


ENV LANG ja_JP.UTF-8
ENV LANGUAGE ja_JP:jp
ENV LC_ALL ja_JP.UTF-8

RUN apk update \
    && apk --no-cache add --virtual .build-deps \
    tzdata \
    && cp /usr/share/zoneinfo/Asia/Tokyo /etc/localtime \
    && echo Asia/Tokyo > /etc/timezone \
    && apk del .build-deps \
    && rm -rf /var/cache/apk/*

WORKDIR /code

COPY react-app .

RUN yarn install

CMD ["yarn", "start"]