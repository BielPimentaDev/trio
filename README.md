# Trio Challenge

## Introduction

This repository is dedicated to solving the challenge proposed in the following link: [Coffeeshop Challenge](https://github.com/GuiPimenta-Dev/coffeeshop-challenge/blob/master/challenge.md).

## Architecture

For this project, it was chosen to use **Hexagonal Architecture**, also known as **Ports and Adapters**. This architectural style focuses on isolating the core business logic from external systems. It achieves this primarily by using the **Dependency Inversion Principle** from SOLID principles, ensuring that high-level business logic does not depend on low-level details.

By decoupling components, Hexagonal Architecture guarantees a clear separation between business rules and application concerns. This separation allows for easier modifications to external systems without impacting core functionality. Additionally, this isolation enhances **testability**, as the core logic can be tested independently from external dependencies.

## Domain

The **Domain** layer is responsible for the core business logic of this application. In this challenge, it implements the following components:

- **Order**: This class handles the management of order resources.
  
- **Product**: The Product class is a value object within the Order class. It contains the business rules that define which products can be initialized and encapsulates the logic for determining the price of each product.

## Application

The **Application** layer acts as an intermediary between the domain and infrastructure layers. It is responsible for orchestrating the flow of data between the domain logic and external systems.

### Use Cases

Here are the services that this application provides, encapsulating the business rules behind each action:

- **visualizeMenuUseCase**: Returns the menu, showing all products, variations, and their prices.
  
- **placeOrderUseCase**: Handles the process of placing an order.
  
- **viewDetailsUseCase**: Displays the details of an order, including the total price.
  
- **updateOrderUseCase**: Manages the process of updating an order.

## Ports

**Ports** define how the application's core components communicate with external systems. These components depend on abstractions, not on specific implementations. This enables easier switching of external dependencies without affecting the business logic.

### Repository

The **Repository** pattern abstracts the persistence layer of the application. By depending only on this interface, he database type or how data is managed can be easily changed, like using in-memory databases for unit testing.

### Gateway

In this project, the system communicates with two external APIs: one for payment processing and another for notifications. This design decouples the system from direct dependency on these services, allowing for future changes or replacements. It also enables mocking of API behaviors, reducing unnecessary requests during testing.

## Infrastructure

The **Infrastructure** layer is responsible for communicating with external systems, such as databases or APIs. In this layer, Was implemented an adapter that converts external systems into the interfaces defined in the **Ports** layer.

## REST API Endpoints

This application provides the following API endpoints:


### `GET /menu`
Returns all products from the catalog, including variations and prices.

```bash
curl --request GET \
  --url http://localhost:8000/api/menu \
  --header 'Content-Type: application/json'
```

### `POST /orders`
Place a new order.

```bash
curl --request POST \
  --url http://localhost:8000/api/orders \
  --header 'Content-Type: application/json' \
  --header 'User-Agent: insomnia/2023.5.8' \
  --header 'role: manager' \
  --data '{
    "products" : [
      {"name" : "Latte", "variant": "Vanilla" },
      {"name" : "Espresso", "variant": "Single Shot" }
    ]
  }'
```

### `PATCH /orders/{id}/status`
Update the status of an order as it progresses through different stages. Only users with the *manager* role can access this endpoint.

```bash
curl --request PATCH \
  --url http://localhost:8000/api/orders/{orderId}/status \
  --header 'Content-Type: application/json' \
  --header 'role: manager'
```

### `GET /orders/{orderId}`
Retrieve the details of a specific order, including the total price.

```bash
curl --request GET \
  --url http://localhost:8000/api/orders/{orderId} \
  --header 'Content-Type: application/json' \
  --header 'role: customer'
```

## Test Coverage

As previously mentioned, one of the main reasons for choosing Hexagonal Architecture was the high level of decoupling between components, making it easy to test each one independently. Additionally, was followed the **Test-Driven Development (TDD)** approach for this project. The tests were created first, and then the logic was implemented to make them pass. The tests include both unit and integration tests, ensuring 100% test coverage. This not only improves the reliability and maintainability of the project but also enhances its readability.

### Test Coverage Summary

| File              | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s |
|-------------------|---------|----------|---------|---------|-------------------|
| **All files**     | 100     | 100      | 100     | 100     |                   |
| **...cases**      | 100     | 100      | 100     | 100     |                   |
| **...e.ts**       | 100     | 100      | 100     | 100     |                   |
| **...e.ts**       | 100     | 100      | 100     | 100     |                   |
| **...e.ts**       | 100     | 100      | 100     | 100     |                   |
| **...e.ts**       | 100     | 100      | 100     | 100     |                   |
| **...ities**      | 100     | 100      | 100     | 100     |                   |
| **...r.ts**       | 100     | 100      | 100     | 100     |                   |
| **...tants**      | 100     | 100      | 100     | 100     |                   |
| **menu.ts**       | 100     | 100      | 100     | 100     |                   |
| **...enums**      | 100     | 100      | 100     | 100     |                   |
| **...s.ts**       | 100     | 100      | 100     | 100     |                   |
| **...bject**      | 100     | 100      | 100     | 100     |                   |
| **...t.ts**       | 100     | 100      | 100     | 100     |                   |
| **...abase**      | 100     | 100      | 100     | 100     |                   |
| **...e.ts**       | 100     | 100      | 100     | 100     |                   |
| **...ories**      | 100     | 100      | 100     | 100     |                   |
| **...y.ts**       | 100     | 100      | 100     | 100     |                   |
| **...y.ts**       | 100     | 100      | 100     | 100     |                   |


To run the test coverage, use the following command:

```bash
npm run coverage
```
OBS: To ensure all tests run correctly, you must have the project running for the integration tests.

## Docker

Docker was used to ensure consistency across different environments and simplify the configuration of the application's components. This allows the project to run smoothly regardless of the local or production environment.

### Running the Project

To build and run the project using Docker, use the following commands:

```bash
npm run start
```
