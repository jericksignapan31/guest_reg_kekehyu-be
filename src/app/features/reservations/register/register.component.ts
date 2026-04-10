import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { ReservationService } from '@core/services/reservation.service';
import { ToastService } from '@shared/services/toast.service';
import { RegisterReservationRequest } from '@core/models';

@Component({
  selector: 'app-register-reservation',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatIconModule
  ],
  template: `
    <div class="register-container">
      <h1>Guest Registration</h1>
      <p class="subtitle">Register a new guest and assign rooms</p>

      <mat-stepper #stepper [linear]="true">
        <!-- Step 1: Guest Information -->
        <mat-step [stepControl]="guestForm">
          <ng-template matStepLabel>Guest Information</ng-template>
          
          <form [formGroup]="guestForm" class="form-section">
            <h3>Personal Details</h3>
            
            <div class="form-row">
              <mat-form-field>
                <mat-label>First Name *</mat-label>
                <input matInput formControlName="firstName" required />
              </mat-form-field>
              <mat-form-field>
                <mat-label>Last Name *</mat-label>
                <input matInput formControlName="lastName" required />
              </mat-form-field>
            </div>

            <mat-form-field class="full-width">
              <mat-label>Middle Name (Optional)</mat-label>
              <input matInput formControlName="middleName" />
            </mat-form-field>

            <div class="form-row">
              <mat-form-field>
                <mat-label>Email *</mat-label>
                <input matInput type="email" formControlName="email" required />
              </mat-form-field>
              <mat-form-field>
                <mat-label>Phone *</mat-label>
                <input matInput formControlName="phone" required />
              </mat-form-field>
            </div>

            <div class="form-row">
              <mat-form-field>
                <mat-label>Country *</mat-label>
                <mat-select formControlName="country" required>
                  <mat-option value="PH">Philippines</mat-option>
                  <mat-option value="US">United States</mat-option>
                  <mat-option value="JP">Japan</mat-option>
                  <mat-option value="KR">South Korea</mat-option>
                  <mat-option value="CN">China</mat-option>
                  <mat-option value="TH">Thailand</mat-option>
                  <mat-option value="SG">Singapore</mat-option>
                  <mat-option value="MY">Malaysia</mat-option>
                  <mat-option value="VN">Vietnam</mat-option>
                  <mat-option value="ID">Indonesia</mat-option>
                </mat-select>
              </mat-form-field>
              <mat-form-field>
                <mat-label>ID Type (Optional)</mat-label>
                <mat-select formControlName="idType">
                  <mat-option value="">None</mat-option>
                  <mat-option value="passport">Passport</mat-option>
                  <mat-option value="driver_license">Driver's License</mat-option>
                  <mat-option value="national_id">National ID</mat-option>
                  <mat-option value="other">Other</mat-option>
                </mat-select>
              </mat-form-field>
            </div>

            <mat-form-field class="full-width">
              <mat-label>ID Number (Optional)</mat-label>
              <input matInput formControlName="idNumber" />
            </mat-form-field>

            <div class="step-actions">
              <button mat-raised-button color="primary" matStepperNext>Next</button>
            </div>
          </form>
        </mat-step>

        <!-- Step 2: Reservation Details -->
        <mat-step [stepControl]="reservationForm">
          <ng-template matStepLabel>Reservation Details</ng-template>
          
          <form [formGroup]="reservationForm" class="form-section">
            <h3>Dates and Rooms</h3>

            <div class="form-row">
              <mat-form-field>
                <mat-label>Check-in Date *</mat-label>
                <input matInput [matDatepicker]="checkInPicker" formControlName="checkInDate" required />
                <mat-datepicker-toggle matIconSuffix [for]="checkInPicker"></mat-datepicker-toggle>
                <mat-datepicker #checkInPicker></mat-datepicker>
              </mat-form-field>
              <mat-form-field>
                <mat-label>Check-out Date *</mat-label>
                <input matInput [matDatepicker]="checkOutPicker" formControlName="checkOutDate" required />
                <mat-datepicker-toggle matIconSuffix [for]="checkOutPicker"></mat-datepicker-toggle>
                <mat-datepicker #checkOutPicker></mat-datepicker>
              </mat-form-field>
            </div>

            <mat-form-field class="full-width">
              <mat-label>Vehicle Plate Number (Optional)</mat-label>
              <input matInput formControlName="vehiclePlateNumber" />
            </mat-form-field>

            <h3 style="margin-top: 2rem;">Rooms</h3>
            <div formArrayName="rooms">
              @for (room of getRoomsArray.controls; let i = $index; track $index) {
                <div [formGroupName]="i" class="room-block">
                  <h4>Room {{ i + 1 }}</h4>
                  
                  <div class="form-row">
                    <mat-form-field>
                      <mat-label>Room Type *</mat-label>
                      <mat-select formControlName="roomType" required>
                        <mat-option value="single">Single</mat-option>
                        <mat-option value="double">Double</mat-option>
                        <mat-option value="suite">Suite</mat-option>
                        <mat-option value="deluxe">Deluxe</mat-option>
                      </mat-select>
                    </mat-form-field>
                    <mat-form-field>
                      <mat-label>Room Number *</mat-label>
                      <input matInput formControlName="roomNumber" required />
                    </mat-form-field>
                  </div>

                  <div class="form-row">
                    <mat-form-field>
                      <mat-label>Check-in Time</mat-label>
                      <input matInput type="time" formControlName="checkInTime" />
                    </mat-form-field>
                    <mat-form-field>
                      <mat-label>Check-out Time</mat-label>
                      <input matInput type="time" formControlName="checkOutTime" />
                    </mat-form-field>
                  </div>

                  @if (getRoomsArray.length > 1) {
                    <button mat-stroked-button color="warn" (click)="removeRoom(i)">
                      <mat-icon>delete</mat-icon>
                      Remove Room
                    </button>
                  }
                </div>
              }
            </div>

            <button mat-stroked-button (click)="addRoom()" type="button">
              <mat-icon>add</mat-icon>
              Add Another Room
            </button>

            <div class="step-actions">
              <button mat-stroked-button matStepperPrevious>Back</button>
              <button mat-raised-button color="primary" matStepperNext>Next</button>
            </div>
          </form>
        </mat-step>

        <!-- Step 3: Accompanying Guests -->
        <mat-step>
          <ng-template matStepLabel>Accompanying Guests</ng-template>
          
          <form [formGroup]="accompanyingForm" class="form-section">
            <h3>Additional Guests (Optional)</h3>

            <div formArrayName="accompanyingGuests">
              @for (guest of getAccompanyingGuestsArray.controls; let i = $index; track $index) {
                <div [formGroupName]="i" class="guest-block">
                  <h4>Guest {{ i + 1 }}</h4>

                  <div class="form-row">
                    <mat-form-field>
                      <mat-label>First Name *</mat-label>
                      <input matInput formControlName="firstName" required />
                    </mat-form-field>
                    <mat-form-field>
                      <mat-label>Last Name *</mat-label>
                      <input matInput formControlName="lastName" required />
                    </mat-form-field>
                  </div>

                  <mat-form-field class="full-width">
                    <mat-label>Middle Name (Optional)</mat-label>
                    <input matInput formControlName="middleName" />
                  </mat-form-field>

                  <mat-checkbox formControlName="validIdPresented">
                    Valid ID Presented
                  </mat-checkbox>

                  @if (getAccompanyingGuestsArray.at(i).get('validIdPresented')!.value) {
                    <div style="margin-top: 1rem;">
                      <div class="form-row">
                        <mat-form-field>
                          <mat-label>ID Type *</mat-label>
                          <mat-select formControlName="idType" required>
                            <mat-option value="passport">Passport</mat-option>
                            <mat-option value="driver_license">Driver's License</mat-option>
                            <mat-option value="national_id">National ID</mat-option>
                          </mat-select>
                        </mat-form-field>
                        <mat-form-field>
                          <mat-label>ID Number *</mat-label>
                          <input matInput formControlName="idNumber" required />
                        </mat-form-field>
                      </div>
                    </div>
                  }

                  @if (getAccompanyingGuestsArray.length > 1) {
                    <button mat-stroked-button color="warn" (click)="removeAccompanyingGuest(i)">
                      <mat-icon>delete</mat-icon>
                      Remove Guest
                    </button>
                  }
                </div>
              }
            </div>

            <button mat-stroked-button (click)="addAccompanyingGuest()" type="button">
              <mat-icon>add</mat-icon>
              Add Another Guest
            </button>

            <div class="step-actions">
              <button mat-stroked-button matStepperPrevious>Back</button>
              <button mat-raised-button color="primary" matStepperNext>Next</button>
            </div>
          </form>
        </mat-step>

        <!-- Step 4: Policies -->
        <mat-step [stepControl]="policiesForm">
          <ng-template matStepLabel>Policies & Confirmation</ng-template>
          
          <form [formGroup]="policiesForm" class="form-section">
            <h3>Hotel Policies Acknowledgment</h3>
            <p class="policy-notice">All guests must acknowledge the following policies:</p>

            <div class="policies-grid">
              <mat-checkbox formControlName="makeUpRoom">
                Make-up Room Available
              </mat-checkbox>
              <mat-checkbox formControlName="housekeepingStaff">
                Housekeeping Staff Access
              </mat-checkbox>
              <mat-checkbox formControlName="smoking">
                Smoking Policy Acknowledged
              </mat-checkbox>
              <mat-checkbox formControlName="corkage">
                Corkage Policy Acknowledged
              </mat-checkbox>
              <mat-checkbox formControlName="noPets">
                No Pets Policy Acknowledged
              </mat-checkbox>
              <mat-checkbox formControlName="damageDeductible">
                Damage Deductible Policy Acknowledged
              </mat-checkbox>
              <mat-checkbox formControlName="minorsCare">
                Minors Care Policy Acknowledged
              </mat-checkbox>
              <mat-checkbox formControlName="digitalSafe">
                Digital Safe Available
              </mat-checkbox>
              <mat-checkbox formControlName="dataPrivacy">
                Data Privacy Policy Acknowledged
              </mat-checkbox>
            </div>

            <mat-form-field class="full-width">
              <mat-label>Guest Signature (Print Name) *</mat-label>
              <input matInput formControlName="guestSignature" required />
            </mat-form-field>

            <mat-checkbox formControlName="confirmPolicies">
              I acknowledge all policies and consent to the terms and conditions
            </mat-checkbox>

            @if (isLoading) {
              <div class="loading">
                <mat-spinner diameter="30"></mat-spinner>
                <p>Processing registration...</p>
              </div>
            }

            @if (successMessage) {
              <div class="success-message">
                <mat-icon>check_circle</mat-icon>
                {{ successMessage }}
              </div>
            }

            @if (errorMessage) {
              <div class="error-message">
                <mat-icon>error</mat-icon>
                {{ errorMessage }}
              </div>
            }

            <div class="step-actions">
              <button mat-stroked-button matStepperPrevious [disabled]="isLoading">Back</button>
              <button 
                mat-raised-button 
                color="primary" 
                (click)="submitRegistration()"
                [disabled]="policiesForm.invalid || isLoading"
              >
                @if (isLoading) {
                  <mat-spinner diameter="20"></mat-spinner>
                  Processing...
                } @else {
                  Complete Registration
                }
              </button>
            </div>
          </form>
        </mat-step>
      </mat-stepper>
    </div>
  `,
  styles: [`
    .register-container {
      max-width: 800px;
      margin: 0 auto;

      h1 {
        margin: 0 0 0.5rem 0;
        font-size: 1.75rem;
      }

      .subtitle {
        margin: 0 0 2rem 0;
        color: #666;
      }
    }

    .form-section {
      padding: 2rem 0;
    }

    h3 {
      margin: 1.5rem 0 1rem 0;
      font-size: 1.1rem;
    }

    h4 {
      margin: 0 0 1rem 0;
      font-size: 1rem;
      color: #667eea;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .full-width {
      width: 100%;
    }

    mat-form-field {
      width: 100%;
    }

    .room-block,
    .guest-block {
      background: #f5f5f5;
      padding: 1.5rem;
      border-radius: 4px;
      margin-bottom: 1.5rem;
      border-left: 4px solid #667eea;
    }

    .policies-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      margin: 1rem 0;
    }

    .policy-notice {
      color: #666;
      margin-bottom: 1rem;
      font-style: italic;
    }

    .step-actions {
      display: flex;
      gap: 1rem;
      margin-top: 2rem;
      justify-content: flex-end;
    }

    .loading {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
      margin: 2rem 0;
    }

    .success-message,
    .error-message {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      border-radius: 4px;
      margin: 1rem 0;

      mat-icon {
        font-size: 1.5rem;
        width: 1.5rem;
        height: 1.5rem;
      }
    }

    .success-message {
      background-color: #e8f5e9;
      color: #2e7d32;
    }

    .error-message {
      background-color: #ffebee;
      color: #c62828;
    }

    @media (max-width: 600px) {
      .form-row {
        grid-template-columns: 1fr;
      }

      .policies-grid {
        grid-template-columns: 1fr;
      }

      .step-actions {
        flex-direction: column;
      }
    }
  `]
})
export class RegisterReservationComponent implements OnInit {
  private fb = inject(FormBuilder);
  private reservationService = inject(ReservationService);
  private router = inject(Router);
  private toastService = inject(ToastService);

  guestForm!: FormGroup;
  reservationForm!: FormGroup;
  accompanyingForm!: FormGroup;
  policiesForm!: FormGroup;

  isLoading = false;
  errorMessage = '';
  successMessage = '';

  ngOnInit(): void {
    this.initializeForms();
  }

  private initializeForms(): void {
    this.guestForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      middleName: [''],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      country: ['', Validators.required],
      idType: [''],
      idNumber: ['']
    });

    this.reservationForm = this.fb.group({
      checkInDate: ['', Validators.required],
      checkOutDate: ['', Validators.required],
      vehiclePlateNumber: [''],
      rooms: this.fb.array([this.createRoomGroup()])
    });

    this.accompanyingForm = this.fb.group({
      accompanyingGuests: this.fb.array([])
    });

    this.policiesForm = this.fb.group({
      makeUpRoom: [false, Validators.requiredTrue],
      housekeepingStaff: [false, Validators.requiredTrue],
      smoking: [false, Validators.requiredTrue],
      corkage: [false, Validators.requiredTrue],
      noPets: [false, Validators.requiredTrue],
      damageDeductible: [false, Validators.requiredTrue],
      minorsCare: [false, Validators.requiredTrue],
      digitalSafe: [false, Validators.requiredTrue],
      dataPrivacy: [false, Validators.requiredTrue],
      guestSignature: ['', Validators.required],
      confirmPolicies: [false, Validators.requiredTrue]
    });
  }

  private createRoomGroup(): FormGroup {
    return this.fb.group({
      roomType: ['', Validators.required],
      roomNumber: ['', Validators.required],
      checkInTime: ['14:00'],
      checkOutTime: ['11:00']
    });
  }

  private createAccompanyingGuestGroup(): FormGroup {
    return this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      middleName: [''],
      validIdPresented: [false],
      idType: [''],
      idNumber: ['']
    });
  }

  get getRoomsArray(): FormArray {
    return this.reservationForm.get('rooms') as FormArray;
  }

  get getAccompanyingGuestsArray(): FormArray {
    return this.accompanyingForm.get('accompanyingGuests') as FormArray;
  }

  addRoom(): void {
    this.getRoomsArray.push(this.createRoomGroup());
  }

  removeRoom(index: number): void {
    this.getRoomsArray.removeAt(index);
  }

  addAccompanyingGuest(): void {
    this.getAccompanyingGuestsArray.push(this.createAccompanyingGuestGroup());
  }

  removeAccompanyingGuest(index: number): void {
    this.getAccompanyingGuestsArray.removeAt(index);
  }

  submitRegistration(): void {
    if (!this.guestForm.valid || !this.reservationForm.valid || !this.policiesForm.valid) {
      this.toastService.error('Please complete all required fields');
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const request: RegisterReservationRequest = {
      ...this.reservationForm.value,
      guest: this.guestForm.value,
      accompanyingGuests: this.accompanyingForm.value.accompanyingGuests || [],
      policies: this.policiesForm.value
    };

    this.reservationService.registerReservation(request).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.successMessage = `Registration successful! Reservation #${response.reservationNumber}`;
        this.toastService.success(this.successMessage);

        setTimeout(() => {
          this.router.navigate(['/reservations/my-bookings']);
        }, 2000);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Registration failed. Please try again.';
        this.toastService.error(this.errorMessage);
      }
    });
  }
}
