#!/usr/bin/env bash
set -euo pipefail

python manage.py migrate --noinput
# Idempotent seeding (creates users/categories/products if missing)
python manage.py seed_data || true

exec "$@"

