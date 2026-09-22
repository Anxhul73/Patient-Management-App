import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="empty-state-wrapper">
      <div class="empty-icon-box">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
      </div>
      <h3 class="empty-title">{{ title }}</h3>
      <p class="empty-description">{{ description }}</p>
      @if (actionLabel) {
        <button type="button" class="btn btn-secondary empty-action-btn" (click)="actionClicked.emit()">
          {{ actionLabel }}
        </button>
      }
    </div>
  `,
  styles: [`
    .empty-state-wrapper {
      padding: 3.5rem 2rem;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }

    .empty-icon-box {
      width: 64px;
      height: 64px;
      border-radius: var(--radius-xl);
      background-color: var(--bg-surface-muted);
      color: var(--text-muted);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 1.25rem;
    }

    .empty-title {
      font-size: 1.15rem;
      font-weight: 700;
      color: var(--text-primary);
      margin-bottom: 0.35rem;
    }

    .empty-description {
      font-size: 0.875rem;
      color: var(--text-secondary);
      max-width: 380px;
      margin-bottom: 1.25rem;
      line-height: 1.45;
    }

    .empty-action-btn {
      margin-top: 0.25rem;
    }
  `]
})
export class EmptyStateComponent {
  @Input() title: string = 'No records found';
  @Input() description: string = 'Try adjusting your search criteria or clear current filters.';
  @Input() actionLabel?: string;
  @Output() actionClicked = new EventEmitter<void>();
}
