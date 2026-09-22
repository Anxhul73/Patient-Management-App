import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { HipaaBannerComponent } from '../../../shared/components/hipaa-banner/hipaa-banner.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HipaaBannerComponent],
  template: `
    <app-hipaa-banner></app-hipaa-banner>
    <div class="login-page">
      <div class="login-card-wrapper">
        <div class="login-card">
          <!-- Brand Header -->
          <div class="login-header">
            <div class="login-brand-logo">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
                <path d="M12 5v14"></path>
                <path d="M5 12h14"></path>
              </svg>
            </div>
            <h1 class="login-title">Welcome to MediCare360</h1>
            <p class="login-subtitle">Sign in to access authorized patient management operations</p>
          </div>

          <!-- Quick Autofill Demo Pills -->
          <div class="demo-pills-box">
            <div class="pills-label">Demo Quick Fill:</div>
            <div class="pills-row">
              <button type="button" class="demo-pill" (click)="fillCredentials('admin@medicare360.demo', 'Admin@123')">
                <span class="pill-dot admin"></span>
                <span>Admin Portal (Full Access)</span>
              </button>
              <button type="button" class="demo-pill" (click)="fillCredentials('doctor@medicare360.demo', 'Doctor@123')">
                <span class="pill-dot doc"></span>
                <span>Clinical Physician</span>
              </button>
            </div>
          </div>

          <!-- Reactive Login Form -->
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="login-form">
            <div class="form-group">
              <label for="email">
                Email Address <span class="required-star">*</span>
              </label>
              <div class="input-icon-wrapper">
                <svg class="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
                <input
                  id="email"
                  type="email"
                  formControlName="email"
                  class="form-control with-icon"
                  placeholder="name@medicare360.demo"
                  [class.is-invalid]="emailControl?.invalid && (emailControl?.touched || submitted())"
                />
              </div>
              @if (emailControl?.invalid && (emailControl?.touched || submitted())) {
                <div class="form-error">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                  </svg>
                  @if (emailControl?.errors?.['required']) {
                    <span>Email address is required.</span>
                  } @else if (emailControl?.errors?.['email']) {
                    <span>Please enter a valid email address.</span>
                  }
                </div>
              }
            </div>

            <div class="form-group">
              <div class="password-label-row">
                <label for="password">Password <span class="required-star">*</span></label>
                <span class="helper-hint">Min 8 characters</span>
              </div>
              <div class="input-icon-wrapper">
                <svg class="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
                <input
                  id="password"
                  [type]="showPassword() ? 'text' : 'password'"
                  formControlName="password"
                  class="form-control with-icon with-trailing"
                  placeholder="••••••••••••"
                  [class.is-invalid]="passwordControl?.invalid && (passwordControl?.touched || submitted())"
                />
                <button
                  type="button"
                  class="trailing-btn"
                  (click)="showPassword.set(!showPassword())"
                  [title]="showPassword() ? 'Hide password' : 'Show password'"
                  tabindex="-1"
                >
                  @if (showPassword()) {
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                      <line x1="1" y1="1" x2="23" y2="23"></line>
                    </svg>
                  } @else {
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  }
                </button>
              </div>
              @if (passwordControl?.invalid && (passwordControl?.touched || submitted())) {
                <div class="form-error">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                  </svg>
                  @if (passwordControl?.errors?.['required']) {
                    <span>Password is required.</span>
                  } @else if (passwordControl?.errors?.['minlength']) {
                    <span>Password must contain at least 8 characters.</span>
                  }
                </div>
              }
            </div>

            <div class="form-row-remember">
              <label class="checkbox-label">
                <input type="checkbox" formControlName="rememberMe" />
                <span>Remember this workstation session</span>
              </label>
            </div>

            <button
              type="submit"
              class="btn btn-primary btn-lg btn-block"
              [disabled]="loading()"
            >
              @if (loading()) {
                <svg class="spinner-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
                  <path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round"></path>
                </svg>
                <span>Authenticating Staff...</span>
              } @else {
                <span>Sign in to MediCare360</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              }
            </button>
          </form>

          <div class="login-footer-info">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
            <span>Educational sandbox • No real credentials or PHI accepted</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-page {
      min-height: calc(100vh - 40px);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem 1.5rem;
      background: radial-gradient(circle at 50% 20%, rgba(37, 99, 235, 0.08) 0%, transparent 60%), var(--bg-app);
    }

    .login-card-wrapper {
      width: 100%;
      max-width: 460px;
    }

    .login-card {
      background-color: var(--bg-surface);
      border: 1px solid var(--border-default);
      border-radius: var(--radius-xl);
      padding: 2.25rem 2rem;
      box-shadow: var(--shadow-xl);
    }

    .login-header {
      text-align: center;
      margin-bottom: 1.5rem;
    }

    .login-brand-logo {
      width: 52px;
      height: 52px;
      border-radius: var(--radius-lg);
      background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%);
      color: #ffffff;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 1rem;
      box-shadow: 0 4px 12px rgba(37, 99, 235, 0.35);
    }

    .login-title {
      font-size: 1.45rem;
      font-weight: 800;
      color: var(--text-primary);
      margin-bottom: 0.35rem;
    }

    .login-subtitle {
      font-size: 0.85rem;
      color: var(--text-secondary);
    }

    .demo-pills-box {
      background-color: var(--bg-surface-muted);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-md);
      padding: 0.75rem 0.85rem;
      margin-bottom: 1.5rem;
    }

    .pills-label {
      font-size: 0.725rem;
      font-weight: 700;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.04em;
      margin-bottom: 0.4rem;
    }

    .pills-row {
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
    }

    .demo-pill {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background-color: var(--bg-surface);
      border: 1px solid var(--border-default);
      border-radius: var(--radius-sm);
      padding: 0.35rem 0.65rem;
      font-size: 0.775rem;
      font-weight: 600;
      color: var(--text-primary);
      cursor: pointer;
      text-align: left;
      transition: all var(--transition-fast);

      &:hover {
        border-color: var(--color-primary);
        background-color: var(--color-primary-light);
        color: var(--color-primary);
      }
    }

    .pill-dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      &.admin { background-color: #2563eb; }
      &.doc { background-color: #0f766e; }
    }

    .input-icon-wrapper {
      position: relative;
    }

    .input-icon {
      position: absolute;
      left: 0.85rem;
      top: 50%;
      transform: translateY(-50%);
      color: var(--text-muted);
      pointer-events: none;
    }

    .form-control.with-icon {
      padding-left: 2.35rem;
    }

    .form-control.with-trailing {
      padding-right: 2.35rem;
    }

    .trailing-btn {
      position: absolute;
      right: 0.65rem;
      top: 50%;
      transform: translateY(-50%);
      background: transparent;
      border: none;
      color: var(--text-muted);
      cursor: pointer;
      padding: 0.2rem;
      display: flex;
      align-items: center;

      &:hover {
        color: var(--text-primary);
      }
    }

    .password-label-row {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
    }

    .form-row-remember {
      margin-bottom: 1.35rem;
    }

    .checkbox-label {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.8125rem;
      color: var(--text-secondary);
      cursor: pointer;
      user-select: none;

      input[type="checkbox"] {
        accent-color: var(--color-primary);
        width: 15px;
        height: 15px;
      }
    }

    .btn-block {
      width: 100%;
    }

    .spinner-icon {
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    .login-footer-info {
      margin-top: 1.5rem;
      padding-top: 1rem;
      border-top: 1px solid var(--border-subtle);
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.4rem;
      font-size: 0.725rem;
      color: var(--text-muted);
      text-align: center;
    }
  `]
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = signal<boolean>(false);
  submitted = signal<boolean>(false);
  showPassword = signal<boolean>(false);

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      email: ['admin@medicare360.demo', [Validators.required, Validators.email]],
      password: ['Admin@123', [Validators.required, Validators.minLength(8)]],
      rememberMe: [true]
    });
  }

  get emailControl() {
    return this.loginForm.get('email');
  }

  get passwordControl() {
    return this.loginForm.get('password');
  }

  fillCredentials(email: string, pass: string): void {
    this.loginForm.patchValue({
      email,
      password: pass
    });
  }

  async onSubmit(): Promise<void> {
    this.submitted.set(true);
    if (this.loginForm.invalid) {
      return;
    }

    this.loading.set(true);
    try {
      await this.authService.login(this.loginForm.value);
    } finally {
      this.loading.set(false);
    }
  }
}
