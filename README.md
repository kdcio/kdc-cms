# KDC CMS

A simple headless CMS for AWS serverless infrastructure.

## Reason

* Cheapest way to run CMS for small to medium websites. Might even cost you nothing if you stay within [AWS Free Tier](https://aws.amazon.com/free/?all-free-tier.sort-by=item.additionalFields.SortRank&all-free-tier.sort-order=asc).
* Boilerplate CMS for new projects
* Learn something new - [monorepo](https://en.wikipedia.org/wiki/Monorepo), [serverless](https://serverless.com), [jwt](https://jwt.io/) and [DynamoDB single table design](https://youtu.be/HaEPXoXVf2k?t=2844).

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
  yarn setup:local
  ```

* Start API and CMS

  ```bash
  yarn start
  ```

* Browser will open KDC CMS at [http://localhost:8100](http://localhost:8100).
* API endpoint is [http://localhost:8101](http://localhost:8101)
* [Dynamodb manager](https://hub.docker.com/r/taydy/dynamodb-manager/) is [http://localhost:8102](http://localhost:8102)
* [Dynamodb-local](https://hub.docker.com/r/amazon/dynamodb-local) endpoint is [http://localhost:8103](http://localhost:8103)

## Deployment to AWS

KDC CMS can be deployed in different stages. Example is `dev` and `prod`. Each stage will have different resources. Don't worry it will not cost you anything as one of the advantages of serverless is pay as you use. There will be no idle servers that you need to pay for.

Make sure you replace ```$stage``` with ```dev```, ```staging``` or ```prod``` to denote different stages of your app.

* Create dynamodb table and create initial user.

  ```bash
  yarn setup:$stage
  ```

* Run the command below.

  ```bash
  yarn deploy $stage
  ```

* You can also deploy individual package:
  
  ```bash
  yarn deploy:api $stage
  yarn deploy:admin $stage
  ```

## Other

* [Software Design](docs/DESIGN.md)

## License

[MIT](LICENSE)