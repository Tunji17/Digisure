# Digisure Assessment

Develop a simple web-based application (API or otherwise) that allows a user to register and send money to other users.

### Application Requirements

A user should be able to:

• Create an account
• Fund their account with (fake) currency
• Securely send money from their account to the account of another user
• Check their account balance and transactions

## Development

Application is build using Nest Js framework on the server and react on the web client and runs in a docker container for cross platform compartibility. SQLite is used for persistent storage as the app is not tasking

### Running the App

Checkout to root of the application and run the following commands in the terminal

```shell
  docker-compose build

  docker-compose up

```

To run the test suites on the server

```shell

  cd server

  npm test

 ```

## Additional Features

Consider taking about 30 minutes to write a summary and/or diagram sketches of how you would extend the existing application to do the following

### Send an email notification to the account holder when

• The account balance is below a user-configurable amount:

  In this scenario what i will do is add a new field on the `Account` model called threshold which will be configurable by the account owner. then on every `debit` transaction i will check if `balance <= threshold` if yes i will publish a message to the queue that a subscriber is listening to and will send the email notification asynchronously.

• The account receives a transfer

  In this scenario i will add a new field to the `Account` model called `notifyOnTransferDeposit` this will be a boolean field that is also user configurable and defaults to `true` I will also add  logic to the `transferMoney` function in the `transaction.service.ts` file. this logic will publish to the queue that sends email notification asynchronously it will send to only the recepient account that have `notifyOnTransferDeposit` set to `true`.

• Other triggers may be requested in the future

  In this scenario it is not feasible to keep adding new fields to the `Account` model because this would require migrations and new deploys to the production environment. I will create a new model called `AccountTriggers` this will have  a field for `triggerName` and `isActive`. this way we can set unique trigger names with a boolean value and check if they are active for the user making a request at any point in the code.

• Allow account holders to schedule recurring transfers

  In this scenario, i will create a new model called `ScheduledTransfers` this model will be used to create many transfers within two time periods that the user set and will most importantly contain a scheduled datetime field (scheduled datetime field will be computed using the recurring rules the user set) with the other details of the transaction. I will also create a cronjob that will run on intervals and check this model for transfers where the scheduled time has slightly exceeded because of the interval run or is equal to `Date.now` and process these transfers.
