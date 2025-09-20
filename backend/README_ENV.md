Environment setup (PostgreSQL)

Create a .env file in the backend directory with:

PORT=5000
PG_HOST=localhost
PG_PORT=5432
PG_DATABASE=task_manager
PG_USER=postgres
PG_PASSWORD=your_password
JWT_SECRET=change_me_in_prod
JWT_EXPIRES_IN=7d

Make sure PostgreSQL is running and the user has privileges to create tables. You can manage the DB using pgAdmin.


