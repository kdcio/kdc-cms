#!/bin/bash

STAGE=$1

if [ "$STAGE" == "local" ]; then
    if [ ! -f "config.local.yml" ]; then
        echo "You have not run setup for stage: $STAGE."
        exit 1
    fi
    yarn workspace kdc-cms-resource-database ddb:stop
    yarn workspace kdc-cms-resource-database ddb:rm
    rm -fR resources/database/.dbdata
    rm -f config.local.yml
else
    if [ ! -f "config.$STAGE.yml" ]; then
        echo "You have not run setup for stage: $STAGE."
        exit 1
    fi
    yarn workspace kdc-cms-admin delete $STAGE
    yarn workspace kdc-cms-api delete $STAGE
    yarn workspace kdc-cms-resource-database delete $STAGE
    rm -f config.$STAGE.yml
    rm -f .env.production.$STAGE
fi
