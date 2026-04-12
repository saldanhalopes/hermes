# Hermes EQM Project Constitution

> **Version: 1.0.0**
> **Scope: Electronic Quality Management System (EQM) Modernization**

---

## 📋 Non-Negotiable Principles (MNP)

### 🏗️ P1: Architectural Integrity (Decoupling)
- **Standard**: All frontend interaction must be handled by the Angular 19 application via secure REST API calls.
- **Strict Prohibition**: No Thymeleaf server-side rendering or hybrid logic for new features.
- **Interface**: Adhere strictly to the `proxy.conf.json` and backend `WebConfig` patterns.

### 🎨 P2: Design Mastery (Antigravity Standards)
- **Standard**: Every UI component must achieve the "Trinity" (Premium aesthetics, No Purple, Fluid Animations).
- **Prohibition**: No default Bootstrap looks, no purple/violet brand colors, no static layouts.
- **Reference**: Follow the `frontend-specialist.md` and `ui-ux-pro-max.md` rules.

### ⚖️ P3: GxP Integrity (Audit Trails)
- **Standard**: All data mutations (Create, Update, Delete) must generate a compliant audit trail entry in the `AuditLog` table.
- **Requirement**: No direct database mutations without a corresponding service-level audit record.
- **Verification**: Mandatory check in the `Analyze` phase of every SDD cycle.

---

## 🔄 SDD Lifecycle Enforcement

All changes must pass through the following gates:
1. **Specify**: Define the "What" and "Why" in `spec.md`.
2. **Clarify**: Resolve ambiguities through directed Q&A.
3. **Plan**: Technical architecture and data modeling.
4. **Task**: Detailed implementation roadmap.
5. **Analyze**: Critical risk and GxP compliance audit.
6. **Implement**: Incremental execution with automated verification.
