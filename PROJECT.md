# Hermes EQM - Angular 21 Migration

## What This Is

**Hermes** is an Electronic Quality Management (EQM) system designed for Eurofarma Laboratorios to streamline compliance, change control, and quality audits. It features real-time analytics and a GxP-compliant architecture.

The project is currently undergoing a major frontend migration from a legacy Spring Boot/Thymeleaf/AdminLTE stack to a modern **Angular 21** standalone architecture using the **Berry** (Material UI) template.

## Core Value

The mission is to provide a **GxP-compliant, audit-ready single source of truth** for quality management, ensuring data integrity (ALCOA+) and seamless approval workflows.

## Requirements

### Validated (Existing Features)

- ✓ Backend REST API (Spring Boot 4.1.0-M4, Java 21)
- ✓ Role-Based Access Control (RBAC) with Firebase Auth
- ✓ Cloud SQL connectivity (PostgreSQL)
- ✓ Base Layout & Shell (Angular 21 + Berry Template)

### Active (In Progress)

- [ ] **Change Control Module**: Porting `ChangeList`, `ChangeDetail`, and `WizardCR` to Berry-styled Angular components.
- [ ] **Dashboard Module**: Implementing real-time analytics with Chart.js using Berry's dashboard widgets.
- [ ] **Audit Trail**: Ensuring immutable logging for all frontend actions within the new components.

### Out of Scope

- [Legacy UI fixes] — We are replacing the old AdminLTE UI entirely, not patching it.
- [Native Mobile App] — While the web UI is responsive, a separate native app is not in the current migration phase.

## Context

- **Environment**: Distributed architecture (Spring Boot API + Angular SPA).
- **Design System**: Transitioning from Bootstrap-based AdminLTE 4 to Material-based **Berry** design tokens (Teal & Deep Blue).
- **Compliance**: Must strictly adhere to FDA 21 CFR Part 11 and EU Annex 11.

## Constraints

- **Tech Stack**: Must use Angular 21 and the Vite-native builder for compatibility with Node v24.
- **Security**: All API calls must be signed and authenticated via Firebase tokens.
- **Performance**: Must maintain Core Web Vitals (LCP < 2.5s) even with complex data tables.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Angular 21 | Future-proofing and performance (Signal-based components) | ✓ Good |
| Berry Template | Premium design specifically requested for local Eurofarma UX | ✓ Good |
| Vite Native | Required for Node v24 support on development machines | ✓ Good |

---
*Last updated: 2026-04-12 after GSD Initialization phase*
