import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterModule } from '@angular/router';
import { ReservationService } from '@core/services/reservation.service';
import { AuthService } from '@core/services/auth.service';
import { ReservationStats } from '@core/models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatGridListModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    RouterModule
  ],
  template: `
    <div class="dashboard-container">
      <div class="welcome-section">
        <h1>Welcome to Dashboard</h1>
        <p>Manage your guest registrations efficiently</p>
      </div>

      @if (isLoading) {
        <div class="loading-spinner">
          <mat-spinner></mat-spinner>
        </div>
      } @else {
        <mat-grid-list cols="4" rowHeight="150px" gutterSize="1rem">
          <!-- Today's Check-ins -->
          <mat-grid-tile>
            <mat-card class="stat-card">
              <mat-card-content>
                <div class="stat-content">
                  <mat-icon class="stat-icon">login</mat-icon>
                  <div class="stat-info">
                    <h3>Today's Check-ins</h3>
                    <p class="stat-value">{{ stats.today }}</p>
                  </div>
                </div>
              </mat-card-content>
            </mat-card>
          </mat-grid-tile>

          <!-- This Week -->
          <mat-grid-tile>
            <mat-card class="stat-card">
              <mat-card-content>
                <div class="stat-content">
                  <mat-icon class="stat-icon">calendar_today</mat-icon>
                  <div class="stat-info">
                    <h3>This Week</h3>
                    <p class="stat-value">{{ stats.week }}</p>
                  </div>
                </div>
              </mat-card-content>
            </mat-card>
          </mat-grid-tile>

          <!-- This Month -->
          <mat-grid-tile>
            <mat-card class="stat-card">
              <mat-card-content>
                <div class="stat-content">
                  <mat-icon class="stat-icon">date_range</mat-icon>
                  <div class="stat-info">
                    <h3>This Month</h3>
                    <p class="stat-value">{{ stats.month }}</p>
                  </div>
                </div>
              </mat-card-content>
            </mat-card>
          </mat-grid-tile>

          <!-- Total -->
          <mat-grid-tile>
            <mat-card class="stat-card">
              <mat-card-content>
                <div class="stat-content">
                  <mat-icon class="stat-icon">assessment</mat-icon>
                  <div class="stat-info">
                    <h3>Total</h3>
                    <p class="stat-value">{{ stats.total }}</p>
                  </div>
                </div>
              </mat-card-content>
            </mat-card>
          </mat-grid-tile>
        </mat-grid-list>

        <div class="quick-actions">
          <h2>Quick Actions</h2>
          <div class="action-buttons">
            <button mat-raised-button color="primary" routerLink="/reservations/register">
              <mat-icon>person_add</mat-icon>
              New Guest Registration
            </button>
            <button mat-raised-button color="accent" routerLink="/reservations/my-bookings">
              <mat-icon>event_note</mat-icon>
              View My Bookings
            </button>
            <button mat-stroked-button routerLink="/reservations/statistics">
              <mat-icon>bar_chart</mat-icon>
              View Statistics
            </button>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .dashboard-container {
      max-width: 1400px;
      margin: 0 auto;
    }

    .welcome-section {
      margin-bottom: 2rem;

      h1 {
        margin: 0;
        font-size: 2rem;
        color: #333;
      }

      p {
        margin: 0.5rem 0 0 0;
        color: #666;
      }
    }

    .loading-spinner {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 400px;
    }

    mat-grid-list {
      margin-bottom: 2rem;
    }

    .stat-card {
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border-radius: 8px;

      mat-card-content {
        padding: 1rem;
      }
    }

    .stat-content {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .stat-icon {
      font-size: 2.5rem;
      width: 2.5rem;
      height: 2.5rem;
    }

    .stat-info {
      h3 {
        margin: 0;
        font-size: 0.875rem;
        font-weight: 500;
        opacity: 0.9;
      }

      .stat-value {
        margin: 0.5rem 0 0 0;
        font-size: 1.75rem;
        font-weight: bold;
      }
    }

    .quick-actions {
      margin-top: 2rem;

      h2 {
        margin: 0 0 1rem 0;
        font-size: 1.25rem;
      }
    }

    .action-buttons {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;

      button {
        padding: 1rem;
        font-size: 1rem;

        mat-icon {
          margin-right: 0.5rem;
        }
      }
    }

    @media (max-width: 1024px) {
      mat-grid-list {
        cols: 2 !important;
      }
    }

    @media (max-width: 600px) {
      .welcome-section h1 {
        font-size: 1.5rem;
      }

      mat-grid-list {
        cols: 1 !important;
      }

      .action-buttons {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  private reservationService = inject(ReservationService);
  private authService = inject(AuthService);

  isLoading = true;
  stats: ReservationStats = {
    today: 0,
    week: 0,
    month: 0,
    total: 0
  };

  ngOnInit(): void {
    this.loadStats();
  }

  private loadStats(): void {
    this.reservationService.getStats().subscribe({
      next: (data) => {
        this.stats = data;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        // Show toast error
      }
    });
  }
}
