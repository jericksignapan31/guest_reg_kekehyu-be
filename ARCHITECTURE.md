# Project Architecture & Structure - Kekehyu Hotel Guest Registration

## 📁 Project Layout

```
guest_reg_kekehyu/
├── public/                          # Static assets (served as-is)
│   ├── manifest.json               # PWA Web App Manifest
│   ├── icon-192x192.svg            # App icon (placeholder)
│   └── [future: PNG icons]         # Production icons
│
├── src/                            # Source code
│   ├── index.html                  # Entry HTML (PWA meta tags)
│   ├── main.ts                     # Bootstrap file (SW registration)
│   ├── main.server.ts              # Server bootstrap
│   ├── server.ts                   # SSR server
│   ├── service-worker.ts           # Service Worker code
│   ├── styles.scss                 # Global responsive styles
│   │
│   └── app/                        # Angular app root
│       ├── app.config.ts           # App providers (HTTP, forms, etc.)
│       ├── app.config.server.ts    # SSR-specific providers
│       ├── app.routes.ts           # Route definitions
│       ├── app.routes.server.ts    # SSR routes
│       ├── app.ts                  # Root component
│       ├── app.scss                # App-level styles
│       │
│       ├── core/                   # Core business logic (singletons)
│       │   ├── services/
│       │   │   ├── auth.service.ts          # Authentication & user state
│       │   │   ├── reservation.service.ts   # Reservation CRUD
│       │   │   ├── admin.service.ts         # Admin operations
│       │   │   ├── toast.service.ts         # Toast notifications
│       │   │   └── dialog.service.ts        # Dialog handling
│       │   ├── interceptors/
│       │   │   ├── auth.interceptor.ts      # JWT token injection
│       │   │   └── error.interceptor.ts     # Error handling
│       │   └── guards/
│       │       ├── auth.guard.ts            # Protect authenticated routes
│       │       ├── no-auth.guard.ts         # Protect login/register pages
│       │       └── role.guard.ts            # Role-based access control
│       │
│       ├── shared/                 # Reusable components & utilities
│       │   ├── components/
│       │   │   ├── layout/
│       │   │   │   └── layout.component.*   # Main layout wrapper
│       │   │   ├── profile/
│       │   │   │   └── profile.component.*  # User profile settings (3 tabs)
│       │   │   └── [other shared components]
│       │   ├── models/             # TypeScript interfaces
│       │   │   ├── auth.model.ts            # Auth DTOs & interfaces
│       │   │   ├── reservation.model.ts     # Reservation interfaces
│       │   │   └── admin.model.ts           # Admin interfaces
│       │   └── utils/              # Utility functions
│       │
│       ├── features/               # Feature modules (by domain)
│       │   ├── auth/              # Authentication
│       │   │   ├── login/
│       │   │   │   └── login.component.*
│       │   │   ├── register/
│       │   │   │   └── register.component.*
│       │   │   └── forgot-password/
│       │   │       └── forgot-password.component.*
│       │   │
│       │   ├── dashboard/         # Main dashboard (FRONTDESK role)
│       │   │   ├── dashboard/
│       │   │   │   └── dashboard.component.*
│       │   │   └── statistics/
│       │   │       └── statistics.component.*
│       │   │
│       │   ├── reservations/      # Guest reservation management
│       │   │   ├── register/
│       │   │   │   └── register.component.*    # 4-step form
│       │   │   ├── my-bookings/
│       │   │   │   └── my-bookings.component.*
│       │   │   └── details/
│       │   │       └── details.component.*
│       │   │
│       │   └── admin/             # Admin dashboard (ADMIN role)
│       │       ├── admin-dashboard/
│       │       │   └── admin-dashboard.component.*
│       │       ├── users/
│       │       │   └── users.component.*
│       │       ├── transactions/
│       │       │   └── transactions.component.*
│       │       ├── user-stats/
│       │       │   └── user-stats.component.*
│       │       └── reports/
│       │           └── reports.component.*
│       │
│       └── [other app files]
│
├── angular.json                # Angular CLI configuration
├── tsconfig.json               # TypeScript base config
├── tsconfig.app.json          # App-specific TS config
├── tsconfig.spec.json         # Test-specific TS config
├── package.json                # NPM dependencies & scripts
├── README.md                   # Project overview
├── PWA_GUIDE.md               # Progressive Web App documentation (NEW)
├── RESPONSIVE_DESIGN.md       # Responsive design implementation (NEW)
└── TESTING_DEPLOYMENT.md      # Testing and deployment (NEW)
```

---

## 🏗️ Architecture Overview

### Layered Architecture

```
┌─────────────────────────────────────────────┐
│          Presentation Layer                  │
│  (Components: login, register, dashboard)   │
│  - User interactions                         │
│  - Form submissions                          │
│  - UI state management                       │
└──────────────┬──────────────────────────────┘
               │
┌──────────────▼──────────────────────────────┐
│          Business Logic Layer                │
│  (Services: auth, reservation, admin)       │
│  - Data transformation                       │
│  - Business rules                            │
│  - State management (BehaviorSubject)        │
└──────────────┬──────────────────────────────┘
               │
┌──────────────▼──────────────────────────────┐
│         HTTP & Data Layer                    │
│  (HttpClient + Interceptors + Guards)       │
│  - API communication                         │
│  - JWT token management                      │
│  - Error handling                            │
│  - Route protection                          │
└──────────────┬──────────────────────────────┘
               │
┌──────────────▼──────────────────────────────┐
│   Backend API (NestJS)                       │
│  - User authentication                       │
│  - Business data CRUD                        │
│  - Database operations                       │
└─────────────────────────────────────────────┘
```

---

## 🔄 Data Flow Examples

### Login Flow

```
User Input (login.component)
    ↓
Form Submission
    ↓
auth.service.login(credentials)
    ↓
HttpClient POST /api/auth/login
    ↓
auth.interceptor adds JWT header
    ↓
Backend validates credentials
    ↓
Returns AuthLoginResponse { accessToken, refreshToken, user }
    ↓
auth.service stores in localStorage
    ↓
Component navigates to dashboard
    ↓
Dashboard loads → authGuard allows access
```

### Reservation Creation Flow

```
User fills 4-step form (register.component)
    ↓
Step 1: Guest details (validation)
Step 2: Dates, rooms, vehicle
Step 3: Accompanying guests
Step 4: Policy acknowledgment
    ↓
Form submit
    ↓
reservation.service.registerReservation(data)
    ↓
HttpClient POST /api/reservations/register
    ↓
Service Worker fetch event:
  - Network request goes to backend
  - Offline: Error response
    ↓
Backend stores reservation
    ↓
Returns confirmation with ID
    ↓
Component shows success toast
    ↓
Navigate to my-bookings
    ↓
Fetch updated list from /api/reservations
```

### Service Worker Offline Flow

```
User opens app
    ↓
main.ts registers service-worker.js
    ↓
Service Worker install event
  - Caches ASSETS_TO_CACHE
  - Static HTML, CSS, JS cached
    ↓
User navigates offline
    ↓
Service Worker fetch event triggered:
    ↓
  API request (*.api.*)?
    → Try network
    → Fail → Return 503 JSON error
    ↓
  Static asset?
    → Check cache-first
    → Hit cache → Serve cached version
    → Miss cache → Try network → Fail gracefully
    ↓
App displays content from cache
User sees UI, API errors gracefully handled
```

---

## 📦 Dependencies Overview

### Core Angular Packages
```json
{
  "@angular/animations": "21.2.0",          // Animations
  "@angular/cdk": "21.2.1",                 // Component Dev Kit
  "@angular/common": "21.2.0",              // Common directives
  "@angular/compiler": "21.2.0",            // Template compiler
  "@angular/core": "21.2.0",                // Core framework
  "@angular/forms": "21.2.0",               // Reactive forms
  "@angular/material": "21.2.6",            // Material Design
  "@angular/platform-browser": "21.2.0",    // Browser support
  "@angular/platform-browser-dynamic": "21.2.0",  // Dynamic compilation
  "@angular/router": "21.2.0"               // Routing
}
```

### Supporting Libraries
```json
{
  "rxjs": "~7.8.0",                         // Reactive extensions
  "tslib": "^2.3.0",                        // TypeScript helpers
  "zone.js": "~0.14.0"                      // Zone management
}
```

### Development Tools
```json
{
  "@angular-devkit/build-angular": "~21.2.0",   // Build tooling
  "@angular/cli": "~21.2.0",                    // CLI tools
  "@angular/compiler-cli": "21.2.0",            // Compiler CLI
  "typescript": "~5.5.4"                        // TypeScript
}
```

---

## 🔐 Authentication & Authorization

### JWT Token Management

**Storage**:
- `localStorage.accessToken` - Short-lived JWT
- `localStorage.refreshToken` - Long-lived refresh token
- `localStorage.authState` - User info & role

**AuthInterceptor**:
- Automatically adds `Authorization: Bearer <token>` to all requests
- Excluded routes: `/auth/login`, `/auth/register`, `/auth/refresh`

**Refresh Logic**:
```
Request fails with 401?
  ↓
Call auth.refresh() with refreshToken
  ↓
Get new accessToken
  ↓
Retry original request
  ↓
If refresh fails → Logout & redirect to login
```

### Role-Based Access Control (RBAC)

**Available Roles**:
- `FRONTDESK` - Guest registration, reservations
- `ADMIN` - User management, transactions, reports

**Guard Usage**:
```typescript
// In route configuration
{
  path: 'admin',
  component: AdminDashboardComponent,
  canActivate: [authGuard, roleGuard],
  data: { roles: ['ADMIN'] }
}
```

**Component Level**:
```typescript
// In component
if (this.authService.getUserRole() === 'ADMIN') {
  // Show admin features
}
```

---

## 🎨 Responsive Design Architecture

### CSS Variable System

**Colors**:
```scss
--primary-color: #667eea;
--accent-color: #f093fb;
--success-color: #4caf50;
```

**Spacing** (scales by breakpoint):
```scss
--spacing-md: 1rem;   // 16px on desktop, 12px on mobile
--spacing-lg: 1.5rem; // 24px on desktop, 16px on mobile
```

### Breakpoint Strategy

**Mobile-First Base** (max-width: 480px)
```scss
// Smallest screens - optimized for touch
font-size: 14px;
padding: 8px;
margin: 8px;
```

**Progressive Enhancement**
```scss
@media (min-width: 481px) { ... }      // Tablets
@media (min-width: 768px) { ... }      // Desktop
@media (min-width: 1024px) { ... }     // Large desktop
@media (min-width: 1440px) { ... }     // Extra large
```

---

## ⚡ Performance Optimization

### Bundle Size
- **Initial Bundle**: ~1.15 MB (optimized)
- **Lazy Loading**: Routes can be lazy-loaded
- **Tree Shaking**: Unused code removed

### Caching Strategy

**Service Worker Cache**:
- **Static Assets** (cache-first): Images, CSS, fonts
- **API Calls** (network-first): Dynamic data always from server
- **Cache Name**: `kekehyu-guest-reg-v1`
- **Update**: Clear old caches on activation

### Image Optimization
- Use WebP for modern browsers
- Provide PNG fallback for older browsers
- Responsive images with srcset
- Lazy load images off-screen

---

## 🔄 State Management

### Service-Based State Management with RxJS

```typescript
// auth.service.ts
export class AuthService {
  private authState$ = new BehaviorSubject<AuthState>(initialState);
  
  login(credentials): Observable<AuthLoginResponse> {
    return this.http.post('/api/auth/login', credentials)
      .pipe(
        tap(response => {
          this.setAuthState(response);  // Update state
          localStorage.setItem('token', response.accessToken);
        })
      );
  }
  
  getAuthState(): Observable<AuthState> {
    return this.authState$.asObservable();
  }
}

// Component usage
export class DashboardComponent implements OnInit {
  user$ = this.authService.getAuthState();
  
  ngOnInit() {
    this.user$.subscribe(state => {
      // Component automatically updates when state changes
    });
  }
}
```

### localStorage for Persistence

**Why localStorage?**
- Persists across page refreshes
- Survives browser restart
- Accessible across tabs
- SSR-safe (checked with isPlatformBrowser)

**What's Stored?**
1. `accessToken` - JWT for API authentication
2. `refreshToken` - For token refresh
3. `authState` - User info, role, preferences

---

## 🧪 Testing Architecture

### Unit Tests Structure

```
src/
├── app/
│   ├── app.spec.ts                 # App component tests
│   ├── core/
│   │   └── services/
│   │       └── auth.service.spec.ts       # Service logic tests
│   ├── shared/
│   │   ├── models/
│   │   └── components/
│   └── features/
│       ├── auth/
│       │   └── login/
│       │       └── login.component.spec.ts # Component tests
```

### Testing Patterns

**Service Testing**:
```typescript
describe('AuthService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthService, HttpClientTestingModule]
    });
  });
  
  it('should authenticate user', () => {
    // Test service methods
  });
});
```

**Component Testing**:
```typescript
describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [ReactiveFormsModule, MatFormFieldModule, ...]
    });
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
  });
  
  it('should render login form', () => {
    expect(component).toBeTruthy();
  });
});
```

---

## 🚀 Build & Deployment Pipeline

### Development Workflow
```
npm start
  ↓
Angular CLI with esbuild/vite
  ↓
Hot Module Replacement (HMR)
  ↓
Automatic browser refresh
  ↓
TypeScript compilation
  ↓
SCSS compilation
```

### Production Build
```
npm run build
  ↓
Angular optimization
  ↓
Tree-shaking
  ↓
Minification
  ↓
Source map generation
  ↓
Service Worker pre-caching
  ↓
dist/guest_reg_kekehyu/browser/
```

### Deployment
```
Build output (dist/)
  ↓
Upload to web server
  ↓
Configure HTTPS
  ↓
Set cache headers
  ↓
Configure service worker routes
  ↓
Monitor in production
```

---

## 📊 API Contract

### Authentication Endpoints

**POST /api/auth/login**
```
Request: { email: string, password: string }
Response: {
  accessToken: string,
  refreshToken: string,
  user: {
    id: string,
    email: string,
    role: 'FRONTDESK' | 'ADMIN',
    status: string
  }
}
```

**POST /api/auth/register**
```
Request: { email, password, name, ... }
Response: { success: boolean, message: string }
```

### Reservation Endpoints

**POST /api/reservations/register**
```
Request: {
  guest: {...},
  dates: {...},
  rooms: [...],
  accompaningGuests: [...],
  policies: {...}
}
Response: { success: boolean, reservationId: string }
```

**GET /api/reservations**
```
Response: [
  {
    id: string,
    guestName: string,
    checkIn: date,
    checkOut: date,
    status: string
  }
]
```

---

## 🔧 Configuration Files

### angular.json
- **Build configurations** (development, production)
- **Project structure** (root, sourceRoot, outputPath)
- **Build options** (optimization, sourceMap, budget)
- **Serve options** (port, browserTarget)

### tsconfig.json
- **Path aliases**: `@core/*`, `@shared/*`, `@features/*`, `@app/*`
- **Compiler options**: strict mode, declaration files
- **Module resolution**: modern, strict

### package.json
- **Dependencies**: Angular 21, Material, RxJS
- **Scripts**:
  - `npm start` - Dev server
  - `npm test` - Unit tests
  - `npm run build` - Production build
  - `npm run serve` - Serve production build

---

## 🎯 Key Features Summary

✅ **Authentication**
- Login/Register with JWT
- Password reset flow
- Profile management
- Token refresh

✅ **Role-Based Access**
- FRONTDESK role (guests)
- ADMIN role (management)
- Route guards

✅ **Guest Registration**
- 4-step form with validation
- Dynamic room allocation
- Accompanying guests
- Policy acknowledgment

✅ **Reservations**
- View bookings
- Reservation details (4 tabs)
- Statistics
- Search/filter

✅ **Admin Features**
- User management
- Transaction history
- User statistics
- Reports

✅ **PWA Features**
- Offline support
- App installation
- Service Worker
- Web Manifest

✅ **Responsive Design**
- Mobile (480px)
- Tablet (768px)
- Desktop (1024px)
- Large desktop (1440px+)
- Dark mode
- Accessibility

---

## 📚 Code Organization Principles

1. **Separation of Concerns**
   - Services: Business logic
   - Components: UI & user interaction
   - Models: Data structures
   - Guards: Route protection
   - Interceptors: HTTP processing

2. **Reusability**
   - Shared components (layout, profile)
   - Shared models (interfaces)
   - Utility functions

3. **Scalability**
   - Feature-based folder structure
   - Lazy loading ready
   - Service-based state management
   - Environment-specific configs

4. **Maintainability**
   - Clear naming conventions
   - TypeScript strict mode
   - Comprehensive comments
   - Documentation files (this guide!)

---

**Last Updated**: April 10, 2026
**Angular Version**: 21.2.0
**Architecture Pattern**: Services + Components + Guards + Interceptors
**State Management**: RxJS BehaviorSubject + localStorage
