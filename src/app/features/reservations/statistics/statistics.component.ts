import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { ReservationService } from '@core/services/reservation.service';
import { ToastService } from '@shared/services/toast.service';
import { ReservationStats } from '@core/models';

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatGridListModule,
    MatProgressSpinnerModule,
    MatIconModule
  ],
  template: `
    <div class="stats-container">
      <div class="header">
        <h1>Reservation Statistics</h1>
        <p>View your registration performance</p>
      </div>

      @if (isLoading) {
        <div class="loading">
          <mat-spinner></mat-spinner>
        </div>
      } @else {
        <mat-grid-list cols="4" rowHeight="150px" gutterSize="1rem">
          <!-- Today -->
          <mat-grid-tile>
            <mat-card class="stat-card">
              <mat-card-content>
                <div class="stat-content">
                  <mat-icon class="stat-icon">today</mat-icon>
                  <div class="stat-info">
                    <h3>Today's Registrations</h3>
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
                    <h3>Total Registrations</h3>
                    <p class="stat-value">{{ stats.total }}</p>
                  </div>
                </div>
              </mat-card-content>
            </mat-card>
          </mat-grid-tile>
        </mat-grid-list>

        <mat-card class="summary-card">
          <mat-card-header>
            <mat-card-title>Performance Summary</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="summary-grid">
              <div class="summary-item">
                <p>Average per day (this week)</p>
                <span class="summary-value">{{ (stats.week / 7) | number: '1.1-1' }}</span>
              </div>
              <div class="summary-item">
                <p>Average per day (this month)</p>
                <span class="summary-value">{{ (stats.month / 30) | number: '1.1-1' }}</span>
              </div>
              <div class="summary-item">
                <p>Overall average per day</p>
                <span class="summary-value">{{ ((stats.total ?? 0) / 365) | number: '1.1-1' }}</span>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
      }
    </div>
  `,
  styles: [`
    .stats-container {
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

    .loading {
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
        padding: 1.5rem;
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

    .summary-card {
      margin-top: 2rem;
    }

    .summary-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 2rem;
    }

    .summary-item {
      text-align: center;

      p {
        margin: 0 0 1rem 0;
        color: #666;
        font-size: 0.9rem;
      }

      .summary-value {
        display: block;
        font-size: 2rem;
        font-weight: bold;
        color: #667eea;
      }
    }

    @media (max-width: 1024px) {
      mat-grid-list {
        cols: 2 !important;
      }
    }

    @media (max-width: 600px) {
      .header h1 {
        font-size: 1.5rem;
      }

      mat-grid-list {
        cols: 1 !important;
      }

      .summary-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class StatisticsComponent implements OnInit {
  private reservationService = inject(ReservationService);
  private toastService = inject(ToastService);

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
        this.toastService.error('Failed to load statistics');
      }
    });
  }
}
