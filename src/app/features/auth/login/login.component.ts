import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { ToastService } from '@shared/services/toast.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatIconModule,
    RouterModule
  ],
  template: `
    <div class="login-container">
      <mat-card class="login-card">
        <mat-card-header>
          <div class="hotel-header">
            <mat-icon class="hotel-icon">hotel</mat-icon>
            <div class="header-text">
              <mat-card-title>Kekehyu Hotel</mat-card-title>
              <mat-card-subtitle>Guest Registration System</mat-card-subtitle>
            </div>
          </div>
        </mat-card-header>

        <mat-card-content>
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="login-form">
            <mat-form-field class="full-width" appearance="outline">
              <mat-label>Email Address</mat-label>
              <input matInput type="email" formControlName="email" required />
              <mat-icon matPrefix>email</mat-icon>
              @if (emailControl?.invalid && emailControl?.touched) {
                <mat-error>
                  @if (emailControl?.hasError('required')) {
                    Email is required
                  }
                  @if (emailControl?.hasError('email')) {
                    Please enter a valid email
                  }
                </mat-error>
              }
            </mat-form-field>

            <mat-form-field class="full-width" appearance="outline">
              <mat-label>Password</mat-label>
              <input matInput type="password" formControlName="password" required />
              <mat-icon matPrefix>lock</mat-icon>
              @if (passwordControl?.invalid && passwordControl?.touched) {
                <mat-error>Password is required</mat-error>
              }
            </mat-form-field>

            <div class="remember-forgot">
              <mat-checkbox formControlName="rememberMe">Remember me</mat-checkbox>
              <a routerLink="/auth/forgot-password" class="forgot-link">Forgot Password?</a>
            </div>

            @if (errorMessage) {
              <div class="error-message">
                <mat-icon>error_outline</mat-icon>
                <span>{{ errorMessage }}</span>
              </div>
            }

            <button 
              mat-raised-button 
              color="primary" 
              type="submit"
              class="login-button"
              [disabled]="isLoading || loginForm.invalid"
            >
              @if (isLoading) {
                <mat-icon class="spinner-icon">sync</mat-icon>
                <span>Logging in...</span>
              } @else {
                <mat-icon>login</mat-icon>
                <span>Login</span>
              }
            </button>
          </form>

          <div class="divider">
            <span>Don't have an account?</span>
          </div>

          <button 
            mat-stroked-button 
            color="primary"
            routerLink="/auth/register"
            class="full-width"
          >
            <mat-icon>person_add</mat-icon>
            <span>Create Account</span>
          </button>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    .login-card {
      width: 100%;
      max-width: 400px;
      padding: 2rem;
    }

    mat-card-header {
      text-align: center;
      margin-bottom: 2rem;
    }

    mat-card-title {
      font-size: 2rem;
      margin: 0;
    }

    mat-card-subtitle {
      margin-top: 0.5rem;
    }

    form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .full-width {
      width: 100%;
    }

    .remember-forgot {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.875rem;
    }

    .forgot-link {
      color: #667eea;
      text-decoration: none;
      
      &:hover {
        text-decoration: underline;
      }
    }

    .error-message {
      background-color: #ffebee;
      color: #c62828;
      padding: 1rem;
      border-radius: 4px;
      margin: 1rem 0;
    }

    button[type="submit"] {
      margin-top: 1rem;
    }

    mat-spinner {
      display: inline-block;
      margin-right: 0.5rem;
    }
  `]
})
export class LoginComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private toastService = inject(ToastService);
  private cdr = inject(ChangeDetectorRef);

  loginForm!: FormGroup;
  isLoading = false;
  errorMessage = '';

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      rememberMe: [false]
    });
  }

  get emailControl() {
    return this.loginForm.get('email');
  }

  get passwordControl() {
    return this.loginForm.get('password');
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.cdr.markForCheck();

    // Extract only email and password - don't send rememberMe to backend
    const credentials = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password
    };
    console.log('Sending login request:', credentials);

    this.authService.login(credentials).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.cdr.markForCheck();
        
        // Handle rememberMe locally if needed
        if (this.loginForm.value.rememberMe) {
          localStorage.setItem('rememberEmail', this.loginForm.value.email);
        }
        
        this.toastService.success('Login successful!');
        
        if (response.user.role === 'ADMIN') {
          this.router.navigate(['/admin/dashboard']);
        } else {
          this.router.navigate(['/dashboard']);
        }
      },
      error: (error) => {
        this.isLoading = false;
        let message = 'An error occurred. Please try again.';
        
        if (error.status === 400) {
          console.error('400 Bad Request. Backend response:', error.error);
          message = error.error?.message || 'Invalid email or password format.';
        } else if (error.status === 401) {
          message = 'Invalid email or password';
        } else if (error.status === 429) {
          message = 'Too many login attempts. Please try again later.';
        } else if (error.error?.message) {
          message = error.error.message;
        }
        
        this.errorMessage = message;
        this.cdr.markForCheck();
        this.toastService.error(this.errorMessage);
      }
    });
  }
}
