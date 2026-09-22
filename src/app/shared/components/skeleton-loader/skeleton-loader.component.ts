import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-skeleton-loader',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (type === 'table') {
      <div class="skeleton-table">
        @for (row of countArray; track $index) {
          <div class="skeleton-row">
            <div class="skeleton skeleton-cell" style="width: 15%"></div>
            <div class="skeleton skeleton-cell" style="width: 25%"></div>
            <div class="skeleton skeleton-cell" style="width: 15%"></div>
            <div class="skeleton skeleton-cell" style="width: 15%"></div>
            <div class="skeleton skeleton-cell" style="width: 15%"></div>
            <div class="skeleton skeleton-cell" style="width: 15%"></div>
          </div>
        }
      </div>
    } @else if (type === 'cards') {
      <div class="skeleton-cards-grid">
        @for (item of countArray; track $index) {
          <div class="card skeleton-card">
            <div class="skeleton" style="width: 40%; height: 16px; margin-bottom: 12px;"></div>
            <div class="skeleton" style="width: 70%; height: 32px; margin-bottom: 8px;"></div>
            <div class="skeleton" style="width: 50%; height: 14px;"></div>
          </div>
        }
      </div>
    } @else {
      <div class="skeleton-generic">
        <div class="skeleton" [style.height.px]="height" [style.width]="width"></div>
      </div>
    }
  `,
  styles: [`
    .skeleton-table {
      padding: 1rem;
    }
    .skeleton-row {
      display: flex;
      gap: 1rem;
      padding: 1rem 0;
      border-bottom: 1px solid var(--border-subtle);
    }
    .skeleton-cell {
      height: 20px;
    }
    .skeleton-cards-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
      gap: 1.25rem;
    }
    .skeleton-card {
      padding: 1.5rem;
      min-height: 140px;
    }
  `]
})
export class SkeletonLoaderComponent {
  @Input() type: 'table' | 'cards' | 'generic' = 'generic';
  @Input() count: number = 4;
  @Input() height: number = 24;
  @Input() width: string = '100%';

  get countArray(): number[] {
    return Array.from({ length: this.count });
  }
}
