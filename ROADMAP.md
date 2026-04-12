# Roadmap: Hermes EQM Angular 21 Migration

## Overview
The migration journey transitions from a legacy monolithic Thymeleaf/AdminLTE architecture to a modern, decoupled Angular 21 frontend integrated with a Spring Boot 4 REST API. The focus is on GxP-compliant modules with a premium Berry (Material UI) design.

## Phases
- [x] **Phase 1: Shell & Foundation** - Base layout with Berry template and Firebase auth.
- [ ] **Phase 2: Change Control Module** - List, detail, and creation (Wizard) components.
- [ ] **Phase 3: Dashboard & Analytics** - Metrics widgets and Chart.js visualization.
- [ ] **Phase 4: CAPA & Regulatory** - Action plans and regulatory submission tracking.

## Phase Details

### Phase 1: Shell & Foundation
**Goal**: Establish the base Berry template and secure navigation.
**Status**: **Complete**
**Success Criteria**:
  1. Base layout with sidebar and header exists.
  2. Firebase authentication correctly initialized.
  3. Routing configured for Dashboard, CC, CAPA, and Regulatory.

### Phase 2: Change Control Module
**Goal**: Port all Change Control functionality to Berry components.
**Depends on**: Phase 1
**Requirements**: CHNG-01, CHNG-02, CHNG-03, CHNG-04, CHNG-05
**Success Criteria**:
  1. User can view and filter Change Requests in a Material table.
  2. User can create new CRs via a multi-step Wizard.
  3. User can sign off on approvals with electronic signature.

### Phase 3: Dashboard & Analytics
**Goal**: Implement real-time quality metrics.
**Depends on**: Phase 1
**Requirements**: DASH-01, DASH-02, DASH-03
**Success Criteria**:
  1. Dashboard cards show live counts from the Spring Boot API.
  2. Line charts visualize CR trends over time.

## Progress
| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Shell & Foundation | 3/3 | Complete | 2026-04-11 |
| 2. Change Control | 0/3 | In Progress | - |
| 3. Dashboard | 0/2 | Not started | - |
| 4. CAPA & Regulatory | 0/2 | Not started | - |

---
*Last updated: 2026-04-12 after GSD Initialization*
