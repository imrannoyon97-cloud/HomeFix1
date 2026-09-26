# HomeFix.live

GitHub-ready HomeFix service management starter.

## Features
- Admin dashboard
- Technician dashboard
- Customer dashboard
- Email/password authentication via Supabase
- Booking management
- Technician assignment
- Job status workflow
- Customer booking history
- Invoice database structure
- Professional invoice template
- Materials, payments, notifications and audit tables

## Setup

1. Create a Supabase project.
2. Open Supabase SQL Editor.
3. Run `database/schema.sql`.
4. Create your Auth users in Supabase Authentication.
5. Insert matching `profiles`, `customers`, and `technicians` records.
6. Edit `js/supabase.js` and replace:
   - YOUR_SUPABASE_URL
   - YOUR_SUPABASE_ANON_KEY
7. Upload the project to GitHub.
8. Enable GitHub Pages.
9. Open your Pages URL.

## Security
Before production, add RLS policies for each role. Never expose a Supabase service-role/secret key in frontend JavaScript.

## Pages
- `/index.html` public booking
- `/login.html` login
- `/admin.html` admin
- `/technician.html` technician
- `/customer.html` customer
