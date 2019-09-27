# KDC CMS

A simple headless CMS for serverless environment.

## Reason

Learn something new - [koa](https://koajs.com/), [Next.js](https://nextjs.org/), [jwt](https://jwt.io/) and [DynamoDB single table design](https://youtu.be/HaEPXoXVf2k?t=2844).

## Infrastructure

Users --> API Gateway --> Lambda --> DynamoDB

## DB Design

![DB Design](docs/img/db-design.png)

### Access Patters

* Users
  * List sorted by name:
    * gs1pk: "user"
  * Login, update, get user:
    * pk: "email"
    * sk: "user"
* Pages
  * List sorted by name
    * gs1pk: "page"
  * Get or update page:
    * pk: "page-id"
    * sk: "page"
* Page Data
  * List sorted by name
    * gs1pk: "page#data"
  * Get or update page data:
    * pk: "page-id"
    * sk: "page#data"
* Content Types
  * List sorted by name
    * gs1pk: "content"
  * Get or update content type:
    * pk: "type-id"
    * sk: "content"
* Content Type Data
  * List sorted as defined by sort-key attribute
    * gs1pk: "content#type-id"
  * Get or update content data
    * pk: "slug"
    * sk: "content#type-id"


*Note that **slug** and **sort-key** are mandatory in Content Types.*