import { Component, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ThemeService } from '../../core/services/theme.service';
import { NotificationService } from '../../core/services/notification.service';
import { PatientService } from '../../core/services/patient.service';
import { Patient } from '../../core/models/patient.model';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header class="top-navbar">
      <div class="navbar-left">
        <button
          type="button"
          class="btn-icon-toggle mobile-only"
          (click)="toggleMobileSidebar.emit()"
          aria-label="Toggle navigation menu"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>

        <!-- Global Search Bar with Live Overlay -->
        <div class="search-container">
          <svg class="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            type="text"
            class="search-input"
            placeholder="Search patients by name, ID, phone..."
            (input)="onSearchInput($event)"
            (focus)="showSearchOverlay.set(true)"
            [value]="searchQuery()"
          />

          @if (showSearchOverlay() && searchResults().length > 0) {
            <div class="search-results-overlay" (click)="$event.stopPropagation()">
              <div class="results-header">Quick Results ({{ searchResults().length }})</div>
              @for (patient of searchResults(); track patient.id) {
                <div class="search-result-item" (click)="selectPatient(patient.id)">
                  <div class="result-avatar">{{ patient.firstName.charAt(0) }}{{ patient.lastName.charAt(0) }}</div>
                  <div class="result-info">
                    <div class="result-name">{{ patient.firstName }} {{ patient.lastName }}</div>
                    <div class="result-meta">{{ patient.id }} • {{ patient.gender }} • {{ patient.medical.primaryPhysician }}</div>
                  </div>
                  <span class="badge" [ngClass]="patient.status === 'Active' ? 'badge-active' : 'badge-inactive'">
                    {{ patient.status }}
                  </span>
                </div>
              }
            </div>
          }
        </div>
      </div>

      <div class="navbar-right">
        <!-- Theme Toggle -->
        <button
          type="button"
          class="btn-icon-action"
          (click)="themeService.toggleTheme()"
          [title]="themeService.isDark() ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
        >
          @if (themeService.isDark()) {
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="5"></circle>
              <line x1="12" y1="1" x2="12" y2="3"></line>
              <line x1="12" y1="21" x2="12" y2="23"></line>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
              <line x1="1" y1="12" x2="3" y2="12"></line>
              <line x1="21" y1="12" x2="23" y2="12"></line>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
            </svg>
          } @else {
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
          }
        </button>

        <!-- Notifications Dropdown -->
        <div class="dropdown-wrapper">
          <button
            type="button"
            class="btn-icon-action notif-btn"
            (click)="toggleNotifications()"
            aria-label="Notifications"
          >
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
            @if (notificationService.unreadCount() > 0) {
              <span class="unread-pill">{{ notificationService.unreadCount() }}</span>
            }
          </button>

          @if (showNotifications()) {
            <div class="notifications-panel" (click)="$event.stopPropagation()">
              <div class="notif-panel-header">
                <div>
                  <h4 class="notif-panel-title">Notifications</h4>
                  <span class="notif-panel-subtitle">{{ notificationService.unreadCount() }} unread alerts</span>
                </div>
                @if (notificationService.unreadCount() > 0) {
                  <button type="button" class="btn-text-link" (click)="notificationService.markAllAsRead()">
                    Mark all read
                  </button>
                }
              </div>
              <div class="notif-list">
                @for (item of notificationService.notifications(); track item.id) {
                  <div
                    class="notif-item"
                    [class.unread]="!item.isRead"
                    (click)="onNotificationClick(item)"
                  >
                    <div class="notif-dot" [class.active]="!item.isRead"></div>
                    <div class="notif-body">
                      <div class="notif-title-row">
                        <span class="item-title">{{ item.title }}</span>
                        <span class="item-time">{{ item.timestamp | date:'shortTime' }}</span>
                      </div>
                      <p class="item-msg">{{ item.message }}</p>
                    </div>
                  </div>
                }
              </div>
            </div>
          }
        </div>

        <!-- User Avatar & Profile Dropdown -->
        <div class="dropdown-wrapper">
          <div class="user-pill" (click)="toggleUserDropdown()">
            <img
              [src]="authService.currentUser()?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'"
              alt="User Avatar"
              class="user-avatar"
            />
            <div class="user-meta desktop-only">
              <span class="user-name">{{ authService.currentUser()?.name || 'Admin' }}</span>
              <span class="user-role">{{ authService.currentUser()?.role || 'Staff' }}</span>
            </div>
            <svg class="dropdown-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </div>

          @if (showUserDropdown()) {
            <div class="user-menu-panel" (click)="$event.stopPropagation()">
              <div class="user-menu-header">
                <div class="menu-user-name">{{ authService.currentUser()?.name }}</div>
                <div class="menu-user-email">{{ authService.currentUser()?.email }}</div>
                <div class="menu-user-dept">{{ authService.currentUser()?.department }}</div>
              </div>
              <div class="menu-divider"></div>
              <a routerLink="/profile" class="menu-item" (click)="closeDropdowns()">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                <span>My Profile</span>
              </a>
              <a routerLink="/settings" class="menu-item" (click)="closeDropdowns()">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="3"></circle>
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                </svg>
                <span>Preferences</span>
              </a>
              <div class="menu-divider"></div>
              <button type="button" class="menu-item menu-item-danger" (click)="authService.logout()">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                  <polyline points="16 17 21 12 16 7"></polyline>
                  <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
                <span>Sign Out</span>
              </button>
            </div>
          }
        </div>
      </div>
    </header>
  `,
  styles: [`
    .top-navbar {
      height: var(--navbar-height);
      background-color: var(--bg-surface);
      border-bottom: 1px solid var(--border-default);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 1.5rem;
      position: sticky;
      top: 0;
      z-index: 100;
      backdrop-filter: blur(8px);
    }

    .navbar-left {
      display: flex;
      align-items: center;
      gap: 1rem;
      flex: 1;
      max-width: 540px;
    }

    .btn-icon-toggle {
      background: transparent;
      border: 1px solid var(--border-default);
      border-radius: var(--radius-md);
      padding: 0.4rem;
      color: var(--text-secondary);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;

      &:hover {
        background-color: var(--bg-surface-muted);
        color: var(--text-primary);
      }
    }

    .search-container {
      position: relative;
      width: 100%;
    }

    .search-icon {
      position: absolute;
      left: 0.85rem;
      top: 50%;
      transform: translateY(-50%);
      color: var(--text-muted);
      pointer-events: none;
    }

    .search-input {
      width: 100%;
      padding: 0.55rem 0.85rem 0.55rem 2.4rem;
      background-color: var(--bg-surface-muted);
      border: 1px solid transparent;
      border-radius: var(--radius-full);
      font-family: inherit;
      font-size: 0.85rem;
      color: var(--text-primary);
      outline: none;
      transition: all var(--transition-fast);

      &:focus {
        background-color: var(--bg-surface);
        border-color: var(--color-primary);
        box-shadow: 0 0 0 3px var(--color-primary-light);
      }
    }

    .search-results-overlay {
      position: absolute;
      top: calc(100% + 8px);
      left: 0;
      right: 0;
      background-color: var(--bg-surface);
      border: 1px solid var(--border-default);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-xl);
      max-height: 360px;
      overflow-y: auto;
      z-index: 200;
      animation: fadeIn 0.15s ease;
    }

    .results-header {
      padding: 0.6rem 1rem;
      font-size: 0.75rem;
      font-weight: 700;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.04em;
      border-bottom: 1px solid var(--border-subtle);
    }

    .search-result-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.7rem 1rem;
      cursor: pointer;
      border-bottom: 1px solid var(--border-subtle);
      transition: background-color var(--transition-fast);

      &:hover {
        background-color: var(--bg-surface-muted);
      }

      &:last-child {
        border-bottom: none;
      }
    }

    .result-avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background-color: var(--color-primary-light);
      color: var(--color-primary);
      font-weight: 700;
      font-size: 0.75rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .result-info {
      flex: 1;
      min-width: 0;
    }

    .result-name {
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--text-primary);
    }

    .result-meta {
      font-size: 0.75rem;
      color: var(--text-muted);
    }

    .navbar-right {
      display: flex;
      align-items: center;
      gap: 0.85rem;
    }

    .btn-icon-action {
      background: transparent;
      border: 1px solid var(--border-default);
      border-radius: var(--radius-md);
      padding: 0.5rem;
      color: var(--text-secondary);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all var(--transition-fast);
      position: relative;

      &:hover {
        background-color: var(--bg-surface-muted);
        color: var(--text-primary);
        border-color: var(--border-strong);
      }
    }

    .unread-pill {
      position: absolute;
      top: -4px;
      right: -4px;
      background-color: #ef4444;
      color: #ffffff;
      font-size: 0.65rem;
      font-weight: 800;
      padding: 0.1rem 0.35rem;
      border-radius: var(--radius-full);
      line-height: 1;
      border: 2px solid var(--bg-surface);
    }

    .dropdown-wrapper {
      position: relative;
    }

    .notifications-panel {
      position: absolute;
      top: calc(100% + 12px);
      right: 0;
      width: 360px;
      background-color: var(--bg-surface);
      border: 1px solid var(--border-default);
      border-radius: var(--radius-xl);
      box-shadow: var(--shadow-xl);
      overflow: hidden;
      z-index: 250;
      animation: fadeIn 0.15s ease;
    }

    .notif-panel-header {
      padding: 1rem 1.25rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid var(--border-subtle);
    }

    .notif-panel-title {
      font-size: 0.95rem;
      font-weight: 700;
      color: var(--text-primary);
    }

    .notif-panel-subtitle {
      font-size: 0.75rem;
      color: var(--text-muted);
    }

    .btn-text-link {
      background: transparent;
      border: none;
      color: var(--color-primary);
      font-size: 0.75rem;
      font-weight: 600;
      cursor: pointer;

      &:hover {
        text-decoration: underline;
      }
    }

    .notif-list {
      max-height: 340px;
      overflow-y: auto;
    }

    .notif-item {
      display: flex;
      gap: 0.75rem;
      padding: 0.85rem 1.25rem;
      border-bottom: 1px solid var(--border-subtle);
      cursor: pointer;
      transition: background-color var(--transition-fast);

      &:hover {
        background-color: var(--bg-surface-muted);
      }

      &.unread {
        background-color: var(--color-primary-light);
      }
    }

    .notif-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background-color: transparent;
      margin-top: 0.35rem;

      &.active {
        background-color: var(--color-primary);
      }
    }

    .notif-body {
      flex: 1;
    }

    .notif-title-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.2rem;
    }

    .item-title {
      font-size: 0.825rem;
      font-weight: 600;
      color: var(--text-primary);
    }

    .item-time {
      font-size: 0.7rem;
      color: var(--text-muted);
    }

    .item-msg {
      font-size: 0.775rem;
      color: var(--text-secondary);
      line-height: 1.35;
    }

    .user-pill {
      display: flex;
      align-items: center;
      gap: 0.65rem;
      padding: 0.3rem 0.65rem 0.3rem 0.3rem;
      border: 1px solid var(--border-default);
      border-radius: var(--radius-full);
      cursor: pointer;
      background-color: var(--bg-surface);
      transition: all var(--transition-fast);

      &:hover {
        border-color: var(--border-strong);
        background-color: var(--bg-surface-muted);
      }
    }

    .user-avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      object-fit: cover;
    }

    .user-meta {
      display: flex;
      flex-direction: column;
      text-align: left;
    }

    .user-name {
      font-size: 0.8125rem;
      font-weight: 700;
      color: var(--text-primary);
      line-height: 1.1;
    }

    .user-role {
      font-size: 0.7rem;
      color: var(--text-muted);
    }

    .dropdown-chevron {
      color: var(--text-muted);
    }

    .user-menu-panel {
      position: absolute;
      top: calc(100% + 10px);
      right: 0;
      width: 240px;
      background-color: var(--bg-surface);
      border: 1px solid var(--border-default);
      border-radius: var(--radius-xl);
      box-shadow: var(--shadow-xl);
      padding: 0.5rem;
      z-index: 250;
      animation: fadeIn 0.15s ease;
    }

    .user-menu-header {
      padding: 0.75rem 0.75rem 0.5rem;
    }

    .menu-user-name {
      font-weight: 700;
      font-size: 0.875rem;
      color: var(--text-primary);
    }

    .menu-user-email {
      font-size: 0.75rem;
      color: var(--text-muted);
    }

    .menu-user-dept {
      font-size: 0.7rem;
      color: var(--color-primary);
      font-weight: 600;
      margin-top: 0.2rem;
    }

    .menu-divider {
      height: 1px;
      background-color: var(--border-subtle);
      margin: 0.4rem 0;
    }

    .menu-item {
      display: flex;
      align-items: center;
      gap: 0.65rem;
      padding: 0.6rem 0.75rem;
      font-size: 0.825rem;
      font-weight: 600;
      color: var(--text-secondary);
      border-radius: var(--radius-md);
      cursor: pointer;
      text-decoration: none;
      width: 100%;
      border: none;
      background: transparent;
      text-align: left;
      transition: all var(--transition-fast);

      &:hover {
        background-color: var(--bg-surface-muted);
        color: var(--text-primary);
      }

      &.menu-item-danger {
        color: #ef4444;
        &:hover {
          background-color: var(--status-inactive-bg);
          color: #dc2626;
        }
      }
    }

    @media (max-width: 768px) {
      .desktop-only { display: none; }
      .mobile-only { display: flex; }
      .navbar-left { max-width: 220px; }
      .notifications-panel { width: 300px; right: -60px; }
    }
    @media (min-width: 769px) {
      .mobile-only { display: none; }
    }
  `]
})
export class NavbarComponent {
  @Output() toggleMobileSidebar = new EventEmitter<void>();

  showNotifications = signal<boolean>(false);
  showUserDropdown = signal<boolean>(false);
  showSearchOverlay = signal<boolean>(false);
  searchQuery = signal<string>('');
  searchResults = signal<Patient[]>([]);

  constructor(
    public authService: AuthService,
    public themeService: ThemeService,
    public notificationService: NotificationService,
    private patientService: PatientService,
    private router: Router
  ) {}

  toggleNotifications(): void {
    this.showNotifications.update((v) => !v);
    this.showUserDropdown.set(false);
  }

  toggleUserDropdown(): void {
    this.showUserDropdown.update((v) => !v);
    this.showNotifications.set(false);
  }

  closeDropdowns(): void {
    this.showNotifications.set(false);
    this.showUserDropdown.set(false);
    this.showSearchOverlay.set(false);
  }

  onSearchInput(event: Event): void {
    const query = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.searchQuery.set(query);

    if (query.length >= 2) {
      const results = this.patientService.patients().filter((p) =>
        p.firstName.toLowerCase().includes(query) ||
        p.lastName.toLowerCase().includes(query) ||
        p.id.toLowerCase().includes(query) ||
        p.contact.phone.includes(query) ||
        p.contact.email.toLowerCase().includes(query)
      ).slice(0, 5);
      this.searchResults.set(results);
      this.showSearchOverlay.set(true);
    } else {
      this.searchResults.set([]);
      this.showSearchOverlay.set(false);
    }
  }

  selectPatient(id: string): void {
    this.showSearchOverlay.set(false);
    this.searchQuery.set('');
    this.router.navigate(['/patients', id]);
  }

  onNotificationClick(item: any): void {
    this.notificationService.markAsRead(item.id);
    if (item.actionUrl) {
      this.router.navigateByUrl(item.actionUrl);
    }
    this.showNotifications.set(false);
  }
}
