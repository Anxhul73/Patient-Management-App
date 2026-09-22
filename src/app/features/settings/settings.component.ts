import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StorageService } from '../../core/services/storage.service';
import { ThemeService, ThemeMode } from '../../core/services/theme.service';
import { ToastService } from '../../core/services/toast.service';
import { AuthService } from '../../core/services/auth.service';
import { STORAGE_KEYS, DEFAULT_USER_SETTINGS } from '../../core/constants/app.constants';
import { UserSettings } from '../../core/models/analytics.model';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="settings-page">
      <div class="settings-header">
        <h1 class="page-title">Workstation Settings & Preferences</h1>
        <p class="page-subtitle">Configure demo clinical environment parameters, notifications, and visual styling.</p>
      </div>

      <div class="settings-container">
        <!-- Sidebar Navigation for Settings Tabs -->
        <div class="settings-nav-card card">
          <button
            type="button"
            class="settings-nav-btn"
            [class.active]="activeSection() === 'appearance'"
            (click)="activeSection.set('appearance')"
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="5"></circle>
              <line x1="12" y1="1" x2="12" y2="3"></line>
              <line x1="12" y1="21" x2="12" y2="23"></line>
            </svg>
            <span>Appearance & Themes</span>
          </button>

          <button
            type="button"
            class="settings-nav-btn"
            [class.active]="activeSection() === 'preferences'"
            (click)="activeSection.set('preferences')"
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 14 14"></polyline>
            </svg>
            <span>Regional & Time Preferences</span>
          </button>

          <button
            type="button"
            class="settings-nav-btn"
            [class.active]="activeSection() === 'notifications'"
            (click)="activeSection.set('notifications')"
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
            <span>Notification Triggers</span>
          </button>

          <button
            type="button"
            class="settings-nav-btn"
            [class.active]="activeSection() === 'security'"
            (click)="activeSection.set('security')"
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            </svg>
            <span>HIPAA Demo Architecture</span>
          </button>
        </div>

        <!-- Settings Content Area -->
        <div class="settings-content-card card">
          <!-- SECTION 1: APPEARANCE -->
          @if (activeSection() === 'appearance') {
            <div class="settings-section">
              <div class="section-title-box">
                <h3 class="section-heading">Visual Appearance</h3>
                <p class="section-desc">Customize the user interface theme mode according to clinical lighting conditions.</p>
              </div>

              <div class="theme-picker-grid">
                <div
                  class="theme-choice-card"
                  [class.selected]="settings.theme === 'light'"
                  (click)="setThemeMode('light')"
                >
                  <div class="theme-preview light-prev">
                    <div class="prev-bar"></div>
                    <div class="prev-content"></div>
                  </div>
                  <div class="choice-meta">
                    <span class="choice-title">Light Mode</span>
                    <span class="choice-sub">Crisp high-contrast daytime UI</span>
                  </div>
                </div>

                <div
                  class="theme-choice-card"
                  [class.selected]="settings.theme === 'dark'"
                  (click)="setThemeMode('dark')"
                >
                  <div class="theme-preview dark-prev">
                    <div class="prev-bar"></div>
                    <div class="prev-content"></div>
                  </div>
                  <div class="choice-meta">
                    <span class="choice-title">Dark Mode</span>
                    <span class="choice-sub">Reduced eye strain in low-light environments</span>
                  </div>
                </div>

                <div
                  class="theme-choice-card"
                  [class.selected]="settings.theme === 'system'"
                  (click)="setThemeMode('system')"
                >
                  <div class="theme-preview system-prev">
                    <div class="prev-bar"></div>
                    <div class="prev-content"></div>
                  </div>
                  <div class="choice-meta">
                    <span class="choice-title">System Synchronized</span>
                    <span class="choice-sub">Follows OS theme preference automatically</span>
                  </div>
                </div>
              </div>
            </div>
          }

          <!-- SECTION 2: REGIONAL PREFERENCES -->
          @if (activeSection() === 'preferences') {
            <div class="settings-section">
              <div class="section-title-box">
                <h3 class="section-heading">Regional & Clinical Localization</h3>
                <p class="section-desc">Configure formats for time stamping, scheduling, and clinical communications.</p>
              </div>

              <div class="form-grid-2">
                <div class="form-group">
                  <label for="prefLang">Language</label>
                  <select id="prefLang" class="form-select" [(ngModel)]="settings.language">
                    <option value="English (US)">English (US)</option>
                    <option value="Spanish (ES)">Spanish (Español)</option>
                    <option value="French (FR)">French (Français)</option>
                  </select>
                </div>

                <div class="form-group">
                  <label for="prefTz">Timezone</label>
                  <select id="prefTz" class="form-select" [(ngModel)]="settings.timezone">
                    <option value="UTC-05:00 (Eastern Time)">UTC-05:00 (Eastern Time)</option>
                    <option value="UTC-06:00 (Central Time)">UTC-06:00 (Central Time)</option>
                    <option value="UTC-08:00 (Pacific Time)">UTC-08:00 (Pacific Time)</option>
                    <option value="UTC+00:00 (Greenwich Mean Time)">UTC+00:00 (Greenwich Mean Time)</option>
                  </select>
                </div>

                <div class="form-group">
                  <label for="prefDateFormat">Clinical Date Format</label>
                  <select id="prefDateFormat" class="form-select" [(ngModel)]="settings.dateFormat">
                    <option value="YYYY-MM-DD">YYYY-MM-DD (ISO 8601 Standard)</option>
                    <option value="MM/DD/YYYY">MM/DD/YYYY (US Clinical)</option>
                    <option value="DD/MM/YYYY">DD/MM/YYYY (EU Standard)</option>
                  </select>
                </div>
              </div>
            </div>
          }

          <!-- SECTION 3: NOTIFICATIONS -->
          @if (activeSection() === 'notifications') {
            <div class="settings-section">
              <div class="section-title-box">
                <h3 class="section-heading">Notification Preferences</h3>
                <p class="section-desc">Manage system triggers for urgent patient updates and clinical alerts.</p>
              </div>

              <div class="toggles-list">
                <label class="toggle-item">
                  <div class="toggle-text">
                    <span class="t-title">Email Notification Summaries</span>
                    <span class="t-sub">Receive daily digest of new synthetic patient intake</span>
                  </div>
                  <input type="checkbox" [(ngModel)]="settings.emailNotifications" />
                </label>

                <label class="toggle-item">
                  <div class="toggle-text">
                    <span class="t-title">Critical Care Alerts</span>
                    <span class="t-sub">Immediate desktop popups for critical allergy or condition alerts</span>
                  </div>
                  <input type="checkbox" [(ngModel)]="settings.securityAlerts" />
                </label>

                <label class="toggle-item">
                  <div class="toggle-text">
                    <span class="t-title">Patient Chart Modifications</span>
                    <span class="t-sub">In-app notifications when attending physicians alter prescriptions</span>
                  </div>
                  <input type="checkbox" [(ngModel)]="settings.patientUpdates" />
                </label>
              </div>
            </div>
          }

          <!-- SECTION 4: HIPAA SECURITY DEMO -->
          @if (activeSection() === 'security') {
            <div class="settings-section">
              <div class="section-title-box">
                <h3 class="section-heading">HIPAA-Aware Sandbox Architecture</h3>
                <p class="section-desc">Architecture and security pattern demonstrations appropriate for a frontend clinical demo.</p>
              </div>

              <div class="security-info-box">
                <div class="sec-item">
                  <div class="sec-badge ok">✓ Active</div>
                  <div>
                    <strong>Client-Side Demo Sandbox:</strong>
                    <p>All records are synthetic. No real PHI is handled in browser storage or memory.</p>
                  </div>
                </div>

                <div class="sec-item">
                  <div class="sec-badge ok">✓ Active</div>
                  <div>
                    <strong>Route Guards & Protected Navigation:</strong>
                    <p>Unauthenticated access to clinical dashboards and patient records is intercepted and redirected.</p>
                  </div>
                </div>

                <div class="sec-item">
                  <div class="sec-badge req">Production Requirement</div>
                  <div>
                    <strong>Production Backend Integration:</strong>
                    <p>Production environments require TLS 1.3, Encrypted PostgreSQL/FHIR store, Role-Based Access Control (RBAC), and SOC 2 / HIPAA certified audit infrastructure.</p>
                  </div>
                </div>
              </div>
            </div>
          }

          <!-- Save Settings Action -->
          <div class="settings-footer">
            <button type="button" class="btn btn-primary" (click)="saveSettings()">
              <span>Save Workstation Preferences</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .settings-page {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
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

    .settings-container {
      display: grid;
      grid-template-columns: 240px 1fr;
      gap: 1.5rem;
      align-items: flex-start;

      @media (max-width: 840px) {
        grid-template-columns: 1fr;
      }
    }

    .settings-nav-card {
      padding: 0.75rem;
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .settings-nav-btn {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem 1rem;
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--text-secondary);
      background: transparent;
      border: none;
      border-radius: var(--radius-md);
      cursor: pointer;
      text-align: left;
      transition: all var(--transition-fast);

      &:hover {
        background-color: var(--bg-surface-muted);
        color: var(--text-primary);
      }

      &.active {
        background-color: var(--color-primary-light);
        color: var(--color-primary);
        font-weight: 700;
      }
    }

    .settings-content-card {
      padding: 1.75rem;
    }

    .section-title-box {
      margin-bottom: 1.5rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid var(--border-subtle);
    }

    .section-heading {
      font-size: 1.2rem;
      font-weight: 700;
      margin-bottom: 0.25rem;
    }

    .section-desc {
      font-size: 0.825rem;
      color: var(--text-secondary);
    }

    .theme-picker-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1.25rem;

      @media (max-width: 680px) {
        grid-template-columns: 1fr;
      }
    }

    .theme-choice-card {
      border: 2px solid var(--border-default);
      border-radius: var(--radius-lg);
      padding: 1rem;
      cursor: pointer;
      transition: all var(--transition-fast);

      &:hover {
        border-color: var(--border-strong);
      }

      &.selected {
        border-color: var(--color-primary);
        box-shadow: 0 0 0 3px var(--color-primary-light);
      }
    }

    .theme-preview {
      height: 80px;
      border-radius: var(--radius-sm);
      border: 1px solid var(--border-default);
      margin-bottom: 0.75rem;
      padding: 0.5rem;
      display: flex;
      flex-direction: column;
      gap: 0.4rem;

      &.light-prev {
        background-color: #f8fafc;
        .prev-bar { height: 12px; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 3px; }
        .prev-content { flex: 1; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 3px; }
      }

      &.dark-prev {
        background-color: #090d16;
        .prev-bar { height: 12px; background-color: #111827; border: 1px solid #334155; border-radius: 3px; }
        .prev-content { flex: 1; background-color: #111827; border: 1px solid #334155; border-radius: 3px; }
      }

      &.system-prev {
        background: linear-gradient(135deg, #f8fafc 50%, #090d16 50%);
        .prev-bar { height: 12px; background-color: #3b82f6; border-radius: 3px; opacity: 0.7; }
        .prev-content { flex: 1; background-color: rgba(255,255,255,0.2); border-radius: 3px; }
      }
    }

    .choice-title {
      display: block;
      font-size: 0.875rem;
      font-weight: 700;
      color: var(--text-primary);
    }

    .choice-sub {
      display: block;
      font-size: 0.75rem;
      color: var(--text-muted);
      margin-top: 0.15rem;
    }

    .toggles-list {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    .toggle-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.85rem 1rem;
      background-color: var(--bg-surface-muted);
      border-radius: var(--radius-md);
      cursor: pointer;

      input[type="checkbox"] {
        accent-color: var(--color-primary);
        width: 18px;
        height: 18px;
        cursor: pointer;
      }
    }

    .t-title {
      display: block;
      font-weight: 600;
      font-size: 0.875rem;
    }

    .t-sub {
      display: block;
      font-size: 0.775rem;
      color: var(--text-muted);
    }

    .security-info-box {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .sec-item {
      display: flex;
      gap: 1rem;
      align-items: flex-start;
      padding: 1rem;
      background-color: var(--bg-surface-muted);
      border-radius: var(--radius-md);

      p {
        font-size: 0.8125rem;
        margin-top: 0.2rem;
      }
    }

    .sec-badge {
      font-size: 0.7rem;
      font-weight: 700;
      padding: 0.2rem 0.5rem;
      border-radius: var(--radius-full);
      white-space: nowrap;

      &.ok {
        background-color: var(--status-active-bg);
        color: var(--status-active-text);
      }
      &.req {
        background-color: var(--status-pending-bg);
        color: var(--status-pending-text);
      }
    }

    .settings-footer {
      margin-top: 2rem;
      padding-top: 1.25rem;
      border-top: 1px solid var(--border-subtle);
      display: flex;
      justify-content: flex-end;
    }
  `]
})
export class SettingsComponent implements OnInit {
  activeSection = signal<'appearance' | 'preferences' | 'notifications' | 'security'>('appearance');

  settings: UserSettings = { ...DEFAULT_USER_SETTINGS };

  constructor(
    private storage: StorageService,
    private themeService: ThemeService,
    private toastService: ToastService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    const saved = this.storage.getLocal<UserSettings>(STORAGE_KEYS.USER_SETTINGS, DEFAULT_USER_SETTINGS);
    this.settings = { ...saved, theme: this.themeService.currentTheme() };
  }

  setThemeMode(mode: ThemeMode): void {
    this.settings.theme = mode;
    this.themeService.setTheme(mode);
  }

  saveSettings(): void {
    this.storage.setLocal(STORAGE_KEYS.USER_SETTINGS, this.settings);
    this.toastService.success('Settings Saved', 'Workstation configuration successfully updated.');
  }
}
