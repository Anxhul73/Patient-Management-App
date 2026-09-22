import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmDialogService } from '../../../core/services/confirm-dialog.service';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (dialogService.activeDialog(); as dialog) {
      <div class="modal-backdrop" (click)="dialogService.handleCancel()">
        <div class="modal-content" (click)="$event.stopPropagation()" role="dialog" aria-modal="true">
          <div class="modal-header">
            <div class="modal-icon" [ngClass]="'icon-' + (dialog.options.type || 'primary')">
              @if (dialog.options.type === 'danger') {
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                  <line x1="12" y1="9" x2="12" y2="13"></line>
                  <line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
              } @else {
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="16" x2="12" y2="12"></line>
                  <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
              }
            </div>
            <div>
              <h3 class="modal-title">{{ dialog.options.title }}</h3>
              <p class="modal-message">{{ dialog.options.message }}</p>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" (click)="dialogService.handleCancel()">
              {{ dialog.options.cancelText || 'Cancel' }}
            </button>
            <button
              type="button"
              class="btn"
              [ngClass]="dialog.options.type === 'danger' ? 'btn-danger' : 'btn-primary'"
              (click)="dialogService.handleConfirm()"
            >
              {{ dialog.options.confirmText || 'Confirm' }}
            </button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .modal-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: var(--backdrop-overlay);
      backdrop-filter: blur(4px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9990;
      padding: 1rem;
      animation: fadeIn 0.15s ease-out;
    }

    .modal-content {
      background-color: var(--bg-surface);
      border: 1px solid var(--border-default);
      border-radius: var(--radius-xl);
      box-shadow: var(--shadow-xl);
      width: 100%;
      max-width: 480px;
      overflow: hidden;
      animation: scaleUp 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .modal-header {
      padding: 1.5rem 1.5rem 1.25rem;
      display: flex;
      gap: 1rem;
      align-items: flex-start;
    }

    .modal-icon {
      flex-shrink: 0;
      width: 44px;
      height: 44px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;

      &.icon-danger {
        background-color: var(--status-inactive-bg);
        color: #ef4444;
      }
      &.icon-warning {
        background-color: var(--status-pending-bg);
        color: #f59e0b;
      }
      &.icon-primary {
        background-color: var(--color-primary-light);
        color: var(--color-primary);
      }
    }

    .modal-title {
      font-size: 1.15rem;
      font-weight: 700;
      color: var(--text-primary);
      margin-bottom: 0.35rem;
    }

    .modal-message {
      font-size: 0.875rem;
      color: var(--text-secondary);
      line-height: 1.45;
    }

    .modal-footer {
      padding: 1rem 1.5rem;
      background-color: var(--bg-surface-muted);
      border-top: 1px solid var(--border-subtle);
      display: flex;
      justify-content: flex-end;
      gap: 0.75rem;
    }
  `]
})
export class ConfirmDialogComponent {
  constructor(public dialogService: ConfirmDialogService) {}
}
