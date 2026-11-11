# Supabase SQL that runs automatically

Every `.sql` file in this folder runs against the Collection-Bound database
once its pull request is merged into `main` (see `.github/workflows/apply-sql.yml`).

- Files run in name order, once each. Finished files are recorded in the
  `applied_sql` table and skipped on later runs.
- A file that errors is rolled back completely (nothing in it is saved) and the
  run shows a red X under the repository's Actions tab.
- Names start with the date so they run in order: `2026-11-10-what-it-does.sql`.
