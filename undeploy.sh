#!/bin/bash

DOMAIN_NAME=kdc-cms.example.com
AWS_PROFILE=kdc

AWS_REGION=$(aws configure get region --profile kdc)

# Get account id
ACCOUNT=$(aws sts get-caller-identity \
    --profile $AWS_PROFILE \
    --query "Account" \
--output text | sed '/^[[:space:]]*$/d')

aws s3 rb s3://$DOMAIN_NAME --profile $AWS_PROFILE

aws dynamodb delete-table --table-name kdc-cms --profile $AWS_PROFILE

API_ID=416slqo892

aws apigateway delete-rest-api \
--rest-api-id $API_ID \
--profile $AWS_PROFILE

aws lambda delete-function \
--function-name kdc-cms \
--profile $AWS_PROFILE

aws iam detach-role-policy \
--role-name kdc-cms-lambda-role \
--policy-arn arn:aws:iam::$ACCOUNT:policy/kdc-cms-lambda-policy \
--profile $AWS_PROFILE

aws iam detach-role-policy \
--role-name kdc-cms-apigateway-role \
--policy-arn arn:aws:iam::$ACCOUNT:policy/kdc-cms-apigateway-policy \
--profile $AWS_PROFILE

aws iam delete-policy \
--policy-arn arn:aws:iam::$ACCOUNT:policy/kdc-cms-lambda-policy \
--profile $AWS_PROFILE

aws iam delete-policy \
--policy-arn arn:aws:iam::$ACCOUNT:policy/kdc-cms-apigateway-policy \
--profile $AWS_PROFILE

aws iam delete-role \
--role-name kdc-cms-lambda-role \
--profile $AWS_PROFILE

aws iam delete-role \
--role-name kdc-cms-apigateway-role \
--profile $AWS_PROFILE