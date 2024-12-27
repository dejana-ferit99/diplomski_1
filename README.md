# Cypress API Testing Project for [Parabank](https://parabank.parasoft.com/parabank/api-docs/index.html)

This project is designed to test the Parabank API using **Cypress**, a JavaScript-based end-to-end testing framework. It validates various API endpoints and functionalities such as retrieving user accounts, accessing account details, and handling invalid requests. 

---

## Features

- **API Testing with Cypress:** Automates API tests for the Parabank application.
- **Dynamic Data Handling:** Uses dynamic data generation for testing with random strings and IDs.
- **Custom Page Objects:** Encapsulates reusable API request methods in the `pageObjects` folder.
- **Configurable Setup:** Uses configuration files to store environment-specific variables such as usernames and passwords.

---

## Prerequisites

Make sure the following tools are installed on your system:

  1. Node.js
  2. Cypress (installed via npm)

---

## Clone the Repository

```
git clone <repository-url>
cd <repository-name>
```
Or you can download the project and open it in your IDE.

---

## Running the tests

## 1. Open Cypres test runner
```
npx cypress open
```

## 2. Run test in headless mode
```
npx cypress run
```

---

## Access the Test Case Documentation

[Google Sheets Documentation](https://docs.google.com/document/d/18wd9rRSaTOtQsZxCi3GCDALjXVsjGgtX0PoPyUzaY1Q/edit?tab=t.0)



