import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StorageService } from '../../../core/services/storage.service';
import { STORAGE_KEYS } from '../../../core/constants/app.constants';

@Component({
  selector: 'app-hipaa-banner',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (visible()) {
      <div
        class="hipaa-strip"
        [class.is-leaving]="leaving()"
        role="complementary"
        aria-label="Educational demo notice"
      >
        <div class="strip-inner">
          <svg class="strip-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
          </svg>
          <span class="strip-text">
            <strong>HIPAA-aware demo</strong>
            <span class="strip-dot" aria-hidden="true">&middot;</span>
            <span class="strip-detail">Synthetic patient data only &mdash; no real PHI is processed or stored.</span>
          </span>
        </div>

        <button
          type="button"
          class="strip-dismiss"
          (click)="dismiss()"
          aria-label="Dismiss notice"
          title="Dismiss"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
    }
  `,
  styles: [`
    .hipaa-strip {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.75rem;
      background: linear-gradient(90deg, #1e1b4b 0%, #171335 100%);
      color: #94a3b8;
      padding: 0.3rem 1rem;
      border-bottom: 1px solid rgba(99, 102, 241, 0.2);
      font-size: 0.7rem;
      line-height: 1.3;
      overflow: hidden;
      animation: stripSlideDown 220ms cubic-bezier(0.4, 0, 0.2, 1);

      &.is-leaving {
        animation: stripSlideUp 200ms cubic-bezier(0.4, 0, 0.2, 1) forwards;
      }
    }

    .strip-inner {
      display: flex;
      align-items: center;
      gap: 0.45rem;
      min-width: 0;
      overflow: hidden;
    }

    .strip-icon {
      flex-shrink: 0;
      color: #818cf8;
    }

    .strip-text {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;

      strong {
        color: #e0e7ff;
        font-weight: 700;
      }
    }

    .strip-dot {
      margin: 0 0.15rem;
      color: #475569;
    }

    .strip-detail {
      color: #94a3b8;
    }

    .strip-dismiss {
      flex-shrink: 0;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 20px;
      height: 20px;
      border-radius: var(--radius-full);
      border: none;
      background: transparent;
      color: #64748b;
      cursor: pointer;
      transition: background-color var(--transition-fast), color var(--transition-fast);

      &:hover {
        background-color: rgba(148, 163, 184, 0.15);
        color: #e0e7ff;
      }
    }

    @media (max-width: 640px) {
      .strip-detail {
        display: none;
      }
    }

    @keyframes stripSlideDown {
      from { opacity: 0; max-height: 0; }
      to { opacity: 1; max-height: 40px; }
    }

    @keyframes stripSlideUp {
      from { opacity: 1; max-height: 40px; }
      to { opacity: 0; max-height: 0; padding-top: 0; padding-bottom: 0; }
    }

    @media (prefers-reduced-motion: reduce) {
      .hipaa-strip {
        animation: none !important;
      }
    }
  `]
})
export class HipaaBannerComponent implements OnInit {
  visible = signal(true);
  leaving = signal(false);

  constructor(private storage: StorageService) {}

  ngOnInit(): void {
    const dismissed = this.storage.getSession<boolean>(STORAGE_KEYS.HIPAA_BANNER_DISMISSED, false);
    if (dismissed) {
      this.visible.set(false);
    }
  }

  dismiss(): void {
    this.leaving.set(true);
    this.storage.setSession(STORAGE_KEYS.HIPAA_BANNER_DISMISSED, true);
    setTimeout(() => this.visible.set(false), 200);
  }
}
