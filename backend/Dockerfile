# syntax=docker/dockerfile:1.7
FROM php:8.3-fpm-alpine

# System deps + PHP extensions
RUN apk add --no-cache \
    bash git curl zip unzip icu-dev oniguruma-dev libzip-dev libpng-dev \
    mysql-client tzdata \
  && docker-php-ext-install pdo pdo_mysql mbstring zip intl exif gd bcmath

# Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# Install PHP deps first (cacheable)
COPY composer.json composer.lock* ./
RUN composer install --no-dev --no-interaction --prefer-dist --no-scripts || true

# Copy the rest of the app
COPY . .

# Permissions
RUN chown -R www-data:www-data storage bootstrap/cache

EXPOSE 9000
CMD ["php-fpm","-F"]
