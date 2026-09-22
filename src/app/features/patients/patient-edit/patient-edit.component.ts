import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule, ParamMap } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { PatientFormService } from '../../../core/services/patient-form.service';
import { PatientService } from '../../../core/services/patient.service';
import { ToastService } from '../../../core/services/toast.service';
import { Patient } from '../../../core/models/patient.model';
import {
  GENDER_OPTIONS,
  MARITAL_STATUS_OPTIONS,
  BLOOD_GROUP_OPTIONS,
  PATIENT_TYPE_OPTIONS,
  EMERGENCY_RELATIONSHIPS,
  SMOKING_STATUS_OPTIONS,
  INSURANCE_PROVIDERS,
  PRIMARY_PHYSICIANS
} from '../../../core/constants/app.constants';

@Component({
  selector: 'app-patient-edit',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  template: `
    @if (patient(); as p) {
      <div class="patient-edit-page">
        <!-- Header -->
        <div class="edit-header">
          <div>
            <div class="breadcrumb">
              <a routerLink="/patients">Patients</a>
              <span class="sep">/</span>
              <a [routerLink]="['/patients', p.id]">{{ p.id }}</a>
              <span class="sep">/</span>
              <span>Edit Record</span>
            </div>
            <h1 class="page-title">Edit Patient Record: {{ p.firstName }} {{ p.lastName }}</h1>
            <p class="page-subtitle">Update clinical, demographic, or emergency contact information.</p>
          </div>
          <div class="header-actions">
            <a [routerLink]="['/patients', p.id]" class="btn btn-secondary">Cancel</a>
            <button
              type="button"
              class="btn btn-primary"
              [disabled]="form.invalid || isSaving()"
              (click)="saveChanges()"
            >
              @if (isSaving()) {
                <span>Saving Changes...</span>
              } @else {
                <span>Save Patient Updates</span>
              }
            </button>
          </div>
        </div>

        <form [formGroup]="form" class="edit-form-stack">
          <!-- Section 1: Demographics -->
          <div class="card" formGroupName="demographics">
            <div class="card-header">
              <h3 class="card-title">1. Patient Demographics</h3>
            </div>
            <div class="card-body">
              <div class="form-grid-3">
                <div class="form-group">
                  <label for="eFirstName">First Name <span class="required-star">*</span></label>
                  <input id="eFirstName" type="text" formControlName="firstName" class="form-control" />
                </div>
                <div class="form-group">
                  <label for="eMiddleName">Middle Name</label>
                  <input id="eMiddleName" type="text" formControlName="middleName" class="form-control" />
                </div>
                <div class="form-group">
                  <label for="eLastName">Last Name <span class="required-star">*</span></label>
                  <input id="eLastName" type="text" formControlName="lastName" class="form-control" />
                </div>
              </div>

              <div class="form-grid-3">
                <div class="form-group">
                  <label for="eDob">Date of Birth <span class="required-star">*</span></label>
                  <input id="eDob" type="date" formControlName="dateOfBirth" class="form-control" />
                </div>
                <div class="form-group">
                  <label for="eGender">Gender <span class="required-star">*</span></label>
                  <select id="eGender" formControlName="gender" class="form-select">
                    @for (g of genderOptions; track g) {
                      <option [value]="g">{{ g }}</option>
                    }
                  </select>
                </div>
                <div class="form-group">
                  <label for="ePatientType">Patient Type / Admission <span class="required-star">*</span></label>
                  <select id="ePatientType" formControlName="patientType" class="form-select">
                    @for (pt of patientTypeOptions; track pt) {
                      <option [value]="pt">{{ pt }}</option>
                    }
                  </select>
                </div>
              </div>

              <div class="form-grid-3">
                <div class="form-group">
                  <label for="eMarital">Marital Status</label>
                  <select id="eMarital" formControlName="maritalStatus" class="form-select">
                    @for (m of maritalOptions; track m) {
                      <option [value]="m">{{ m }}</option>
                    }
                  </select>
                </div>
                <div class="form-group">
                  <label for="eBlood">Blood Group</label>
                  <select id="eBlood" formControlName="bloodGroup" class="form-select">
                    @for (b of bloodOptions; track b) {
                      <option [value]="b">{{ b }}</option>
                    }
                  </select>
                </div>
                <div class="form-group">
                  <label for="eNationality">Nationality</label>
                  <input id="eNationality" type="text" formControlName="nationality" class="form-control" />
                </div>
              </div>

              <div class="form-grid-3">
                <div class="form-group">
                  <label for="eLanguage">Preferred Language</label>
                  <input id="eLanguage" type="text" formControlName="preferredLanguage" class="form-control" />
                </div>
              </div>
            </div>
          </div>

          <!-- Section 2: Contact Information -->
          <div class="card" formGroupName="contact">
            <div class="card-header">
              <h3 class="card-title">2. Contact & Address</h3>
            </div>
            <div class="card-body">
              <div class="form-grid-2">
                <div class="form-group">
                  <label for="eEmail">Email Address <span class="required-star">*</span></label>
                  <input id="eEmail" type="email" formControlName="email" class="form-control" />
                </div>
                <div class="form-group">
                  <label for="ePhone">Primary Phone <span class="required-star">*</span></label>
                  <input id="ePhone" type="tel" formControlName="phone" class="form-control" />
                </div>
              </div>

              <div formGroupName="address">
                <div class="form-group">
                  <label for="eAddr1">Address Line 1 <span class="required-star">*</span></label>
                  <input id="eAddr1" type="text" formControlName="addressLine1" class="form-control" />
                </div>
                <div class="form-group">
                  <label for="eAddr2">Address Line 2</label>
                  <input id="eAddr2" type="text" formControlName="addressLine2" class="form-control" />
                </div>
                <div class="form-grid-3">
                  <div class="form-group">
                    <label for="eCity">City <span class="required-star">*</span></label>
                    <input id="eCity" type="text" formControlName="city" class="form-control" />
                  </div>
                  <div class="form-group">
                    <label for="eState">State <span class="required-star">*</span></label>
                    <input id="eState" type="text" formControlName="state" class="form-control" />
                  </div>
                  <div class="form-group">
                    <label for="eZip">ZIP Code <span class="required-star">*</span></label>
                    <input id="eZip" type="text" formControlName="zipCode" class="form-control" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Section 3: Medical Information & FormArray -->
          <div class="card" formGroupName="medical">
            <div class="card-header">
              <h3 class="card-title">3. Medical Profile & Dynamic FormArrays</h3>
            </div>
            <div class="card-body">
              <div class="form-grid-3">
                <div class="form-group">
                  <label for="ePhysician">Primary Physician <span class="required-star">*</span></label>
                  <select id="ePhysician" formControlName="primaryPhysician" class="form-select">
                    @for (doc of physicianOptions; track doc) {
                      <option [value]="doc">{{ doc }}</option>
                    }
                  </select>
                </div>
                <div class="form-group">
                  <label for="eInsurance">Insurance Provider <span class="required-star">*</span></label>
                  <select id="eInsurance" formControlName="insuranceProvider" class="form-select">
                    @for (ins of insuranceOptions; track ins) {
                      <option [value]="ins">{{ ins }}</option>
                    }
                  </select>
                </div>
                <div class="form-group">
                  <label for="eInsId">Insurance Member ID <span class="required-star">*</span></label>
                  <input id="eInsId" type="text" formControlName="insuranceId" class="form-control" />
                </div>
              </div>

              <!-- FormArray 1: Allergies -->
              <div class="formarray-box">
                <div class="fa-top">
                  <label class="fa-title">Allergies (FormArray)</label>
                  <button type="button" class="btn btn-outline btn-sm" (click)="formService.addAllergy()">+ Add Allergy</button>
                </div>
                <div formArrayName="allergies">
                  @for (a of formService.allergiesArray.controls; track $index) {
                    <div [formGroupName]="$index" class="fa-row">
                      <input type="text" formControlName="name" class="form-control" placeholder="Allergen Name" />
                      <select formControlName="severity" class="form-select">
                        <option value="Mild">Mild</option>
                        <option value="Moderate">Moderate</option>
                        <option value="Severe">Severe</option>
                      </select>
                      <button type="button" class="btn btn-danger-outline btn-sm" (click)="formService.removeAllergy($index)">Remove</button>
                    </div>
                  }
                </div>
              </div>

              <!-- FormArray 2: Medications -->
              <div class="formarray-box">
                <div class="fa-top">
                  <label class="fa-title">Current Medications (FormArray)</label>
                  <button type="button" class="btn btn-outline btn-sm" (click)="formService.addMedication()">+ Add Medication</button>
                </div>
                <div formArrayName="currentMedications">
                  @for (m of formService.medicationsArray.controls; track $index) {
                    <div [formGroupName]="$index" class="fa-card">
                      <div class="fa-card-top">
                        <span>Medication #{{ $index + 1 }}</span>
                        <button type="button" class="btn btn-danger-outline btn-sm" (click)="formService.removeMedication($index)">Remove</button>
                      </div>
                      <div class="form-grid-2">
                        <input type="text" formControlName="name" class="form-control" placeholder="Medication Name" />
                        <input type="text" formControlName="dosage" class="form-control" placeholder="Dosage (e.g. 20mg)" />
                        <input type="text" formControlName="frequency" class="form-control" placeholder="Frequency" />
                        <input type="date" formControlName="startDate" class="form-control" />
                      </div>
                    </div>
                  }
                </div>
              </div>

              <!-- Vitals -->
              <div formGroupName="vitals" class="form-grid-3">
                <div class="form-group">
                  <label for="eVitBp">Blood Pressure</label>
                  <input id="eVitBp" type="text" formControlName="bloodPressure" class="form-control" placeholder="120/80 mmHg" />
                </div>
                <div class="form-group">
                  <label for="eVitHt">Height (cm)</label>
                  <input id="eVitHt" type="number" formControlName="heightCm" class="form-control" />
                </div>
                <div class="form-group">
                  <label for="eVitWt">Weight (kg)</label>
                  <input id="eVitWt" type="number" formControlName="weightKg" class="form-control" />
                </div>
              </div>

              <div class="form-group">
                <label for="eConditions">Existing Diagnoses (Comma separated)</label>
                <input id="eConditions" type="text" formControlName="existingConditions" class="form-control" />
              </div>
            </div>
          </div>

          <!-- Section 4: Emergency Contact -->
          <div class="card" formGroupName="emergencyContact">
            <div class="card-header">
              <h3 class="card-title">4. Emergency Contact</h3>
            </div>
            <div class="card-body">
              <div class="form-grid-3">
                <div class="form-group">
                  <label for="eEmFirst">First Name <span class="required-star">*</span></label>
                  <input id="eEmFirst" type="text" formControlName="firstName" class="form-control" />
                </div>
                <div class="form-group">
                  <label for="eEmLast">Last Name <span class="required-star">*</span></label>
                  <input id="eEmLast" type="text" formControlName="lastName" class="form-control" />
                </div>
                <div class="form-group">
                  <label for="eEmRel">Relationship</label>
                  <select id="eEmRel" formControlName="relationship" class="form-select">
                    @for (rel of relationshipOptions; track rel) {
                      <option [value]="rel">{{ rel }}</option>
                    }
                  </select>
                </div>
              </div>
              <div class="form-grid-2">
                <div class="form-group">
                  <label for="eEmPhone">Emergency Phone <span class="required-star">*</span></label>
                  <input id="eEmPhone" type="tel" formControlName="phone" class="form-control" />
                </div>
                <div class="form-group">
                  <label for="eEmEmail">Emergency Email</label>
                  <input id="eEmEmail" type="email" formControlName="email" class="form-control" />
                </div>
              </div>
            </div>
          </div>

          <div class="bottom-actions">
            <a [routerLink]="['/patients', p.id]" class="btn btn-secondary">Cancel</a>
            <button
              type="button"
              class="btn btn-primary btn-lg"
              [disabled]="form.invalid || isSaving()"
              (click)="saveChanges()"
            >
              Save Patient Record Updates
            </button>
          </div>
        </form>
      </div>
    }
  `,
  styles: [`
    .patient-edit-page {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      max-width: 1040px;
      margin: 0 auto;
    }

    .edit-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 1.5rem;
      flex-wrap: wrap;
    }

    .breadcrumb {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.8125rem;
      color: var(--text-muted);
      margin-bottom: 0.25rem;

      a {
        color: var(--text-link);
      }
    }

    .page-title {
      font-size: 1.65rem;
      font-weight: 800;
    }

    .page-subtitle {
      font-size: 0.875rem;
      color: var(--text-secondary);
    }

    .header-actions {
      display: flex;
      gap: 0.75rem;
    }

    .edit-form-stack {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .formarray-box {
      background-color: var(--bg-surface-muted);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-md);
      padding: 1.25rem;
      margin-bottom: 1.25rem;
    }

    .fa-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.85rem;
    }

    .fa-title {
      font-weight: 700;
      font-size: 0.9rem;
    }

    .fa-row {
      display: flex;
      gap: 0.75rem;
      margin-bottom: 0.65rem;
      align-items: center;
    }

    .fa-card {
      background-color: var(--bg-surface);
      border: 1px solid var(--border-default);
      border-radius: var(--radius-sm);
      padding: 1rem;
      margin-bottom: 0.75rem;
    }

    .fa-card-top {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.5rem;
      font-size: 0.8125rem;
      font-weight: 700;
      color: var(--color-primary);
    }

    .bottom-actions {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      padding: 1rem 0 2rem;
    }
  `]
})
export class PatientEditComponent implements OnInit {
  public formService = inject(PatientFormService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private patientService = inject(PatientService);
  private toastService = inject(ToastService);

  patient = signal<Patient | null>(null);
  form = this.formService.patientForm;
  isSaving = signal<boolean>(false);

  genderOptions = GENDER_OPTIONS;
  patientTypeOptions = PATIENT_TYPE_OPTIONS;
  maritalOptions = MARITAL_STATUS_OPTIONS;
  bloodOptions = BLOOD_GROUP_OPTIONS;
  relationshipOptions = EMERGENCY_RELATIONSHIPS;
  smokingOptions = SMOKING_STATUS_OPTIONS;
  insuranceOptions = INSURANCE_PROVIDERS;
  physicianOptions = PRIMARY_PHYSICIANS;

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      const id = params.get('id');
      if (id) {
        const found = this.patientService.getPatientById(id);
        if (found) {
          this.patient.set(found);
          this.formService.populateFromPatient(found);
        } else {
          this.toastService.error('Record Missing', `Patient ${id} could not be located.`);
          this.router.navigate(['/patients']);
        }
      }
    });
  }

  async saveChanges(): Promise<void> {
    const current = this.patient();
    if (!current) return;

    if (this.form.invalid) {
      this.toastService.warning('Validation Check', 'Please correct any highlighted field errors before saving.');
      return;
    }

    this.isSaving.set(true);
    try {
      const payload = this.formService.toPatientPayload();
      await this.patientService.updatePatient(current.id, payload);
      this.router.navigate(['/patients', current.id]);
    } catch (error) {
      this.toastService.error('Update Error', 'Could not save updates to patient record.');
    } finally {
      this.isSaving.set(false);
    }
  }
}
