# Backend Dockerfile
FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

RUN apt-get update && apt-get install -y build-essential libpq-dev && rm -rf /var/lib/apt/lists/*

COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

COPY . /app
RUN chmod +x /app/entrypoint.sh

ENV DJANGO_SETTINGS_MODULE=Backend.settings \
    DB_ENGINE=django.db.backends.postgresql \
    DB_HOST=db \
    DB_PORT=5432 \
    DB_NAME=postgres \
    DB_USER=postgres \
    DB_PASSWORD=postgres \
    DJANGO_ALLOWED_HOSTS=*

EXPOSE 8000

ENTRYPOINT ["/app/entrypoint.sh"]
CMD ["bash", "-lc", "python manage.py runserver 0.0.0.0:8000"]


