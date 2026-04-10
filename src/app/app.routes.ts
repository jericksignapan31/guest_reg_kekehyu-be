import { Routes } from '@angular/router';
import { authGuard, noAuthGuard, roleGuard } from './core/guards/auth.guard';
import { LayoutComponent } from './shared/components/layout/layout.component';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { ForgotPasswordComponent } from './features/auth/forgot-password/forgot-password.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { AdminDashboardComponent } from './features/admin/dashboard/admin-dashboard.component';

export const routes: Routes = [
  // Auth routes (no authentication required)
  {
    path: 'auth',
    canActivate: [noAuthGuard],
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent, data: { role: 'ADMIN' } },
      { path: 'forgot-password', component: ForgotPasswordComponent },
      { path: '', redirectTo: 'login', pathMatch: 'full' }
    ]
  },

  // Protected routes (authentication required)
  {
    path: '',
    canActivate: [authGuard],
    component: LayoutComponent,
    children: [
      // Front Desk Routes
      {
        path: 'dashboard',
        component: DashboardComponent,
        data: { role: 'FRONTDESK' }
      },
      {
        path: 'reservations',
        children: [
          {
            path: 'register',
            loadComponent: () =>
              import('./features/reservations/register/register.component').then(
                (m) => m.RegisterReservationComponent
              ),
            data: { role: 'FRONTDESK' }
          },
          {
            path: 'my-bookings',
            loadComponent: () =>
              import('./features/reservations/my-bookings/my-bookings.component').then(
                (m) => m.MyBookingsComponent
              ),
            data: { role: 'FRONTDESK' }
          },
          {
            path: ':id',
            loadComponent: () =>
              import('./features/reservations/details/details.component').then(
                (m) => m.ReservationDetailsComponent
              ),
            data: { role: 'FRONTDESK' }
          },
          {
            path: 'statistics',
            loadComponent: () =>
              import('./features/reservations/statistics/statistics.component').then(
                (m) => m.StatisticsComponent
              ),
            data: { role: 'FRONTDESK' }
          }
        ]
      },

      // Admin Routes
      {
        path: 'admin',
        children: [
          {
            path: 'dashboard',
            component: AdminDashboardComponent,
            data: { role: 'ADMIN' }
          },
          {
            path: 'users',
            loadComponent: () =>
              import('./features/admin/users/users.component').then((m) => m.UsersComponent),
            data: { role: 'ADMIN' }
          },
          {
            path: 'users/:id/stats',
            loadComponent: () =>
              import('./features/admin/user-stats/user-stats.component').then(
                (m) => m.UserStatsComponent
              ),
            data: { role: 'ADMIN' }
          },
          {
            path: 'transactions',
            loadComponent: () =>
              import('./features/admin/transactions/transactions.component').then(
                (m) => m.TransactionsComponent
              ),
            data: { role: 'ADMIN' }
          },
          {
            path: 'reports',
            loadComponent: () =>
              import('./features/admin/reports/reports.component').then(
                (m) => m.ReportsComponent
              ),
            data: { role: 'ADMIN' }
          }
        ]
      },

      // Profile Route
      {
        path: 'profile',
        loadComponent: () =>
          import('./shared/components/profile/profile.component').then(
            (m) => m.ProfileComponent
          )
      },

      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },

  // Wildcard route
  { path: '**', redirectTo: '/auth/login' }
];
