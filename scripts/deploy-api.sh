#!/bin/bash

STAGE=$1

if [ ! -f "config.$STAGE.yml" ]; then
    echo "You have not run setup for stage: $STAGE."
    exit 1
fi

yarn workspace kdc-cms-api deploy $STAGE

EP=$(yarn workspace kdc-cms-api deploy:info $STAGE | grep 'ServiceEndpoint:' | cut -f 2 -d ' ')

echo "REACT_APP_API_URL=$EP" > .env.production.$STAGE