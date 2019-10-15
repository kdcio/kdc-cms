#!/bin/bash

STAGE=$1

if [ "$STAGE" == "local" ]; then
    yarn workspace kdc-cms-resource-database ddb:stop
    rm -f config.local.yml
else
    yarn workspace kdc-cms-resource-database delete $STAGE
    rm -f config.$STAGE.yml
fi
