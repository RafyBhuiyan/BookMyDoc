# Start with a base PHP 8.2 FPM image. 'fpm' is optimized for web apps.
FROM php:8.2-fpm

# Set the working directory in the container
WORKDIR /var/www

# Install system dependencies needed for Laravel
RUN apt-get update && apt-get install -y \
    build-essential \
    libpng-dev \
    libjpeg62-turbo-dev \
    libfreetype6-dev \
    locales \
    zip \
    jpegoptim optipng pngquant gifsicle \
    vim \
    unzip \
    git \
    curl \
    libonig-dev \
    libxml2-dev

# Install PHP extensions Laravel needs
RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd

# Install Composer (PHP package manager)
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Copy existing application directory contents
COPY ./backend /var/www

# Set correct permissions for storage and cache folders
RUN chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache

# Expose port 9000 and start php-fpm server
EXPOSE 9000
CMD ["php-fpm"]