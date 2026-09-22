import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule, ParamMap } from '@angular/router';
import { PatientService } from '../../../core/services/patient.service';
import { ConfirmDialogService } from '../../../core/services/confirm-dialog.service';
import { ToastService } from '../../../core/services/toast.service';
import { Patient } from '../../../core/models/patient.model';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { AgePipe } from '../../../shared/pipes/age.pipe';

@Component({
  selector: 'app-patient-details',
  standalone: true,
  imports: [CommonModule, RouterModule, StatusBadgeComponent, AgePipe],
  template: `
    @if (patient(); as p) {
      <div class="patient-details-page">
        <!-- Breadcrumb & Header Bar -->
        <div class="details-top-bar">
          <div class="breadcrumb-trail">
            <a routerLink="/patients">Patients</a>
            <span class="sep">/</span>
            <span>{{ p.id }}</span>
          </div>

          <div class="profile-header-card card">
            <div class="profile-left">
              <div class="profile-avatar">
                {{ p.firstName.charAt(0) }}{{ p.lastName.charAt(0) }}
              </div>
              <div class="profile-meta">
                <div class="name-status-row">
                  <h1 class="profile-name">{{ p.firstName }} {{ p.middleName ? p.middleName + ' ' : '' }}{{ p.lastName }}</h1>
                  <app-status-badge [status]="p.status"></app-status-badge>
                </div>
                <div class="id-meta-row">
                  <span class="id-badge">{{ p.id }}</span>
                  <span>•</span>
                  <span>{{ p.gender }}</span>
                  <span>•</span>
                  <span>{{ p.dateOfBirth | age }} (DOB: {{ p.dateOfBirth }})</span>
                  <span>•</span>
                  <span>Blood Group: {{ p.bloodGroup || 'Unknown' }}</span>
                </div>
              </div>
            </div>

            <div class="profile-actions">
              <a [routerLink]="['/patients', p.id, 'edit']" class="btn btn-secondary">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
                <span>Edit Record</span>
              </a>

              <button
                type="button"
                class="btn btn-secondary"
                (click)="confirmToggleStatus(p)"
              >
                {{ p.status === 'Active' ? 'Deactivate' : 'Activate' }}
              </button>

              <button
                type="button"
                class="btn btn-danger-outline"
                (click)="confirmDelete(p)"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Navigation Tabs -->
        <div class="details-tabs-bar">
          <button
            type="button"
            class="tab-btn"
            [class.active]="activeTab() === 'overview'"
            (click)="activeTab.set('overview')"
          >
            Overview & Clinical Summary
          </button>
          <button
            type="button"
            class="tab-btn"
            [class.active]="activeTab() === 'medical'"
            (click)="activeTab.set('medical')"
          >
            Medical, Regimen & Vitals
          </button>
          <button
            type="button"
            class="tab-btn"
            [class.active]="activeTab() === 'contact'"
            (click)="activeTab.set('contact')"
          >
            Contact & Emergency
          </button>
          <button
            type="button"
            class="tab-btn"
            [class.active]="activeTab() === 'activity'"
            (click)="activeTab.set('activity')"
          >
            Audit & Timeline ({{ (p.activities || []).length }})
          </button>
        </div>

        <!-- Tab 1: Overview -->
        @if (activeTab() === 'overview') {
          <div class="tab-content-grid">
            <!-- Demographics Card -->
            <div class="card">
              <div class="card-header">
                <div class="card-title">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                  <span>Demographic Profile</span>
                </div>
              </div>
              <div class="card-body detail-grid">
                <div class="detail-item">
                  <span class="detail-label">Full Legal Name</span>
                  <span class="detail-val">{{ p.firstName }} {{ p.middleName }} {{ p.lastName }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Date of Birth</span>
                  <span class="detail-val">{{ p.dateOfBirth }} ({{ p.dateOfBirth | age }})</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Gender Identity</span>
                  <span class="detail-val">{{ p.gender }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Marital Status</span>
                  <span class="detail-val">{{ p.maritalStatus }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Blood Group</span>
                  <span class="detail-val">{{ p.bloodGroup || 'Unknown' }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Preferred Language</span>
                  <span class="detail-val">{{ p.preferredLanguage }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Nationality</span>
                  <span class="detail-val">{{ p.nationality }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Record Created</span>
                  <span class="detail-val">{{ p.createdAt | date:'medium' }}</span>
                </div>
              </div>
            </div>

            <!-- Insurance & Care Provider Card -->
            <div class="card">
              <div class="card-header">
                <div class="card-title">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="2" y="4" width="20" height="16" rx="2"></rect>
                    <line x1="2" y1="10" x2="22" y2="10"></line>
                  </svg>
                  <span>Care Provider & Insurance</span>
                </div>
              </div>
              <div class="card-body detail-grid">
                <div class="detail-item span-2">
                  <span class="detail-label">Primary Attending Physician</span>
                  <span class="detail-val text-bold">{{ p.medical.primaryPhysician }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Insurance Provider</span>
                  <span class="detail-val">{{ p.medical.insuranceProvider }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Member ID / Policy Number</span>
                  <span class="detail-val font-mono">{{ p.medical.insuranceId }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Smoking Status</span>
                  <span class="detail-val">{{ p.medical.smokingStatus }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Account Status</span>
                  <span class="detail-val">{{ p.status }}</span>
                </div>
              </div>
            </div>
          </div>
        }

        <!-- Tab 2: Medical Profile -->
        @if (activeTab() === 'medical') {
          <div class="medical-tab-stack">
            <!-- Vitals Grid -->
            <div class="card">
              <div class="card-header">
                <div class="card-title">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                  </svg>
                  <span>Recorded Clinical Vitals</span>
                </div>
              </div>
              <div class="card-body vitals-grid-cards">
                <div class="vital-mini-card">
                  <span class="v-label">Blood Pressure</span>
                  <span class="v-val">{{ p.medical.vitals?.bloodPressure || '120/80 mmHg' }}</span>
                </div>
                <div class="vital-mini-card">
                  <span class="v-label">Pulse Rate</span>
                  <span class="v-val">{{ p.medical.vitals?.pulseRate ? p.medical.vitals?.pulseRate + ' bpm' : '72 bpm' }}</span>
                </div>
                <div class="vital-mini-card">
                  <span class="v-label">Height</span>
                  <span class="v-val">{{ p.medical.vitals?.heightCm ? p.medical.vitals?.heightCm + ' cm' : '—' }}</span>
                </div>
                <div class="vital-mini-card">
                  <span class="v-label">Weight</span>
                  <span class="v-val">{{ p.medical.vitals?.weightKg ? p.medical.vitals?.weightKg + ' kg' : '—' }}</span>
                </div>
                <div class="vital-mini-card">
                  <span class="v-label">Body Mass Index (BMI)</span>
                  <span class="v-val">{{ p.medical.vitals?.bmi ? p.medical.vitals?.bmi : '22.4' }}</span>
                </div>
              </div>
            </div>

            <!-- Allergies & Medications Grid -->
            <div class="tab-content-grid">
              <!-- Allergies -->
              <div class="card">
                <div class="card-header">
                  <div class="card-title">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                    </svg>
                    <span>Allergies ({{ p.medical.allergies?.length || 0 }})</span>
                  </div>
                </div>
                <div class="card-body">
                  @if (!p.medical.allergies || p.medical.allergies.length === 0) {
                    <p class="empty-hint">No documented clinical allergies for this patient.</p>
                  } @else {
                    <div class="allergies-stack">
                      @for (a of p.medical.allergies; track a.name) {
                        <div class="allergy-row" [class.severe]="a.severity === 'Severe'">
                          <div>
                            <span class="allergy-name">{{ a.name }}</span>
                          </div>
                          <span class="badge" [ngClass]="a.severity === 'Severe' ? 'badge-inactive' : 'badge-pending'">
                            {{ a.severity }} Severity
                          </span>
                        </div>
                      }
                    </div>
                  }
                </div>
              </div>

              <!-- Active Medications -->
              <div class="card">
                <div class="card-header">
                  <div class="card-title">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <circle cx="12" cy="12" r="10"></circle>
                      <path d="m10 15 5-3-5-3v6Z"></path>
                    </svg>
                    <span>Current Medications ({{ p.medical.currentMedications?.length || 0 }})</span>
                  </div>
                </div>
                <div class="card-body">
                  @if (!p.medical.currentMedications || p.medical.currentMedications.length === 0) {
                    <p class="empty-hint">No active prescriptions entered in chart.</p>
                  } @else {
                    <div class="meds-stack">
                      @for (m of p.medical.currentMedications; track m.name) {
                        <div class="med-item-card">
                          <div class="med-top">
                            <span class="med-name">{{ m.name }}</span>
                            <span class="med-dosage-tag">{{ m.dosage }}</span>
                          </div>
                          <div class="med-details">
                            <span>Frequency: {{ m.frequency }}</span>
                            <span>•</span>
                            <span>Started: {{ m.startDate }}</span>
                          </div>
                        </div>
                      }
                    </div>
                  }
                </div>
              </div>
            </div>

            @if (p.medical.emergencyMedicalNotes) {
              <div class="card notes-card">
                <div class="card-header">
                  <div class="card-title">Emergency Clinical Notes</div>
                </div>
                <div class="card-body">
                  <p class="notes-text">{{ p.medical.emergencyMedicalNotes }}</p>
                </div>
              </div>
            }
          </div>
        }

        <!-- Tab 3: Contact & Emergency -->
        @if (activeTab() === 'contact') {
          <div class="tab-content-grid">
            <div class="card">
              <div class="card-header">
                <div class="card-title">Patient Contact & Residential Address</div>
              </div>
              <div class="card-body detail-grid">
                <div class="detail-item">
                  <span class="detail-label">Email Address</span>
                  <span class="detail-val">{{ p.contact.email }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Primary Phone</span>
                  <span class="detail-val">{{ p.contact.phone }}</span>
                </div>
                @if (p.contact.alternatePhone) {
                  <div class="detail-item">
                    <span class="detail-label">Alternate Phone</span>
                    <span class="detail-val">{{ p.contact.alternatePhone }}</span>
                  </div>
                }
                <div class="detail-item span-2">
                  <span class="detail-label">Physical Address</span>
                  <span class="detail-val">
                    {{ p.contact.address.addressLine1 }}
                    {{ p.contact.address.addressLine2 ? ', ' + p.contact.address.addressLine2 : '' }}<br />
                    {{ p.contact.address.city }}, {{ p.contact.address.state }} {{ p.contact.address.zipCode }}<br />
                    {{ p.contact.address.country }}
                  </span>
                </div>
              </div>
            </div>

            <div class="card">
              <div class="card-header">
                <div class="card-title">Emergency Contact Information</div>
              </div>
              <div class="card-body detail-grid">
                <div class="detail-item">
                  <span class="detail-label">Designated Contact</span>
                  <span class="detail-val font-bold">{{ p.emergencyContact.firstName }} {{ p.emergencyContact.lastName }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Relationship</span>
                  <span class="detail-val">{{ p.emergencyContact.relationship }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Emergency Phone</span>
                  <span class="detail-val font-bold">{{ p.emergencyContact.phone }}</span>
                </div>
                @if (p.emergencyContact.email) {
                  <div class="detail-item">
                    <span class="detail-label">Email</span>
                    <span class="detail-val">{{ p.emergencyContact.email }}</span>
                  </div>
                }
              </div>
            </div>
          </div>
        }

        <!-- Tab 4: Audit & Activity Timeline -->
        @if (activeTab() === 'activity') {
          <div class="card">
            <div class="card-header">
              <div class="card-title">Clinical Audit Log & Timeline</div>
              <span class="badge badge-info">HIPAA-Aware Logging Pattern</span>
            </div>
            <div class="card-body">
              @if (!p.activities || p.activities.length === 0) {
                <p class="empty-hint">No audit events recorded.</p>
              } @else {
                <div class="timeline-stack">
                  @for (act of p.activities; track act.id) {
                    <div class="timeline-node">
                      <div class="timeline-marker"></div>
                      <div class="timeline-content">
                        <div class="timeline-header">
                          <span class="timeline-action">{{ act.action }}</span>
                          <span class="timeline-time">{{ act.timestamp | date:'medium' }}</span>
                        </div>
                        <p class="timeline-desc">{{ act.description }}</p>
                        <span class="timeline-actor">Performed by: {{ act.performedBy }}</span>
                      </div>
                    </div>
                  }
                </div>
              }
            </div>
          </div>
        }
      </div>
    } @else {
      <div class="not-found-box card">
        <h2>Patient Record Not Found</h2>
        <p>The synthetic patient record you requested does not exist or has been removed.</p>
        <a routerLink="/patients" class="btn btn-primary">Return to Patients List</a>
      </div>
    }
  `,
  styles: [`
    .patient-details-page {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .breadcrumb-trail {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.8125rem;
      color: var(--text-muted);
      margin-bottom: 0.75rem;

      a {
        color: var(--text-link);
      }
    }

    .profile-header-card {
      padding: 1.5rem 1.75rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1.5rem;
      flex-wrap: wrap;
    }

    .profile-left {
      display: flex;
      align-items: center;
      gap: 1.25rem;
    }

    .profile-avatar {
      width: 58px;
      height: 58px;
      border-radius: 50%;
      background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
      color: #ffffff;
      font-size: 1.35rem;
      font-weight: 800;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
    }

    .name-status-row {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .profile-name {
      font-size: 1.5rem;
      font-weight: 800;
      letter-spacing: -0.02em;
    }

    .id-meta-row {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.8125rem;
      color: var(--text-secondary);
      margin-top: 0.25rem;
      flex-wrap: wrap;
    }

    .id-badge {
      font-family: monospace;
      font-weight: 700;
      color: var(--color-primary);
      background-color: var(--color-primary-light);
      padding: 0.15rem 0.45rem;
      border-radius: var(--radius-xs);
    }

    .profile-actions {
      display: flex;
      gap: 0.65rem;
      align-items: center;
      flex-wrap: wrap;
    }

    .details-tabs-bar {
      display: flex;
      gap: 0.5rem;
      border-bottom: 1px solid var(--border-default);
      overflow-x: auto;
    }

    .tab-btn {
      background: transparent;
      border: none;
      border-bottom: 2px solid transparent;
      padding: 0.75rem 1.25rem;
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--text-secondary);
      cursor: pointer;
      white-space: nowrap;
      transition: all var(--transition-fast);

      &:hover {
        color: var(--text-primary);
      }

      &.active {
        color: var(--color-primary);
        border-bottom-color: var(--color-primary);
        font-weight: 700;
      }
    }

    .tab-content-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;

      @media (max-width: 900px) {
        grid-template-columns: 1fr;
      }
    }

    .medical-tab-stack {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .detail-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.25rem;

      .span-2 {
        grid-column: span 2;
      }
    }

    .detail-item {
      display: flex;
      flex-direction: column;
      gap: 0.2rem;
    }

    .detail-label {
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      color: var(--text-muted);
    }

    .detail-val {
      font-size: 0.9rem;
      color: var(--text-primary);

      &.font-mono {
        font-family: monospace;
      }
      &.font-bold {
        font-weight: 700;
      }
    }

    .vitals-grid-cards {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
      gap: 1rem;
    }

    .vital-mini-card {
      background-color: var(--bg-surface-muted);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-md);
      padding: 1rem;
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .v-label {
      font-size: 0.75rem;
      color: var(--text-muted);
      font-weight: 600;
    }

    .v-val {
      font-size: 1.25rem;
      font-weight: 800;
      color: var(--text-primary);
    }

    .allergies-stack, .meds-stack {
      display: flex;
      flex-direction: column;
      gap: 0.65rem;
    }

    .allergy-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.65rem 0.85rem;
      background-color: var(--bg-surface-muted);
      border-radius: var(--radius-md);
      border-left: 3px solid #f59e0b;

      &.severe {
        border-left-color: #ef4444;
      }
    }

    .allergy-name {
      font-weight: 600;
      font-size: 0.875rem;
    }

    .med-item-card {
      padding: 0.75rem 0.85rem;
      background-color: var(--bg-surface-muted);
      border-radius: var(--radius-md);
      border: 1px solid var(--border-subtle);
    }

    .med-top {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.25rem;
    }

    .med-name {
      font-weight: 700;
      font-size: 0.9rem;
    }

    .med-dosage-tag {
      font-size: 0.75rem;
      font-weight: 700;
      color: var(--color-primary);
    }

    .med-details {
      display: flex;
      gap: 0.5rem;
      font-size: 0.775rem;
      color: var(--text-muted);
    }

    .timeline-stack {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
      position: relative;
      padding-left: 1.5rem;

      &::before {
        content: '';
        position: absolute;
        left: 6px;
        top: 6px;
        bottom: 6px;
        width: 2px;
        background-color: var(--border-default);
      }
    }

    .timeline-node {
      position: relative;
    }

    .timeline-marker {
      position: absolute;
      left: -1.5rem;
      top: 4px;
      width: 14px;
      height: 14px;
      border-radius: 50%;
      background-color: var(--color-primary);
      border: 3px solid var(--bg-surface);
    }

    .timeline-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.2rem;
    }

    .timeline-action {
      font-weight: 700;
      font-size: 0.875rem;
      color: var(--text-primary);
    }

    .timeline-time {
      font-size: 0.75rem;
      color: var(--text-muted);
    }

    .timeline-desc {
      font-size: 0.8125rem;
      color: var(--text-secondary);
      margin-bottom: 0.2rem;
    }

    .timeline-actor {
      font-size: 0.725rem;
      color: var(--text-muted);
      font-style: italic;
    }

    .not-found-box {
      padding: 3rem;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
    }
  `]
})
export class PatientDetailsComponent implements OnInit {
  patient = signal<Patient | null>(null);
  activeTab = signal<'overview' | 'medical' | 'contact' | 'activity'>('overview');

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private patientService: PatientService,
    private confirmService: ConfirmDialogService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      const id = params.get('id');
      if (id) {
        const found = this.patientService.getPatientById(id);
        this.patient.set(found || null);
      }
    });
  }

  async confirmToggleStatus(p: Patient): Promise<void> {
    const action = p.status === 'Active' ? 'Deactivate' : 'Activate';
    const confirmed = await this.confirmService.confirm({
      title: `${action} Patient Chart?`,
      message: `Change patient status for ${p.firstName} ${p.lastName} to ${p.status === 'Active' ? 'Inactive' : 'Active'}?`,
      confirmText: action
    });

    if (confirmed) {
      const updated = await this.patientService.togglePatientStatus(p.id);
      this.patient.set(updated);
    }
  }

  async confirmDelete(p: Patient): Promise<void> {
    const confirmed = await this.confirmService.confirm({
      title: 'Delete Patient Record?',
      message: `Permanently delete synthetic record for ${p.firstName} ${p.lastName} (${p.id})?`,
      confirmText: 'Delete Record',
      type: 'danger'
    });

    if (confirmed) {
      await this.patientService.deletePatient(p.id);
      this.router.navigate(['/patients']);
    }
  }
}
