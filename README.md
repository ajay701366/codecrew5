# BrandGuard

BrandGuard is a FastAPI backend with a React/Vite dashboard and PostgreSQL storage.

## Local development

1. Create `.env` from `.env.example` if you do not already have an `.env` file.
2. Start PostgreSQL from the project root:

   ```powershell
   docker compose up -d --wait
   ```

3. Install backend requirements in your Python environment and run:

   ```powershell
   python main.py
   ```

4. In another terminal, install frontend dependencies and start Vite:

   ```powershell
   cd frontend
   npm install
   npm run dev
   ```

Vite proxies `/api` and `/health` to `http://localhost:8000`. Set
`BRANDGUARD_API_URL` to change that backend address. The dashboard reads and
creates brands through the API and displays social accounts and official apps
for the selected brand. Their API endpoints are ready, but this dashboard does
not yet include forms for creating those records.

The backend uses `DATABASE_URL` from `.env`. PostgreSQL is the default; database
startup or connectivity errors are reported instead of silently switching to
SQLite. Do not commit `.env` or production credentials.

If the API cannot be reached, the dashboard displays clearly labeled sample
records in demo preview mode. Demo changes are temporary and are not written
to any database.
