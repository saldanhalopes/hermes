# Speckit SDD Workflows

> **Standardized Specification-Driven Development (SDD) Cycle**

---

## 📋 Commands

### 🔍 /speckit.specify
**Purpose**: Define the "What" and "Why" of a feature.
**Action**:
1. Research the current codebase for related features.
2. Draft a `spec.md` with User Stories, Functional Requirements, and Success Criteria.
3. Save to `specs/<feature-name>/spec.md`.

### ❓ /speckit.clarify
**Purpose**: Resolve ambiguities through directed Q&A.
**Action**:
1. Identify missing requirements or edge cases in `spec.md`.
2. Present 3-5 specific questions to the user.
3. Update `spec.md` based on responses.

### 🗺️ /speckit.plan
**Purpose**: Technical architecture and data modeling.
**Action**:
1. Verify compliance with `CONSTITUTION.md`.
2. Create `plan.md`, `data-model.md`, and `research.md`.
3. Map architectural changes (Spring Boot API, Angular Components).

### ✅ /speckit.tasks
**Purpose**: Detailed implementation roadmap.
**Action**:
1. Generate `tasks.md` with ordered, actionable steps.
2. Assign priority and track dependencies.

### 🛡️ /speckit.analyze
**Purpose**: Critical risk and GxP compliance audit.
**Action**:
1. Audit the `tasks.md` vs. `CONSTITUTION.md`.
2. Tag items as [P0], [P1], or [P2].
3. Verify audit trail and security compliance.

### 🚀 /speckit.implement
**Purpose**: Managed code execution.
**Action**:
1. Execute tasks from `tasks.md` incrementally.
2. Run `checklist.py` after each significant change.
3. Mark tasks as complete [x] upon verification.

---

## 🏗️ Standards

### Design Trinity
All UI work must achieve:
1. **Premium Aesthetics** (Custom layouts, typography).
2. **No Purple** (Zero violet/indigo brand colors).
3. **Fluid Motion** (GPU-accelerated animations).

### GxP Integrity
All data mutations must include a service-level audit record.
