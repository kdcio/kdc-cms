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
  * List sorted by name (/api/users)
    * gs1pk: "user"
  * Login, update, get user (/api/users/:email):
    * pk: "email"
    * sk: "user"
* Page Definition
  * List sorted by name (/api/page-definition)
    * gs1pk: "page"
  * Get or update page (/api/page-definition/:id)
    * pk: ":page-id"
    * sk: "page"
* Page Data
  * List sorted by name (/api/pages)
    * gs1pk: "page#data"
  * Get or update page data (/api/pages/:id)
    * pk: ":id"
    * sk: "page#data"
* Content Definition
  * List sorted by name (/api/content-definition)
    * gs1pk: "content"
  * Get or update content type: (/api/content-definition/:type)
    * pk: ":type"
    * sk: "content"
* Content Data
  * List sorted as defined by sort-key attribute (/api/contents/:type)
    * gs1pk: "content#:type"
  * Get or update content data (/api/contents/:type/:slug)
    * pk: ":slug"
    * sk: "content#:type"


*Note that **slug** and **sort-key** are mandatory in Content Types.*