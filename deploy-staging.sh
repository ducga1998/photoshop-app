#!/usr/bin/env bash
yarn install
rm -rf build && mkdir build && cd build
# sync build from S3
aws s3 sync s3://c2-photobook .
# restart app
pm2 restart "photobook-dev"
