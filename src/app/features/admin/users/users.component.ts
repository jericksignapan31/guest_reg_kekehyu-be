import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { RouterModule } from '@angular/router';
import { AdminService } from '@core/services/admin.service';
import { ToastService } from '@shared/services/toast.service';
import { FrontDeskUser } from '@core/models';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatMenuModule,
    MatSlideToggleModule,
    RouterModule
  ],
  template: `
    <div class="users-container">
      <div class="header">
        <h1>Front Desk Users</h1>
        <p>Manage all front desk staff accounts</p>
      </div>

      <div class="actions">
        <mat-form-field>
          <mat-label>Search by name or email</mat-label>
          <input matInput [(ngModel)]="searchTerm" (keyup)="onSearchChange()" />
        </mat-form-field>

        <button mat-raised-button color="primary" routerLink="/auth/register">
          <mat-icon>person_add</mat-icon>
          Create New User
        </button>
      </div>

      @if (isLoading) {
        <div class="loading">
          <mat-spinner></mat-spinner>
        </div>
      } @else {
        @if (filteredUsers.length > 0) {
          <mat-card class="table-card">
            <table mat-table [dataSource]="filteredUsers" class="users-table">
              <!-- Name -->
              <ng-container matColumnDef="name">
                <th mat-header-cell *matHeaderCellDef>Name</th>
                <td mat-cell *matCellDef="let element">
                  {{ element.firstName }} {{ element.lastName }}
                </td>
              </ng-container>

              <!-- Email -->
              <ng-container matColumnDef="email">
                <th mat-header-cell *matHeaderCellDef>Email</th>
                <td mat-cell *matCellDef="let element">{{ element.email }}</td>
              </ng-container>

              <!-- Contact -->
              <ng-container matColumnDef="contact">
                <th mat-header-cell *matHeaderCellDef>Contact</th>
                <td mat-cell *matCellDef="let element">{{ element.contactNumber }}</td>
              </ng-container>

              <!-- Status -->
              <ng-container matColumnDef="status">
                <th mat-header-cell *matHeaderCellDef>Status</th>
                <td mat-cell *matCellDef="let element">
                  <span class="status" [ngClass]="element.status">
                    {{ element.status | uppercase }}
                  </span>
                </td>
              </ng-container>

              <!-- Last Login -->
              <ng-container matColumnDef="lastLogin">
                <th mat-header-cell *matHeaderCellDef>Last Login</th>
                <td mat-cell *matCellDef="let element">
                  {{ element.lastLogin | date: 'short' }}
                </td>
              </ng-container>

              <!-- Actions -->
              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>Actions</th>
                <td mat-cell *matCellDef="let element">
                  <button mat-icon-button [matMenuTriggerFor]="menu">
                    <mat-icon>more_vert</mat-icon>
                  </button>
                  <mat-menu #menu="matMenu">
                    <button mat-menu-item [routerLink]="['/admin/users', element.id, 'stats']">
                      <mat-icon>assessment</mat-icon>
                      <span>View Stats</span>
                    </button>
                    <button mat-menu-item (click)="toggleLockUser(element)">
                      <mat-icon>{{ element.status === 'active' ? 'lock' : 'lock_open' }}</mat-icon>
                      <span>{{ element.status === 'active' ? 'Lock' : 'Unlock' }}</span>
                    </button>
                    <button mat-menu-item color="warn" (click)="deleteUser(element.id)">
                      <mat-icon>delete</mat-icon>
                      <span>Delete</span>
                    </button>
                  </mat-menu>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;" class="data-row"></tr>
            </table>
          </mat-card>
        } @else {
          <mat-card class="empty-state">
            <mat-icon>people</mat-icon>
            <h2>No Users Found</h2>
            <p>Create a new user account to get started.</p>
            <button mat-raised-button color="primary" routerLink="/auth/register">
              <mat-icon>person_add</mat-icon>
              Create New User
            </button>
          </mat-card>
        }
      }
    </div>
  `,
  styles: [`
    .users-container {
      max-width: 1200px;
      margin: 0 auto;
    }

    .header {
      margin-bottom: 2rem;

      h1 {
        margin: 0 0 0.5rem 0;
        font-size: 1.75rem;
      }

      p {
        margin: 0;
        color: #666;
      }
    }

    .actions {
      display: flex;
      gap: 1rem;
      margin-bottom: 2rem;
      flex-wrap: wrap;

      mat-form-field {
        min-width: 300px;
      }
    }

    .loading {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 400px;
    }

    .table-card {
      overflow: auto;
    }

    .users-table {
      width: 100%;
    }

    .data-row:hover {
      background-color: #f5f5f5;
    }

    .status {
      padding: 0.5rem 1rem;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 500;

      &.active {
        background-color: #e8f5e9;
        color: #2e7d32;
      }

      &.inactive {
        background-color: #ffebee;
        color: #c62828;
      }
    }

    .empty-state {
      text-align: center;
      padding: 4rem 2rem;

      mat-icon {
        font-size: 3rem;
        width: 3rem;
        height: 3rem;
        color: #ccc;
        margin-bottom: 1rem;
      }

      h2 {
        margin: 0 0 0.5rem 0;
        color: #666;
      }

      p {
        margin: 0 0 2rem 0;
        color: #999;
      }
    }

    @media (max-width: 1000px) {
      .users-table {
        font-size: 0.875rem;
      }

      .actions {
        flex-direction: column;

        mat-form-field {
          width: 100%;
          min-width: unset;
        }
      }
    }
  `]
})
export class UsersComponent implements OnInit {
  private adminService = inject(AdminService);
  private toastService = inject(ToastService);

  users: FrontDeskUser[] = [];
  filteredUsers: FrontDeskUser[] = [];
  displayedColumns = ['name', 'email', 'contact', 'status', 'lastLogin', 'actions'];

  isLoading = true;
  searchTerm = '';

  ngOnInit(): void {
    this.loadUsers();
  }

  private loadUsers(): void {
    this.adminService.getFrontDeskUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.filteredUsers = data;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.toastService.error('Failed to load users');
      }
    });
  }

  onSearchChange(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredUsers = this.users.filter(
      (u) =>
        u.firstName.toLowerCase().includes(term) ||
        u.lastName.toLowerCase().includes(term) ||
        u.email.toLowerCase().includes(term)
    );
  }

  toggleLockUser(user: FrontDeskUser): void {
    const action = user.status === 'active' ? 'lock' : 'unlock';
    if (user.status === 'active') {
      this.adminService.lockUser(user.id).subscribe({
        next: () => {
          this.toastService.success(`User locked successfully`);
          this.loadUsers();
        },
        error: () => {
          this.toastService.error(`Failed to lock user`);
        }
      });
    } else {
      this.adminService.unlockUser(user.id).subscribe({
        next: () => {
          this.toastService.success(`User unlocked successfully`);
          this.loadUsers();
        },
        error: () => {
          this.toastService.error(`Failed to unlock user`);
        }
      });
    }
  }

  deleteUser(id: string): void {
    if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      this.adminService.deleteUser(id).subscribe({
        next: () => {
          this.toastService.success('User deleted successfully');
          this.loadUsers();
        },
        error: () => {
          this.toastService.error('Failed to delete user');
        }
      });
    }
  }
}
