#!/bin/bash

DOMAIN_NAME=kdc-cms.example.com
AWS_PROFILE=kdc

AWS_REGION=$(aws configure get region --profile kdc)

# Get account id
ACCOUNT=$(aws sts get-caller-identity \
    --profile $AWS_PROFILE \
    --query "Account" \
--output text | sed '/^[[:space:]]*$/d')

aws s3 mb s3://$DOMAIN_NAME --profile $AWS_PROFILE

aws dynamodb create-table --cli-input-json file://packages/server/schema.json --profile $AWS_PROFILE

# Create IAM Roles & Policies

aws iam create-role \
--role-name kdc-cms-lambda-role \
--assume-role-policy-document file://extra/lambdaRole.json \
--profile $AWS_PROFILE

aws iam put-role-policy \
--role-name kdc-cms-lambda-role \
--policy-name kdc-cms-lambda-policy \
--policy-document file://extra/lambdaPermission.json \
--profile $AWS_PROFILE

aws iam create-role \
--role-name kdc-cms-apigateway-role \
--assume-role-policy-document file://extra/apiGatewayRole.json \
--profile $AWS_PROFILE

aws iam put-role-policy \
--role-name kdc-cms-apigateway-role \
--policy-name kdc-cms-apigateway-policy \
--policy-document file://extra/apiGatewayPermission.json \
--profile $AWS_PROFILE

cd packages/server
zip kdc-cms.zip lambda.js

aws lambda create-function --function-name kdc-cms \
--zip-file fileb://kdc-cms.zip --handler lambda.handler --runtime nodejs10.x \
--role arn:aws:iam::$ACCOUNT:role/kdc-cms-lambda-role \
--profile $AWS_PROFILE

rm -f kdc-cms.zip

cd ../..

API_ID=$(aws apigateway create-rest-api \
    --name 'KDC CMS' \
    --profile $AWS_PROFILE \
    --query "id" \
--output text | sed '/^[[:space:]]*$/d')

RES_ID=$(aws apigateway get-resources \
    --rest-api-id $API_ID \
    --profile $AWS_PROFILE \
    --query "items[0].id" \
--output text | sed '/^[[:space:]]*$/d')

aws apigateway create-resource \
--rest-api-id $API_ID \
--parent-id $RES_ID \
--path-part {proxy+} \
--profile $AWS_PROFILE

aws apigateway put-method \
--rest-api-id $API_ID \
--resource-id $RES_ID \
--http-method ANY \
--authorization-type "NONE" \
--profile $AWS_PROFILE

aws apigateway put-integration \
--rest-api-id $API_ID \
--resource-id $RES_ID \
--http-method ANY \
--type AWS_PROXY \
--integration-http-method POST \
--uri arn:aws:apigateway:$AWS_REGION:lambda:path/2015-03-31/functions/arn:aws:lambda:$AWS_REGION:$ACCOUNT:function:kdc-cms/invocations \
--credentials arn:aws:iam::$ACCOUNT:role/kdc-cms-apigateway-role \
--profile $AWS_PROFILE

aws apigateway create-deployment \
--rest-api-id $API_ID \
--stage-name dev \
--profile $AWS_PROFILE
