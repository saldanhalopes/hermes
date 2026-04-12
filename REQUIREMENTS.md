# Requirements: Hermes EQM Angular 21 Migration

**Defined:** 2026-04-12
**Core Value:** GxP-compliant, audit-ready single source of truth for quality management.

## v1 Requirements

Requirements for the current migration phase (Thymeleaf/AdminLTE → Angular 21/Berry).

### Authentication & Shell
- [ ] **AUTH-01**: User can log in via Firebase Authentication.
- [ ] **AUTH-02**: Session persists across refreshes and is synchronized with the Spring Boot backend.
- [ ] **SHLL-01**: Persistent sidebar navigation matching Berry design.
- [ ] **SHLL-02**: Global header with user profile and notification drawer.

### Change Control Module
- [ ] **CHNG-01**: Data table with server-side pagination and filtering for Change Requests.
- [ ] **CHNG-02**: Multi-step wizard (`WizardCR`) for creating new Change Requests.
- [ ] **CHNG-03**: Detail view with impact analysis sections and status timeline.
- [ ] **CHNG-04**: Electronic Signature component for approvals (Reason + Password).
- [ ] **CHNG-05**: Audit Trail timeline showing all state transitions and comments.

### Dashboard & Analytics
- [ ] **DASH-01**: Real-time metrics widgets (Total CRs, Pending Approvals, CAPA status).
- [ ] **DASH-02**: Trend charts (Line/Bar) using Chart.js integrated into Berry cards.
- [ ] **DASH-03**: Quick Action shortcuts (New CR, New CAPA).

### CAPA Module (Porting)
- [ ] **CAPA-01**: List view for Corrective and Preventive Actions.
- [ ] **CAPA-02**: Radar chart for CAPA distribution by department/risk.
- [ ] **CAPA-03**: Wizard for CAPA creation with action item assignment.

## v2 Requirements (Future Phases)
- **AI-01**: Intelligent GxP validation document generator integration.
- **NOTF-01**: Native Web Push notifications for approval requests.
- **RPRT-01**: Exportable PDF/Excel reports with digital watermarks.

## Out of Scope
| Feature | Reason |
|---------|--------|
| Legacy UI Maintenance | The AdminLTE/Thymeleaf UI is deprecated. |
| Offline Mode | GxP data integrity requires real-time server validation. |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| AUTH-01 | Phase 1 | Complete |
| SHLL-01 | Phase 1 | Complete |
| CHNG-01 | Phase 2 | In Progress |
| CHNG-02 | Phase 2 | In Progress |
| DASH-01 | Phase 3 | Pending |
| CAPA-01 | Phase 4 | Pending |

---
*Last updated: 2026-04-12 after GSD Initialization*
