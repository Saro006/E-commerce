import os
from celery import Celery

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Backend.settings')

app = Celery('Backend')
app.conf.broker_url = os.environ.get('CELERY_BROKER_URL', 'redis://redis:6379/0')
app.conf.result_backend = os.environ.get('CELERY_RESULT_BACKEND', 'redis://redis:6379/1')
app.autodiscover_tasks()




