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
