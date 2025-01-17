#!/bin/sh

rsync -arv /npm-cache/node_modules/. /app/node_modules/
exec npm run start:debug
