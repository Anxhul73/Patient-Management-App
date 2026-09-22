import { TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { PatientFormService } from './patient-form.service';
import { StorageService } from './storage.service';
import { ToastService } from './toast.service';

describe('PatientFormService & FormArray', () => {
  let service: PatientFormService;
  let storageSpy: jasmine.SpyObj<StorageService>;
  let toastSpy: jasmine.SpyObj<ToastService>;

  beforeEach(() => {
    storageSpy = jasmine.createSpyObj('StorageService', ['getSession', 'setSession', 'removeSession']);
    toastSpy = jasmine.createSpyObj('ToastService', ['success', 'info', 'warning', 'error']);

    TestBed.configureTestingModule({
      providers: [
        PatientFormService,
        FormBuilder,
        { provide: StorageService, useValue: storageSpy },
        { provide: ToastService, useValue: toastSpy }
      ]
    });

    service = TestBed.inject(PatientFormService);
  });

  it('should initialize reactive form with all required groups', () => {
    expect(service.patientForm).toBeDefined();
    expect(service.demographicsGroup).toBeDefined();
    expect(service.contactGroup).toBeDefined();
    expect(service.medicalGroup).toBeDefined();
    expect(service.emergencyGroup).toBeDefined();
  });

  it('should dynamically add and remove allergies using FormArray', () => {
    expect(service.allergiesArray.length).toBe(0);

    service.addAllergy({ name: 'Penicillin', severity: 'Severe' });
    expect(service.allergiesArray.length).toBe(1);
    expect(service.allergiesArray.at(0).value.name).toBe('Penicillin');
    expect(service.allergiesArray.at(0).value.severity).toBe('Severe');

    service.addAllergy({ name: 'Peanuts', severity: 'Moderate' });
    expect(service.allergiesArray.length).toBe(2);

    service.removeAllergy(0);
    expect(service.allergiesArray.length).toBe(1);
    expect(service.allergiesArray.at(0).value.name).toBe('Peanuts');
  });

  it('should dynamically add and remove medications using FormArray<FormGroup>', () => {
    expect(service.medicationsArray.length).toBe(0);

    service.addMedication({
      name: 'Amoxicillin',
      dosage: '500 mg',
      frequency: 'Twice daily',
      startDate: '2026-09-01'
    });

    expect(service.medicationsArray.length).toBe(1);
    expect(service.medicationsArray.at(0).value.name).toBe('Amoxicillin');
    expect(service.medicationsArray.at(0).value.dosage).toBe('500 mg');

    service.removeMedication(0);
    expect(service.medicationsArray.length).toBe(0);
  });

  it('should validate step progression and prevent invalid transitions', () => {
    service.setStep(1);
    expect(service.isCurrentStepValid(1)).toBeFalse();

    // Fill minimum required demographics
    service.demographicsGroup.patchValue({
      firstName: 'Ada',
      lastName: 'Lovelace',
      dateOfBirth: '1815-12-10',
      gender: 'Female',
      maritalStatus: 'Married',
      nationality: 'British',
      preferredLanguage: 'English'
    });

    expect(service.isCurrentStepValid(1)).toBeTrue();
    const advanced = service.nextStep();
    expect(advanced).toBeTrue();
    expect(service.currentStep()).toBe(2);
  });
});
