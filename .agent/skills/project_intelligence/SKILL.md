# Skill: Project Intelligence (Hermes)

This skill provides the core intelligence and standards for the Hermes project. Any AI assistant working on this project MUST read this file before suggesting or implementing changes.

## Project Context
- **Name**: Hermes
- **Organization**: Eurofarma Laboratórios
- **Domain**: Validation and Traceability System
- **Compliance**: ALCOA+, FDA 21 CFR Part 11 (Audited entities)

## Tech Stack
- **Backend**: Spring Boot 4.1.0-M4 (Java 21)
- **Database**: PostgreSQL (Production) / H2 (Development)
- **Security**: Spring Security 6
- **Persistence**: Spring Data JPA + Hibernate Envers (Auditing)
- **Frontend**: Thymeleaf + AdminLTE 3.2 (Bootstrap 4)
- **Cloud**: Google Cloud Platform (Cloud SQL, Firebase Admin SDK)
- **Notifications**: Web Push (Vapid) + Firebase

## UI Standards
1. **Theme**: AdminLTE 3.2 with `dark-mode`.
2. **Architecture**: Fragment-based structure in `src/main/resources/templates/`.
   - `layout/main.html`: Base template.
   - `fragments/`: Head, Navbar, Sidebar, Footer, Scripts.
3. **Icons**: FontAwesome 5.
4. **Primary Color**: Indigo (`#6366f1`).

## Modification Protocol
Before making any changes:
1. **CONSULT**: Check `pom.xml` for existing versioned dependencies. Use Webjars for frontend libraries.
2. **VERIFY**: Check `src/main/resources/templates/layout/main.html` to ensure the page structure follows the fragment system.
3. **SECURITY**: Always check `SecurityConfig.java` when adding new endpoints or pages.
4. **AUDIT**: Respect `@Audited` annotations on entities.

## Implementation Pattern
- Use `layout:decorate="~{layout/main}"` for all dashboard pages.
- Use `layout:fragment="content"` for the main body.
- Use `layout:fragment="extra-scripts"` for page-specific JS.

## Commands
- **Start Project**: `.\start.ps1` (Uses local JDK 21 and Maven Wrapper)
