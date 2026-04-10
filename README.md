# Hermes EQM 🚀

**Hermes** is a modern Electronic Quality Management (EQM) system designed to streamline compliance, change control, and quality audits with real-time analytics and an intelligent dashboard.

## 🌟 Features

- **Change Control Management**: Full lifecycle management of change requests, impact analysis, and effectiveness evaluation.
- **Intelligent Dashboard**: Real-time metrics and analytics powered by Spring Boot and Chart.js.
- **Audit Logging**: Comprehensive GxP-compliant audit trails and user activity monitoring.
- **Role-Based Security**: Integrated with Firebase Authentication and Spring Security 6.
- **Push Notifications**: Real-time alerts via Web Push and WebSockets.
- **Modern UI**: Built with AdminLTE 4 (Bootstrap 5) for a responsive and premium experience.

## 🛠️ Technology Stack

| Layer | Stack |
|-------|-------|
| **Language** | Java 21 |
| **Framework** | Spring Boot 4.1.0-M4 |
| **Security** | Spring Security 6 + Firebase Admin |
| **Database** | PostgreSQL (Google Cloud SQL) |
| **View Engine** | Thymeleaf + Layout Dialect |
| **Frontend** | Bootstrap 5, AdminLTE 4, FontAwesome 6 |
| **Real-time** | WebSockets (STOMP), Web Push |
| **Build Tool** | Apache Maven |

## 🚀 Getting Started

### Prerequisites

- **Java 21** or higher.
- **Maven 3.9+**.
- **Firebase Service Account**: A valid `serviceAccountKey.json` from your Firebase project.
- **PostgreSQL Database**: Access to a PostgreSQL instance (local or Cloud SQL).

### Configuration

1. Clone the repository:
   ```bash
   git clone https://github.com/saldanhalopes/hermes.git
   cd hermes
   ```

2. Configure environment variables or `application-dev.properties`:
   - `SPRING_DATASOURCE_URL`
   - `SPRING_DATASOURCE_USERNAME`
   - `SPRING_DATASOURCE_PASSWORD`
   - `FIREBASE_CONFIG_PATH`

3. Build the project:
   ```bash
   mvn clean install
   ```

4. Run the application:
   ```bash
   mvn spring-boot:run
   ```

## 📂 Project Structure

- `src/main/java`: Backend logic, controllers, and services.
- `src/main/resources`:
    - `templates`: Thymeleaf HTML views.
    - `static`: CSS, JS, and image assets.
    - `fragments`: Reusable UI components.
- `dataconnect`: Firebase Data Connect schema and operations.

## 📄 License

This project is proprietary and confidential.

---
Built with ❤️ for Eurofarma Laboratorios.
