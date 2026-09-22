import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PatientStatus } from '../../../core/models/patient.model';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span class="badge" [ngClass]="badgeClass">
      <span class="badge-dot"></span>
      <span>{{ status }}</span>
    </span>
  `,
  styles: [`
    :host {
      display: inline-block;
    }
  `]
})
export class StatusBadgeComponent {
  @Input() status: PatientStatus | string = 'Active';

  get badgeClass(): string {
    const s = this.status?.toLowerCase();
    if (s === 'active') return 'badge-active';
    if (s === 'inactive' || s === 'archived') return 'badge-inactive';
    if (s === 'pending' || s === 'review') return 'badge-pending';
    return 'badge-info';
  }
}
