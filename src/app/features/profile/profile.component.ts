import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="profile-page">
      <div class="page-header">
        <h1 class="page-title">Healthcare Staff Profile</h1>
        <p class="page-subtitle">Authenticated clinician and administrative credential details</p>
      </div>

      <div class="profile-layout-grid">
        <!-- Main Profile Card -->
        <div class="card profile-main-card">
          <div class="profile-banner"></div>
          <div class="profile-card-content">
            <div class="avatar-row">
              <img
                [src]="authService.currentUser()?.avatarUrl || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150'"
                alt="Profile Avatar"
                class="main-avatar"
              />
              <span class="role-pill">{{ authService.currentUser()?.role || 'Staff' }}</span>
            </div>

            <h2 class="user-display-name">{{ authService.currentUser()?.name }}</h2>
            <p class="user-display-email">{{ authService.currentUser()?.email }}</p>
            <p class="user-display-dept">{{ authService.currentUser()?.department }}</p>

            <div class="profile-divider"></div>

            <div class="info-list">
              <div class="info-row">
                <span class="info-label">Staff User ID</span>
                <span class="info-val font-mono">{{ authService.currentUser()?.id }}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Security Role</span>
                <span class="info-val">{{ authService.currentUser()?.role }}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Workstation Session Started</span>
                <span class="info-val">{{ authService.currentUser()?.lastLogin | date:'medium' }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Security & Audit Info -->
        <div class="card profile-sec-card">
          <div class="card-header">
            <h3 class="card-title">Session Security & HIPAA Safeguards</h3>
          </div>
          <div class="card-body">
            <div class="sec-bullets">
              <div class="bullet-item">
                <div class="bullet-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                </div>
                <div>
                  <strong>Workstation Token:</strong>
                  <p>Authenticated via mock Bearer session with simulated 8-hour expiry.</p>
                </div>
              </div>

              <div class="bullet-item">
                <div class="bullet-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                  </svg>
                </div>
                <div>
                  <strong>Audit Logging:</strong>
                  <p>All client chart edits produce timestamped audit log entries with user attribution.</p>
                </div>
              </div>
            </div>

            <div class="logout-box">
              <button type="button" class="btn btn-danger-outline" (click)="authService.logout()">
                Sign out of MediCare360 Workstation
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .profile-page {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      max-width: 980px;
      margin: 0 auto;
    }

    .page-title {
      font-size: 1.75rem;
      font-weight: 800;
    }

    .page-subtitle {
      font-size: 0.875rem;
      color: var(--text-secondary);
      margin-top: 0.2rem;
    }

    .profile-layout-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;

      @media (max-width: 768px) {
        grid-template-columns: 1fr;
      }
    }

    .profile-main-card {
      overflow: hidden;
    }

    .profile-banner {
      height: 90px;
      background: linear-gradient(135deg, #2563eb 0%, #6366f1 100%);
    }

    .profile-card-content {
      padding: 0 1.5rem 1.5rem;
      position: relative;
    }

    .avatar-row {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-top: -36px;
      margin-bottom: 0.85rem;
    }

    .main-avatar {
      width: 72px;
      height: 72px;
      border-radius: 50%;
      border: 3px solid var(--bg-surface);
      object-fit: cover;
      box-shadow: var(--shadow-md);
    }

    .role-pill {
      font-size: 0.75rem;
      font-weight: 700;
      background-color: var(--color-primary-light);
      color: var(--color-primary);
      padding: 0.25rem 0.65rem;
      border-radius: var(--radius-full);
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    .user-display-name {
      font-size: 1.35rem;
      font-weight: 800;
      color: var(--text-primary);
    }

    .user-display-email {
      font-size: 0.85rem;
      color: var(--text-secondary);
    }

    .user-display-dept {
      font-size: 0.8rem;
      color: var(--color-primary);
      font-weight: 600;
      margin-top: 0.2rem;
    }

    .profile-divider {
      height: 1px;
      background-color: var(--border-subtle);
      margin: 1.25rem 0;
    }

    .info-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .info-row {
      display: flex;
      justify-content: space-between;
      font-size: 0.825rem;
    }

    .info-label {
      color: var(--text-muted);
      font-weight: 600;
    }

    .info-val {
      font-weight: 600;
      color: var(--text-primary);

      &.font-mono {
        font-family: monospace;
      }
    }

    .sec-bullets {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    .bullet-item {
      display: flex;
      gap: 0.85rem;
      align-items: flex-start;

      p {
        font-size: 0.8125rem;
        margin-top: 0.2rem;
      }
    }

    .bullet-icon {
      width: 36px;
      height: 36px;
      border-radius: var(--radius-md);
      background-color: var(--color-primary-light);
      color: var(--color-primary);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .logout-box {
      margin-top: 2rem;
      padding-top: 1.25rem;
      border-top: 1px solid var(--border-subtle);
    }
  `]
})
export class ProfileComponent {
  constructor(public authService: AuthService) {}
}
