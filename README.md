# Payertel API

The Payertel API provides a comprehensive platform for telecom and fintech solutions. This API enables seamless management of user authentication, airtime top-ups, data bundle purchases, airtime-to-cash conversions, cable TV subscriptions, electricity bill payments, and more. Designed for security, scalability, and ease of use, the Payertel API serves as the backbone of the Payertel platform, ensuring reliable transactions.

## Table of Contents

1. [Features](#features)
2. [API Documentation](#api-documentation)
3. [Authentication](#authentication)
   - [Authentication Endpoints](#authentication-endpoints)
4. [User Management](#user-management)
5. [Bills Payment](#bills-payment)
6. [Transactions](#transactions)
7. [Third-Party Wallet](#third-party-wallet)
8. [Getting Started](#getting-started)
   - [Prerequisites](#prerequisites)
   - [Installation](#installation)
9. [Usage](#usage)
10. [License](#license)

## Features

- **User Authentication**: User registration, login, password management, and OTP verification.
- **User Management**: Profile updates, wallet transactions, and account deletion.
- **Airtime and Data Bundles**: Purchase airtime or data bundles from various telecom providers.
- **Cable TV Subscriptions**: Pay for cable TV packages like GOTV and DSTV.
- **Electricity Bill Payments**: Process electricity bill payments for providers like Ibadan Electric.
- **Transaction Management**: View transaction history by category, status, and date.
- **Third-Party Wallet Integration**: Manage and check balances for third-party API wallets.

## API Documentation

Detailed information regarding endpoints, request parameters, and responses can be found in the Postman documentation:

[Payertel API Documentation](https://documenter.getpostman.com/view/29545222/2sA3s3FqT6)

## Authentication

Most routes require authentication via a Bearer Token, which is obtained after a successful login. Include this token in the Authorization header of your requests.

### Authentication Endpoints

- **POST /auth/signup**
  Register a new user on the platform.

- **POST /auth/login**
  Log in a user and receive an authentication token.

- **PATCH /auth/updatemypassword**
  Update the logged-in user's password.

- **POST /auth/forgotpassword**
  Send a password reset link to the user's email.

- **PATCH /auth/resetpassword/**
  Reset the password using the token sent to the user's email.

- **POST /auth/verifyotp**
  Verify the OTP sent during signup or password recovery.

## User Management

Endpoints for managing user accounts, including profile updates, wallet transactions, and admin-level management:

- **GET /users/me**
  Fetch the current user's profile details.

- **PATCH /users/updateMe**
  Update the current user's profile information.

- **DELETE /users/deleteme**
  Permanently delete the current user's account.

- **GET /users**
  _Admin-only_: Retrieve a list of all users.

- **GET /users/:id**
  _Admin-only_: Fetch a user's details by ID.

## Bills Payment

Endpoints related to various bill payments, such as airtime, data bundles, cable TV, and electricity:

- **POST /bills/airtime-top-up**
  Purchase airtime for a given phone number.

- **POST /bills/data-bundle-purchase**
  Purchase a data bundle for a given phone number.

- **POST /bills/cabletv-subscription**
  Pay for cable TV subscriptions.

- **POST /bills/electricity-bill-payment**
  Pay electricity bills for prepaid or postpaid meters.

- **POST /bills/verify-customerId**
  Verify the validity of customer details (e.g., meter numbers, decoder IDs).

- **GET /bills/?category=airtime**
  Retrieve bill information by category.

- **GET /bills/?billerCode=mtn&itemCode=500**
  Retrieve bill information by biller code and item code.

## Transactions

Endpoints for viewing and filtering transactions:

- **GET /transactions**
  Retrieve the user's transaction history.

- **GET /transactions/?category=airtime**
  Retrieve transactions by category.

- **GET /transactions/?status=failed**
  Retrieve transactions by status.

- **GET /transactions?from=2024-06**
  Retrieve transactions within a specific date range.

## Third-Party Wallet

Manage the third-party wallet associated with the Payertel platform:

- **GET /third-party-wallet/balance**
  Retrieve the current balance of the third-party wallet.

## Getting Started

### Prerequisites

- Node.js v14.x or higher
- MongoDB
- Postman for testing the API

### Installation

**Clone the repository**:

```bash
git clone https://github.com/your-repository/payertel-api.git
cd payertel-api
```

**Install dependencies**:

```bash
npm install
```

**Set up environment variables**:

Create a .env file based on the provided .env.example file.
Configure MongoDB URI, JWT secret, and other necessary credentials.
Start the application:

```bash
npm run dev
```

### Usage

Once the API is running, you can use tools like Postman to test the available endpoints. For detailed examples of how to structure your requests, refer to the [Postman Documentation](https://documenter.getpostman.com/view/29545222/2sA3s3FqT6).

### License

This project is licensed under the MIT License.
