import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormArray } from '@angular/forms';
import { PatientFormService } from '../../../core/services/patient-form.service';
import { PatientService } from '../../../core/services/patient.service';
import { ToastService } from '../../../core/services/toast.service';
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
  selector: 'app-patient-wizard',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  template: `
    <div class="wizard-page">
      <!-- Wizard Page Header -->
      <div class="wizard-header">
        <div>
          <div class="wizard-breadcrumb">
            <a routerLink="/patients">Patients</a>
            <span class="separator">/</span>
            <span>New Patient Registration Wizard</span>
          </div>
          <h1 class="wizard-title">Register New Patient</h1>
          <p class="wizard-subtitle">Complete the multi-step clinical intake workflow to enroll a synthetic patient chart.</p>
        </div>

        <!-- Wizard Draft Action Controls -->
        <div class="draft-actions">
          @if (formService.hasDraftSignal()) {
            <button type="button" class="btn btn-outline btn-sm" (click)="restoreDraft()">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path>
                <path d="M21 3v5h-5"></path>
              </svg>
              <span>Restore Session Draft</span>
            </button>
            <button type="button" class="btn btn-ghost btn-sm" (click)="clearDraft()">
              Clear Draft
            </button>
          }
          <button type="button" class="btn btn-secondary btn-sm" (click)="saveDraftManual()">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
              <polyline points="17 21 17 13 7 13 7 21"></polyline>
              <polyline points="7 3 7 8 15 8"></polyline>
            </svg>
            <span>Save Progress</span>
          </button>
        </div>
      </div>

      <!-- Visual Progress Bar & Stepper Indicator -->
      <div class="card stepper-card">
        <div class="stepper-progress-track">
          <div class="stepper-progress-fill" [style.width.%]="(currentStep() / 5) * 100"></div>
        </div>
        <div class="steps-nav">
          <div
            class="step-node"
            [class.active]="currentStep() === 1"
            [class.completed]="currentStep() > 1"
            (click)="goToStep(1)"
          >
            <div class="step-circle">{{ currentStep() > 1 ? '✓' : '1' }}</div>
            <div class="step-label-group">
              <span class="step-num">Step 1</span>
              <span class="step-name">Demographics</span>
            </div>
          </div>

          <div
            class="step-node"
            [class.active]="currentStep() === 2"
            [class.completed]="currentStep() > 2"
            (click)="goToStep(2)"
          >
            <div class="step-circle">{{ currentStep() > 2 ? '✓' : '2' }}</div>
            <div class="step-label-group">
              <span class="step-num">Step 2</span>
              <span class="step-name">Contact Info</span>
            </div>
          </div>

          <div
            class="step-node"
            [class.active]="currentStep() === 3"
            [class.completed]="currentStep() > 3"
            (click)="goToStep(3)"
          >
            <div class="step-circle">{{ currentStep() > 3 ? '✓' : '3' }}</div>
            <div class="step-label-group">
              <span class="step-num">Step 3</span>
              <span class="step-name">Medical & FormArray</span>
            </div>
          </div>

          <div
            class="step-node"
            [class.active]="currentStep() === 4"
            [class.completed]="currentStep() > 4"
            (click)="goToStep(4)"
          >
            <div class="step-circle">{{ currentStep() > 4 ? '✓' : '4' }}</div>
            <div class="step-label-group">
              <span class="step-num">Step 4</span>
              <span class="step-name">Emergency Contact</span>
            </div>
          </div>

          <div
            class="step-node"
            [class.active]="currentStep() === 5"
            (click)="goToStep(5)"
          >
            <div class="step-circle">5</div>
            <div class="step-label-group">
              <span class="step-num">Step 5</span>
              <span class="step-name">Review & Submit</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Wizard Form Body -->
      <form [formGroup]="form" class="wizard-form-container">
        <!-- ================= STEP 1: DEMOGRAPHICS ================= -->
        @if (currentStep() === 1) {
          <div class="card wizard-step-card" formGroupName="demographics">
            <div class="card-header">
              <div>
                <h3 class="card-title">1. Patient Demographics</h3>
                <p class="card-subtitle">Personal information and core biological demographics</p>
              </div>
              <span class="badge badge-info">Step 1 of 5</span>
            </div>
            <div class="card-body">
              <div class="form-grid-3">
                <div class="form-group">
                  <label for="firstName">First Name <span class="required-star">*</span></label>
                  <input
                    id="firstName"
                    type="text"
                    formControlName="firstName"
                    class="form-control"
                    placeholder="e.g. Eleanor"
                    [class.is-invalid]="isInvalid('demographics.firstName')"
                  />
                  @if (isInvalid('demographics.firstName')) {
                    <div class="form-error">First name is required (min 2 chars).</div>
                  }
                </div>

                <div class="form-group">
                  <label for="middleName">Middle Name <span class="helper-hint">(Optional)</span></label>
                  <input
                    id="middleName"
                    type="text"
                    formControlName="middleName"
                    class="form-control"
                    placeholder="e.g. Jean"
                  />
                </div>

                <div class="form-group">
                  <label for="lastName">Last Name <span class="required-star">*</span></label>
                  <input
                    id="lastName"
                    type="text"
                    formControlName="lastName"
                    class="form-control"
                    placeholder="e.g. Vance"
                    [class.is-invalid]="isInvalid('demographics.lastName')"
                  />
                  @if (isInvalid('demographics.lastName')) {
                    <div class="form-error">Last name is required.</div>
                  }
                </div>
              </div>

              <div class="form-grid-3">
                <div class="form-group">
                  <label for="dateOfBirth">Date of Birth <span class="required-star">*</span></label>
                  <input
                    id="dateOfBirth"
                    type="date"
                    formControlName="dateOfBirth"
                    class="form-control"
                    [class.is-invalid]="isInvalid('demographics.dateOfBirth')"
                  />
                  @if (isInvalid('demographics.dateOfBirth')) {
                    <div class="form-error">Date of birth is required.</div>
                  }
                </div>

                <div class="form-group">
                  <label for="gender">Gender <span class="required-star">*</span></label>
                  <select
                    id="gender"
                    formControlName="gender"
                    class="form-select"
                    [class.is-invalid]="isInvalid('demographics.gender')"
                  >
                    <option value="" disabled>Select Gender</option>
                    @for (g of genderOptions; track g) {
                      <option [value]="g">{{ g }}</option>
                    }
                  </select>
                  @if (isInvalid('demographics.gender')) {
                    <div class="form-error">Please select gender identity.</div>
                  }
                </div>

                <div class="form-group">
                  <label for="patientType">Patient Type / Admission <span class="required-star">*</span></label>
                  <select
                    id="patientType"
                    formControlName="patientType"
                    class="form-select"
                    [class.is-invalid]="isInvalid('demographics.patientType')"
                  >
                    @for (pt of patientTypeOptions; track pt) {
                      <option [value]="pt">{{ pt }}</option>
                    }
                  </select>
                </div>
              </div>

              <div class="form-grid-3">
                <div class="form-group">
                  <label for="maritalStatus">Marital Status <span class="required-star">*</span></label>
                  <select id="maritalStatus" formControlName="maritalStatus" class="form-select">
                    @for (m of maritalOptions; track m) {
                      <option [value]="m">{{ m }}</option>
                    }
                  </select>
                </div>

                <div class="form-group">
                  <label for="bloodGroup">Blood Group</label>
                  <select id="bloodGroup" formControlName="bloodGroup" class="form-select">
                    @for (b of bloodOptions; track b) {
                      <option [value]="b">{{ b }}</option>
                    }
                  </select>
                </div>

                <div class="form-group">
                  <label for="nationality">Nationality <span class="required-star">*</span></label>
                  <input
                    id="nationality"
                    type="text"
                    formControlName="nationality"
                    class="form-control"
                    placeholder="e.g. American"
                  />
                </div>
              </div>

              <div class="form-grid-3">
                <div class="form-group">
                  <label for="preferredLanguage">Preferred Language <span class="required-star">*</span></label>
                  <input
                    id="preferredLanguage"
                    type="text"
                    formControlName="preferredLanguage"
                    class="form-control"
                    placeholder="e.g. English, Spanish"
                  />
                </div>
              </div>
            </div>
          </div>
        }

        <!-- ================= STEP 2: CONTACT INFORMATION ================= -->
        @if (currentStep() === 2) {
          <div class="card wizard-step-card" formGroupName="contact">
            <div class="card-header">
              <div>
                <h3 class="card-title">2. Contact Information & Address</h3>
                <p class="card-subtitle">Primary digital communication channels and residential location</p>
              </div>
              <span class="badge badge-info">Step 2 of 5</span>
            </div>
            <div class="card-body">
              <div class="form-grid-2">
                <div class="form-group">
                  <label for="contactEmail">Email Address <span class="required-star">*</span></label>
                  <input
                    id="contactEmail"
                    type="email"
                    formControlName="email"
                    class="form-control"
                    placeholder="patient.demo@example.com"
                    [class.is-invalid]="isInvalid('contact.email')"
                  />
                  @if (isInvalid('contact.email')) {
                    <div class="form-error">A valid email address is required.</div>
                  }
                </div>

                <div class="form-group">
                  <label for="contactPhone">Primary Phone Number <span class="required-star">*</span></label>
                  <input
                    id="contactPhone"
                    type="tel"
                    formControlName="phone"
                    class="form-control"
                    placeholder="+1 (555) 000-0000"
                    [class.is-invalid]="isInvalid('contact.phone')"
                  />
                  @if (isInvalid('contact.phone')) {
                    <div class="form-error">Valid phone number format is required.</div>
                  }
                </div>
              </div>

              <div class="form-group">
                <label for="alternatePhone">Alternate Phone <span class="helper-hint">(Optional)</span></label>
                <input
                  id="alternatePhone"
                  type="tel"
                  formControlName="alternatePhone"
                  class="form-control"
                  placeholder="+1 (555) 000-0000"
                />
              </div>

              <div formGroupName="address" class="address-subgroup">
                <h4 class="subgroup-title">Residential Address</h4>
                <div class="form-group">
                  <label for="addressLine1">Address Line 1 <span class="required-star">*</span></label>
                  <input
                    id="addressLine1"
                    type="text"
                    formControlName="addressLine1"
                    class="form-control"
                    placeholder="Street address, P.O. box"
                    [class.is-invalid]="isInvalid('contact.address.addressLine1')"
                  />
                  @if (isInvalid('contact.address.addressLine1')) {
                    <div class="form-error">Street address is required.</div>
                  }
                </div>

                <div class="form-group">
                  <label for="addressLine2">Address Line 2 <span class="helper-hint">(Apartment, suite, unit)</span></label>
                  <input
                    id="addressLine2"
                    type="text"
                    formControlName="addressLine2"
                    class="form-control"
                    placeholder="Apt 4B"
                  />
                </div>

                <div class="form-grid-3">
                  <div class="form-group">
                    <label for="city">City <span class="required-star">*</span></label>
                    <input
                      id="city"
                      type="text"
                      formControlName="city"
                      class="form-control"
                      placeholder="e.g. Springfield"
                      [class.is-invalid]="isInvalid('contact.address.city')"
                    />
                    @if (isInvalid('contact.address.city')) {
                      <div class="form-error">City is required.</div>
                    }
                  </div>

                  <div class="form-group">
                    <label for="state">State / Province <span class="required-star">*</span></label>
                    <input
                      id="state"
                      type="text"
                      formControlName="state"
                      class="form-control"
                      placeholder="e.g. IL"
                      [class.is-invalid]="isInvalid('contact.address.state')"
                    />
                    @if (isInvalid('contact.address.state')) {
                      <div class="form-error">State is required.</div>
                    }
                  </div>

                  <div class="form-group">
                    <label for="zipCode">ZIP Code <span class="required-star">*</span></label>
                    <input
                      id="zipCode"
                      type="text"
                      formControlName="zipCode"
                      class="form-control"
                      placeholder="62704"
                      [class.is-invalid]="isInvalid('contact.address.zipCode')"
                    />
                    @if (isInvalid('contact.address.zipCode')) {
                      <div class="form-error">Valid 5-digit ZIP code is required.</div>
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
        }

        <!-- ================= STEP 3: MEDICAL INFORMATION & FORMARRAY ================= -->
        @if (currentStep() === 3) {
          <div class="card wizard-step-card" formGroupName="medical">
            <div class="card-header">
              <div>
                <h3 class="card-title">3. Medical Information & Clinical FormArrays</h3>
                <p class="card-subtitle">Physician assignment, insurance, dynamic allergies and active medications</p>
              </div>
              <span class="badge badge-info">Step 3 of 5</span>
            </div>
            <div class="card-body">
              <div class="form-grid-3">
                <div class="form-group">
                  <label for="primaryPhysician">Primary Attending Physician <span class="required-star">*</span></label>
                  <select
                    id="primaryPhysician"
                    formControlName="primaryPhysician"
                    class="form-select"
                    [class.is-invalid]="isInvalid('medical.primaryPhysician')"
                  >
                    <option value="" disabled>Select Primary Physician</option>
                    @for (doc of physicianOptions; track doc) {
                      <option [value]="doc">{{ doc }}</option>
                    }
                  </select>
                  @if (isInvalid('medical.primaryPhysician')) {
                    <div class="form-error">Please assign a primary physician.</div>
                  }
                </div>

                <div class="form-group">
                  <label for="insuranceProvider">Insurance Carrier <span class="required-star">*</span></label>
                  <select
                    id="insuranceProvider"
                    formControlName="insuranceProvider"
                    class="form-select"
                    [class.is-invalid]="isInvalid('medical.insuranceProvider')"
                  >
                    <option value="" disabled>Select Insurance Carrier</option>
                    @for (ins of insuranceOptions; track ins) {
                      <option [value]="ins">{{ ins }}</option>
                    }
                  </select>
                  @if (isInvalid('medical.insuranceProvider')) {
                    <div class="form-error">Insurance carrier is required.</div>
                  }
                </div>

                <div class="form-group">
                  <label for="insuranceId">Insurance Member ID <span class="required-star">*</span></label>
                  <input
                    id="insuranceId"
                    type="text"
                    formControlName="insuranceId"
                    class="form-control"
                    placeholder="e.g. BCBS-90218-X"
                    [class.is-invalid]="isInvalid('medical.insuranceId')"
                  />
                  @if (isInvalid('medical.insuranceId')) {
                    <div class="form-error">Insurance ID is required.</div>
                  }
                </div>
              </div>

              <!-- FORMARRAY 1: ALLERGIES -->
              <div class="formarray-section">
                <div class="formarray-header">
                  <div>
                    <h4 class="formarray-title">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                      </svg>
                      <span>Patient Allergies (Angular FormArray)</span>
                    </h4>
                    <span class="formarray-subtitle">Dynamically add or remove known allergens with clinical severity</span>
                  </div>
                  <button type="button" class="btn btn-outline btn-sm" (click)="formService.addAllergy()">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                      <line x1="12" y1="5" x2="12" y2="19"></line>
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                    <span>Add Allergy</span>
                  </button>
                </div>

                <div formArrayName="allergies" class="formarray-items-list">
                  @if (formService.allergiesArray.length === 0) {
                    <div class="empty-array-notice">No allergies currently registered for this patient. Click "Add Allergy" to specify.</div>
                  } @else {
                    @for (allergy of formService.allergiesArray.controls; track $index) {
                      <div [formGroupName]="$index" class="formarray-row-card">
                        <div class="form-group flex-2">
                          <label>Allergen Name <span class="required-star">*</span></label>
                          <input type="text" formControlName="name" class="form-control" placeholder="e.g. Penicillin, Peanuts, Latex" />
                        </div>
                        <div class="form-group flex-1">
                          <label>Severity</label>
                          <select formControlName="severity" class="form-select">
                            <option value="Mild">Mild</option>
                            <option value="Moderate">Moderate</option>
                            <option value="Severe">Severe (Anaphylaxis Risk)</option>
                          </select>
                        </div>
                        <button type="button" class="btn-remove-array-item" (click)="formService.removeAllergy($index)" title="Remove Allergy">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                          </svg>
                        </button>
                      </div>
                    }
                  }
                </div>
              </div>

              <!-- FORMARRAY 2: CURRENT MEDICATIONS -->
              <div class="formarray-section">
                <div class="formarray-header">
                  <div>
                    <h4 class="formarray-title">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <path d="m10 15 5-3-5-3v6Z"></path>
                      </svg>
                      <span>Current Medications (Angular FormArray&lt;FormGroup&gt;)</span>
                    </h4>
                    <span class="formarray-subtitle">Manage structured prescriptions: dosage, administration frequency, and start date</span>
                  </div>
                  <button type="button" class="btn btn-outline btn-sm" (click)="formService.addMedication()">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                      <line x1="12" y1="5" x2="12" y2="19"></line>
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                    <span>Add Medication</span>
                  </button>
                </div>

                <div formArrayName="currentMedications" class="formarray-items-list">
                  @if (formService.medicationsArray.length === 0) {
                    <div class="empty-array-notice">No active prescribed medications entered. Click "Add Medication" if prescribed.</div>
                  } @else {
                    @for (med of formService.medicationsArray.controls; track $index) {
                      <div [formGroupName]="$index" class="formarray-card-block">
                        <div class="card-sub-header">
                          <span class="med-badge">Medication #{{ $index + 1 }}</span>
                          <button type="button" class="btn btn-danger-outline btn-sm" (click)="formService.removeMedication($index)">
                            Remove
                          </button>
                        </div>
                        <div class="form-grid-2">
                          <div class="form-group">
                            <label>Medication Name <span class="required-star">*</span></label>
                            <input type="text" formControlName="name" class="form-control" placeholder="e.g. Lisinopril, Metformin" />
                          </div>
                          <div class="form-group">
                            <label>Dosage <span class="required-star">*</span></label>
                            <input type="text" formControlName="dosage" class="form-control" placeholder="e.g. 10 mg, 500 mcg" />
                          </div>
                        </div>
                        <div class="form-grid-2">
                          <div class="form-group">
                            <label>Administration Frequency <span class="required-star">*</span></label>
                            <input type="text" formControlName="frequency" class="form-control" placeholder="e.g. Once daily (Morning), Twice daily with food" />
                          </div>
                          <div class="form-group">
                            <label>Start Date <span class="required-star">*</span></label>
                            <input type="date" formControlName="startDate" class="form-control" />
                          </div>
                        </div>
                      </div>
                    }
                  }
                </div>
              </div>

              <!-- Vitals Subgroup -->
              <div formGroupName="vitals" class="vitals-subgroup">
                <h4 class="subgroup-title">Baseline Clinical Vitals</h4>
                <div class="form-grid-3">
                  <div class="form-group">
                    <label for="bloodPressure">Blood Pressure (mmHg)</label>
                    <input id="bloodPressure" type="text" formControlName="bloodPressure" class="form-control" placeholder="e.g. 120/80 mmHg" />
                  </div>
                  <div class="form-group">
                    <label for="heightCm">Height (cm)</label>
                    <input id="heightCm" type="number" formControlName="heightCm" class="form-control" placeholder="175" />
                  </div>
                  <div class="form-group">
                    <label for="weightKg">Weight (kg)</label>
                    <input id="weightKg" type="number" formControlName="weightKg" class="form-control" placeholder="72" />
                  </div>
                </div>
              </div>

              <!-- Other Medical Details -->
              <div class="form-grid-2">
                <div class="form-group">
                  <label for="existingConditions">Existing Diagnoses / Conditions <span class="helper-hint">(Comma separated)</span></label>
                  <input
                    id="existingConditions"
                    type="text"
                    formControlName="existingConditions"
                    class="form-control"
                    placeholder="e.g. Hypertension, Type 2 Diabetes, Asthma"
                  />
                </div>
                <div class="form-group">
                  <label for="smokingStatus">Smoking History</label>
                  <select id="smokingStatus" formControlName="smokingStatus" class="form-select">
                    @for (s of smokingOptions; track s) {
                      <option [value]="s">{{ s }}</option>
                    }
                  </select>
                </div>
              </div>

              <div class="form-group">
                <label for="emergencyNotes">Emergency Clinical Notes</label>
                <textarea
                  id="emergencyNotes"
                  formControlName="emergencyMedicalNotes"
                  class="form-control form-textarea"
                  placeholder="Special clinical instructions, contraindications, or emergency notes..."
                ></textarea>
              </div>
            </div>
          </div>
        }

        <!-- ================= STEP 4: EMERGENCY CONTACT ================= -->
        @if (currentStep() === 4) {
          <div class="card wizard-step-card" formGroupName="emergencyContact">
            <div class="card-header">
              <div>
                <h3 class="card-title">4. Emergency Contact Details</h3>
                <p class="card-subtitle">Designated next of kin or emergency proxy</p>
              </div>
              <span class="badge badge-info">Step 4 of 5</span>
            </div>
            <div class="card-body">
              <div class="form-grid-3">
                <div class="form-group">
                  <label for="emFirstName">Contact First Name <span class="required-star">*</span></label>
                  <input
                    id="emFirstName"
                    type="text"
                    formControlName="firstName"
                    class="form-control"
                    placeholder="e.g. Robert"
                    [class.is-invalid]="isInvalid('emergencyContact.firstName')"
                  />
                  @if (isInvalid('emergencyContact.firstName')) {
                    <div class="form-error">First name is required.</div>
                  }
                </div>

                <div class="form-group">
                  <label for="emLastName">Contact Last Name <span class="required-star">*</span></label>
                  <input
                    id="emLastName"
                    type="text"
                    formControlName="lastName"
                    class="form-control"
                    placeholder="e.g. Vance"
                    [class.is-invalid]="isInvalid('emergencyContact.lastName')"
                  />
                  @if (isInvalid('emergencyContact.lastName')) {
                    <div class="form-error">Last name is required.</div>
                  }
                </div>

                <div class="form-group">
                  <label for="emRelationship">Relationship <span class="required-star">*</span></label>
                  <select id="emRelationship" formControlName="relationship" class="form-select">
                    @for (rel of relationshipOptions; track rel) {
                      <option [value]="rel">{{ rel }}</option>
                    }
                  </select>
                </div>
              </div>

              <div class="form-grid-3">
                <div class="form-group">
                  <label for="emPhone">Emergency Phone <span class="required-star">*</span></label>
                  <input
                    id="emPhone"
                    type="tel"
                    formControlName="phone"
                    class="form-control"
                    placeholder="+1 (555) 000-0000"
                    [class.is-invalid]="isInvalid('emergencyContact.phone')"
                  />
                  @if (isInvalid('emergencyContact.phone')) {
                    <div class="form-error">Valid emergency phone number is required.</div>
                  }
                </div>

                <div class="form-group">
                  <label for="emAltPhone">Alternate Phone</label>
                  <input id="emAltPhone" type="tel" formControlName="alternatePhone" class="form-control" placeholder="+1 (555) 000-0000" />
                </div>

                <div class="form-group">
                  <label for="emEmail">Email Address</label>
                  <input id="emEmail" type="email" formControlName="email" class="form-control" placeholder="contact@example.com" />
                </div>
              </div>

              <div class="form-group">
                <label for="emAddress">Full Physical Address</label>
                <input id="emAddress" type="text" formControlName="address" class="form-control" placeholder="Street, City, State ZIP" />
              </div>
            </div>
          </div>
        }

        <!-- ================= STEP 5: REVIEW & SUBMIT ================= -->
        @if (currentStep() === 5) {
          <div class="card wizard-step-card review-step-card">
            <div class="card-header">
              <div>
                <h3 class="card-title">5. Review & Final Confirmation</h3>
                <p class="card-subtitle">Verify synthetic patient details before committing chart to dataset</p>
              </div>
              <span class="badge badge-active">Final Verification</span>
            </div>
            <div class="card-body review-cards-container">
              <!-- Demographics Review Box -->
              <div class="review-section-box">
                <div class="review-box-header">
                  <h4>1. Demographics</h4>
                  <button type="button" class="btn btn-outline btn-sm" (click)="goToStep(1)">Edit</button>
                </div>
                <div class="review-grid">
                  <div><strong>Full Name:</strong> {{ form.value.demographics?.firstName }} {{ form.value.demographics?.middleName }} {{ form.value.demographics?.lastName }}</div>
                  <div><strong>Date of Birth:</strong> {{ form.value.demographics?.dateOfBirth }}</div>
                  <div><strong>Gender:</strong> {{ form.value.demographics?.gender }}</div>
                  <div><strong>Admission Type:</strong> {{ form.value.demographics?.patientType }}</div>
                  <div><strong>Marital Status:</strong> {{ form.value.demographics?.maritalStatus }}</div>
                  <div><strong>Blood Group:</strong> {{ form.value.demographics?.bloodGroup }}</div>
                  <div><strong>Nationality:</strong> {{ form.value.demographics?.nationality }}</div>
                </div>
              </div>

              <!-- Contact Review Box -->
              <div class="review-section-box">
                <div class="review-box-header">
                  <h4>2. Contact & Address</h4>
                  <button type="button" class="btn btn-outline btn-sm" (click)="goToStep(2)">Edit</button>
                </div>
                <div class="review-grid">
                  <div><strong>Email:</strong> {{ form.value.contact?.email }}</div>
                  <div><strong>Phone:</strong> {{ form.value.contact?.phone }}</div>
                  <div class="span-2">
                    <strong>Address:</strong>
                    {{ form.value.contact?.address?.addressLine1 }} {{ form.value.contact?.address?.addressLine2 }},
                    {{ form.value.contact?.address?.city }}, {{ form.value.contact?.address?.state }} {{ form.value.contact?.address?.zipCode }}
                  </div>
                </div>
              </div>

              <!-- Medical Review Box -->
              <div class="review-section-box">
                <div class="review-box-header">
                  <h4>3. Medical Profile & FormArray Regimen</h4>
                  <button type="button" class="btn btn-outline btn-sm" (click)="goToStep(3)">Edit</button>
                </div>
                <div class="review-grid">
                  <div><strong>Primary Physician:</strong> {{ form.value.medical?.primaryPhysician }}</div>
                  <div><strong>Insurance Carrier:</strong> {{ form.value.medical?.insuranceProvider }} ({{ form.value.medical?.insuranceId }})</div>
                  <div class="span-2">
                    <strong>Allergies ({{ formService.allergiesArray.length }}):</strong>
                    @if (formService.allergiesArray.length === 0) {
                      <span> None recorded</span>
                    } @else {
                      <div class="chips-list">
                        @for (allergy of form.value.medical?.allergies; track $index) {
                          <span class="chip chip-warning">{{ allergy.name }} ({{ allergy.severity }})</span>
                        }
                      </div>
                    }
                  </div>
                  <div class="span-2">
                    <strong>Medications ({{ formService.medicationsArray.length }}):</strong>
                    @if (formService.medicationsArray.length === 0) {
                      <span> None recorded</span>
                    } @else {
                      <ul class="review-med-list">
                        @for (m of form.value.medical?.currentMedications; track $index) {
                          <li><strong>{{ m.name }}</strong> — {{ m.dosage }}, {{ m.frequency }} (Started {{ m.startDate }})</li>
                        }
                      </ul>
                    }
                  </div>
                </div>
              </div>

              <!-- Emergency Review Box -->
              <div class="review-section-box">
                <div class="review-box-header">
                  <h4>4. Emergency Contact</h4>
                  <button type="button" class="btn btn-outline btn-sm" (click)="goToStep(4)">Edit</button>
                </div>
                <div class="review-grid">
                  <div><strong>Contact Name:</strong> {{ form.value.emergencyContact?.firstName }} {{ form.value.emergencyContact?.lastName }} ({{ form.value.emergencyContact?.relationship }})</div>
                  <div><strong>Phone:</strong> {{ form.value.emergencyContact?.phone }}</div>
                  <div><strong>Email:</strong> {{ form.value.emergencyContact?.email || 'N/A' }}</div>
                </div>
              </div>

              <!-- Confirmation Checkbox -->
              <div class="confirmation-box" formGroupName="confirmation">
                <label class="checkbox-label confirm-label">
                  <input type="checkbox" formControlName="confirmAccuracy" />
                  <span>By checking this box, I confirm that the synthetic patient record details entered are accurate and ready for enrollment.</span>
                </label>
              </div>
            </div>
          </div>
        }

        <!-- Wizard Navigation Buttons Bar -->
        <div class="wizard-footer-bar">
          <div class="footer-left">
            @if (currentStep() > 1) {
              <button type="button" class="btn btn-secondary" (click)="formService.previousStep()">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <line x1="19" y1="12" x2="5" y2="12"></line>
                  <polyline points="12 19 5 12 12 5"></polyline>
                </svg>
                <span>Back</span>
              </button>
            }
          </div>

          <div class="footer-right">
            <a routerLink="/patients" class="btn btn-ghost">Cancel</a>

            @if (currentStep() < 5) {
              <button type="button" class="btn btn-primary" (click)="formService.nextStep()">
                <span>Continue</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </button>
            } @else {
              <button
                type="button"
                class="btn btn-primary btn-lg"
                [disabled]="form.invalid || isSubmitting()"
                (click)="onSubmitPatient()"
              >
                @if (isSubmitting()) {
                  <span>Enrolling Patient Chart...</span>
                } @else {
                  <span>Complete Patient Enrollment</span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                }
              </button>
            }
          </div>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .wizard-page {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      max-width: 1040px;
      margin: 0 auto;
    }

    .wizard-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 1.5rem;
      flex-wrap: wrap;
    }

    .wizard-breadcrumb {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.8125rem;
      color: var(--text-muted);
      margin-bottom: 0.25rem;

      a {
        color: var(--text-link);
        text-decoration: none;
      }
    }

    .wizard-title {
      font-size: 1.75rem;
      font-weight: 800;
    }

    .wizard-subtitle {
      font-size: 0.875rem;
      color: var(--text-secondary);
      margin-top: 0.2rem;
    }

    .draft-actions {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      flex-wrap: wrap;
    }

    .stepper-card {
      padding: 1.25rem 1.75rem;
      position: relative;
      overflow: hidden;
    }

    .stepper-progress-track {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background-color: var(--bg-surface-muted);
    }

    .stepper-progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #2563eb, #10b981);
      transition: width 0.3s ease;
    }

    .steps-nav {
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: relative;

      @media (max-width: 768px) {
        overflow-x: auto;
        padding-bottom: 0.5rem;
      }
    }

    .step-node {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      cursor: pointer;
      opacity: 0.6;
      transition: all var(--transition-fast);

      &.active {
        opacity: 1;
        .step-circle {
          background-color: var(--color-primary);
          color: #ffffff;
          border-color: var(--color-primary);
          box-shadow: 0 0 0 3px var(--color-primary-light);
        }
        .step-name {
          color: var(--color-primary);
          font-weight: 700;
        }
      }

      &.completed {
        opacity: 1;
        .step-circle {
          background-color: var(--status-active-bg);
          color: var(--status-active-text);
          border-color: var(--status-active-border);
        }
      }
    }

    .step-circle {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      border: 2px solid var(--border-default);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.8125rem;
      font-weight: 700;
      background-color: var(--bg-surface);
      color: var(--text-secondary);
      transition: all var(--transition-fast);
      flex-shrink: 0;
    }

    .step-label-group {
      display: flex;
      flex-direction: column;
    }

    .step-num {
      font-size: 0.675rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--text-muted);
      font-weight: 700;
    }

    .step-name {
      font-size: 0.825rem;
      font-weight: 600;
      color: var(--text-primary);
      white-space: nowrap;
    }

    .wizard-form-container {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .wizard-step-card {
      animation: fadeIn 0.2s ease;
    }

    .subgroup-title {
      font-size: 0.95rem;
      font-weight: 700;
      color: var(--text-primary);
      margin: 1.25rem 0 0.85rem;
      padding-top: 1rem;
      border-top: 1px solid var(--border-subtle);
    }

    .formarray-section {
      background-color: var(--bg-surface-muted);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-lg);
      padding: 1.25rem;
      margin: 1.25rem 0;
    }

    .formarray-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .formarray-title {
      font-size: 0.95rem;
      font-weight: 700;
      color: var(--text-primary);
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .formarray-subtitle {
      font-size: 0.775rem;
      color: var(--text-muted);
    }

    .formarray-items-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .empty-array-notice {
      padding: 1.25rem;
      text-align: center;
      font-size: 0.825rem;
      color: var(--text-muted);
      background-color: var(--bg-surface);
      border: 1px dashed var(--border-default);
      border-radius: var(--radius-md);
    }

    .formarray-row-card {
      display: flex;
      align-items: flex-end;
      gap: 1rem;
      background-color: var(--bg-surface);
      padding: 1rem;
      border: 1px solid var(--border-default);
      border-radius: var(--radius-md);

      .form-group {
        margin-bottom: 0;
      }
      .flex-2 { flex: 2; }
      .flex-1 { flex: 1; }
    }

    .btn-remove-array-item {
      background: transparent;
      border: none;
      color: var(--text-muted);
      cursor: pointer;
      padding: 0.5rem;
      border-radius: var(--radius-sm);
      margin-bottom: 2px;

      &:hover {
        background-color: var(--status-inactive-bg);
        color: #ef4444;
      }
    }

    .formarray-card-block {
      background-color: var(--bg-surface);
      border: 1px solid var(--border-default);
      border-radius: var(--radius-md);
      padding: 1.25rem;
    }

    .card-sub-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.85rem;
    }

    .med-badge {
      font-size: 0.75rem;
      font-weight: 700;
      color: var(--color-primary);
      background-color: var(--color-primary-light);
      padding: 0.2rem 0.5rem;
      border-radius: var(--radius-xs);
    }

    .review-cards-container {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    .review-section-box {
      background-color: var(--bg-surface-muted);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-lg);
      padding: 1.25rem;
    }

    .review-box-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.85rem;
      border-bottom: 1px solid var(--border-subtle);
      padding-bottom: 0.5rem;

      h4 {
        font-size: 0.95rem;
        font-weight: 700;
      }
    }

    .review-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 0.75rem 1.25rem;
      font-size: 0.85rem;
      color: var(--text-secondary);

      .span-2 {
        grid-column: span 2;
      }
    }

    .chips-list {
      display: flex;
      flex-wrap: wrap;
      gap: 0.4rem;
      margin-top: 0.35rem;
    }

    .chip {
      display: inline-flex;
      align-items: center;
      padding: 0.2rem 0.6rem;
      border-radius: var(--radius-full);
      font-size: 0.75rem;
      font-weight: 600;

      &.chip-warning {
        background-color: var(--status-pending-bg);
        color: var(--status-pending-text);
      }
    }

    .review-med-list {
      padding-left: 1.25rem;
      margin-top: 0.35rem;
      li {
        margin-bottom: 0.25rem;
      }
    }

    .confirmation-box {
      margin-top: 1rem;
      padding: 1.25rem;
      background-color: var(--color-primary-light);
      border: 1px solid var(--color-primary-border);
      border-radius: var(--radius-lg);
    }

    .confirm-label {
      font-weight: 600;
      color: var(--text-primary);
      font-size: 0.875rem;
    }

    .wizard-footer-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 0;
    }

    .footer-right {
      display: flex;
      gap: 0.75rem;
      align-items: center;
    }
  `]
})
export class PatientWizardComponent implements OnInit {
  public formService = inject(PatientFormService);
  private patientService = inject(PatientService);
  private toastService = inject(ToastService);
  private router = inject(Router);

  currentStep = this.formService.currentStep;
  form = this.formService.patientForm;
  isSubmitting = signal<boolean>(false);

  genderOptions = GENDER_OPTIONS;
  patientTypeOptions = PATIENT_TYPE_OPTIONS;
  maritalOptions = MARITAL_STATUS_OPTIONS;
  bloodOptions = BLOOD_GROUP_OPTIONS;
  relationshipOptions = EMERGENCY_RELATIONSHIPS;
  smokingOptions = SMOKING_STATUS_OPTIONS;
  insuranceOptions = INSURANCE_PROVIDERS;
  physicianOptions = PRIMARY_PHYSICIANS;

  ngOnInit(): void {
    // Reset or prepare form
    if (this.formService.allergiesArray.length === 0 && this.currentStep() === 1) {
      // Provide clean default
    }
  }

  isInvalid(path: string): boolean {
    const control = this.form.get(path);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  goToStep(step: number): void {
    if (step < this.currentStep()) {
      this.formService.setStep(step);
    } else {
      if (this.formService.isCurrentStepValid(this.currentStep())) {
        this.formService.setStep(step);
      } else {
        this.formService.markStepAsTouched(this.currentStep());
        this.toastService.warning('Required Fields Missing', 'Complete current required inputs before jumping ahead.');
      }
    }
  }

  saveDraftManual(): void {
    this.formService.saveDraftToStorage();
    this.toastService.info('Draft Saved', 'Your progress has been preserved in session storage.');
  }

  restoreDraft(): void {
    this.formService.restoreDraft();
  }

  clearDraft(): void {
    this.formService.clearDraft();
  }

  async onSubmitPatient(): Promise<void> {
    if (this.form.invalid) {
      this.toastService.error('Incomplete Form', 'Please review all form sections and check the confirmation box.');
      return;
    }

    this.isSubmitting.set(true);
    try {
      const payload = this.formService.toPatientPayload();
      const created = await this.patientService.createPatient(payload);
      this.formService.clearDraft();
      this.router.navigate(['/patients', created.id]);
    } catch (error) {
      this.toastService.error('Registration Error', 'An error occurred while saving the patient record.');
    } finally {
      this.isSubmitting.set(false);
    }
  }
}
