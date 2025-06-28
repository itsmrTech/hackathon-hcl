# Portfolio Management System - Modular Structure

This document describes the modular architecture of the Portfolio Management System API.

## Project Structure

```
src/
├── config/                 # Configuration files
│   └── database.ts        # MongoDB connection
├── shared/                # Shared utilities and middleware
│   └── middleware/
│       ├── auth.ts        # Authentication middleware
│       ├── errorHandler.ts # Error handling middleware
│       └── notFound.ts    # 404 handler
├── modules/               # Feature-based modules
│   ├── auth/             # Authentication module
│   │   ├── models/
│   │   │   └── User.ts
│   │   ├── controllers/
│   │   │   └── authController.ts
│   │   ├── validators/
│   │   │   └── authValidators.ts
│   │   ├── routes/
│   │   │   └── authRoutes.ts
│   │   ├── __tests__/
│   │   │   └── authController.test.ts
│   │   └── index.ts
│   ├── portfolio/        # Portfolio management module
│   │   ├── models/
│   │   │   └── Order.ts
│   │   ├── controllers/
│   │   │   └── portfolioController.ts
│   │   ├── validators/
│   │   │   └── portfolioValidators.ts
│   │   ├── routes/
│   │   │   └── portfolioRoutes.ts
│   │   └── index.ts
│   ├── order/            # Order management module
│   │   ├── models/
│   │   │   └── Order.ts
│   │   ├── controllers/
│   │   │   └── orderController.ts
│   │   ├── validators/
│   │   │   └── orderValidators.ts
│   │   ├── routes/
│   │   │   └── orderRoutes.ts
│   │   └── index.ts
│   ├── securities/       # Securities/funds module
│   │   ├── models/
│   │   │   └── Security.ts
│   │   ├── controllers/
│   │   │   └── securityController.ts
│   │   ├── routes/
│   │   │   └── securityRoutes.ts
│   │   └── index.ts
│   └── transactions/     # Transaction history module
│       ├── models/
│       │   └── Order.ts
│       ├── controllers/
│       │   └── transactionController.ts
│       ├── validators/
│       │   └── transactionValidators.ts
│       ├── routes/
│       │   └── transactionRoutes.ts
│       └── index.ts
└── index.ts              # Main application entry point
```

## Module Structure

Each module follows a consistent structure:

### 1. Models (`models/`)
- Mongoose schemas and interfaces
- Database models for the module

### 2. Controllers (`controllers/`)
- Business logic implementation
- Request/response handling
- Service layer integration

### 3. Validators (`validators/`)
- Input validation middleware
- Express-validator rules
- Custom validation functions

### 4. Routes (`routes/`)
- Express route definitions
- Middleware composition
- Route handlers

### 5. Tests (`__tests__/`)
- Unit tests for controllers
- Integration tests for routes
- Test utilities and fixtures

### 6. Index (`index.ts`)
- Module exports
- Public API definition
- Dependency management

## Benefits of Modular Structure

1. **Separation of Concerns**: Each module handles a specific domain
2. **Maintainability**: Easy to locate and modify specific functionality
3. **Scalability**: New modules can be added without affecting existing ones
4. **Testability**: Isolated testing of each module
5. **Reusability**: Modules can be reused across different parts of the application
6. **Team Collaboration**: Different teams can work on different modules

## Module Dependencies

```
auth/          ← Independent (no dependencies)
securities/    ← Independent (no dependencies)
portfolio/     ← Depends on auth, order
order/         ← Depends on auth, securities
transactions/  ← Depends on auth, order
```

## Adding a New Module

1. Create the module directory structure
2. Implement models, controllers, validators, and routes
3. Create an `index.ts` file to export the module
4. Add the module routes to the main `index.ts`
5. Write tests for the module
6. Update documentation

## Testing Strategy

- **Unit Tests**: Test individual controllers and services
- **Integration Tests**: Test complete API endpoints
- **Module Tests**: Test module-specific functionality
- **End-to-End Tests**: Test complete user workflows

## Best Practices

1. Keep modules focused on a single responsibility
2. Use dependency injection for cross-module dependencies
3. Implement proper error handling in each module
4. Write comprehensive tests for each module
5. Use TypeScript interfaces for type safety
6. Follow consistent naming conventions
7. Document module APIs and dependencies 