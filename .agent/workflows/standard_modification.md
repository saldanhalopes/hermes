---
description: Hermes Standard Modification Workflow
---
// turbo-all

Any modifications to the Hermes project must follow these steps to ensure architectural integrity.

1. READ the project intelligence skill at `.agent/skills/project_intelligence/SKILL.md`.
2. ANALYZE the relevant components (Entity, Repository, Service, Controller, Template).
3. VERIFY security implications in `com.hermes.config.SecurityConfig`.
4. IMPLEMENT changes following the layout patterns (AdminLTE + Thymeleaf fragments).
5. TEST the connectivity (Firebase, Push, DB) after changes.
