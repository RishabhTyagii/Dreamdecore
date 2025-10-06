Next.js + Django (minimal) starter
=================================

What's included
- backend/: Django project with a 'core' app exposing /api/queries/ (ListCreate)
- frontend/: Next.js app with pages: /, /about, /vision, /contact, /query, /admin/queries

Quick start (backend)
---------------------
1. cd backend
2. python -m venv venv
3. source venv/bin/activate   (on Windows: venv\Scripts\activate)
4. pip install -r requirements.txt
5. python manage.py migrate
6. python manage.py createsuperuser   # optional - to see queries in admin
7. python manage.py runserver

Quick start (frontend)
----------------------
1. cd frontend
2. npm install
3. npm run dev
4. Open http://localhost:3000

Notes
-----
- The frontend expects the Django API at http://127.0.0.1:8000/api by default.
- This is a minimal skeleton intended to be extended. Replace SECRET_KEY in production.