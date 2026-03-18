# ===========================================
# Stage 1: Dependencies (cached separately)
# ===========================================
FROM php:8.3-cli AS deps

WORKDIR /app

COPY --from=mlocati/php-extension-installer /usr/bin/install-php-extensions /usr/local/bin/
RUN install-php-extensions pdo_pgsql pgsql mbstring zip bcmath intl redis

COPY --from=composer:2.7 /usr/bin/composer /usr/bin/composer

COPY composer.json composer.lock ./
RUN composer install --no-dev --no-interaction --optimize-autoloader --ignore-platform-reqs

COPY package.json package-lock.json* ./
RUN npm ci

# ===========================================
# Stage 2: The "Everything" Builder
# ===========================================
FROM php:8.3-cli AS builder

WORKDIR /app

COPY --from=mlocati/php-extension-installer /usr/bin/install-php-extensions /usr/local/bin/
RUN install-php-extensions pdo_pgsql pgsql mbstring zip bcmath intl redis

COPY --from=composer:2.7 /usr/bin/composer /usr/bin/composer

COPY composer.json composer.lock ./
RUN composer install --no-dev --no-interaction --optimize-autoloader --ignore-platform-reqs

COPY package.json package-lock.json* ./
RUN npm ci

COPY . .

RUN php artisan wayfinder:generate || true

RUN npm run build

# ===========================================
# Stage 3: Final Production Image
# ===========================================
FROM php:8.3-fpm AS final

WORKDIR /var/www/html

COPY --from=mlocati/php-extension-installer /usr/bin/install-php-extensions /usr/local/bin/
RUN install-php-extensions pdo_pgsql pgsql mbstring zip bcmath intl opcache pcntl redis

RUN apt-get update && apt-get install -y nginx supervisor curl bash \
    && rm -rf /var/lib/apt/lists/*

COPY --from=builder /app /var/www/html

COPY ./docker/nginx.conf /etc/nginx/nginx.conf
COPY ./docker/php.ini /usr/local/etc/php/conf.d/custom.ini
COPY ./docker/supervisord.conf /etc/supervisor/conf.d/supervisord.conf
COPY ./docker/entrypoint.sh /entrypoint.sh

RUN chmod +x /entrypoint.sh

RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html/storage \
    && chmod -R 755 /var/www/html/bootstrap/cache

EXPOSE 80 8080

ENTRYPOINT ["/entrypoint.sh"]
