# Project Context: Hermes EQM

> **Status: Modernizing (Angular 19 + Spring Boot)**
> **Architecture: Decoupled SPA + REST API**

---

## 🏗️ Technical Stack

- **Backend**: Java 21, Spring Boot 4.1.0-M4, Spring Security 6, Maven.
- **Frontend**: Angular 19, PrimeNG, Bootstrap 5, Chart.js, Mermaid.
- **Database**: PostgreSQL (Google Cloud SQL) + pgvector.
- **Auth**: Firebase Admin SDK (Local config: `serviceAccountKey.json`).
- **Dev Tools**: Antigravity Kit (SDD/Spec-kit), MCP Toolbox.

---

## 📁 Directory Structure

- **`/frontend`**: Angular 19 application.
    - `src/app/components`: Feature areas (change-control, dashboard).
    - `src/app/services`: API clients (change-control.service.ts).
    - `src/app/models`: TypeScript interfaces for backend entities.
    - `proxy.conf.json`: Maps `/api` to `localhost:8080`.
- **`/src/main/java/com/hermes/hermes`**: Core backend.
    - `controller`: REST endpoints (ChangeControl, Audit, Settings).
    - `model`: JPA entities (ChangeRequest, ActionPlanTask, AuditLog).
    - `repository`: Spring Data JPA repositories.
    - `service`: Business logic and GxP audit trail generation.
- **`/src/main/resources`**:
    - `application.properties`: Server and DB config.
- **`/.agent`**: AI agent configuration, skills, and workflows.
- **`/.specify`**: SDD (Spec-kit) memory and constitution.

---

## 🏛️ Standard Patterns

### Backend (REST)
- **Controllers**: Return `ResponseEntity<T>`.
- **Audit**: Every mutating service call MUST log to `AuditLog`.
- **Security**: Stateless JWT validation via Firebase.

### Frontend (Angular)
- **Navigation**: Sidebar-based (AdminLTE 4 shell).
- **Styling**: PrimeNG components with custom Antigravity designs (No Purple).
- **Communication**: All external data via services using `HttpClient`.

---

## 🔄 Core Domain Model

- **ChangeRequest**: The central entity for EQM. Tracks status, impact, and plans.
- **ActionPlanTask**: Dependent tasks for implementing a change.
- **AuditLog**: GxP-compliant record of all system changes.
- **User**: Identified by Firebase UID and internal roles.
