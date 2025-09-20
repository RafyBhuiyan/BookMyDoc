# Set the base image for the PHP Laravel environment
FROM php:8.2-fpm

# Set working directory
WORKDIR /var/www

# Install dependencies
RUN apt-get update && apt-get install -y libpng-dev libjpeg-dev libfreetype6-dev zip git && \
    docker-php-ext-configure gd --with-freetype --with-jpeg && \
    docker-php-ext-install gd pdo pdo_mysql && \
    pecl install xdebug && \
    docker-php-ext-enable xdebug

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Copy Laravel files
COPY . .

# Install PHP dependencies
RUN composer install --no-dev --optimize-autoloader

# Set environment variables
ENV APACHE_DOCUMENT_ROOT /var/www/public

# Expose the port Laravel will run on
EXPOSE 8000

# Start the Laravel application
CMD ["php-fpm"]
