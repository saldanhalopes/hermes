# Specification: CAPA Lifecycle Management (Hermes EQM)

> **Status: Draft**
> **Feature Area: Quality Compliance**
> **SDD Phase: Specify**

---

## 📖 Overview
Implement a GxP-compliant lifecycle for **Corrective and Preventive Actions (CAPA)**. This module tracks the resolution of deviations, audit findings, and quality incidents, ensuring that root causes are identified and recurrence is prevented.

## ⚙️ Functional Requirements

### 1. CAPA Intake & Classification
- **Source Selection**: Internal Audit, Regulatory Inspection, Customer Complaint, Non-Conformance.
- **Criticality Detection**: Automate initial risk based on source and area.
- **Scope**: Product, Process, System, Equipment.

### 2. Root Cause Analysis (RCA) - "The Investigator"
- **5 Whys Tool**: An interactive guided form to drill down into the primary root cause.
- **Ishikawa (Fishbone) Metadata**: Categorization by Man, Machine, Material, Method, Measurement, Environment.

### 3. Integrated Action Plan
- **Corrective Actions**: Immediate fix.
- **Preventive Actions**: Strategic fix.
- **Task Assignment**: Integration with the email notification system.

### 4. Verification of Effectiveness (VoE)
- Mandatory 60-90 day re-evaluation step after action completion.
- Quantitative success criteria.

---

## 🎨 Design & UX (Maestro Standards)

### The "Maestro" Audit Grid
- **Global CAPA Radar**: A dashboard view showing the average "Time-to-Closure" and the distribution of unresolved vs. overdue actions.
- **RCA Canvas**: A visual, non-linear form for documenting the 5 Whys.

---

## 🛡️ GxP & Data Integrity
- electronic signature: Required for "RCA Approval" and "Closure".
- **Audit Logging**: Full version history of all CAPA records via Envers.

## ✅ Success Criteria
- [ ] UI passes the "Maestro Auditor" check for high-end analytics.
- [ ] Every data mutation is verified to create an `AuditLog` entry.
- [ ] Root Cause Analysis workflow allows multi-area collaboration.
