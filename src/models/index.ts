// Core authentication and user management models
export { User, type IUser } from './User'; // Main user model with authentication
export { Order, type IOrder } from './Order'; // Main order model
export { Security, type ISecurity } from './Security'; // Main security model

// Detailed user and system models (converted from JS)
export { UserDetail, type IUserDetail } from './UserDetail'; // Basic user information
export { UserLoginDetail, type IUserLoginDetail } from './UserLoginDetail'; // User login tracking
export { AccountDetail, type IAccountDetail } from './AccountDetail'; // Account balance tracking
export { AuditAction, type IAuditAction } from './AuditAction'; // User action auditing
export { AuditUserLogin, type IAuditUserLogin } from './AuditUserLogin'; // Login session auditing
export { OrderDetail, type IOrderDetail } from './OrderDetail'; // Detailed order information
export { SecurityDetail, type ISecurityDetail } from './SecurityDetail'; // Security-specific details

// Model relationships:
// User (main) -> UserDetail (basic info)
// UserDetail -> UserLoginDetail (login tracking)
// UserLoginDetail -> AccountDetail (account management)
// UserLoginDetail -> AuditAction (action tracking)
// UserLoginDetail -> AuditUserLogin (session tracking)
// Security (main) -> SecurityDetail (detailed info)
// Order (main) -> OrderDetail (detailed order info) 