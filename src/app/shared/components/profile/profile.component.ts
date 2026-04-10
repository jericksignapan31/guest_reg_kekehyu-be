import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { AuthService } from '@core/services/auth.service';
import { ToastService } from '@shared/services/toast.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatTabsModule,
    MatIconModule,
    MatListModule
  ],
  template: `
    <div class="profile-container">
      <div class="header">
        <h1>User Profile</h1>
        <p>Manage your account settings and password</p>
      </div>

      <mat-tab-group>
        <!-- Profile Information Tab -->
        <mat-tab label="Profile Information">
          <mat-card class="profile-card">
            <mat-card-header>
              <mat-card-title>Profile Details</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <form [formGroup]="profileForm" (ngSubmit)="updateProfile()">
                <div class="form-row">
                  <mat-form-field>
                    <mat-label>First Name</mat-label>
                    <input matInput formControlName="firstName" />
                  </mat-form-field>
                  <mat-form-field>
                    <mat-label>Last Name</mat-label>
                    <input matInput formControlName="lastName" />
                  </mat-form-field>
                </div>

                <mat-form-field class="full-width">
                  <mat-label>Email</mat-label>
                  <input matInput type="email" formControlName="email" [disabled]="true" />
                </mat-form-field>

                <mat-form-field class="full-width">
                  <mat-label>Contact Number</mat-label>
                  <input matInput formControlName="contactNumber" />
                </mat-form-field>

                @if (isUpdating) {
                  <div class="loading">
                    <mat-spinner diameter="30"></mat-spinner>
                    <p>Updating...</p>
                  </div>
                }

                @if (updateSuccess) {
                  <div class="success-message">
                    <mat-icon>check_circle</mat-icon>
                    Profile updated successfully
                  </div>
                }

                @if (updateError) {
                  <div class="error-message">
                    <mat-icon>error</mat-icon>
                    {{ updateError }}
                  </div>
                }

                <div class="actions">
                  <button mat-raised-button color="primary" type="submit" [disabled]="isUpdating">
                    Save Changes
                  </button>
                  <button mat-stroked-button type="button" (click)="resetProfileForm()">
                    Cancel
                  </button>
                </div>
              </form>
            </mat-card-content>
          </mat-card>
        </mat-tab>

        <!-- Change Password Tab -->
        <mat-tab label="Change Password">
          <mat-card class="profile-card">
            <mat-card-header>
              <mat-card-title>Change Your Password</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <form [formGroup]="passwordForm" (ngSubmit)="changePassword()">
                <mat-form-field class="full-width">
                  <mat-label>Current Password</mat-label>
                  <input matInput type="password" formControlName="currentPassword" required />
                  @if (passwordForm.get('currentPassword')?.invalid && passwordForm.get('currentPassword')?.touched) {
                    <mat-error>Current password is required</mat-error>
                  }
                </mat-form-field>

                <mat-form-field class="full-width">
                  <mat-label>New Password</mat-label>
                  <input matInput type="password" formControlName="newPassword" required />
                  @if (passwordForm.get('newPassword')?.invalid && passwordForm.get('newPassword')?.touched) {
                    <mat-error>
                      @if (passwordForm.get('newPassword')?.hasError('required')) {
                        New password is required
                      }
                      @if (passwordForm.get('newPassword')?.hasError('minlength')) {
                        Password must be at least 8 characters
                      }
                    </mat-error>
                  }
                </mat-form-field>

                <mat-form-field class="full-width">
                  <mat-label>Confirm New Password</mat-label>
                  <input matInput type="password" formControlName="confirmPassword" required />
                  @if (passwordForm.get('confirmPassword')?.invalid && passwordForm.get('confirmPassword')?.touched) {
                    <mat-error>Please confirm your password</mat-error>
                  }
                </mat-form-field>

                @if (passwordForm.hasError('passwordMismatch') && passwordForm.get('confirmPassword')?.touched) {
                  <div class="error-message">
                    <mat-icon>error</mat-icon>
                    Passwords do not match
                  </div>
                }

                @if (passwordIsUpdating) {
                  <div class="loading">
                    <mat-spinner diameter="30"></mat-spinner>
                    <p>Updating...</p>
                  </div>
                }

                @if (passwordUpdateSuccess) {
                  <div class="success-message">
                    <mat-icon>check_circle</mat-icon>
                    Password changed successfully
                  </div>
                }

                @if (passwordUpdateError) {
                  <div class="error-message">
                    <mat-icon>error</mat-icon>
                    {{ passwordUpdateError }}
                  </div>
                }

                <div class="actions">
                  <button mat-raised-button color="primary" type="submit" [disabled]="passwordIsUpdating || passwordForm.invalid">
                    Change Password
                  </button>
                  <button mat-stroked-button type="button" (click)="resetPasswordForm()">
                    Cancel
                  </button>
                </div>
              </form>
            </mat-card-content>
          </mat-card>
        </mat-tab>

        <!-- Login History Tab -->
        <mat-tab label="Login History">
          <mat-card class="profile-card">
            <mat-card-header>
              <mat-card-title>Recent Login Activity</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <p>Your recent login history will be displayed here.</p>
              <mat-list>
                <mat-list-item>
                  <mat-icon matListItemIcon>login</mat-icon>
                  <div matListItemTitle>Login</div>
                  <div matListItemLine>Today at 10:30 AM</div>
                </mat-list-item>
              </mat-list>
            </mat-card-content>
          </mat-card>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  styles: [`
    .profile-container {
      max-width: 700px;
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

    .profile-card {
      margin: 1rem 0;
    }

    mat-card-header {
      padding: 1rem !important;
      border-bottom: 1px solid #eee;
    }

    mat-card-content {
      padding: 2rem 1rem !important;
    }

    form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }

    .full-width {
      width: 100%;
    }

    mat-form-field {
      width: 100%;
    }

    .loading {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
      padding: 2rem;
    }

    .success-message,
    .error-message {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      border-radius: 4px;

      mat-icon {
        font-size: 1.25rem;
        width: 1.25rem;
        height: 1.25rem;
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

    .actions {
      display: flex;
      gap: 1rem;
      margin-top: 2rem;
    }

    mat-list {
      padding: 0;
    }

    @media (max-width: 600px) {
      .form-row {
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
export class ProfileComponent implements OnInit {
  private authService = inject(AuthService);
  private toastService = inject(ToastService);
  private fb = inject(FormBuilder);

  profileForm!: FormGroup;
  passwordForm!: FormGroup;

  isUpdating = false;
  updateSuccess = false;
  updateError = '';
  passwordIsUpdating = false;
  passwordUpdateSuccess = false;
  passwordUpdateError = '';

  ngOnInit(): void {
    this.initializeProfileForm();
    this.initializePasswordForm();
    this.loadProfileData();
  }

  private initializeProfileForm(): void {
    this.profileForm = this.fb.group({
      firstName: [''],
      lastName: [''],
      email: [{ value: '', disabled: true }],
      contactNumber: ['']
    });
  }

  private initializePasswordForm(): void {
    this.passwordForm = this.fb.group(
      {
        currentPassword: ['', Validators.required],
        newPassword: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', Validators.required]
      },
      { validators: this.passwordMatchValidator }
    );
  }

  private loadProfileData(): void {
    this.authService.getProfile().subscribe({
      next: (user) => {
        this.profileForm.patchValue({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          contactNumber: user.contactNumber
        });
      }
    });
  }

  updateProfile(): void {
    if (this.profileForm.invalid) {
      return;
    }

    this.isUpdating = true;
    this.updateSuccess = false;
    this.updateError = '';

    const data = {
      firstName: this.profileForm.get('firstName')?.value,
      lastName: this.profileForm.get('lastName')?.value,
      contactNumber: this.profileForm.get('contactNumber')?.value
    };

    this.authService.updateProfile(data).subscribe({
      next: () => {
        this.isUpdating = false;
        this.updateSuccess = true;
        this.toastService.success('Profile updated successfully');
        setTimeout(() => (this.updateSuccess = false), 3000);
      },
      error: (error) => {
        this.isUpdating = false;
        this.updateError = error.error?.message || 'Failed to update profile';
        this.toastService.error(this.updateError);
      }
    });
  }

  changePassword(): void {
    if (this.passwordForm.invalid) {
      return;
    }

    this.passwordIsUpdating = true;
    this.passwordUpdateSuccess = false;
    this.passwordUpdateError = '';

    const currentPassword = this.passwordForm.get('currentPassword')?.value;
    const newPassword = this.passwordForm.get('newPassword')?.value;

    this.authService.changePassword(currentPassword, newPassword).subscribe({
      next: () => {
        this.passwordIsUpdating = false;
        this.passwordUpdateSuccess = true;
        this.toastService.success('Password changed successfully');
        this.resetPasswordForm();
        setTimeout(() => (this.passwordUpdateSuccess = false), 3000);
      },
      error: (error) => {
        this.passwordIsUpdating = false;
        this.passwordUpdateError = error.error?.message || 'Failed to change password';
        this.toastService.error(this.passwordUpdateError);
      }
    });
  }

  resetProfileForm(): void {
    this.loadProfileData();
    this.updateSuccess = false;
    this.updateError = '';
  }

  resetPasswordForm(): void {
    this.passwordForm.reset();
    this.passwordUpdateSuccess = false;
    this.passwordUpdateError = '';
  }

  private passwordMatchValidator(fg: any) {
    const newPassword = fg.get('newPassword')?.value;
    const confirmPassword = fg.get('confirmPassword')?.value;

    if (newPassword && confirmPassword && newPassword !== confirmPassword) {
      return { passwordMismatch: true };
    }

    return null;
  }
}
