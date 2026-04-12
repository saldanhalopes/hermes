# Specification: Change Control Modernization (Hermes EQM)

> **Status: Draft**
> **Feature: Change Control Lifecycle Management**
> **SDD Phase: Specify**

---

## 📖 Overview
Modernize the core "Controle de Mudanças" (Change Control) module from the legacy system to a high-end Angular 19 interface. The system must support the full lifecycle of a Change Request (CR) while ensuring strict GxP compliance and providing AI-driven technical assistance.

## 👤 User Stories
- **As a Quality Analyst**, I want to create a new Change Request with all mandatory GxP fields so that I can initiate a formal impact assessment.
- **As a Technical Area Expert**, I want to receive AI suggestions for my technical opinion so that I can provide faster and more accurate impact analyses.
- **As a Quality Manager**, I want a real-time visualization of the CR status and associated action plans so that I can manage risks and approvals efficiently.
- **As an Auditor**, I want to see a tamper-evident record of every change made to a CR so that GxP compliance is guaranteed.

---

## ⚙️ Functional Requirements

### 1. Lifecycle Workflow
- **Creation**: Wizard-style form for CR data (Title, Type, Unit, Justification, Affected Products).
- **Status Management**:
    - **Identification**: Initial drafting phase.
    - **Impact Analysis**: Multi-area assessment (Quality, Regulatory, Production, etc.).
    - **Committee Review**: Decision-making gate.
    - **Action Plan**: Implementation tasks tracking.
    - **Execution**: Completion of all plan tasks.
    - **Effectiveness**: Post-implementation verification.
- **Transitions**: State-machine-based transitions triggered by user actions (e.g., "Submit for Committee").

### 2. AI Intelligence (Hermes Genius)
- **Technical Opinion Suggestion**: Use Gemini API to suggest text for impact analysis based on the CR description and the specific area.
- **Auto-Risk Assessment**: Suggest criticality levels based on historical data patterns (Future capability).

### 3. GxP & Audit
- **Audit Logging**: Every mutation MUST record: Timestamp, User, Operation (Create/Update), and Snapshot of changes.
- **Electronic Signature**: Required for critical transitions (Approve Execution). Implemented via a **simple password re-confirmation modal**.

---

## 🎨 Design & UX (Antigravity Standards)

### The Trinity Rule
1. **Premium Aesthetics**: Use asymmetric layouts for the dashboard. Avoid standard Bootstrap grids.
2. **No Purple**: Zero use of purple/magenta. Use a professional palette of Deep Blues (`#0A192F`), Slate Greys, and Vibrant Teal for accents.
3. **Fluid Motion**: Page transitions and component reveals must use modern CSS animations (staggered reveals).

### Components
- **Lifecycle Timeline**: A visual, interactive map of the CR progress.
- **Wizard Stages**:
    - *Stage 1*: Identification & Classification.
    - *Stage 2*: Technical Context.
    - *Stage 3*: Impact Initial Assessment.
    - *Stage 4*: Risk & Justification.
- **Impact Area Cards**: Dynamic cards that expand to show expert fields. Includes an **On-Demand "Generate with Gemini" button** for technical opinions.
- **Action Plan Grid**: Sortable, groupable table for tasks with priority indicators.

### 🌐 Scope & Data
- **Legacy Integration**: The system will focus exclusively on **new records** created within the Angular environment. Legacy data from the previous system will not be imported into this module.

---

## ✅ Success Criteria
- [ ] UI passes the "Maestro Auditor" check for high-end aesthetics.
- [ ] Every data mutation is verified to create an `AuditLog` entry.
- [ ] Full state-machine validation (Status transitions work and block invalid moves).
- [ ] Technical Opinion AI suggestion returns relevant text for at least 3 distinct areas.
