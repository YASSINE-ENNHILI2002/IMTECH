FROM python:3.12-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Set work directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    libpq-dev \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

# Copy project
COPY backend/ /app/backend/

# Set Django settings module
ENV DJANGO_SETTINGS_MODULE=magasin_app.settings

# Change to backend directory
WORKDIR /app/backend

# Expose port
EXPOSE 8000

# Run migrations, collect static and start server (all at runtime when env vars are available)
CMD python manage.py migrate --noinput && python manage.py collectstatic --noinput && gunicorn magasin_app.wsgi:application --bind 0.0.0.0:$PORT
