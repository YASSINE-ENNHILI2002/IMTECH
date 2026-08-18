web: cd backend && python manage.py migrate --noinput && python manage.py collectstatic --noinput && gunicorn magasin_app.wsgi:application --bind 0.0.0.0:$PORT
