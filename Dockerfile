# ===========================================
# Stage 1: Build assets (Node + Vite)
# ===========================================
FROM node:20-alpine AS assets

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# ===========================================
# Stage 2: PHP dependencies
# ===========================================
FROM composer:2.7 AS vendor

WORKDIR /app

COPY composer.json composer.lock ./
RUN composer install \
    --no-dev \
    --no-interaction \
    --no-progress \
    --optimize-autoloader \
    --ignore-platform-reqs

# ===========================================
# Stage 3: Final production image
# ===========================================
FROM php:8.3-fpm-alpine AS final

# Install system dependencies
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

# Install PHP extensions
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

# Install Redis PHP extension
RUN pecl install redis && docker-php-ext-enable redis

WORKDIR /var/www/html

# Copy application files
COPY . .
COPY --from=vendor /app/vendor ./vendor
COPY --from=assets /app/public/build ./public/build

# Copy config files
COPY ./docker/nginx.conf /etc/nginx/nginx.conf
COPY ./docker/php.ini /usr/local/etc/php/conf.d/custom.ini
COPY ./docker/supervisord.conf /etc/supervisor/conf.d/supervisord.conf
COPY ./docker/entrypoint.sh /entrypoint.sh

RUN chmod +x /entrypoint.sh

# Set permissions
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html/storage \
    && chmod -R 755 /var/www/html/bootstrap/cache

EXPOSE 80

ENTRYPOINT ["/entrypoint.sh"]