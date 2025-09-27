# syntax=docker/dockerfile:1.7
FROM php:8.3-cli-alpine

# System deps + PHP extensions needed by Laravel and dompdf
RUN apk add --no-cache \
    bash git curl zip unzip tzdata icu-dev oniguruma-dev libzip-dev \
    libpng-dev freetype-dev libjpeg-turbo-dev libwebp-dev libxml2-dev \
    ttf-dejavu fontconfig mysql-client \
 && docker-php-ext-configure gd --with-jpeg --with-webp \
 && docker-php-ext-install pdo pdo_mysql mbstring zip intl exif gd bcmath

# Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /app

# Install PHP deps first (cacheable)
COPY composer.json composer.lock* ./
RUN composer install --no-dev --no-interaction --prefer-dist --no-scripts

# App code
COPY . .

# Clean caches; ensure runtime dirs exist; safe permissions
RUN php artisan config:clear || true \
 && php artisan route:clear || true \
 && php artisan view:clear  || true \
 && mkdir -p storage/framework/{cache,sessions,views} \
 && chown -R www-data:www-data storage bootstrap/cache

# Railway provides $PORT; default to 8080 if not present
ENV PORT=8080
EXPOSE 8080

# Start sequence:
# - storage:link (idempotent)
# - migrate --force (will run if DB is reachable)
# - serve Laravel via PHP built-in web server (router = public/index.php)
CMD sh -lc 'php artisan storage:link || true; php artisan migrate --force || true; php -d variables_order=EGPCS -S 0.0.0.0:${PORT} -t public public/index.php'
