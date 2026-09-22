import { TestBed } from '@angular/core/testing';
import { PatientService } from './patient.service';
import { StorageService } from './storage.service';
import { ToastService } from './toast.service';
import { MOCK_PATIENTS_DATA } from '../constants/mock-patients.data';
import { Patient } from '../models/patient.model';

describe('PatientService', () => {
  let service: PatientService;
  let storageSpy: jasmine.SpyObj<StorageService>;
  let toastSpy: jasmine.SpyObj<ToastService>;

  beforeEach(() => {
    storageSpy = jasmine.createSpyObj('StorageService', ['getLocal', 'setLocal']);
    storageSpy.getLocal.and.returnValue(MOCK_PATIENTS_DATA);
    toastSpy = jasmine.createSpyObj('ToastService', ['success', 'error', 'info', 'warning']);

    TestBed.configureTestingModule({
      providers: [
        PatientService,
        { provide: StorageService, useValue: storageSpy },
        { provide: ToastService, useValue: toastSpy }
      ]
    });

    service = TestBed.inject(PatientService);
  });

  it('should be created and initialized with mock patients', () => {
    expect(service).toBeTruthy();
    expect(service.patients().length).toBeGreaterThan(0);
  });

  it('should retrieve a patient by ID', () => {
    const patient = service.getPatientById('PAT-1001');
    expect(patient).toBeDefined();
    expect(patient?.firstName).toBe('John');
  });

  it('should create a new patient and assign unique ID', async () => {
    const initialCount = service.patients().length;
    const newPatientData: Omit<Patient, 'id' | 'createdAt' | 'updatedAt' | 'activities'> = {
      firstName: 'Alan',
      lastName: 'Turing',
      dateOfBirth: '1912-06-23',
      gender: 'Male',
      maritalStatus: 'Single',
      bloodGroup: 'O+',
      nationality: 'British',
      preferredLanguage: 'English',
      contact: {
        email: 'alan.turing@demo.test',
        phone: '+1 (555) 123-4567',
        address: {
          addressLine1: '42 Bletchley Park',
          city: 'Milton Keynes',
          state: 'Buckinghamshire',
          zipCode: '12345',
          country: 'United Kingdom'
        }
      },
      medical: {
        primaryPhysician: 'Dr. Eleanor Vance, MD (Cardiology)',
        insuranceProvider: 'BlueCross BlueShield',
        insuranceId: 'BCBS-123456',
        allergies: [],
        currentMedications: [],
        existingConditions: [],
        vitals: {},
        smokingStatus: 'Never'
      },
      emergencyContact: {
        firstName: 'Joan',
        lastName: 'Clarke',
        relationship: 'Friend',
        phone: '+1 (555) 987-6543'
      },
      status: 'Active'
    };

    const created = await service.createPatient(newPatientData);
    expect(created.id).toContain('PAT-');
    expect(service.patients().length).toBe(initialCount + 1);
    expect(toastSpy.success).toHaveBeenCalled();
  });

  it('should toggle patient status from Active to Inactive', async () => {
    const updated = await service.togglePatientStatus('PAT-1001');
    expect(updated.status).toBe('Inactive');
  });

  it('should delete a patient record', async () => {
    const initialCount = service.patients().length;
    await service.deletePatient('PAT-1002');
    expect(service.patients().length).toBe(initialCount - 1);
    expect(service.getPatientById('PAT-1002')).toBeUndefined();
  });
});
