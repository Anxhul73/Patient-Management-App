# MediCare360 — Modern Healthcare Patient Management SaaS Platform

![MediCare360 Banner](https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&auto=format&fit=crop&q=80)

**MediCare360** is a production-quality, enterprise-grade Angular Healthcare Patient Management SaaS application built for training, demonstration, and assessment purposes. Designed with modern web aesthetics (inspired by Linear, Stripe, and Vercel), it showcases standalone component architecture, reactive forms with dynamic `FormArray`, route protection, interactive Chart.js analytics, draft persistence, and HIPAA-aware frontend security patterns.

---

## 🚀 Live Demo & Quick Start

### Demo Credentials
| Portal | Email | Password | Access Scope |
| :--- | :--- | :--- | :--- |
| **Admin Portal** | `admin@medicare360.demo` | `Admin@123` | Full clinical administration, CRUD, and analytics |
| **Physician Portal** | `doctor@medicare360.demo` | `Doctor@123` | Clinical chart management and patient reviews |

*Tip: Use the convenient 1-click **Demo Quick Fill** pills on the login screen.*

### Installation & Local Development

```bash
# Clone the repository
git clone <repository-url>
cd Angular

# Install dependencies
npm install

# Launch local development server
npm start
# or
npx ng serve
```

Navigate to `http://localhost:4200/` in your browser. The application will automatically reload if you change any source files.

---

## 🛠️ Technology Stack & Architecture

- **Framework**: Angular 19+ (Latest Stable)
- **Architecture**: 100% Standalone Components, Signal-based reactivity, and RxJS state streams
- **Forms**: Angular Reactive Forms (`FormBuilder`, `FormGroup`, `FormControl`, `FormArray`, `Validators`)
- **Data Visualizations**: [Chart.js](https://www.chartjs.org/) (Line, Doughnut, and Bar charts with dynamic light/dark mode adaptation)
- **Routing**: Angular Router with functional Route Guards (`authGuard`, `guestGuard`) and lazy-loaded feature chunks
- **Styling**: Vanilla SCSS with full design tokens, CSS variables, and seamless Light / Dark / System theme switching
- **State & Storage**: Centralized typed `StorageService` managing session drafts and local demo records
- **Icons & UI**: Native SVG icons, Glassmorphism, Micro-animations, Skeleton loaders, and accessible modals

---

## 📂 Project Architecture

```
src/
├── app/
│   ├── core/
│   │   ├── constants/
│   │   │   ├── app.constants.ts            # Centralized storage keys, options, default settings
│   │   │   └── mock-patients.data.ts       # 20+ rich synthetic clinical patient records
│   │   ├── guards/
│   │   │   ├── auth.guard.ts               # Functional auth & guest route guards
│   │   │   └── auth.guard.spec.ts          # Route guard unit test suite
│   │   ├── models/
│   │   │   ├── auth.model.ts               # User, AuthState, and Credentials interfaces
│   │   │   ├── patient.model.ts            # Strongly typed Patient, Medical, Vitals, Contact, Emergency
│   │   │   ├── notification.model.ts       # In-app notifications, Toast, and Dialog models
│   │   │   └── analytics.model.ts          # Metrics, Chart datasets, and Settings definitions
│   │   └── services/
│   │       ├── storage.service.ts          # Type-safe LocalStorage & SessionStorage wrapper
│   │       ├── auth.service.ts             # Demo auth state, token expiry, login/logout
│   │       ├── auth.service.spec.ts        # AuthService unit test suite
│   │       ├── patient.service.ts          # Reactive CRUD, client search/filter/sort/pagination, CSV/JSON export
│   │       ├── patient.service.spec.ts     # PatientService unit test suite
│   │       ├── patient-form.service.ts     # Multi-step wizard coordinator, FormArray & draft persistence
│   │       ├── patient-form.service.spec.ts# FormArray and validation unit tests
│   │       ├── analytics.service.ts        # Real-time metrics calculations and Chart.js feeds
│   │       ├── notification.service.ts     # Notification center with unread counters
│   │       ├── toast.service.ts            # Floating toast notification manager
│   │       ├── confirm-dialog.service.ts   # Reusable promise-based modal dialogs
│   │       └── theme.service.ts            # Light/Dark/System theme switcher with DOM sync
│   │
│   ├── shared/
│   │   ├── components/
│   │   │   ├── toast-container/            # Animated toast notification stack
│   │   │   ├── confirm-dialog/             # Accessible confirmation dialog modal
│   │   │   ├── hipaa-banner/               # Educational demo disclaimer banner
│   │   │   ├── kpi-card/                   # Dynamic metric card with trend indicators
│   │   │   ├── status-badge/               # Active/Inactive clinical status pill
│   │   │   ├── empty-state/                # Illustrated empty state placeholder
│   │   │   └── skeleton-loader/            # Shimmer loading cards and table rows
│   │   └── pipes/
│   │       ├── age.pipe.ts                 # Dynamic age calculation from DOB
│   │       └── phone-format.pipe.ts        # Phone number formatting helper
│   │
│   ├── layout/
│   │   ├── main-layout/                    # Master layout shell (Navbar, Sidebar, Banner, Outlet)
│   │   ├── navbar/                         # Search bar, notifications drawer, theme toggle, user menu
│   │   └── sidebar/                        # Responsive desktop/mobile navigation drawer
│   │
│   ├── features/
│   │   ├── auth/login/                     # SaaS login screen with autofill demo pills
│   │   ├── dashboard/                      # Executive KPI cards, Chart.js trends, recent patients
│   │   ├── patients/
│   │   │   ├── patient-list/               # Data grid with debounced search, filters, sorting, pagination
│   │   │   ├── patient-wizard/             # 5-Step registration wizard with FormArray & review
│   │   │   ├── patient-details/            # Patient profile view with 4 detailed tabs & audit log
│   │   │   └── patient-edit/               # Unified form editor pre-populated with patient data
│   │   ├── analytics/                      # Dedicated analytics dashboard with 5 interactive charts
│   │   ├── settings/                       # Workstation settings, preferences, and theme choices
│   │   ├── profile/                        # User profile and session security details
│   │   └── not-found/                      # 404 page with quick navigation links
│   │
│   ├── app.routes.ts                       # Standalone lazy-loaded routing tree
│   ├── app.config.ts                       # Application configuration and providers
│   └── app.component.ts                    # Root host component
└── styles.scss                             # Global design system tokens and dark mode styling
```

---

## 📋 Key Technical Highlights

### 1. Multi-Step Patient Wizard & FormArray Implementation
The Add Patient flow is structured as a sequential 5-step wizard (`Demographics` → `Contact` → `Medical` → `Emergency Contact` → `Review & Submit`):
- **Dynamic Allergies (`FormArray<FormGroup>`)**: Allows clinical staff to add/remove multiple allergies with associated severity ratings (Mild, Moderate, Severe).
- **Structured Medications (`FormArray<FormGroup>`)**: Enables adding/removing complex medication regimens including Drug Name, Dosage (mg/mcg), Frequency, and Start Date.
- **Auto Draft Persistence**: Automatically serializes form progress to `sessionStorage` under `patientFormDraft`. If the clinician accidentally refreshes or navigates away, a single click restores all fields and resumes their exact wizard step.
- **Review Step**: Presents a structured summary with one-click "Jump to Edit" links before final confirmation.

### 2. Comprehensive Chart.js Integration
Chart.js is dynamically integrated to visualize population health metrics:
- **Patient Growth**: Trajectory line chart tracking registered cohorts.
- **Gender Demographics**: Doughnut chart representing population distribution.
- **Age Tier Distribution**: Bar chart categorized into pediatric, adult, and geriatric tiers (`0-18`, `19-30`, `31-45`, `46-60`, `61-75`, `76+`).
- **Patient Status**: Active vs Inactive record ratio.
- **Monthly Registrations**: Month-by-month intake velocity.
- **Insurance Carriers**: Provider distribution across enrolled records.
- *Charts automatically re-render and adjust palettes when switching between Light and Dark themes.*

### 3. Patient Data Grid & Management
- **Debounced Live Search**: Real-time client-side search across Name, Patient ID, Email, and Phone number using RxJS `debounceTime(250)` to ensure buttery-smooth performance.
- **Multidimensional Filters**: Combined filtering by Clinical Status, Gender, and Age Groups.
- **Column Sorting & Pagination**: Configurable rows per page (5, 10, 25) with intuitive pagination controls.
- **Status Toggle & Delete Modals**: Confirmations powered by `ConfirmDialogService` preventing accidental data loss.
- **Exporting**: Instant export of patient cohorts to standard CSV or JSON format.

---

## 🔒 Healthcare & HIPAA Considerations

> [!IMPORTANT]
> **Educational & Demonstration Notice**
> This application is strictly an educational demonstration and training platform. It uses **100% synthetic mock patient data**. No real Protected Health Information (PHI), medical records, or genuine patient credentials should ever be inputted into this platform.

### Frontend Security & HIPAA-Aware Patterns Implemented:
1. **Zero Real PHI**: All demo data is generated synthetically and clearly marked as fictional.
2. **URL Hygiene**: No sensitive clinical data, diagnostic notes, or patient identifiers are exposed via URL parameters or unencrypted query strings.
3. **Session Demarcation**: Client storage (`localStorage` / `sessionStorage`) is used exclusively for sandbox state persistence (UI preferences, demo draft restoration).
4. **Route Protection**: Functional Angular Route Guards prevent unauthorized navigation into clinical management routes.
5. **Audit Logging Simulation**: Patient record modifications and status changes generate timestamped audit entries with user attribution, illustrating the HIPAA audit trail requirement.

### Production Security Limitations & Backend Requirements
In a production healthcare deployment, frontend application code represents only a portion of the required HIPAA compliance matrix. A production implementation requires:
- **Secure Backend APIs**: All clinical transactions must be processed via secure REST/GraphQL/FHIR APIs over TLS 1.3 encryption.
- **Role-Based Access Control (RBAC)**: Fine-grained server-side authorization enforcing least-privilege principles (e.g., separating Billing, Attending Physicians, and Triage Nurses).
- **Encryption at Rest & In Transit**: Databases must utilize AES-256 encryption at rest and encrypted volumes.
- **Immutable Audit Trails**: Centralized, tamper-evident audit logging of every read, write, and export event for compliance audits.
- **Automatic Inactivity Timeouts**: Enforced workstation lockout and session invalidation after idle duration.
- **Business Associate Agreements (BAAs)**: Formal legal BAAs with cloud infrastructure providers (GCP, AWS, Azure).

---

## 🧪 Testing

Run the automated test suite with the Angular CLI:

```bash
npm test -- --watch=false
```

The unit test suite covers:
- `AuthService` — Login validation, invalid credential rejection, logout state cleanup.
- `AuthGuard` & `GuestGuard` — URL tree redirection and protected route access.
- `PatientService` — CRUD operations, search/filter routines, status toggling, and data deletion.
- `PatientFormService` & `FormArray` — Dynamic addition/removal of allergies and medications, step validation logic, and draft restoration.

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
