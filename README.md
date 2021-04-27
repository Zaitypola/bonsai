# Welcome to the Bonsai Backend Test!

We want to test your skills in a few key areas, especially with respect to how you think about problems and the values you bring to the code you write.

We've prepared a basic skeleton of a project to help you work a little bit faster. Feel free to change out anything in the project as long as you meet the `Requirements`. Just because something is written doesn't mean it is right!

## What you'll be building

A small RESTful API written in [Node.js](https://nodejs.org/en/) using [Express.js](https://expressjs.com/) loading products from an external E-Commerce shopping API and storing them into a local database (Bonsai Shop).

You'll be using [Fake Store API](https://fakestoreapi.com) to mimic an online e-commerce API with products, users and the ability to checkout.

## Requirements

- [ ] Provide a new API endpoint which gets a product by its public id from our local database.
- [ ] Update the existing endpoint to get products by adding an **optional** category filter.
  - This endpoint should return filtered products from our database, not those from the external api.
- [ ] Fix current issues when synchronizing products.
  - [ ] We want to make sure the process succeeds before sending a response.
  - [ ] Make sure products are being upserted instead of recreated every time a sync happens.
  - [ ] Update all existing properties when a synchronization happens. For some reason the image isn't being stored. Figure out why this is happening.
- [ ] Check on **every product route** whether a custom HTTP header is provided.
  - The header key should be `BonsaiDeveloper` and have *your name* as its value.
- [ ] Provide extra product checks when performing **checkout**.
  - Make sure the product exists in our database.
- [ ] Synchronize users only if they have an even id (0, 2, 4, ...).
  - Fetch only the first 8 users.
  - Use `fetchUserById` to make sure you fetch each user individually from the Fake Store API instead of fetching all users and filtering out those by their id.

## Notes

- Because it’s a **fake** store API, when calling `/checkout` the input values you provide don’t have to be real. You can provide any values and will still receive a success status code from the external store API.
- Using `axios` is not a requirement, we’ve only added this to already provide an endpoint.
- Whenever something isn't working or could use some improvements, go ahead!

## Evaluation

Please document your changes well and make as many atomic commits as you feel are necessary for someone to see how you work.

We will be evaluating the following:

- How well and completely you meet the requirements
- Attention to detail
- Following modern best practices
- Robustness of testing, both manual and automatic
- Communication clarity in code and documentation

People who do well will be contacted through email within a week of acknowledgement of submission.

Thanks and good luck!

## Implementation

### Major project changes

##### HTTP service
A new `http_servce.ts` file has been added that includes two methods:
- startService(PORT): Starts the service on the given port and the database connection.
- stopService(): Stops service.

These file was added to be able to export each method individually to be used in test hooks.

##### Linting
The command to run eslint has been added to hte build script. Running `npm run build` will also trigger `npm run lint` first, to verify that code follows the standard before building.

I noticed that I wasn't running the linter when I was finishing the code requirements, leading to a big commit with all the linting changes. This is not a good idea and should have been tackled since the begining.

### Testing
Tests can be run by running `npm run test`. This will run all tests included in the folder `/tests`. Two different folders containing tests are found here, acceptance and service.

##### Acceptance tests
Acceptance tests can be found in the `acceptance` folder. These tests have a new hook to start and stop the service per test suite. Here we will be doing real HTTP calls to our own service to test that from begining to end our feature is responding with the right HTTP statuses and all the business logic happens according to the given scenario.

##### Service tests
The folder `tests/services` test each service per entity that are used for every controller. These tests only setup the database and verifies that the logic is correct and the right exceptions are thrown.

##### External calls

The calls to the external store API have been mocked in the tests. I have previously tested the services using POSTMAN to verify what are the bodies/responses that we get from them. 

In the tests they are mocked so that external issues in other platforms don't affect our local development. The idea is to hit the real external platform when running integration tests, to verify that the real answers suit our code.


### Requirements

##### Get product by id from our local db
- Added a new product service, `getOneProduct` that accepts a query to find just one product. This method is used by the controller, that receives the public id from the URL.
- If the product is not found, an exception is thrown an 404 is returned to the client.

##### Get products by category
- Modify the GET `/products` route to accept a query object (optional) that it's used to fetch products.

##### Issues syncing products
- The issue that the sync service doesn't finish before sending a response is because we are not awaiting in the controller for all promises to finish. Also, `Array.forEach` cannot be awaited, and it's been used to update products.
- I changed the main loop into a `Promise.all(map)` to fire all the updates at the same time and await at the end. I am not sure if the requirement is to do it in series, but we can benefit from doing it all at the same time. If the volume of products to sync is too large, we can use a cursor instead for this loop.

##### Validate header middleware
- A middleware that accepts a header name to verify has been added in the product services.
- The middleware returns a `400- BAD REQUEST` error if the `BonsaiDeveloper` header is not present.

##### Product checks when performing checkout
- A verify json body middleware has been added to verify the cart contents. The exercise mentions `add extra checks` so I considered a good one to add, specially when it's a `POST` service. The middleware returns `400 - BAD REQUEST` if it doesn't contain the required data to call the external checkout service.
- A `validateProducts` service has been added before checkout. This service will fetch the products in our db by the `publicId` provided in the `POST call. This service will fail when it finds a product that is not found. The requirements on how to fail are not specified. I decided to return a list of the missing products to the client.
- Products are upserted now. The `create` service is now `createOrUpdate` and based on the `publicId` provided (made unique and indexed now), we create the products if they don't exist and update them if they do.
- The `image` field was missing from the product update operation, it's been added.

##### Sync users if they have an even id
- The exercise asks to synchronize even users from the external store API. It mentions to only do the first 8, I don't know if it means in order or the first 8 created. I went for the first 8 that the database has stored.
- A new service `getEvenUsers` was added that returns the list of the first 8 even users.
- The publicId field in the user model was changed from `string` to `number`. It makes sense to store external data in our services as the same type as they are externally, when it makes sense, like in this case. Performing the `mod` operations on strings is not possible. Same applies with `productId` in the product object.
- Syncing with the external API updates the user's data that we have stored with whatever they have stored, leaving the `publicId` untouched.

