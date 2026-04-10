# User Management System Guide

## Overview

The user management system provides comprehensive controls for managing front desk staff accounts, monitoring user activity, and tracking system usage. This guide covers all user management features and API endpoints.

---

## Features

### 1. User List Management (`/admin/users`)

**Capabilities:**
- View all front desk staff accounts
- Search users by name, email, or role
- View user role and account status
- Edit user information
- Lock/unlock user accounts
- Delete user accounts
- View user activity statistics

**Key Columns:**
- **Name**: First and last name
- **Email**: Unique email address (cannot be changed)
- **Role**: Account type (FRONTDESK, ADMIN)
- **Contact**: Phone number
- **Status**: Active or inactive
- **Last Login**: Last access timestamp

**Actions Menu:**
```
├── Edit → Opens user edit dialog
├── View Stats → Navigate to activity page
├── Lock/Unlock → Change account status
└── Delete → Remove user permanently
```

---

### 2. Edit User Dialog

**Editable Fields:**
- First Name (required, min 2 chars)
- Last Name (required, min 2 chars)
- Contact Number
- Role (FRONTDESK or ADMIN)
- Department
- Position
- Status (Active or Inactive)

**Read-Only Information:**
- Email (cannot be changed)
- User ID
- Account creation date
- Last updated date
- Last login date

**Actions:**
- Save Changes → Updates user profile
- Cancel → Close dialog without changes

---

### 3. User Activity & Statistics (`/admin/users/:userId/activity`)

**Statistics Displayed:**
- Total Logins - Number of times user logged in
- Registrations Processed - Guest registrations handled
- Reservations Handled - Reservation transactions processed
- Average Response Time - Average action completion time

**Activity Log:**
Shows all user transactions with:
- **Action Type**: Registration, Check-in, Check-out, Payment, Update
- **Description**: Details of the action
- **Amount**: Transaction value (if applicable)
- **Status**: Completed, Pending, Failed
- **Timestamp**: Date and time of action

**Activity Filtering:**
Color-coded by action type:
- 🟢 Registration (Green)
- 🔵 Check-in (Blue)
- 🟠 Check-out (Orange)
- 🟣 Payment (Purple)
- ⚫ Other (Gray)

---

## API Endpoints Used

### User Management

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/admin/frontdesk/users` | List all staff |
| GET | `/admin/users/{userId}/stats` | User statistics |
| PUT | `/admin/users/{userId}` | Update user info |
| POST | `/admin/users/{userId}/lock` | Lock account |
| POST | `/admin/users/{userId}/unlock` | Unlock account |
| DELETE | `/admin/users/{userId}` | Delete user |
| GET | `/admin/transactions/user/{userId}` | User activity log |

### Associated Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/admin/transactions` | All system transactions |
| GET | `/admin/dashboard/stats` | System statistics |
| POST | `/auth/register` | Create new user |

---

## User Roles & Permissions

### FRONTDESK Role
- Can process guest registrations
- Can handle reservations
- Can view own activity
- Cannot access admin features

### ADMIN Role
- Full access to user management
- Can edit all users
- Can view all activities
- Can generate reports
- Can manage system settings

---

## Common Tasks

### Task 1: Create a New User
1. Click "Create New User" button on Users page
2. Fill in registration form:
   - Email
   - Password
   - First Name
   - Last Name
   - Contact Number
3. Select Role: FRONTDESK or ADMIN
4. Click Register

### Task 2: Edit User Information
1. Go to Users page (`/admin/users`)
2. Click menu (⋮) on the user row
3. Select "Edit"
4. Update fields in the dialog
5. Click "Save Changes"

### Task 3: Lock a User Account
1. Go to Users page
2. Click menu (⋮) on the user
3. Click "Lock"
4. Confirm action
⚠️ **Note**: Locked users cannot log in

### Task 4: View User Activity
1. Go to Users page
2. Click menu (⋮) on the user
3. Select "View Stats"
4. Browse activity log and statistics
5. Sort by action type or date

### Task 5: Delete a User
1. Go to Users page
2. Click menu (⋮) on the user
3. Click "Delete"
4. Confirm deletion
⚠️ **Warning**: This action is permanent and cannot be undone

---

## Search & Filtering

### Search Options
Search works across:
- First name
- Last name
- Email address
- Role (FRONTDESK, ADMIN)

**Example Searches:**
```
"John" → Finds "John Smith", "John Doe"
"john@hotel.com" → Finds by email
"admin" → Finds all ADMIN role users
"smith" → Finds last name matches
```

---

## User Status

### Active Status
- User can log in
- User can perform normal operations
- Account is fully functional

### Inactive Status
- User cannot log in
- Account is disabled but not deleted
- All history is preserved
- Can be reactivated by editing and changing status

### Locked Status
- User cannot log in
- Account exists but is restricted
- Same as inactive status
- Purpose: Temporary suspension

---

## Activity Log Details

### Action Types

**Registration**
- Guest registration processed
- Includes room assignment
- Vehicle information
- Accompanying guests

**Check-in**
- Guest arrival processed
- Room key issued
- Payment confirmation

**Check-out**
- Guest departure processed
- Final payment collected
- Room status updated

**Payment**
- Payment transaction processed
- Refund issued
- Payment method recorded

**Update**
- User made changes to reservation
- Profile information modified
- Account settings updated

---

## Performance Metrics

### Key Metrics Tracked
- **Total Logins**: Measure of user activity frequency
- **Registrations Processed**: Guest processing volume
- **Reservations Handled**: Booking management volume
- **Response Time**: System responsiveness

### Interpreting Statistics
- Higher login count = More active staff
- High registration count = Busy period
- High response time = System optimization needed
- Low activity = Under-utilized staff

---

## Best Practices

### ✅ Do's
- ✅ Regularly review user activity logs
- ✅ Lock accounts instead of deleting if unsure
- ✅ Keep contact information current
- ✅ Assign appropriate roles based on responsibilities
- ✅ Monitor response times for performance
- ✅ Back up user activity records periodically

### ❌ Don'ts
- ❌ Share admin credentials
- ❌ Delete active or important accounts
- ❌ Ignore suspicious activity
- ❌ Use the same user account for multiple people
- ❌ Store passwords in unsecured places
- ❌ Grant ADMIN role without proper authorization

---

## Troubleshooting

### Issue: Cannot edit user
**Solution**: 
- Check if you have ADMIN role
- Verify user is not deleted
- Try refreshing the page

### Issue: User cannot log in
**Solution**:
- Check if account status is "active"
- Verify account is not locked
- Check email address is correct
- Request password reset

### Issue: Activity log not showing
**Solution**:
- Check if user has recent activity
- Verify date range filters
- Try refreshing the page
- Check network connection

### Issue: Statistics not updating
**Solution**:
- Wait for cache refresh (usually 5 minutes)
- Check if user has recent transactions
- Try logging out and in again
- Contact system administrator

---

## Security Considerations

### Account Security
- All passwords are encrypted
- Tokens expire after inactivity
- Sessions are logged and monitored
- IP addresses are tracked

### Data Protection
- User information is encrypted in transit
- Activity logs are immutable
- Deletions cannot be undone
- Backups are maintained

### Admin Responsibilities
- Monitor for unusual activity
- Lock compromised accounts immediately
- Review access logs regularly
- Enforce strong password policies

---

## API Response Examples

### List Users Response
```json
[
  {
    "id": "user123",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@hotel.com",
    "role": "FRONTDESK",
    "contactNumber": "+1234567890",
    "status": "active",
    "lastLogin": "2026-04-10T10:30:00Z",
    "createdAt": "2026-01-15T08:00:00Z",
    "updatedAt": "2026-04-09T14:20:00Z"
  }
]
```

### User Statistics Response
```json
{
  "userId": "user123",
  "totalLogins": 245,
  "registrationsProcessed": 128,
  "reservationsHandled": 89,
  "averageResponse": 2.45,
  "firstLogin": "2026-01-15T08:00:00Z",
  "lastLogin": "2026-04-10T10:30:00Z"
}
```

### Activity Log Response
```json
[
  {
    "id": "trans123",
    "userId": "user123",
    "type": "registration",
    "description": "Guest John Smith registered",
    "amount": null,
    "status": "completed",
    "createdAt": "2026-04-10T10:30:00Z"
  }
]
```

---

## Related Resources

- [Admin Dashboard](./ADMIN_DASHBOARD.md)
- [Authentication System](../../core/services/auth.service.ts)
- [API Documentation](./API_DOCS.md)
- [System Architecture](../../ARCHITECTURE.md)

---

## Support & Help

**For technical issues:**
- Check server logs
- Verify API endpoints are accessible
- Check database connectivity
- Review browser console for errors

**For permission issues:**
- Verify user has ADMIN role
- Check API token is valid
- Verify headers are correct
- Check CORS configuration

---

**Last Updated**: April 10, 2026
**Version**: 1.0
**Status**: Active & Maintained
