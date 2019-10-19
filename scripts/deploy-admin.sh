#!/bin/bash

STAGE=$1

if [ ! -f "config.$STAGE.yml" ]; then
    echo "You have not run setup for stage: $STAGE."
    exit 1
fi

if [ ! -f ".env.production.$STAGE" ]; then
    echo "You have not deployed api for stage: $STAGE"
    exit 1
fi

cp -f .env.production.$STAGE packages/kdc-cms-admin/.env.production

yarn workspace kdc-cms-admin build

yarn workspace kdc-cms-admin deploy $STAGE

