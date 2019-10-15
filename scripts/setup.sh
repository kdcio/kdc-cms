#!/bin/bash

STAGE=$1
CONFIG="config.$STAGE.yml"

if [ -f "$CONFIG" ]; then
    echo "Stage: $STAGE has already been setup."
    exit 1
fi

if [ "$STAGE" == "local" ]; then
    yarn workspace kdc-cms-setup start local
    yarn workspace kdc-cms-resource-database setup:local
    yarn workspace kdc-cms-setup fu local
else
    echo "AWS Setup"
    yarn workspace kdc-cms-setup start $STAGE
    yarn workspace kdc-cms-resource-database setup $STAGE
    yarn workspace kdc-cms-setup fu $STAGE
fi
