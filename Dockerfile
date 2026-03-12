# ===========================================
# Stage 1: Build assets (Node + Vite + PHP)
# ===========================================
FROM php:8.3-cli-alpine AS assets

# Install Node + npm
RUN apk add --no-cache nodejs npm

WORKDIR /app

# Install PHP extensions needed for artisan commands
RUN apk add --no-cache libpq-dev oniguruma-dev libzip-dev && \
    docker-php-ext-install pdo pdo_pgsql mbstring zip bcmath

# Install composer
COPY --from=composer:2.7 /usr/bin/composer /usr/bin/composer

# Install PHP dependencies first
COPY composer.json composer.lock ./
COPY packages/ ./packages/
RUN composer install \
    --no-dev \
    --no-interaction \
    --no-progress \
    --optimize-autoloader \
    --ignore-platform-reqs \
    --no-scripts

# Copy full app (needed for php artisan wayfinder:generate)
COPY . .

# Install Node dependencies
RUN npm ci

# Generate wayfinder routes before building
RUN php artisan wayfinder:generate || true

# Build assets
RUN npm run build

# ===========================================
# Stage 2: PHP dependencies
# ===========================================
FROM composer:2.7 AS vendor

WORKDIR /app

COPY composer.json composer.lock ./
COPY packages/ ./packages/

RUN composer install \
    --no-dev \
    --no-interaction \
    --no-progress \
    --optimize-autoloader \
    --ignore-platform-reqs \
    --no-scripts

# ===========================================
# Stage 3: Final production image
# ===========================================
FROM php:8.3-fpm-alpine AS final

RUN apk add --no-cache \
    nginx \
    curl \
    bash \
    supervisor \
    postgresql-client \
    libpq-dev \
    libzip-dev \
    zip \
    unzip \
    oniguruma-dev \
    icu-dev

RUN docker-php-ext-install \
    pdo \
    pdo_pgsql \
    pgsql \
    mbstring \
    zip \
    bcmath \
    opcache \
    pcntl \
    intl

RUN pecl install redis && docker-php-ext-enable redis

WORKDIR /var/www/html

COPY . .
COPY --from=vendor /app/vendor ./vendor
COPY --from=assets /app/public/build ./public/build
COPY --from=assets /app/resources/js/routes.ts ./resources/js/routes.ts

# Discover packages with full app available
RUN php artisan package:discover --ansi

COPY ./docker/nginx.conf /etc/nginx/nginx.conf
COPY ./docker/php.ini /usr/local/etc/php/conf.d/custom.ini
COPY ./docker/supervisord.conf /etc/supervisor/conf.d/supervisord.conf
COPY ./docker/entrypoint.sh /entrypoint.sh

RUN chmod +x /entrypoint.sh

RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html/storage \
    && chmod -R 755 /var/www/html/bootstrap/cache

EXPOSE 80

ENTRYPOINT ["/entrypoint.sh"]