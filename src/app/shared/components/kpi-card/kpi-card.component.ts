import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-kpi-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card kpi-card hover-lift" [class.highlight]="isHighlight">
      <div class="kpi-header">
        <span class="kpi-title">{{ title }}</span>
        <div class="kpi-icon-wrapper" [ngClass]="iconColorClass">
          <ng-content select="[kpi-icon]"></ng-content>
        </div>
      </div>
      <div class="kpi-body">
        <div class="kpi-value">{{ value }}</div>
        @if (changeText) {
          <div class="kpi-change" [ngClass]="changePositive ? 'positive' : 'negative'">
            <span class="change-arrow">{{ changePositive ? '↑' : '↓' }}</span>
            <span>{{ changeText }}</span>
          </div>
        }
      </div>
      @if (subtitle) {
        <div class="kpi-subtitle">{{ subtitle }}</div>
      }
    </div>
  `,
  styles: [`
    .kpi-card {
      padding: 1.35rem;
      border-radius: var(--radius-xl);
      position: relative;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      min-height: 140px;

      &.highlight {
        background: linear-gradient(135deg, var(--bg-surface) 0%, var(--color-primary-light) 100%);
        border-color: var(--color-primary-border);
      }
    }

    .kpi-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 0.75rem;
    }

    .kpi-title {
      font-size: 0.825rem;
      font-weight: 600;
      color: var(--text-secondary);
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    .kpi-icon-wrapper {
      width: 36px;
      height: 36px;
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: var(--bg-surface-muted);
      color: var(--text-secondary);
      transition: transform var(--transition-normal);

      .kpi-card:hover & {
        transform: scale(1.08) rotate(-4deg);
      }

      &.icon-blue {
        background-color: var(--color-primary-light);
        color: var(--color-primary);
      }
      &.icon-green {
        background-color: var(--status-active-bg);
        color: var(--status-active-text);
      }
      &.icon-teal {
        background-color: var(--color-secondary-light);
        color: var(--color-secondary);
      }
      &.icon-amber {
        background-color: var(--status-pending-bg);
        color: var(--status-pending-text);
      }
      &.icon-red {
        background-color: var(--status-inactive-bg);
        color: #ef4444;
      }
    }

    .kpi-body {
      display: flex;
      align-items: baseline;
      gap: 0.75rem;
      margin-bottom: 0.25rem;
    }

    .kpi-value {
      font-size: 1.85rem;
      font-weight: 800;
      color: var(--text-primary);
      letter-spacing: -0.03em;
      line-height: 1;
    }

    .kpi-change {
      display: inline-flex;
      align-items: center;
      gap: 0.2rem;
      font-size: 0.75rem;
      font-weight: 700;
      padding: 0.15rem 0.45rem;
      border-radius: var(--radius-full);

      &.positive {
        background-color: var(--status-active-bg);
        color: var(--status-active-text);
      }
      &.negative {
        background-color: var(--status-inactive-bg);
        color: #ef4444;
      }
    }

    .kpi-subtitle {
      font-size: 0.775rem;
      color: var(--text-muted);
      margin-top: 0.25rem;
    }
  `]
})
export class KpiCardComponent {
  @Input() title: string = '';
  @Input() value: string | number = '';
  @Input() changeText?: string;
  @Input() changePositive: boolean = true;
  @Input() subtitle?: string;
  @Input() iconColorClass: string = 'icon-blue';
  @Input() isHighlight: boolean = false;
}
