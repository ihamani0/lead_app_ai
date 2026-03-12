#!/bin/bash
set -e

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Laravel Entrypoint Starting..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Wait for PostgreSQL to be ready
echo "⏳ Waiting for PostgreSQL..."
until php -r "
    \$pdo = new PDO(
        'pgsql:host=${DB_HOST};port=${DB_PORT:-5432};dbname=${DB_DATABASE}',
        '${DB_USERNAME}',
        '${DB_PASSWORD}'
    );
    echo 'connected';
" 2>/dev/null; do
    echo "   PostgreSQL not ready yet, retrying in 2s..."
    sleep 2
done
echo "✅ PostgreSQL is ready"

# Determine the APP_MODE (app, queue, reverb)
APP_MODE=${APP_MODE:-app}
echo "🚀 Starting in mode: $APP_MODE"

if [ "$APP_MODE" = "app" ]; then

    # Cache configuration for production
    echo "⚙️  Caching config..."
    php artisan config:cache
    php artisan route:cache
    php artisan view:cache
    php artisan event:cache

    echo "🗺️  Generating Wayfinder types..."
    php artisan wayfinder:generate    # ← add this
    
    # Run migrations
    echo "🗄️  Running migrations..."
    php artisan migrate --force

    # Storage link
    php artisan storage:link --force 2>/dev/null || true

    echo "✅ App ready — starting Nginx + PHP-FPM"
    exec /usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf

elif [ "$APP_MODE" = "queue" ]; then

    echo "✅ Queue worker starting..."
    exec php artisan queue:work \
        --sleep=3 \
        --tries=3 \
        --max-time=3600 \
        --timeout=90

elif [ "$APP_MODE" = "reverb" ]; then

    echo "✅ Reverb WebSocket server starting..."
    exec php artisan reverb:start \
        --host=0.0.0.0 \
        --port=${REVERB_PORT:-8080} \
        --debug

fi