# ===========================================
# Stage 1: The "Everything" Builder (FAST)
# ===========================================
# We use standard CLI PHP (not Alpine) so things install instantly
FROM php:8.3-cli AS builder

WORKDIR /app

# 1. Install a magical tool that installs PHP extensions instantly (no compiling!)
COPY --from=mlocati/php-extension-installer /usr/bin/install-php-extensions /usr/local/bin/
RUN install-php-extensions pdo_pgsql pgsql mbstring zip bcmath intl redis

# 2. Install Node.js (for NPM) and Composer
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && npm install -g npm@latest
COPY --from=composer:2.7 /usr/bin/composer /usr/bin/composer

# 3. Copy ALL your app files in
COPY . .

# 4. Install PHP dependencies
RUN composer install --no-dev --no-interaction --optimize-autoloader --ignore-platform-reqs

# 5. Install Node dependencies
RUN npm ci

# 6. Generate Wayfinder Routes (PHP is ready, so this will work perfectly)
RUN php artisan wayfinder:generate || true

# 7. Build the frontend assets
RUN npm run build


# ===========================================
# Stage 2: Final Production Image (Small & Fast)
# ===========================================
FROM php:8.3-fpm AS final

WORKDIR /var/www/html

# 1. Install PHP extensions instantly
COPY --from=mlocati/php-extension-installer /usr/bin/install-php-extensions /usr/local/bin/
RUN install-php-extensions pdo_pgsql pgsql mbstring zip bcmath intl opcache pcntl redis

# 2. Install Nginx and Supervisor via apt (Takes 5 seconds!)
RUN apt-get update && apt-get install -y nginx supervisor curl bash \
    && rm -rf /var/lib/apt/lists/*

# 3. Copy everything from the builder stage
COPY --from=builder /app /var/www/html

# 4. Copy your custom config files
COPY ./docker/nginx.conf /etc/nginx/nginx.conf
COPY ./docker/php.ini /usr/local/etc/php/conf.d/custom.ini
COPY ./docker/supervisord.conf /etc/supervisor/conf.d/supervisord.conf
COPY ./docker/entrypoint.sh /entrypoint.sh

RUN chmod +x /entrypoint.sh

# 5. Set correct permissions for Laravel
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html/storage \
    && chmod -R 755 /var/www/html/bootstrap/cache

# Expose Nginx and Reverb ports
EXPOSE 80 8080

ENTRYPOINT ["/entrypoint.sh"]
