# Kitchen Rotation

Kitchen Rotation is a full-stack web application I developed to solve a practical problem in my own home: organizing a shared kitchen cleaning schedule. It allows households to manage members, customize the cleaning rotation, and automatically generate a schedule.
## Tech Stack

- **Frontend:** Next.js, React, TypeScript
- **Backend:** Java , Spring Boot, Spring Data JPA, Hibernate, Spring Security
- **Database:** PostgreSQL
- **Authentication:** Supabase Auth with JWT
- **Deployment:** Vercel for the frontend, Heroku for the backend using Docker, and Supabase for the database and authentication.

## Deployment

The frontend is deployed on Vercel, while the Spring Boot backend is containerized with Docker and deployed on Heroku. Supabase provides the PostgreSQL database and authentication services. The frontend communicates with the backend through REST API endpoints, with authenticated requests secured using JWTs.
