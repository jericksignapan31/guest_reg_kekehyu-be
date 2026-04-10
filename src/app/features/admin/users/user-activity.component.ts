import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { AdminService } from '@core/services/admin.service';
import { ToastService } from '@shared/services/toast.service';
import { Transaction } from '@core/models';

@Component({
  selector: 'app-user-activity',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTabsModule,
    MatTableModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatButtonModule
  ],
  template: `
    <div class="user-activity-container">
      <div class="header">
        <h1>User Activity & Statistics</h1>
        <p>Track user actions and system interactions</p>
      </div>

      @if (isLoading) {
        <div class="loading-center">
          <mat-spinner></mat-spinner>
        </div>
      } @else {
        <mat-card class="stats-card">
          <mat-card-header>
            <mat-card-title>User Statistics</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="stats-grid">
              <div class="stat-item">
                <div class="stat-value">{{ userStats?.totalLogins | number }}</div>
                <div class="stat-label">Total Logins</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">{{ userStats?.registrationsProcessed | number }}</div>
                <div class="stat-label">Registrations Processed</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">{{ userStats?.reservationsHandled | number }}</div>
                <div class="stat-label">Reservations Handled</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">{{ userStats?.averageResponse | number:'1.1-2' }}s</div>
                <div class="stat-label">Avg Response Time</div>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="activity-card">
          <mat-card-header>
            <mat-card-title>Activity Log</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            @if (transactions && transactions.length > 0) {
              <table mat-table [dataSource]="transactions" class="activity-table">
                <!-- Action -->
                <ng-container matColumnDef="action">
                  <th mat-header-cell *matHeaderCellDef>Action</th>
                  <td mat-cell *matCellDef="let element">
                    <span class="action-badge" [ngClass]="getActionClass(element.type)">
                      <mat-icon>{{ getActionIcon(element.type) }}</mat-icon>
                      {{ element.type | titlecase }}
                    </span>
                  </td>
                </ng-container>

                <!-- Description -->
                <ng-container matColumnDef="description">
                  <th mat-header-cell *matHeaderCellDef>Description</th>
                  <td mat-cell *matCellDef="let element">
                    {{ element.description }}
                  </td>
                </ng-container>

                <!-- Amount/Value -->
                <ng-container matColumnDef="amount">
                  <th mat-header-cell *matHeaderCellDef>Amount</th>
                  <td mat-cell *matCellDef="let element">
                    @if (element.amount) {
                      <span class="amount">{{ element.amount | currency }}</span>
                    } @else {
                      <span class="amount-none">-</span>
                    }
                  </td>
                </ng-container>

                <!-- Status -->
                <ng-container matColumnDef="status">
                  <th mat-header-cell *matHeaderCellDef>Status</th>
                  <td mat-cell *matCellDef="let element">
                    <span class="status-badge" [ngClass]="element.status">
                      {{ element.status | titlecase }}
                    </span>
                  </td>
                </ng-container>

                <!-- Timestamp -->
                <ng-container matColumnDef="timestamp">
                  <th mat-header-cell *matHeaderCellDef>Date & Time</th>
                  <td mat-cell *matCellDef="let element">
                    {{ element.createdAt | date: 'short' }}
                  </td>
                </ng-container>

                <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
                <tr mat-row *matRowDef="let row; columns: displayedColumns;" class="activity-row"></tr>
              </table>
            } @else {
              <div class="empty-state">
                <mat-icon>inbox</mat-icon>
                <p>No activity records found</p>
              </div>
            }
          </mat-card-content>
        </mat-card>
      }
    </div>
  `,
  styles: [`
    .user-activity-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem 1rem;
    }

    .header {
      margin-bottom: 2rem;

      h1 {
        margin: 0 0 0.5rem 0;
        font-size: 1.75rem;
        color: #333;
      }

      p {
        margin: 0;
        color: #666;
      }
    }

    .loading-center {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 400px;
    }

    .stats-card {
      margin-bottom: 2rem;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 2rem;
      padding: 1rem 0;
    }

    .stat-item {
      text-align: center;
      padding: 1.5rem;
      background-color: #f8f9fa;
      border-radius: 8px;
      border-left: 4px solid #667eea;
    }

    .stat-value {
      font-size: 2rem;
      font-weight: 700;
      color: #667eea;
      margin-bottom: 0.5rem;
    }

    .stat-label {
      font-size: 0.875rem;
      color: #666;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .activity-card {
      overflow: auto;
    }

    .activity-table {
      width: 100%;
    }

    .activity-row {
      border-bottom: 1px solid #eee;
    }

    .activity-row:hover {
      background-color: #f8f9fa;
    }

    .action-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.35rem 0.75rem;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 600;
      
      mat-icon {
        font-size: 1rem;
        width: 1rem;
        height: 1rem;
      }

      &.registration {
        background-color: #e8f5e9;
        color: #2e7d32;
      }

      &.checkin {
        background-color: #e3f2fd;
        color: #1565c0;
      }

      &.checkout {
        background-color: #fff3e0;
        color: #e65100;
      }

      &.payment {
        background-color: #f3e5f5;
        color: #6a1b9a;
      }

      &.other {
        background-color: #eceff1;
        color: #455a64;
      }
    }

    .amount {
      font-weight: 600;
      color: #2e7d32;
    }

    .amount-none {
      color: #999;
      font-style: italic;
    }

    .status-badge {
      display: inline-block;
      padding: 0.35rem 0.75rem;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 600;

      &.completed {
        background-color: #e8f5e9;
        color: #2e7d32;
      }

      &.pending {
        background-color: #fff3e0;
        color: #e65100;
      }

      &.failed {
        background-color: #ffebee;
        color: #c62828;
      }
    }

    .empty-state {
      text-align: center;
      padding: 3rem 1rem;
      color: #999;

      mat-icon {
        font-size: 3rem;
        width: 3rem;
        height: 3rem;
        margin-bottom: 1rem;
        color: #ccc;
      }

      p {
        margin: 0;
      }
    }

    @media (max-width: 768px) {
      .stats-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 1rem;
      }

      .activity-table {
        font-size: 0.875rem;
      }
    }
  `]
})
export class UserActivityComponent implements OnInit {
  private adminService = inject(AdminService);
  private toastService = inject(ToastService);
  private route = inject(ActivatedRoute);

  isLoading = true;
  userId: string = '';
  userStats: any = null;
  transactions: Transaction[] = [];
  displayedColumns = ['action', 'description', 'amount', 'status', 'timestamp'];

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('userId') || '';
    this.loadData();
  }

  private loadData(): void {
    this.adminService.getUserStatistics(this.userId).subscribe({
      next: (stats) => {
        this.userStats = stats;
        this.loadTransactions();
      },
      error: () => {
        this.isLoading = false;
        this.toastService.error('Failed to load user statistics');
      }
    });
  }

  private loadTransactions(): void {
    this.adminService.getTransactionsByUser(this.userId).subscribe({
      next: (data) => {
        this.transactions = data.sort((a, b) => 
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.toastService.error('Failed to load activity log');
      }
    });
  }

  getActionIcon(type: string): string {
    const iconMap: { [key: string]: string } = {
      'registration': 'person_add',
      'checkin': 'login',
      'checkout': 'logout',
      'payment': 'payments',
      'update': 'edit',
      'other': 'info'
    };
    return iconMap[type.toLowerCase()] || 'info';
  }

  getActionClass(type: string): string {
    const classMap: { [key: string]: string } = {
      'registration': 'registration',
      'checkin': 'checkin',
      'checkout': 'checkout',
      'payment': 'payment'
    };
    return classMap[type.toLowerCase()] || 'other';
  }
}
