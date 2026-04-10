import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { ReservationService } from '@core/services/reservation.service';
import { ToastService } from '@shared/services/toast.service';
import { Reservation } from '@core/models';

@Component({
  selector: 'app-reservation-details',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTabsModule
  ],
  template: `
    <div class="details-container">
      <div class="header">
        <button mat-icon-button routerLink="/reservations/my-bookings">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <h1>Reservation Details</h1>
      </div>

      @if (isLoading) {
        <div class="loading">
          <mat-spinner></mat-spinner>
        </div>
      } @else if (reservation) {
        <mat-tab-group>
          <!-- Guest Information Tab -->
          <mat-tab label="Guest Information">
            <mat-card class="detail-card">
              <mat-card-header>
                <mat-card-title>Guest Details</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <div class="info-grid">
                  <div class="info-item">
                    <strong>Reservation Number:</strong>
                    <span>{{ reservation.reservationNumber }}</span>
                  </div>
                  <div class="info-item">
                    <strong>Status:</strong>
                    <span class="status" [ngClass]="reservation.status">
                      {{ reservation.status | uppercase }}
                    </span>
                  </div>
                  <div class="info-item">
                    <strong>First Name:</strong>
                    <span>{{ reservation.guest.firstName }}</span>
                  </div>
                  <div class="info-item">
                    <strong>Last Name:</strong>
                    <span>{{ reservation.guest.lastName }}</span>
                  </div>
                  <div class="info-item">
                    <strong>Middle Name:</strong>
                    <span>{{ reservation.guest.middleName || 'N/A' }}</span>
                  </div>
                  <div class="info-item">
                    <strong>Email:</strong>
                    <span>{{ reservation.guest.email }}</span>
                  </div>
                  <div class="info-item">
                    <strong>Phone:</strong>
                    <span>{{ reservation.guest.phone }}</span>
                  </div>
                  <div class="info-item">
                    <strong>Country:</strong>
                    <span>{{ reservation.guest.country }}</span>
                  </div>
                  <div class="info-item">
                    <strong>ID Type:</strong>
                    <span>{{ reservation.guest.idType || 'Not provided' }}</span>
                  </div>
                  <div class="info-item">
                    <strong>ID Number:</strong>
                    <span>{{ reservation.guest.idNumber || 'Not provided' }}</span>
                  </div>
                </div>
              </mat-card-content>
            </mat-card>
          </mat-tab>

          <!-- Reservation Details Tab -->
          <mat-tab label="Reservation Details">
            <mat-card class="detail-card">
              <mat-card-header>
                <mat-card-title>Dates and Rooms</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <div class="info-grid">
                  <div class="info-item">
                    <strong>Check-in Date:</strong>
                    <span>{{ reservation.checkInDate | date: 'MMM dd, yyyy' }}</span>
                  </div>
                  <div class="info-item">
                    <strong>Check-out Date:</strong>
                    <span>{{ reservation.checkOutDate | date: 'MMM dd, yyyy' }}</span>
                  </div>
                  <div class="info-item">
                    <strong>Vehicle Plate:</strong>
                    <span>{{ reservation.vehiclePlateNumber || 'Not provided' }}</span>
                  </div>
                </div>

                <h3 style="margin-top: 2rem;">Rooms</h3>
                <div class="rooms-grid">
                  @for (room of reservation.rooms; let i = $index; track $index) {
                    <mat-card class="room-card">
                      <mat-card-content>
                        <h4>Room {{ i + 1 }}</h4>
                        <div class="room-info">
                          <div><strong>Type:</strong> {{ room.roomType | titlecase }}</div>
                          <div><strong>Number:</strong> {{ room.roomNumber }}</div>
                          <div><strong>Check-in Time:</strong> {{ room.checkInTime || '14:00' }}</div>
                          <div><strong>Check-out Time:</strong> {{ room.checkOutTime || '11:00' }}</div>
                        </div>
                      </mat-card-content>
                    </mat-card>
                  }
                </div>
              </mat-card-content>
            </mat-card>
          </mat-tab>

          <!-- Accompanying Guests Tab -->
          <mat-tab label="Accompanying Guests">
            <mat-card class="detail-card">
              <mat-card-header>
                <mat-card-title>Additional Guests</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                @if (reservation.accompanyingGuests && reservation.accompanyingGuests.length > 0) {
                  <div class="guests-grid">
                    @for (guest of reservation.accompanyingGuests; let i = $index; track $index) {
                      <mat-card class="guest-card">
                        <mat-card-content>
                          <h4>Guest {{ i + 1 }}</h4>
                          <div class="guest-info">
                            <div><strong>Name:</strong> {{ guest.firstName }} {{ guest.lastName }}</div>
                            <div><strong>ID Presented:</strong> {{ guest.validIdPresented ? 'Yes' : 'No' }}</div>
                            @if (guest.validIdPresented) {
                              <div><strong>ID Type:</strong> {{ guest.idType }}</div>
                              <div><strong>ID Number:</strong> {{ guest.idNumber }}</div>
                            }
                          </div>
                        </mat-card-content>
                      </mat-card>
                    }
                  </div>
                } @else {
                  <p>No accompanying guests</p>
                }
              </mat-card-content>
            </mat-card>
          </mat-tab>

          <!-- Policies Tab -->
          <mat-tab label="Policies">
            <mat-card class="detail-card">
              <mat-card-header>
                <mat-card-title>Policy Acknowledgments</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <div class="policies-grid">
                  <div class="policy-item" [class.acknowledged]="reservation.policies.makeUpRoom">
                    <mat-icon>{{ reservation.policies.makeUpRoom ? 'check_circle' : 'cancel' }}</mat-icon>
                    Make-up Room Available
                  </div>
                  <div class="policy-item" [class.acknowledged]="reservation.policies.housekeepingStaff">
                    <mat-icon>{{ reservation.policies.housekeepingStaff ? 'check_circle' : 'cancel' }}</mat-icon>
                    Housekeeping Staff
                  </div>
                  <div class="policy-item" [class.acknowledged]="reservation.policies.smoking">
                    <mat-icon>{{ reservation.policies.smoking ? 'check_circle' : 'cancel' }}</mat-icon>
                    Smoking Policy
                  </div>
                  <div class="policy-item" [class.acknowledged]="reservation.policies.corkage">
                    <mat-icon>{{ reservation.policies.corkage ? 'check_circle' : 'cancel' }}</mat-icon>
                    Corkage Policy
                  </div>
                  <div class="policy-item" [class.acknowledged]="reservation.policies.noPets">
                    <mat-icon>{{ reservation.policies.noPets ? 'check_circle' : 'cancel' }}</mat-icon>
                    No Pets Policy
                  </div>
                  <div class="policy-item" [class.acknowledged]="reservation.policies.damageDeductible">
                    <mat-icon>{{ reservation.policies.damageDeductible ? 'check_circle' : 'cancel' }}</mat-icon>
                    Damage Deductible
                  </div>
                  <div class="policy-item" [class.acknowledged]="reservation.policies.minorsCare">
                    <mat-icon>{{ reservation.policies.minorsCare ? 'check_circle' : 'cancel' }}</mat-icon>
                    Minors Care Policy
                  </div>
                  <div class="policy-item" [class.acknowledged]="reservation.policies.digitalSafe">
                    <mat-icon>{{ reservation.policies.digitalSafe ? 'check_circle' : 'cancel' }}</mat-icon>
                    Digital Safe
                  </div>
                  <div class="policy-item" [class.acknowledged]="reservation.policies.dataPrivacy">
                    <mat-icon>{{ reservation.policies.dataPrivacy ? 'check_circle' : 'cancel' }}</mat-icon>
                    Data Privacy Policy
                  </div>
                </div>

                <div style="margin-top: 2rem;">
                  <strong>Guest Signature:</strong>
                  <p>{{ reservation.policies.guestSignature }}</p>
                </div>
              </mat-card-content>
            </mat-card>
          </mat-tab>
        </mat-tab-group>

        <div class="actions">
          <button mat-raised-button color="primary">
            <mat-icon>print</mat-icon>
            Print Confirmation
          </button>
          <button mat-stroked-button>
            <mat-icon>download</mat-icon>
            Download PDF
          </button>
          <button mat-stroked-button routerLink="/reservations/my-bookings">
            <mat-icon>arrow_back</mat-icon>
            Back to List
          </button>
        </div>
      } @else {
        <p>Reservation not found</p>
      }
    </div>
  `,
  styles: [`
    .details-container {
      max-width: 1000px;
      margin: 0 auto;
    }

    .header {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 2rem;

      h1 {
        margin: 0;
        font-size: 1.75rem;
      }
    }

    .loading {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 400px;
    }

    .detail-card {
      margin-bottom: 2rem;
    }

    .info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1.5rem;
    }

    .info-item {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;

      strong {
        color: #666;
        font-weight: 600;
      }

      .status {
        display: inline-block;
        padding: 0.5rem 1rem;
        border-radius: 20px;
        font-size: 0.75rem;
        font-weight: 500;
        width: fit-content;

        &.completed {
          background-color: #e8f5e9;
          color: #2e7d32;
        }

        &.ongoing {
          background-color: #fff3e0;
          color: #f57c00;
        }

        &.upcoming {
          background-color: #e3f2fd;
          color: #1976d2;
        }
      }
    }

    h3 {
      font-size: 1.1rem;
      margin: 1.5rem 0 1rem 0;
    }

    .rooms-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1rem;
    }

    .room-card {
      background-color: #f5f5f5;

      h4 {
        margin: 0 0 1rem 0;
        color: #667eea;
      }

      .room-info {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;

        div {
          font-size: 0.9rem;
          display: flex;
          justify-content: space-between;
        }
      }
    }

    .guests-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1rem;
    }

    .guest-card {
      background-color: #f5f5f5;

      h4 {
        margin: 0 0 1rem 0;
        color: #667eea;
      }

      .guest-info {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;

        div {
          font-size: 0.9rem;
          display: flex;
          justify-content: space-between;
        }
      }
    }

    .policies-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
    }

    .policy-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      background-color: #ffebee;
      border-radius: 4px;
      color: #c62828;

      mat-icon {
        flex-shrink: 0;
      }

      &.acknowledged {
        background-color: #e8f5e9;
        color: #2e7d32;
      }
    }

    .actions {
      display: flex;
      gap: 1rem;
      margin-top: 2rem;
      flex-wrap: wrap;
    }

    @media (max-width: 600px) {
      .info-grid {
        grid-template-columns: 1fr;
      }

      .rooms-grid,
      .guests-grid {
        grid-template-columns: 1fr;
      }

      .policies-grid {
        grid-template-columns: 1fr;
      }

      .actions {
        flex-direction: column;

        button {
          width: 100%;
        }
      }
    }
  `]
})
export class ReservationDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private reservationService = inject(ReservationService);
  private toastService = inject(ToastService);

  reservation: Reservation | null = null;
  isLoading = true;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadReservation(id);
    }
  }

  private loadReservation(id: string): void {
    this.reservationService.getReservationById(id).subscribe({
      next: (data) => {
        this.reservation = data;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.toastService.error('Failed to load reservation');
      }
    });
  }
}
