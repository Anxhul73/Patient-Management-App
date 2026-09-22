import { Injectable, signal, computed } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { StorageService } from './storage.service';
import { STORAGE_KEYS } from '../constants/app.constants';
import { Patient, Allergy, Medication } from '../models/patient.model';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class PatientFormService {
  public currentStepSignal = signal<number>(1);
  public currentStep = this.currentStepSignal.asReadonly();
  public isSubmitting = signal<boolean>(false);
  public hasDraftSignal = signal<boolean>(false);

  public patientForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private storage: StorageService,
    private toastService: ToastService
  ) {
    this.initForm();
    this.checkDraft();
  }

  public initForm(): void {
    this.patientForm = this.fb.group({
      // Step 1: Demographics
      demographics: this.fb.group({
        firstName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
        middleName: [''],
        lastName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
        dateOfBirth: ['', [Validators.required]],
        gender: ['', [Validators.required]],
        patientType: ['Outpatient', [Validators.required]],
        maritalStatus: ['Single', [Validators.required]],
        bloodGroup: ['Unknown'],
        nationality: ['American', [Validators.required]],
        preferredLanguage: ['English', [Validators.required]],
        profilePhoto: ['']
      }),

      // Step 2: Contact Info
      contact: this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        phone: ['', [Validators.required, Validators.pattern(/^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{6,15}$/)]],
        alternatePhone: [''],
        address: this.fb.group({
          addressLine1: ['', [Validators.required, Validators.minLength(3)]],
          addressLine2: [''],
          city: ['', [Validators.required]],
          state: ['', [Validators.required]],
          zipCode: ['', [Validators.required, Validators.pattern(/^[0-9]{5}(-[0-9]{4})?$/)]],
          country: ['United States', [Validators.required]]
        })
      }),

      // Step 3: Medical Info & FormArrays
      medical: this.fb.group({
        primaryPhysician: ['', [Validators.required]],
        insuranceProvider: ['', [Validators.required]],
        insuranceId: ['', [Validators.required]],
        allergies: this.fb.array<FormGroup>([]),
        currentMedications: this.fb.array<FormGroup>([]),
        existingConditions: [''],
        vitals: this.fb.group({
          bloodPressure: ['', [Validators.pattern(/^(\d{2,3})\/(\d{2,3})(\s*mmHg)?$/)]],
          heightCm: [null, [Validators.min(20), Validators.max(260)]],
          weightKg: [null, [Validators.min(1), Validators.max(400)]],
          pulseRate: [null, [Validators.min(30), Validators.max(250)]],
          temperature: [null, [Validators.min(90), Validators.max(110)]]
        }),
        smokingStatus: ['Never', [Validators.required]],
        emergencyMedicalNotes: ['']
      }),

      // Step 4: Emergency Contact
      emergencyContact: this.fb.group({
        firstName: ['', [Validators.required, Validators.minLength(2)]],
        lastName: ['', [Validators.required, Validators.minLength(2)]],
        relationship: ['Family', [Validators.required]],
        phone: ['', [Validators.required, Validators.pattern(/^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{6,15}$/)]],
        alternatePhone: [''],
        email: ['', [Validators.email]],
        address: ['']
      }),

      // Step 5: Confirmation
      confirmation: this.fb.group({
        confirmAccuracy: [false, [Validators.requiredTrue]]
      })
    });

    // Auto save draft on changes
    this.patientForm.valueChanges.subscribe((val) => {
      if (this.patientForm.dirty) {
        this.saveDraftToStorage();
      }
    });
  }

  // Getters for easy template access
  get demographicsGroup(): FormGroup {
    return this.patientForm.get('demographics') as FormGroup;
  }

  get contactGroup(): FormGroup {
    return this.patientForm.get('contact') as FormGroup;
  }

  get addressGroup(): FormGroup {
    return this.contactGroup.get('address') as FormGroup;
  }

  get medicalGroup(): FormGroup {
    return this.patientForm.get('medical') as FormGroup;
  }

  get vitalsGroup(): FormGroup {
    return this.medicalGroup.get('vitals') as FormGroup;
  }

  get emergencyGroup(): FormGroup {
    return this.patientForm.get('emergencyContact') as FormGroup;
  }

  get confirmationGroup(): FormGroup {
    return this.patientForm.get('confirmation') as FormGroup;
  }

  // FormArray accessors
  get allergiesArray(): FormArray {
    return this.medicalGroup.get('allergies') as FormArray;
  }

  get medicationsArray(): FormArray {
    return this.medicalGroup.get('currentMedications') as FormArray;
  }

  // FormArray helpers
  addAllergy(allergy?: Partial<Allergy>): void {
    const allergyForm = this.fb.group({
      name: [allergy?.name || '', [Validators.required, Validators.minLength(2)]],
      severity: [allergy?.severity || 'Moderate', [Validators.required]]
    });
    this.allergiesArray.push(allergyForm);
  }

  removeAllergy(index: number): void {
    this.allergiesArray.removeAt(index);
    this.saveDraftToStorage();
  }

  addMedication(med?: Partial<Medication>): void {
    const medForm = this.fb.group({
      name: [med?.name || '', [Validators.required, Validators.minLength(2)]],
      dosage: [med?.dosage || '', [Validators.required]],
      frequency: [med?.frequency || '', [Validators.required]],
      startDate: [med?.startDate || new Date().toISOString().substring(0, 10), [Validators.required]]
    });
    this.medicationsArray.push(medForm);
  }

  removeMedication(index: number): void {
    this.medicationsArray.removeAt(index);
    this.saveDraftToStorage();
  }

  // Step Validation & Navigation
  setStep(step: number): void {
    if (step >= 1 && step <= 5) {
      this.currentStepSignal.set(step);
    }
  }

  nextStep(): boolean {
    const current = this.currentStepSignal();
    if (!this.isCurrentStepValid(current)) {
      this.markStepAsTouched(current);
      this.toastService.warning('Validation Required', 'Please fill in all required fields accurately before proceeding.');
      return false;
    }

    if (current < 5) {
      this.currentStepSignal.set(current + 1);
      return true;
    }
    return false;
  }

  previousStep(): void {
    const current = this.currentStepSignal();
    if (current > 1) {
      this.currentStepSignal.set(current - 1);
    }
  }

  isCurrentStepValid(step: number): boolean {
    switch (step) {
      case 1:
        return this.demographicsGroup.valid;
      case 2:
        return this.contactGroup.valid;
      case 3:
        return this.medicalGroup.valid;
      case 4:
        return this.emergencyGroup.valid;
      case 5:
        return this.patientForm.valid;
      default:
        return false;
    }
  }

  markStepAsTouched(step: number): void {
    let targetGroup: FormGroup;
    switch (step) {
      case 1:
        targetGroup = this.demographicsGroup;
        break;
      case 2:
        targetGroup = this.contactGroup;
        break;
      case 3:
        targetGroup = this.medicalGroup;
        break;
      case 4:
        targetGroup = this.emergencyGroup;
        break;
      default:
        targetGroup = this.patientForm;
    }
    this.markAllControlsTouched(targetGroup);
  }

  private markAllControlsTouched(group: FormGroup): void {
    Object.keys(group.controls).forEach((key) => {
      const control = group.get(key);
      if (control instanceof FormGroup) {
        this.markAllControlsTouched(control);
      } else if (control instanceof FormArray) {
        control.controls.forEach((c) => {
          if (c instanceof FormGroup) this.markAllControlsTouched(c);
          else c.markAsTouched();
        });
      } else {
        control?.markAsTouched();
      }
    });
  }

  // Draft Management
  private checkDraft(): void {
    const draft = this.storage.getSession<any>(STORAGE_KEYS.PATIENT_FORM_DRAFT, null);
    this.hasDraftSignal.set(!!draft);
  }

  saveDraftToStorage(): void {
    const rawValue = this.patientForm.getRawValue();
    this.storage.setSession(STORAGE_KEYS.PATIENT_FORM_DRAFT, {
      formData: rawValue,
      step: this.currentStepSignal(),
      savedAt: new Date().toISOString()
    });
    this.hasDraftSignal.set(true);
  }

  restoreDraft(): boolean {
    const draft = this.storage.getSession<any>(STORAGE_KEYS.PATIENT_FORM_DRAFT, null);
    if (!draft || !draft.formData) {
      this.toastService.info('No Draft Found', 'No saved draft was found in current session.');
      return false;
    }

    this.populateForm(draft.formData);
    if (draft.step) {
      this.currentStepSignal.set(draft.step);
    }
    this.toastService.success('Draft Restored', 'Your previously saved patient registration progress has been restored.');
    return true;
  }

  clearDraft(): void {
    this.storage.removeSession(STORAGE_KEYS.PATIENT_FORM_DRAFT);
    this.hasDraftSignal.set(false);
    this.resetForm();
    this.toastService.info('Draft Cleared', 'Registration form draft has been cleared.');
  }

  resetForm(): void {
    this.allergiesArray.clear();
    this.medicationsArray.clear();
    this.patientForm.reset({
      demographics: {
        patientType: 'Outpatient',
        maritalStatus: 'Single',
        bloodGroup: 'Unknown',
        nationality: 'American',
        preferredLanguage: 'English'
      },
      contact: {
        address: {
          country: 'United States'
        }
      },
      medical: {
        smokingStatus: 'Never'
      },
      emergencyContact: {
        relationship: 'Family'
      },
      confirmation: {
        confirmAccuracy: false
      }
    });
    this.currentStepSignal.set(1);
  }

  // Populate from Existing Patient (e.g. for Edit or Load)
  populateFromPatient(patient: Patient): void {
    this.allergiesArray.clear();
    this.medicationsArray.clear();

    // Populate allergies FormArray
    if (patient.medical?.allergies && patient.medical.allergies.length > 0) {
      patient.medical.allergies.forEach((a) => this.addAllergy(a));
    }

    // Populate medications FormArray
    if (patient.medical?.currentMedications && patient.medical.currentMedications.length > 0) {
      patient.medical.currentMedications.forEach((m) => this.addMedication(m));
    }

    this.patientForm.patchValue({
      demographics: {
        firstName: patient.firstName,
        middleName: patient.middleName || '',
        lastName: patient.lastName,
        dateOfBirth: patient.dateOfBirth,
        gender: patient.gender,
        patientType: patient.patientType || 'Outpatient',
        maritalStatus: patient.maritalStatus,
        bloodGroup: patient.bloodGroup || 'Unknown',
        nationality: patient.nationality || 'American',
        preferredLanguage: patient.preferredLanguage || 'English',
        profilePhoto: patient.profilePhoto || ''
      },
      contact: {
        email: patient.contact?.email,
        phone: patient.contact?.phone,
        alternatePhone: patient.contact?.alternatePhone || '',
        address: {
          addressLine1: patient.contact?.address?.addressLine1,
          addressLine2: patient.contact?.address?.addressLine2 || '',
          city: patient.contact?.address?.city,
          state: patient.contact?.address?.state,
          zipCode: patient.contact?.address?.zipCode,
          country: patient.contact?.address?.country || 'United States'
        }
      },
      medical: {
        primaryPhysician: patient.medical?.primaryPhysician,
        insuranceProvider: patient.medical?.insuranceProvider,
        insuranceId: patient.medical?.insuranceId,
        existingConditions: Array.isArray(patient.medical?.existingConditions) ? patient.medical.existingConditions.join(', ') : '',
        vitals: {
          bloodPressure: patient.medical?.vitals?.bloodPressure || '',
          heightCm: patient.medical?.vitals?.heightCm || null,
          weightKg: patient.medical?.vitals?.weightKg || null,
          pulseRate: patient.medical?.vitals?.pulseRate || null,
          temperature: patient.medical?.vitals?.temperature || null
        },
        smokingStatus: patient.medical?.smokingStatus || 'Never',
        emergencyMedicalNotes: patient.medical?.emergencyMedicalNotes || ''
      },
      emergencyContact: {
        firstName: patient.emergencyContact?.firstName,
        lastName: patient.emergencyContact?.lastName,
        relationship: patient.emergencyContact?.relationship || 'Family',
        phone: patient.emergencyContact?.phone,
        alternatePhone: patient.emergencyContact?.alternatePhone || '',
        email: patient.emergencyContact?.email || '',
        address: patient.emergencyContact?.address || ''
      },
      confirmation: {
        confirmAccuracy: true
      }
    });
  }

  private populateForm(formData: any): void {
    this.allergiesArray.clear();
    this.medicationsArray.clear();

    if (formData.medical?.allergies && Array.isArray(formData.medical.allergies)) {
      formData.medical.allergies.forEach((a: any) => this.addAllergy(a));
    }

    if (formData.medical?.currentMedications && Array.isArray(formData.medical.currentMedications)) {
      formData.medical.currentMedications.forEach((m: any) => this.addMedication(m));
    }

    this.patientForm.patchValue(formData);
  }

  toPatientPayload(): Omit<Patient, 'id' | 'createdAt' | 'updatedAt' | 'activities'> {
    const val = this.patientForm.getRawValue();
    const existingConditionsArray = typeof val.medical.existingConditions === 'string'
      ? val.medical.existingConditions.split(',').map((c: string) => c.trim()).filter((c: string) => c.length > 0)
      : (val.medical.existingConditions || []);

    return {
      firstName: val.demographics.firstName.trim(),
      middleName: val.demographics.middleName?.trim() || undefined,
      lastName: val.demographics.lastName.trim(),
      dateOfBirth: val.demographics.dateOfBirth,
      gender: val.demographics.gender,
      patientType: val.demographics.patientType || 'Outpatient',
      maritalStatus: val.demographics.maritalStatus,
      bloodGroup: val.demographics.bloodGroup,
      nationality: val.demographics.nationality,
      preferredLanguage: val.demographics.preferredLanguage,
      profilePhoto: val.demographics.profilePhoto || undefined,
      contact: {
        email: val.contact.email.trim(),
        phone: val.contact.phone.trim(),
        alternatePhone: val.contact.alternatePhone?.trim() || undefined,
        address: {
          addressLine1: val.contact.address.addressLine1.trim(),
          addressLine2: val.contact.address.addressLine2?.trim() || undefined,
          city: val.contact.address.city.trim(),
          state: val.contact.address.state.trim(),
          zipCode: val.contact.address.zipCode.trim(),
          country: val.contact.address.country.trim()
        }
      },
      medical: {
        primaryPhysician: val.medical.primaryPhysician,
        insuranceProvider: val.medical.insuranceProvider,
        insuranceId: val.medical.insuranceId.trim(),
        allergies: val.medical.allergies || [],
        currentMedications: val.medical.currentMedications || [],
        existingConditions: existingConditionsArray,
        vitals: {
          bloodPressure: val.medical.vitals.bloodPressure || undefined,
          heightCm: val.medical.vitals.heightCm || undefined,
          weightKg: val.medical.vitals.weightKg || undefined,
          pulseRate: val.medical.vitals.pulseRate || undefined,
          temperature: val.medical.vitals.temperature || undefined
        },
        smokingStatus: val.medical.smokingStatus,
        emergencyMedicalNotes: val.medical.emergencyMedicalNotes?.trim() || undefined
      },
      emergencyContact: {
        firstName: val.emergencyContact.firstName.trim(),
        lastName: val.emergencyContact.lastName.trim(),
        relationship: val.emergencyContact.relationship,
        phone: val.emergencyContact.phone.trim(),
        alternatePhone: val.emergencyContact.alternatePhone?.trim() || undefined,
        email: val.emergencyContact.email?.trim() || undefined,
        address: val.emergencyContact.address?.trim() || undefined
      },
      status: 'Active'
    };
  }
}
