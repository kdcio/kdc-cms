# KDC CMS

A simple headless CMS for AWS serverless infrastructure. API uses [API Gateway](https://aws.amazon.com/api-gateway/), [Lambda](https://aws.amazon.com/lambda/) and [DynamoDB](https://aws.amazon.com/dynamodb/) while Admin interface uses [S3](https://aws.amazon.com/s3/).

**Note: THIS PROJECT IS UNDER HEAVY DEVELOPMENT!**

## Why

I needed a CMS to manage my web/app projects but I wanted it to be as cheap as possible (if not free) since most of them are websites that doesn't change too much. In addition to that, I also wanted to have full control over the source code so that I can use it as a starting point for my larger projects.

I looked at [strapi](https://strapi.io/) but unfortunately it needs a server to work. And having a server means that it will cost money to run.  A cost which is more than what I am willing to spend.

So my solution is to use serverless technology. Except for API Gateway, all of the other services the CMS will use have an ["Always free"](https://aws.amazon.com/free/?nc2=h_ql_pr_ft&all-free-tier.sort-by=item.additionalFields.SortRank&all-free-tier.sort-order=asc&awsf.Free%20Tier%20Types=tier%23always-free) tier in AWS. API Gateway has a  [1 million request per month](https://aws.amazon.com/api-gateway/pricing/) **free** for 12 months. So this means as long as you do not exceed the free tier limits, the CMS will be free for 1 year then on the second year on wards you'll just be paying a few cents.

## Installation

* Clone this repository
* Install [aws-cli](https://docs.aws.amazon.com/en_pv/cli/latest/userguide/cli-chap-install.html) and [create a profile](https://docs.aws.amazon.com/en_pv/cli/latest/userguide/cli-chap-configure.html).
  
  ```bash
  aws configure --profile kdc
  ```

  As a safety precaution, I usually set my default credentials as a fake account like so:

  ```credentials
  [default]
  aws_access_key_id=fake
  aws_secret_access_key=fake

  [kdc]
  aws_access_key_id=xxxxxxx
  aws_secret_access_key=xxxxxxxx
  ```

* Install [serverless](https://serverless.com/) binary
  
  ```bash
  sudo npm i -g serverless
  ```

* Install project dependencies.

  ```bash
  cd kdc-cms
  yarn install
  ```

## Local Development

* Install [docker](https://docs.docker.com/install/) for running [dynamodb-local](https://hub.docker.com/r/amazon/dynamodb-local) and [dynamodb-manager](https://hub.docker.com/r/taydy/dynamodb-manager/) on your machine.

* Setup database and create initial user.

  ```bash
  yarn setup local
  ```

* Start API and CMS

  ```bash
  yarn start
  ```

  Endpoints:

  * [http://localhost:8100](http://localhost:8100) - KDC CMS
  * [http://localhost:8101](http://localhost:8101) - API endpoint
  * [http://localhost:8102](http://localhost:8102) - [Dynamodb manager](https://hub.docker.com/r/taydy/dynamodb-manager/)
  * [http://localhost:8103](http://localhost:8103) - [Dynamodb-local](https://hub.docker.com/r/amazon/dynamodb-local)
  * [http://localhost:8104](http://localhost:8104) - [S3 local](https://github.com/ar90n/serverless-s3-local)

* Run API tests

  ```bash
  yarn test:api
  ```

* Run Admin [Cypress](https://www.cypress.io/) tests
  
  Before running admin test, edit the file [`packages/kdc-cms-admin/cypress.json`](packages/kdc-cms-admin/cypress.json) and change the email and password to match what entered in the setup.
  
  Terminal 1:

  ```bash
  yarn start
  ```

  Terminal 2:

  ```bash
  yarn test:admin
  ```

## Deployment to AWS

KDC CMS can be deployed in different stages. Example is `dev` and `prod`. Each stage will have different resources. Don't worry it will not cost you anything as one of the advantages of serverless is pay as you use. There will be no idle servers that you need to pay for.

Make sure you replace ```$stage``` with ```dev```, ```staging``` or ```prod``` to denote different stages of your app.

* Create dynamodb table and create initial user.

  ```bash
  yarn setup $stage
  ```

* Deploy API package:

  ```bash
  yarn deploy:api $stage
  ```

* Deploy Admin package:
  
  ```bash
  yarn deploy:admin $stage
  ```

* If you want to undo setup and deployment:

  ```bash
  yarn delete $stage
  ```

  **Note that this cannot be undone. Please be careful!**

## Other

* [Software Design](docs/DESIGN.md)

## Limitations

* Does not work on MS Windows. I am open to contributions.

## Links and Other Open Source Projects Used

* [monorepo](https://en.wikipedia.org/wiki/Monorepo)
* [serverless](https://serverless.com)
* [cypress](https://www.cypress.io/)
* [jwt](https://jwt.io/)
* [DynamoDB single table design](https://youtu.be/HaEPXoXVf2k?t=2844).

## Star Me

If you find this project useful, please consider giving a star. I would really appreciate it.

## License

[MIT](LICENSE)
