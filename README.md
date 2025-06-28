# Portfolio Management System — API Overview

This document describes the high-level APIs for the Portfolio Management System. It covers the purpose, request/response structure, and key edge cases for each API. This will guide the initial implementation phase.

## API Endpoints

### `GET /api/portfolio/summary`

**Description:**
Retrieve portfolio summary including asset allocations, holdings, and performance chart.

**Request Parameters**

```json
{
  "orderRefNo": "string (optional)",
  "securityName": "string (optional)",
  "transactionType": "Buy | Sell (optional)",
  "fromDate": "YYYY-MM-DD (optional)",
  "toDate": "YYYY-MM-DD (optional)"
}
```

**Response Example**

```json
{
  "accountRunningBalance": 10000,
  "summaries": [
    {
      "orderDate": "YYYY-MM-DD",
      "orderRefNo": "string",
      "fundName": "string",
      "transactionType": "Buy | Sell",
      "credit": 100,
      "debit": 0,
      "runningBalance": 10100
    }
  ]
}
```

**Edge Cases**

- Invalid date range (`fromDate > toDate`)
- Unknown `orderRefNo`, `securityName`, or `transactionType`
- Empty result set if no matching records

### `POST /api/order`

**Description:**
Place a new trade order (buy or sell).

**Request Body**

```json
{
  "fundName": "string (required)",
  "transactionType": "Buy | Sell (required)",
  "quantity": "number (required, > 0)"
}
```

**Response Example**

```json
{
  "orderRefNo": "string",
  "status": "Submitted",
  "orderValue": 500
}
```

**Edge Cases**

- Invalid `transactionType`
- Invalid `fundName`
- `quantity` is zero or negative
- Insufficient balance
- Legacy system timeout or failure

### `GET /api/transaction/history`

**Description:**
Retrieve transaction history.

**Request Parameters**

```json
{
  "orderRefNo": "string (optional)",
  "securityName": "string (optional)",
  "transactionType": "Buy | Sell (optional)",
  "orderStatus": "Submitted | Cancelled | Executed | Completed | Failed (optional)",
  "fromDate": "YYYY-MM-DD (optional)",
  "toDate": "YYYY-MM-DD (optional)"
}
```

**Response Example**

```json
{
  "transactions": [
    {
      "orderRefNo": "string",
      "securityName": "string",
      "transactionType": "Buy | Sell",
      "orderStatus": "Completed",
      "orderDate": "YYYY-MM-DD",
      "quantity": 10,
      "orderValue": 1000
    }
  ]
}
```

**Edge Cases**

- No filters provided (at least one required)
- Invalid filters (e.g. bad `orderRefNo`)
- Invalid date range

### `GET /api/securities`

**Description:**
Fetch available funds/securities for placing orders.

**Response Example**

```json
[
  { "securityId": 1, "securityName": "Fund A", "value": 100 },
  { "securityId": 2, "securityName": "Fund B", "value": 200 }
]
```

### `POST /api/auth/login`

**Description:**
Authenticate a user.

**Request Body**

```json
{
  "email": "string",
  "password": "string"
}
```

**Response Example**

```json
{
  "sessionId": "abc123",
  "user": {
    "id": 1,
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

### `POST /api/auth/logout`

**Description:**
Logout user and end session.

**Response Example**

```json
{
  "status": "Logged out"
}
```

### `GET /api/order/{orderRefNo}/status`

**Description:**
Retrieve the current status of an individual order.

**Response Example**

```json
{
  "orderRefNo": "ORD123",
  "status": "Completed"
}
```

### Common Validations

| Field                     | Rule                  | Error                        |
| ------------------------- | --------------------- | ---------------------------- |
| `orderRefNo`            | Must exist            | Invalid Order Ref No.        |
| `securityName`          | Must exist            | Invalid Security Name        |
| `transactionType`       | Buy / Sell            | Invalid Transaction Type     |
| `orderStatus`           | Valid status          | Invalid Order Status         |
| `fromDate` & `toDate` | `fromDate < toDate` | Invalid From Date or To Date |
| `quantity`              | > 0                   | Invalid Quantity             |

## Key Considerations

- All APIs will require authentication.
- Sensitive data will not be logged.
- The system will ensure high performance (SLA 1 second for transactions) even with legacy system constraints.
- Proper exception handling will be in place, including fallback mechanisms for legacy system failures.
