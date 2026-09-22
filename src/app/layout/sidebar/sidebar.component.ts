import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { PatientService } from '../../core/services/patient.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <aside class="app-sidebar" [class.mobile-open]="isMobileOpen">
      <div class="sidebar-header">
        <a routerLink="/dashboard" class="brand-link" (click)="closeMobileSidebar.emit()">
          <div class="brand-logo">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
              <path d="M12 5v14"></path>
              <path d="M5 12h14"></path>
            </svg>
          </div>
          <div class="brand-text">
            <span class="brand-name">MediCare<span class="highlight">360</span></span>
            <span class="brand-badge">SaaS</span>
          </div>
        </a>

        <button
          type="button"
          class="btn-close-mobile mobile-only"
          (click)="closeMobileSidebar.emit()"
          aria-label="Close menu"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      <!-- Navigation Links -->
      <nav class="sidebar-nav">
        <div class="nav-section-title">Operations</div>

        <a routerLink="/dashboard" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" class="nav-link" style="--nav-index: 0" (click)="closeMobileSidebar.emit()">
          <div class="nav-icon">
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="3" width="7" height="7"></rect>
              <rect x="14" y="3" width="7" height="7"></rect>
              <rect x="14" y="14" width="7" height="7"></rect>
              <rect x="3" y="14" width="7" height="7"></rect>
            </svg>
          </div>
          <span class="nav-label">Dashboard</span>
        </a>

        <a routerLink="/patients" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" class="nav-link" style="--nav-index: 1" (click)="closeMobileSidebar.emit()">
          <div class="nav-icon">
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
          </div>
          <span class="nav-label">Patients</span>
          <span class="nav-counter">{{ patientService.totalCount() }}</span>
        </a>

        <a routerLink="/patients/add" routerLinkActive="active" class="nav-link" style="--nav-index: 2" (click)="closeMobileSidebar.emit()">
          <div class="nav-icon">
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="16"></line>
              <line x1="8" y1="12" x2="16" y2="12"></line>
            </svg>
          </div>
          <span class="nav-label">Add Patient Wizard</span>
          <span class="nav-badge-pill">Wizard</span>
        </a>

        <a routerLink="/analytics" routerLinkActive="active" class="nav-link" style="--nav-index: 3" (click)="closeMobileSidebar.emit()">
          <div class="nav-icon">
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="20" x2="18" y2="10"></line>
              <line x1="12" y1="20" x2="12" y2="4"></line>
              <line x1="6" y1="20" x2="6" y2="14"></line>
            </svg>
          </div>
          <span class="nav-label">Analytics & Charts</span>
        </a>

        <div class="nav-section-title">Administration</div>

        <a routerLink="/settings" routerLinkActive="active" class="nav-link" style="--nav-index: 4" (click)="closeMobileSidebar.emit()">
          <div class="nav-icon">
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
            </svg>
          </div>
          <span class="nav-label">Settings</span>
        </a>

        <a routerLink="/profile" routerLinkActive="active" class="nav-link" style="--nav-index: 5" (click)="closeMobileSidebar.emit()">
          <div class="nav-icon">
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>
          <span class="nav-label">User Profile</span>
        </a>
      </nav>

      <!-- Sidebar Footer User Card & Logout -->
      <div class="sidebar-footer">
        <div class="user-card-compact">
          <img
            [src]="authService.currentUser()?.avatarUrl || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100'"
            alt="User avatar"
            class="footer-avatar"
          />
          <div class="footer-user-info">
            <span class="footer-user-name">{{ authService.currentUser()?.name || 'Staff' }}</span>
            <span class="footer-user-role">{{ authService.currentUser()?.role || 'Admin' }}</span>
          </div>
          <button
            type="button"
            class="btn-footer-logout"
            (click)="authService.logout()"
            title="Sign out of MediCare360"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
          </button>
        </div>
      </div>
    </aside>

    @if (isMobileOpen) {
      <div class="sidebar-backdrop mobile-only" (click)="closeMobileSidebar.emit()"></div>
    }
  `,
  styles: [`
    .app-sidebar {
      width: var(--sidebar-width);
      background-color: var(--bg-surface);
      border-right: 1px solid var(--border-default);
      display: flex;
      flex-direction: column;
      height: 100vh;
      position: sticky;
      top: 0;
      z-index: 150;
      transition: transform var(--transition-normal);
    }

    .sidebar-header {
      height: var(--navbar-height);
      padding: 0 1.25rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid var(--border-subtle);
    }

    .brand-link {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      text-decoration: none;
      color: var(--text-primary);
    }

    .brand-logo {
      width: 38px;
      height: 38px;
      border-radius: var(--radius-md);
      background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%);
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 8px rgba(37, 99, 235, 0.35);
    }

    .brand-name {
      font-size: 1.15rem;
      font-weight: 800;
      letter-spacing: -0.02em;

      .highlight {
        color: var(--color-primary);
      }
    }

    .brand-badge {
      font-size: 0.65rem;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      background-color: var(--color-primary-light);
      color: var(--color-primary);
      padding: 0.1rem 0.35rem;
      border-radius: var(--radius-xs);
      margin-left: 0.35rem;
    }

    .btn-close-mobile {
      background: transparent;
      border: none;
      color: var(--text-muted);
      cursor: pointer;
    }

    .sidebar-nav {
      flex: 1;
      padding: 1.25rem 0.85rem;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .nav-section-title {
      font-size: 0.7rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: var(--text-muted);
      padding: 0.75rem 0.75rem 0.35rem;
    }

    .nav-link {
      position: relative;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.65rem 0.85rem;
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--text-secondary);
      border-radius: var(--radius-md);
      text-decoration: none;
      transition: background-color var(--transition-fast), color var(--transition-fast), transform var(--transition-fast);
      animation: fadeInUp 360ms cubic-bezier(0.16, 1, 0.3, 1) both;
      animation-delay: calc(var(--nav-index, 0) * 40ms);

      &::before {
        content: '';
        position: absolute;
        left: -0.5rem;
        top: 15%;
        height: 70%;
        width: 3px;
        border-radius: var(--radius-full);
        background-color: var(--color-primary);
        transform: scaleY(0);
        transition: transform var(--transition-normal);
      }

      &:hover {
        background-color: var(--bg-surface-muted);
        color: var(--text-primary);
        transform: translateX(2px);
      }

      &.active {
        background-color: var(--color-primary-light);
        color: var(--color-primary);
        font-weight: 700;

        &::before {
          transform: scaleY(1);
        }

        .nav-icon {
          color: var(--color-primary);
          transform: scale(1.08);
        }
      }
    }

    .nav-icon {
      color: var(--text-muted);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: color var(--transition-fast), transform var(--transition-fast);
    }

    .nav-label {
      flex: 1;
    }

    .nav-counter {
      font-size: 0.725rem;
      font-weight: 700;
      padding: 0.15rem 0.5rem;
      border-radius: var(--radius-full);
      background-color: var(--bg-surface-muted);
      color: var(--text-secondary);
    }

    .nav-badge-pill {
      font-size: 0.65rem;
      font-weight: 800;
      text-transform: uppercase;
      padding: 0.15rem 0.45rem;
      border-radius: var(--radius-full);
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      color: #ffffff;
      letter-spacing: 0.03em;
    }

    .sidebar-footer {
      padding: 1rem;
      border-top: 1px solid var(--border-subtle);
    }

    .user-card-compact {
      display: flex;
      align-items: center;
      gap: 0.65rem;
      padding: 0.5rem;
      border-radius: var(--radius-md);
      background-color: var(--bg-surface-muted);
    }

    .footer-avatar {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      object-fit: cover;
    }

    .footer-user-info {
      flex: 1;
      min-width: 0;
    }

    .footer-user-name {
      display: block;
      font-size: 0.8125rem;
      font-weight: 700;
      color: var(--text-primary);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .footer-user-role {
      display: block;
      font-size: 0.7rem;
      color: var(--text-muted);
    }

    .btn-footer-logout {
      background: transparent;
      border: none;
      color: var(--text-muted);
      cursor: pointer;
      padding: 0.35rem;
      border-radius: var(--radius-xs);
      transition: all var(--transition-fast);

      &:hover {
        color: #ef4444;
        background-color: var(--status-inactive-bg);
      }
    }

    .sidebar-backdrop {
      position: fixed;
      inset: 0;
      background-color: var(--backdrop-overlay);
      backdrop-filter: blur(2px);
      z-index: 140;
    }

    @media (max-width: 768px) {
      .app-sidebar {
        position: fixed;
        left: 0;
        top: 0;
        bottom: 0;
        transform: translateX(-100%);
        box-shadow: var(--shadow-xl);

        &.mobile-open {
          transform: translateX(0);
        }
      }
    }
  `]
})
export class SidebarComponent {
  @Input() isMobileOpen: boolean = false;
  @Output() closeMobileSidebar = new EventEmitter<void>();

  constructor(
    public authService: AuthService,
    public patientService: PatientService
  ) {}
}
