import { Patient } from '../models/patient.model';

export const MOCK_PATIENTS_DATA: Patient[] = [
  {
    id: 'PAT-1001',
    firstName: 'John',
    middleName: 'Alexander',
    lastName: 'Carter',
    dateOfBirth: '1984-04-12',
    gender: 'Male',
    patientType: 'Outpatient',
    maritalStatus: 'Married',
    bloodGroup: 'O+',
    nationality: 'American',
    preferredLanguage: 'English',
    profilePhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    contact: {
      email: 'john.carter.demo@medicare360.example',
      phone: '+1 (555) 234-5678',
      alternatePhone: '+1 (555) 234-9988',
      address: {
        addressLine1: '742 Evergreen Terrace',
        addressLine2: 'Suite 4B',
        city: 'Springfield',
        state: 'IL',
        zipCode: '62704',
        country: 'United States'
      }
    },
    medical: {
      primaryPhysician: 'Dr. Eleanor Vance, MD (Cardiology)',
      insuranceProvider: 'BlueCross BlueShield',
      insuranceId: 'BCBS-984421-X',
      allergies: [
        { name: 'Penicillin', severity: 'Severe' },
        { name: 'Peanuts', severity: 'Moderate' }
      ],
      currentMedications: [
        { name: 'Lisinopril', dosage: '10 mg', frequency: 'Once daily (Morning)', startDate: '2025-01-10' },
        { name: 'Atorvastatin', dosage: '20 mg', frequency: 'Once daily (Evening)', startDate: '2025-02-15' }
      ],
      existingConditions: ['Hypertension', 'Hyperlipidemia'],
      vitals: {
        bloodPressure: '124/82 mmHg',
        heightCm: 180,
        weightKg: 82,
        bmi: 25.3,
        pulseRate: 72,
        temperature: 98.4
      },
      smokingStatus: 'Former',
      emergencyMedicalNotes: 'Carry Epipen for severe peanut allergy. Responsive to ACE inhibitors.'
    },
    emergencyContact: {
      firstName: 'Emily',
      lastName: 'Carter',
      relationship: 'Spouse',
      phone: '+1 (555) 234-8899',
      email: 'emily.carter.demo@medicare360.example',
      address: '742 Evergreen Terrace, Springfield, IL 62704'
    },
    status: 'Active',
    createdAt: '2025-01-10T09:30:00Z',
    updatedAt: '2026-03-15T14:20:00Z',
    activities: [
      { id: 'ACT-1', action: 'Created', description: 'Patient record created via onboarding wizard', timestamp: '2025-01-10T09:30:00Z', performedBy: 'Admin (System)' },
      { id: 'ACT-2', action: 'Updated', description: 'Added Atorvastatin to medication regimen', timestamp: '2025-02-15T11:00:00Z', performedBy: 'Dr. Eleanor Vance' },
      { id: 'ACT-3', action: 'Updated', description: 'Annual vitals examination recorded', timestamp: '2026-03-15T14:20:00Z', performedBy: 'Nurse Practitioner' }
    ]
  },
  {
    id: 'PAT-1002',
    firstName: 'Sarah',
    middleName: 'Jane',
    lastName: 'Miller',
    dateOfBirth: '1992-09-24',
    gender: 'Female',
    patientType: 'Inpatient',
    maritalStatus: 'Single',
    bloodGroup: 'A+',
    nationality: 'American',
    preferredLanguage: 'English',
    contact: {
      email: 'sarah.miller.demo@medicare360.example',
      phone: '+1 (555) 876-5432',
      address: {
        addressLine1: '1204 Pine Creek Road',
        city: 'Austin',
        state: 'TX',
        zipCode: '78701',
        country: 'United States'
      }
    },
    medical: {
      primaryPhysician: 'Dr. Sarah Chen, MD (Pediatrics)',
      insuranceProvider: 'UnitedHealthcare',
      insuranceId: 'UHC-449102-M',
      allergies: [
        { name: 'Sulfa Drugs', severity: 'Moderate' }
      ],
      currentMedications: [
        { name: 'Albuterol Inhaler', dosage: '90 mcg', frequency: 'As needed for asthma', startDate: '2024-06-01' }
      ],
      existingConditions: ['Asthma (Mild Persistent)'],
      vitals: {
        bloodPressure: '118/76 mmHg',
        heightCm: 165,
        weightKg: 58,
        bmi: 21.3,
        pulseRate: 68,
        temperature: 98.6
      },
      smokingStatus: 'Never',
      emergencyMedicalNotes: 'Mild asthma triggers: cold dry air, feline dander.'
    },
    emergencyContact: {
      firstName: 'David',
      lastName: 'Miller',
      relationship: 'Parent',
      phone: '+1 (555) 876-1122',
      email: 'david.miller.demo@medicare360.example'
    },
    status: 'Active',
    createdAt: '2025-02-14T10:15:00Z',
    updatedAt: '2026-02-28T16:45:00Z',
    activities: [
      { id: 'ACT-4', action: 'Created', description: 'Patient record created', timestamp: '2025-02-14T10:15:00Z', performedBy: 'Admin (System)' }
    ]
  },
  {
    id: 'PAT-1003',
    firstName: 'Michael',
    middleName: 'Robert',
    lastName: 'Johnson',
    dateOfBirth: '1968-11-03',
    gender: 'Male',
    patientType: 'Admitted',
    maritalStatus: 'Married',
    bloodGroup: 'B-',
    nationality: 'Canadian',
    preferredLanguage: 'English',
    contact: {
      email: 'michael.johnson.demo@medicare360.example',
      phone: '+1 (555) 345-6789',
      address: {
        addressLine1: '388 Maple Leaf Boulevard',
        city: 'Seattle',
        state: 'WA',
        zipCode: '98101',
        country: 'United States'
      }
    },
    medical: {
      primaryPhysician: 'Dr. Priya Patel, DO (Endocrinology)',
      insuranceProvider: 'Aetna Healthcare',
      insuranceId: 'AET-771239-J',
      allergies: [],
      currentMedications: [
        { name: 'Metformin', dosage: '500 mg', frequency: 'Twice daily with meals', startDate: '2023-11-20' },
        { name: 'Glipizide', dosage: '5 mg', frequency: 'Once daily before breakfast', startDate: '2024-04-10' }
      ],
      existingConditions: ['Type 2 Diabetes Mellitus', 'Peripheral Neuropathy'],
      vitals: {
        bloodPressure: '132/86 mmHg',
        heightCm: 175,
        weightKg: 89,
        bmi: 29.1,
        pulseRate: 76,
        temperature: 98.2
      },
      smokingStatus: 'Never',
      emergencyMedicalNotes: 'Monitor for hypoglycemia during prolonged fasting.'
    },
    emergencyContact: {
      firstName: 'Linda',
      lastName: 'Johnson',
      relationship: 'Spouse',
      phone: '+1 (555) 345-9900',
      email: 'linda.johnson.demo@medicare360.example'
    },
    status: 'Active',
    createdAt: '2024-11-20T08:00:00Z',
    updatedAt: '2026-03-01T10:30:00Z',
    activities: [
      { id: 'ACT-5', action: 'Created', description: 'Patient registered', timestamp: '2024-11-20T08:00:00Z', performedBy: 'Staff' }
    ]
  },
  {
    id: 'PAT-1004',
    firstName: 'Emma',
    middleName: 'Rose',
    lastName: 'Wilson',
    dateOfBirth: '2001-03-18',
    gender: 'Female',
    patientType: 'Outpatient',
    maritalStatus: 'Single',
    bloodGroup: 'O-',
    nationality: 'American',
    preferredLanguage: 'English',
    contact: {
      email: 'emma.wilson.demo@medicare360.example',
      phone: '+1 (555) 456-7890',
      address: {
        addressLine1: '520 Sunset Harbor Way',
        city: 'San Diego',
        state: 'CA',
        zipCode: '92101',
        country: 'United States'
      }
    },
    medical: {
      primaryPhysician: 'Dr. Alan Montgomery, MD (Family Medicine)',
      insuranceProvider: 'Cigna Health',
      insuranceId: 'CIG-330198-W',
      allergies: [
        { name: 'Latex', severity: 'Severe' },
        { name: 'Aspirin', severity: 'Mild' }
      ],
      currentMedications: [],
      existingConditions: ['Seasonal Allergic Rhinitis'],
      vitals: {
        bloodPressure: '112/70 mmHg',
        heightCm: 170,
        weightKg: 61,
        bmi: 21.1,
        pulseRate: 64,
        temperature: 98.7
      },
      smokingStatus: 'Never'
    },
    emergencyContact: {
      firstName: 'Karen',
      lastName: 'Wilson',
      relationship: 'Parent',
      phone: '+1 (555) 456-0011',
      email: 'karen.wilson.demo@medicare360.example'
    },
    status: 'Active',
    createdAt: '2025-05-12T13:40:00Z',
    updatedAt: '2026-01-20T11:15:00Z'
  },
  {
    id: 'PAT-1005',
    firstName: 'Carlos',
    middleName: 'Eduardo',
    lastName: 'Rodriguez',
    dateOfBirth: '1975-07-29',
    gender: 'Male',
    patientType: 'Admitted',
    maritalStatus: 'Married',
    bloodGroup: 'AB+',
    nationality: 'Mexican-American',
    preferredLanguage: 'Spanish',
    contact: {
      email: 'carlos.rodriguez.demo@medicare360.example',
      phone: '+1 (555) 567-8901',
      address: {
        addressLine1: '901 Rio Grande Drive',
        city: 'El Paso',
        state: 'TX',
        zipCode: '79901',
        country: 'United States'
      }
    },
    medical: {
      primaryPhysician: 'Dr. Marcus Thorne, MD (Internal Medicine)',
      insuranceProvider: 'Kaiser Permanente',
      insuranceId: 'KP-882104-R',
      allergies: [
        { name: 'Codeine', severity: 'Severe' }
      ],
      currentMedications: [
        { name: 'Omeprazole', dosage: '20 mg', frequency: 'Once daily before breakfast', startDate: '2025-04-01' }
      ],
      existingConditions: ['GERD', 'Mild Sleep Apnea'],
      vitals: {
        bloodPressure: '128/84 mmHg',
        heightCm: 178,
        weightKg: 86,
        bmi: 27.1,
        pulseRate: 74,
        temperature: 98.6
      },
      smokingStatus: 'Former'
    },
    emergencyContact: {
      firstName: 'Maria',
      lastName: 'Rodriguez',
      relationship: 'Spouse',
      phone: '+1 (555) 567-2233',
      email: 'maria.rodriguez.demo@medicare360.example'
    },
    status: 'Active',
    createdAt: '2025-04-01T15:20:00Z',
    updatedAt: '2026-02-10T09:00:00Z'
  },
  {
    id: 'PAT-1006',
    firstName: 'Aaliyah',
    middleName: 'Zainab',
    lastName: 'Khan',
    dateOfBirth: '1995-12-04',
    gender: 'Female',
    patientType: 'Inpatient',
    maritalStatus: 'Single',
    bloodGroup: 'B+',
    nationality: 'American',
    preferredLanguage: 'English',
    contact: {
      email: 'aaliyah.khan.demo@medicare360.example',
      phone: '+1 (555) 678-9012',
      address: {
        addressLine1: '143 Michigan Avenue',
        addressLine2: 'Apt 12B',
        city: 'Chicago',
        state: 'IL',
        zipCode: '60601',
        country: 'United States'
      }
    },
    medical: {
      primaryPhysician: 'Dr. Robert Sterling, MD (Neurology)',
      insuranceProvider: 'BlueCross BlueShield',
      insuranceId: 'BCBS-102938-K',
      allergies: [
        { name: 'Ibuprofen', severity: 'Moderate' }
      ],
      currentMedications: [
        { name: 'Sumatriptan', dosage: '50 mg', frequency: 'As needed for acute migraine', startDate: '2025-03-10' }
      ],
      existingConditions: ['Migraine with Aura'],
      vitals: {
        bloodPressure: '116/74 mmHg',
        heightCm: 162,
        weightKg: 55,
        bmi: 21.0,
        pulseRate: 70,
        temperature: 98.5
      },
      smokingStatus: 'Never'
    },
    emergencyContact: {
      firstName: 'Tariq',
      lastName: 'Khan',
      relationship: 'Sibling',
      phone: '+1 (555) 678-3344',
      email: 'tariq.khan.demo@medicare360.example'
    },
    status: 'Active',
    createdAt: '2025-03-10T11:00:00Z',
    updatedAt: '2026-03-10T14:30:00Z'
  },
  {
    id: 'PAT-1007',
    firstName: 'Arthur',
    middleName: 'William',
    lastName: 'Pendleton',
    dateOfBirth: '1948-02-14',
    gender: 'Male',
    maritalStatus: 'Widowed',
    bloodGroup: 'A-',
    nationality: 'American',
    preferredLanguage: 'English',
    contact: {
      email: 'arthur.pendleton.demo@medicare360.example',
      phone: '+1 (555) 789-0123',
      address: {
        addressLine1: '88 Oakridge Estates',
        city: 'Boston',
        state: 'MA',
        zipCode: '02108',
        country: 'United States'
      }
    },
    medical: {
      primaryPhysician: 'Dr. Eleanor Vance, MD (Cardiology)',
      insuranceProvider: 'Medicare Advantage',
      insuranceId: 'MED-550912-P',
      allergies: [
        { name: 'Contrast Dye', severity: 'Severe' }
      ],
      currentMedications: [
        { name: 'Amlodipine', dosage: '5 mg', frequency: 'Daily morning', startDate: '2022-08-15' },
        { name: 'Warfarin', dosage: '2.5 mg', frequency: 'Daily evening', startDate: '2023-01-20' },
        { name: 'Furosemide', dosage: '20 mg', frequency: 'Daily morning', startDate: '2024-05-10' }
      ],
      existingConditions: ['Atrial Fibrillation', 'Congestive Heart Failure (Stage B)', 'Osteoarthritis'],
      vitals: {
        bloodPressure: '138/88 mmHg',
        heightCm: 172,
        weightKg: 78,
        bmi: 26.4,
        pulseRate: 80,
        temperature: 98.1
      },
      smokingStatus: 'Former',
      emergencyMedicalNotes: 'Patient on anticoagulants (Warfarin). High fall risk.'
    },
    emergencyContact: {
      firstName: 'Eleanor',
      lastName: 'Pendleton-Smith',
      relationship: 'Child',
      phone: '+1 (555) 789-4455',
      email: 'eleanor.smith.demo@medicare360.example'
    },
    status: 'Active',
    createdAt: '2023-01-20T09:00:00Z',
    updatedAt: '2026-03-05T15:00:00Z'
  },
  {
    id: 'PAT-1008',
    firstName: 'Jessica',
    middleName: 'Ann',
    lastName: 'Taylor',
    dateOfBirth: '1989-06-22',
    gender: 'Female',
    maritalStatus: 'Married',
    bloodGroup: 'O+',
    nationality: 'American',
    preferredLanguage: 'English',
    contact: {
      email: 'jessica.taylor.demo@medicare360.example',
      phone: '+1 (555) 890-1234',
      address: {
        addressLine1: '310 Peachtree Street NE',
        city: 'Atlanta',
        state: 'GA',
        zipCode: '30303',
        country: 'United States'
      }
    },
    medical: {
      primaryPhysician: 'Dr. Priya Patel, DO (Endocrinology)',
      insuranceProvider: 'Humana Choice',
      insuranceId: 'HUM-419203-T',
      allergies: [],
      currentMedications: [
        { name: 'Levothyroxine', dosage: '75 mcg', frequency: 'Once daily on empty stomach', startDate: '2024-01-12' }
      ],
      existingConditions: ['Hypothyroidism (Hashimoto)'],
      vitals: {
        bloodPressure: '120/78 mmHg',
        heightCm: 168,
        weightKg: 64,
        bmi: 22.7,
        pulseRate: 72,
        temperature: 98.6
      },
      smokingStatus: 'Never'
    },
    emergencyContact: {
      firstName: 'Brian',
      lastName: 'Taylor',
      relationship: 'Spouse',
      phone: '+1 (555) 890-5566',
      email: 'brian.taylor.demo@medicare360.example'
    },
    status: 'Inactive',
    createdAt: '2024-01-12T14:10:00Z',
    updatedAt: '2025-11-18T10:00:00Z'
  },
  {
    id: 'PAT-1009',
    firstName: 'David',
    middleName: 'Lee',
    lastName: 'Kim',
    dateOfBirth: '2010-08-15',
    gender: 'Male',
    maritalStatus: 'Single',
    bloodGroup: 'B+',
    nationality: 'American',
    preferredLanguage: 'Korean / English',
    contact: {
      email: 'kim.family.demo@medicare360.example',
      phone: '+1 (555) 901-2345',
      address: {
        addressLine1: '1420 Wilshire Blvd',
        city: 'Los Angeles',
        state: 'CA',
        zipCode: '90017',
        country: 'United States'
      }
    },
    medical: {
      primaryPhysician: 'Dr. Sarah Chen, MD (Pediatrics)',
      insuranceProvider: 'Kaiser Permanente',
      insuranceId: 'KP-991024-K',
      allergies: [
        { name: 'Tree Nuts', severity: 'Severe' }
      ],
      currentMedications: [],
      existingConditions: ['Eczema (Atopic Dermatitis)'],
      vitals: {
        bloodPressure: '106/68 mmHg',
        heightCm: 155,
        weightKg: 46,
        bmi: 19.1,
        pulseRate: 78,
        temperature: 98.4
      },
      smokingStatus: 'Never'
    },
    emergencyContact: {
      firstName: 'Grace',
      lastName: 'Kim',
      relationship: 'Parent',
      phone: '+1 (555) 901-6677',
      email: 'grace.kim.demo@medicare360.example'
    },
    status: 'Active',
    createdAt: '2025-06-01T10:00:00Z',
    updatedAt: '2026-02-15T11:45:00Z'
  },
  {
    id: 'PAT-1010',
    firstName: 'Olivia',
    middleName: 'Grace',
    lastName: 'Martinez',
    dateOfBirth: '1998-05-30',
    gender: 'Female',
    maritalStatus: 'Single',
    bloodGroup: 'O+',
    nationality: 'American',
    preferredLanguage: 'English',
    contact: {
      email: 'olivia.martinez.demo@medicare360.example',
      phone: '+1 (555) 012-3456',
      address: {
        addressLine1: '714 Brickell Avenue',
        city: 'Miami',
        state: 'FL',
        zipCode: '33131',
        country: 'United States'
      }
    },
    medical: {
      primaryPhysician: 'Dr. Alan Montgomery, MD (Family Medicine)',
      insuranceProvider: 'Aetna Healthcare',
      insuranceId: 'AET-110948-M',
      allergies: [],
      currentMedications: [],
      existingConditions: ['None reported'],
      vitals: {
        bloodPressure: '114/72 mmHg',
        heightCm: 167,
        weightKg: 59,
        bmi: 21.2,
        pulseRate: 66,
        temperature: 98.6
      },
      smokingStatus: 'Never'
    },
    emergencyContact: {
      firstName: 'Sophia',
      lastName: 'Martinez',
      relationship: 'Sibling',
      phone: '+1 (555) 012-7788',
      email: 'sophia.martinez.demo@medicare360.example'
    },
    status: 'Active',
    createdAt: '2025-07-20T16:00:00Z',
    updatedAt: '2026-01-05T09:30:00Z'
  },
  {
    id: 'PAT-1011',
    firstName: 'Samuel',
    middleName: 'Thomas',
    lastName: 'Wright',
    dateOfBirth: '1962-10-10',
    gender: 'Male',
    maritalStatus: 'Married',
    bloodGroup: 'A+',
    nationality: 'American',
    preferredLanguage: 'English',
    contact: {
      email: 'samuel.wright.demo@medicare360.example',
      phone: '+1 (555) 123-7890',
      address: {
        addressLine1: '404 Rocky Ridge Lane',
        city: 'Denver',
        state: 'CO',
        zipCode: '80202',
        country: 'United States'
      }
    },
    medical: {
      primaryPhysician: 'Dr. Marcus Thorne, MD (Internal Medicine)',
      insuranceProvider: 'UnitedHealthcare',
      insuranceId: 'UHC-662319-W',
      allergies: [
        { name: 'Shellfish', severity: 'Severe' }
      ],
      currentMedications: [
        { name: 'Hydrochlorothiazide', dosage: '25 mg', frequency: 'Daily morning', startDate: '2024-03-15' }
      ],
      existingConditions: ['Hypertension', 'Gout'],
      vitals: {
        bloodPressure: '130/84 mmHg',
        heightCm: 182,
        weightKg: 91,
        bmi: 27.5,
        pulseRate: 75,
        temperature: 98.4
      },
      smokingStatus: 'Current'
    },
    emergencyContact: {
      firstName: 'Brenda',
      lastName: 'Wright',
      relationship: 'Spouse',
      phone: '+1 (555) 123-8899',
      email: 'brenda.wright.demo@medicare360.example'
    },
    status: 'Active',
    createdAt: '2024-03-15T08:45:00Z',
    updatedAt: '2026-02-18T14:10:00Z'
  },
  {
    id: 'PAT-1012',
    firstName: 'Chloe',
    middleName: 'Elizabeth',
    lastName: 'Dubois',
    dateOfBirth: '1990-01-25',
    gender: 'Female',
    maritalStatus: 'Single',
    bloodGroup: 'AB-',
    nationality: 'French-American',
    preferredLanguage: 'French / English',
    contact: {
      email: 'chloe.dubois.demo@medicare360.example',
      phone: '+1 (555) 234-8901',
      address: {
        addressLine1: '650 Canal Street',
        city: 'New Orleans',
        state: 'LA',
        zipCode: '70112',
        country: 'United States'
      }
    },
    medical: {
      primaryPhysician: 'Dr. Robert Sterling, MD (Neurology)',
      insuranceProvider: 'Cigna Health',
      insuranceId: 'CIG-904128-D',
      allergies: [],
      currentMedications: [],
      existingConditions: ['Tension Headaches'],
      vitals: {
        bloodPressure: '115/75 mmHg',
        heightCm: 172,
        weightKg: 62,
        bmi: 21.0,
        pulseRate: 68,
        temperature: 98.6
      },
      smokingStatus: 'Never'
    },
    emergencyContact: {
      firstName: 'Pierre',
      lastName: 'Dubois',
      relationship: 'Parent',
      phone: '+1 (555) 234-9911',
      email: 'pierre.dubois.demo@medicare360.example'
    },
    status: 'Inactive',
    createdAt: '2024-08-10T11:20:00Z',
    updatedAt: '2025-09-14T16:00:00Z'
  },
  {
    id: 'PAT-1013',
    firstName: 'Rajesh',
    middleName: 'Kumar',
    lastName: 'Patel',
    dateOfBirth: '1981-11-19',
    gender: 'Male',
    maritalStatus: 'Married',
    bloodGroup: 'O+',
    nationality: 'Indian-American',
    preferredLanguage: 'Gujarati / English',
    contact: {
      email: 'rajesh.patel.demo@medicare360.example',
      phone: '+1 (555) 345-9012',
      address: {
        addressLine1: '210 Silicon Way',
        city: 'San Jose',
        state: 'CA',
        zipCode: '95113',
        country: 'United States'
      }
    },
    medical: {
      primaryPhysician: 'Dr. Priya Patel, DO (Endocrinology)',
      insuranceProvider: 'BlueCross BlueShield',
      insuranceId: 'BCBS-772190-P',
      allergies: [
        { name: 'Sulfa Drugs', severity: 'Mild' }
      ],
      currentMedications: [
        { name: 'Metformin', dosage: '850 mg', frequency: 'Twice daily', startDate: '2024-10-05' }
      ],
      existingConditions: ['Pre-diabetes', 'Vitamin D Deficiency'],
      vitals: {
        bloodPressure: '122/80 mmHg',
        heightCm: 176,
        weightKg: 79,
        bmi: 25.5,
        pulseRate: 71,
        temperature: 98.5
      },
      smokingStatus: 'Never'
    },
    emergencyContact: {
      firstName: 'Ananya',
      lastName: 'Patel',
      relationship: 'Spouse',
      phone: '+1 (555) 345-1122',
      email: 'ananya.patel.demo@medicare360.example'
    },
    status: 'Active',
    createdAt: '2024-10-05T14:30:00Z',
    updatedAt: '2026-03-12T11:20:00Z'
  },
  {
    id: 'PAT-1014',
    firstName: 'Harper',
    middleName: 'Quinn',
    lastName: 'Avery',
    dateOfBirth: '1999-04-08',
    gender: 'Other',
    maritalStatus: 'Single',
    bloodGroup: 'A-',
    nationality: 'American',
    preferredLanguage: 'English',
    contact: {
      email: 'harper.avery.demo@medicare360.example',
      phone: '+1 (555) 456-0123',
      address: {
        addressLine1: '812 Pearl Street',
        city: 'Portland',
        state: 'OR',
        zipCode: '97201',
        country: 'United States'
      }
    },
    medical: {
      primaryPhysician: 'Dr. Alan Montgomery, MD (Family Medicine)',
      insuranceProvider: 'Kaiser Permanente',
      insuranceId: 'KP-301982-A',
      allergies: [],
      currentMedications: [],
      existingConditions: ['Mild Anxiety'],
      vitals: {
        bloodPressure: '118/74 mmHg',
        heightCm: 173,
        weightKg: 66,
        bmi: 22.1,
        pulseRate: 70,
        temperature: 98.6
      },
      smokingStatus: 'Never'
    },
    emergencyContact: {
      firstName: 'Jordan',
      lastName: 'Avery',
      relationship: 'Sibling',
      phone: '+1 (555) 456-2233',
      email: 'jordan.avery.demo@medicare360.example'
    },
    status: 'Active',
    createdAt: '2025-08-18T10:00:00Z',
    updatedAt: '2026-01-15T09:00:00Z'
  },
  {
    id: 'PAT-1015',
    firstName: 'Victor',
    middleName: 'Hugo',
    lastName: 'Silva',
    dateOfBirth: '1955-06-12',
    gender: 'Male',
    maritalStatus: 'Married',
    bloodGroup: 'O+',
    nationality: 'Brazilian-American',
    preferredLanguage: 'Portuguese / English',
    contact: {
      email: 'victor.silva.demo@medicare360.example',
      phone: '+1 (555) 567-1234',
      address: {
        addressLine1: '320 Beacon Street',
        city: 'Somerville',
        state: 'MA',
        zipCode: '02143',
        country: 'United States'
      }
    },
    medical: {
      primaryPhysician: 'Dr. Eleanor Vance, MD (Cardiology)',
      insuranceProvider: 'Medicare Advantage',
      insuranceId: 'MED-901823-S',
      allergies: [
        { name: 'Aspirin', severity: 'Moderate' }
      ],
      currentMedications: [
        { name: 'Losartan', dosage: '50 mg', frequency: 'Daily morning', startDate: '2023-04-10' },
        { name: 'Metoprolol', dosage: '25 mg', frequency: 'Twice daily', startDate: '2023-09-15' }
      ],
      existingConditions: ['Coronary Artery Disease', 'Hypertension'],
      vitals: {
        bloodPressure: '136/82 mmHg',
        heightCm: 170,
        weightKg: 80,
        bmi: 27.7,
        pulseRate: 64,
        temperature: 98.3
      },
      smokingStatus: 'Former'
    },
    emergencyContact: {
      firstName: 'Isabella',
      lastName: 'Silva',
      relationship: 'Spouse',
      phone: '+1 (555) 567-4455',
      email: 'isabella.silva.demo@medicare360.example'
    },
    status: 'Active',
    createdAt: '2023-04-10T12:00:00Z',
    updatedAt: '2026-03-02T16:20:00Z'
  },
  {
    id: 'PAT-1016',
    firstName: 'Fatima',
    middleName: 'Nour',
    lastName: 'Mansour',
    dateOfBirth: '1987-10-05',
    gender: 'Female',
    maritalStatus: 'Married',
    bloodGroup: 'B+',
    nationality: 'American',
    preferredLanguage: 'Arabic / English',
    contact: {
      email: 'fatima.mansour.demo@medicare360.example',
      phone: '+1 (555) 678-2345',
      address: {
        addressLine1: '1904 Dearborn Street',
        city: 'Detroit',
        state: 'MI',
        zipCode: '48201',
        country: 'United States'
      }
    },
    medical: {
      primaryPhysician: 'Dr. Sarah Chen, MD (Pediatrics)',
      insuranceProvider: 'BlueCross BlueShield',
      insuranceId: 'BCBS-448102-M',
      allergies: [],
      currentMedications: [
        { name: 'Prenatal Vitamins', dosage: '1 tablet', frequency: 'Daily', startDate: '2025-11-01' }
      ],
      existingConditions: ['Mild Anemia'],
      vitals: {
        bloodPressure: '112/70 mmHg',
        heightCm: 163,
        weightKg: 62,
        bmi: 23.3,
        pulseRate: 76,
        temperature: 98.7
      },
      smokingStatus: 'Never'
    },
    emergencyContact: {
      firstName: 'Omar',
      lastName: 'Mansour',
      relationship: 'Spouse',
      phone: '+1 (555) 678-5566',
      email: 'omar.mansour.demo@medicare360.example'
    },
    status: 'Active',
    createdAt: '2025-11-01T09:15:00Z',
    updatedAt: '2026-02-20T10:45:00Z'
  },
  {
    id: 'PAT-1017',
    firstName: 'Lucas',
    middleName: 'Alexander',
    lastName: 'Bennett',
    dateOfBirth: '2015-12-11',
    gender: 'Male',
    maritalStatus: 'Single',
    bloodGroup: 'O-',
    nationality: 'American',
    preferredLanguage: 'English',
    contact: {
      email: 'bennett.family.demo@medicare360.example',
      phone: '+1 (555) 789-3456',
      address: {
        addressLine1: '45 Bluebell Court',
        city: 'Charlotte',
        state: 'NC',
        zipCode: '28202',
        country: 'United States'
      }
    },
    medical: {
      primaryPhysician: 'Dr. Sarah Chen, MD (Pediatrics)',
      insuranceProvider: 'UnitedHealthcare',
      insuranceId: 'UHC-551092-B',
      allergies: [
        { name: 'Amoxicillin', severity: 'Severe' }
      ],
      currentMedications: [],
      existingConditions: ['Childhood Asthma (Intermittent)'],
      vitals: {
        bloodPressure: '100/65 mmHg',
        heightCm: 138,
        weightKg: 32,
        bmi: 16.8,
        pulseRate: 84,
        temperature: 98.6
      },
      smokingStatus: 'Never'
    },
    emergencyContact: {
      firstName: 'Rebecca',
      lastName: 'Bennett',
      relationship: 'Parent',
      phone: '+1 (555) 789-7788',
      email: 'rebecca.bennett.demo@medicare360.example'
    },
    status: 'Active',
    createdAt: '2025-09-01T14:00:00Z',
    updatedAt: '2026-01-10T11:00:00Z'
  },
  {
    id: 'PAT-1018',
    firstName: 'Evelyn',
    middleName: 'Claire',
    lastName: 'Foster',
    dateOfBirth: '1942-08-03',
    gender: 'Female',
    maritalStatus: 'Widowed',
    bloodGroup: 'A+',
    nationality: 'American',
    preferredLanguage: 'English',
    contact: {
      email: 'evelyn.foster.demo@medicare360.example',
      phone: '+1 (555) 890-4567',
      address: {
        addressLine1: '710 Heritage Woods Lane',
        city: 'Richmond',
        state: 'VA',
        zipCode: '23219',
        country: 'United States'
      }
    },
    medical: {
      primaryPhysician: 'Dr. Marcus Thorne, MD (Internal Medicine)',
      insuranceProvider: 'Medicare Advantage',
      insuranceId: 'MED-110293-F',
      allergies: [
        { name: 'Morphine', severity: 'Severe' }
      ],
      currentMedications: [
        { name: 'Alendronate', dosage: '70 mg', frequency: 'Weekly on Sunday morning', startDate: '2021-05-10' },
        { name: 'Calcium + Vit D', dosage: '600 mg', frequency: 'Twice daily', startDate: '2021-05-10' }
      ],
      existingConditions: ['Osteoporosis', 'Cataracts (Post-op)', 'Mild Kyphosis'],
      vitals: {
        bloodPressure: '134/78 mmHg',
        heightCm: 158,
        weightKg: 52,
        bmi: 20.8,
        pulseRate: 70,
        temperature: 97.9
      },
      smokingStatus: 'Never'
    },
    emergencyContact: {
      firstName: 'Nathan',
      lastName: 'Foster',
      relationship: 'Child',
      phone: '+1 (555) 890-8899',
      email: 'nathan.foster.demo@medicare360.example'
    },
    status: 'Active',
    createdAt: '2021-05-10T10:30:00Z',
    updatedAt: '2026-02-14T15:30:00Z'
  },
  {
    id: 'PAT-1019',
    firstName: 'Zackary',
    middleName: 'Noah',
    lastName: 'Adams',
    dateOfBirth: '2004-11-28',
    gender: 'Male',
    maritalStatus: 'Single',
    bloodGroup: 'B-',
    nationality: 'American',
    preferredLanguage: 'English',
    contact: {
      email: 'zack.adams.demo@medicare360.example',
      phone: '+1 (555) 901-5678',
      address: {
        addressLine1: '115 University Way',
        city: 'Austin',
        state: 'TX',
        zipCode: '78712',
        country: 'United States'
      }
    },
    medical: {
      primaryPhysician: 'Dr. Alan Montgomery, MD (Family Medicine)',
      insuranceProvider: 'Aetna Healthcare',
      insuranceId: 'AET-883019-A',
      allergies: [],
      currentMedications: [],
      existingConditions: ['Acne Vulgaris'],
      vitals: {
        bloodPressure: '118/76 mmHg',
        heightCm: 184,
        weightKg: 76,
        bmi: 22.4,
        pulseRate: 62,
        temperature: 98.6
      },
      smokingStatus: 'Never'
    },
    emergencyContact: {
      firstName: 'Mark',
      lastName: 'Adams',
      relationship: 'Parent',
      phone: '+1 (555) 901-9900',
      email: 'mark.adams.demo@medicare360.example'
    },
    status: 'Active',
    createdAt: '2025-10-12T13:00:00Z',
    updatedAt: '2026-03-01T12:00:00Z'
  },
  {
    id: 'PAT-1020',
    firstName: 'Maya',
    middleName: 'Lin',
    lastName: 'Zhang',
    dateOfBirth: '1979-03-14',
    gender: 'Female',
    maritalStatus: 'Married',
    bloodGroup: 'O+',
    nationality: 'American',
    preferredLanguage: 'Mandarin / English',
    contact: {
      email: 'maya.zhang.demo@medicare360.example',
      phone: '+1 (555) 012-6789',
      address: {
        addressLine1: '540 Bay Street',
        city: 'San Francisco',
        state: 'CA',
        zipCode: '94133',
        country: 'United States'
      }
    },
    medical: {
      primaryPhysician: 'Dr. Priya Patel, DO (Endocrinology)',
      insuranceProvider: 'Kaiser Permanente',
      insuranceId: 'KP-119283-Z',
      allergies: [
        { name: 'Sulfa Drugs', severity: 'Moderate' }
      ],
      currentMedications: [
        { name: 'Levothyroxine', dosage: '50 mcg', frequency: 'Daily morning', startDate: '2024-02-20' }
      ],
      existingConditions: ['Subclinical Hypothyroidism'],
      vitals: {
        bloodPressure: '116/72 mmHg',
        heightCm: 160,
        weightKg: 54,
        bmi: 21.1,
        pulseRate: 68,
        temperature: 98.4
      },
      smokingStatus: 'Never'
    },
    emergencyContact: {
      firstName: 'Wei',
      lastName: 'Zhang',
      relationship: 'Spouse',
      phone: '+1 (555) 012-1122',
      email: 'wei.zhang.demo@medicare360.example'
    },
    status: 'Active',
    createdAt: '2024-02-20T11:00:00Z',
    updatedAt: '2026-01-28T14:30:00Z'
  }
];
