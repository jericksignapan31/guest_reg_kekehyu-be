import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { AuthService } from '@core/services/auth.service';
import { ToastService } from '@shared/services/toast.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatBadgeModule
  ],
  template: `
    <mat-toolbar color="primary" class="app-toolbar">
      <button mat-icon-button (click)="toggleSidebar()">
        <mat-icon>menu</mat-icon>
      </button>
      <span class="app-title">Kekehyu Hotel - Guest Registration</span>
      <span class="spacer"></span>
      
      <div class="user-menu">
        <span class="user-name">{{ userRole }}</span>
        <button mat-icon-button [matMenuTriggerFor]="menu">
          <mat-icon>account_circle</mat-icon>
        </button>
        <mat-menu #menu="matMenu">
          <button mat-menu-item routerLink="/profile">
            <mat-icon>person</mat-icon>
            <span>Profile</span>
          </button>
          <button mat-menu-item (click)="logout()">
            <mat-icon>logout</mat-icon>
            <span>Logout</span>
          </button>
        </mat-menu>
      </div>
    </mat-toolbar>

    <mat-sidenav-container class="sidenav-container">
      <mat-sidenav #sidenav mode="side" [opened]="sidenavOpened">
        <mat-nav-list>
          @if (userRole === 'ADMIN') {
            <h3 mat-subheader>Admin Menu</h3>
            <mat-list-item routerLink="/admin/dashboard" routerLinkActive="active">
              <mat-icon matListItemIcon>dashboard</mat-icon>
              <span matListItemTitle>Dashboard</span>
            </mat-list-item>
            <mat-list-item routerLink="/admin/users" routerLinkActive="active">
              <mat-icon matListItemIcon>people</mat-icon>
              <span matListItemTitle>Manage Users</span>
            </mat-list-item>
            <mat-list-item routerLink="/admin/transactions" routerLinkActive="active">
              <mat-icon matListItemIcon>history</mat-icon>
              <span matListItemTitle>Transactions</span>
            </mat-list-item>
            <mat-list-item routerLink="/admin/reports" routerLinkActive="active">
              <mat-icon matListItemIcon>assessment</mat-icon>
              <span matListItemTitle>Reports</span>
            </mat-list-item>
          } @else {
            <h3 mat-subheader>Front Desk Menu</h3>
            <mat-list-item routerLink="/dashboard" routerLinkActive="active">
              <mat-icon matListItemIcon>dashboard</mat-icon>
              <span matListItemTitle>Dashboard</span>
            </mat-list-item>
            <mat-list-item routerLink="/reservations/my-bookings" routerLinkActive="active">
              <mat-icon matListItemIcon>event_note</mat-icon>
              <span matListItemTitle>My Bookings</span>
            </mat-list-item>
            <mat-list-item routerLink="/reservations/statistics" routerLinkActive="active">
              <mat-icon matListItemIcon>bar_chart</mat-icon>
              <span matListItemTitle>Statistics</span>
            </mat-list-item>
            <mat-list-item routerLink="/users" routerLinkActive="active">
              <mat-icon matListItemIcon>people</mat-icon>
              <span matListItemTitle>Users</span>
            </mat-list-item>
          }
        </mat-nav-list>
      </mat-sidenav>

      <mat-sidenav-content class="content">
        <router-outlet></router-outlet>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [`
    .app-toolbar {
      position: sticky;
      top: 0;
      z-index: 100;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .app-title {
      margin-left: 1rem;
      font-weight: 500;
    }

    .spacer {
      flex: 1 1 auto;
    }

    .user-menu {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .user-name {
      font-size: 0.875rem;
    }

    .sidenav-container {
      height: calc(100vh - 64px);
    }

    mat-sidenav {
      width: 250px;
    }

    .content {
      padding: 2rem;
      overflow-y: auto;
    }

    mat-nav-list {
      padding: 1rem 0;
    }

    mat-list-item.active {
      background-color: rgba(0,0,0,0.04);
      color: #667eea;
    }

    @media (max-width: 768px) {
      mat-sidenav {
        width: 200px;
      }

      .content {
        padding: 1rem;
      }

      .app-title {
        display: none;
      }
    }
  `]
})
export class LayoutComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private toastService = inject(ToastService);

  sidenavOpened = true;
  userRole: string = '';

  constructor() {
    const role = this.authService.getUserRole();
    this.userRole = role === 'ADMIN' ? 'Admin' : 'Front Desk';
  }

  toggleSidebar(): void {
    this.sidenavOpened = !this.sidenavOpened;
  }

  logout(): void {
    this.authService.logout();
    this.toastService.success('Logged out successfully');
    this.router.navigate(['/auth/login']);
  }
}
