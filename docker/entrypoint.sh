#!/bin/bash
set -e

echo "⏳ Waiting for PostgreSQL..."
until php -r "
    \$pdo = new PDO(
        'pgsql:host=${DB_HOST};port=${DB_PORT:-5432};dbname=${DB_DATABASE}',
        '${DB_USERNAME}',
        '${DB_PASSWORD}'
    );
" 2>/dev/null; do
    sleep 2
done
echo "✅ PostgreSQL is ready"

echo "🧹 Clearing and caching config..."
php artisan cache:clear
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan event:cache

echo "🗄️ Running migrations..."
php artisan migrate --force

php artisan storage:link --force 2>/dev/null || true

echo "🚀 Starting Supervisor (Nginx, PHP, Queue, Reverb)..."
exec /usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf