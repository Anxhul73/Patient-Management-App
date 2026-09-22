import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../../core/services/toast.service';
import { ToastNotification } from '../../../core/models/notification.model';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container" aria-live="polite" aria-atomic="true">
      @for (toast of toastService.toasts(); track toast.id) {
        <div class="toast-item toast-{{ toast.type }}" role="alert">
          <div class="toast-icon">
            @switch (toast.type) {
              @case ('success') {
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              }
              @case ('error') {
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="15" y1="9" x2="9" y2="15"></line>
                  <line x1="9" y1="9" x2="15" y2="15"></line>
                </svg>
              }
              @case ('warning') {
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path>
                  <line x1="12" y1="9" x2="12" y2="13"></line>
                  <line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
              }
              @default {
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="16" x2="12" y2="12"></line>
                  <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
              }
            }
          </div>
          <div class="toast-content">
            <div class="toast-title">{{ toast.title }}</div>
            <div class="toast-message">{{ toast.message }}</div>
          </div>
          <button type="button" class="toast-close" (click)="toastService.dismiss(toast.id)" aria-label="Dismiss notification">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      }
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      top: 1.5rem;
      right: 1.5rem;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      max-width: 420px;
      width: calc(100vw - 3rem);
      pointer-events: none;
    }

    .toast-item {
      display: flex;
      align-items: flex-start;
      gap: 0.85rem;
      padding: 1rem 1.15rem;
      border-radius: var(--radius-lg);
      background-color: var(--bg-surface-elevated);
      border: 1px solid var(--border-default);
      box-shadow: var(--shadow-xl);
      pointer-events: auto;
      animation: slideInRight 0.25s cubic-bezier(0.16, 1, 0.3, 1);
      position: relative;
      overflow: hidden;

      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        width: 4px;
      }
    }

    .toast-success {
      border-left-color: #10b981;
      .toast-icon { color: #10b981; }
      &::before { background-color: #10b981; }
    }

    .toast-error {
      border-left-color: #ef4444;
      .toast-icon { color: #ef4444; }
      &::before { background-color: #ef4444; }
    }

    .toast-warning {
      border-left-color: #f59e0b;
      .toast-icon { color: #f59e0b; }
      &::before { background-color: #f59e0b; }
    }

    .toast-info {
      border-left-color: #3b82f6;
      .toast-icon { color: #3b82f6; }
      &::before { background-color: #3b82f6; }
    }

    .toast-icon {
      flex-shrink: 0;
      margin-top: 0.1rem;
    }

    .toast-content {
      flex: 1;
      min-width: 0;
    }

    .toast-title {
      font-size: 0.9rem;
      font-weight: 700;
      color: var(--text-primary);
      margin-bottom: 0.2rem;
    }

    .toast-message {
      font-size: 0.8125rem;
      color: var(--text-secondary);
      line-height: 1.4;
      word-break: break-word;
    }

    .toast-close {
      background: transparent;
      border: none;
      color: var(--text-muted);
      cursor: pointer;
      padding: 0.2rem;
      margin: -0.2rem -0.2rem 0 0;
      border-radius: var(--radius-xs);
      transition: color var(--transition-fast);

      &:hover {
        color: var(--text-primary);
      }
    }

    @keyframes slideInRight {
      from {
        opacity: 0;
        transform: translateX(30px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }
  `]
})
export class ToastContainerComponent {
  constructor(public toastService: ToastService) {}
}
