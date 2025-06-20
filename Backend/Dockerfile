# Use PHP with Apache
FROM php:8.3-apache

# Install system dependencies and PHP extensions
RUN apt-get update && apt-get install -y \
    unzip \
    libzip-dev \
    libonig-dev \
    git \
    zip \
    libpq-dev \
    libicu-dev \
    && docker-php-ext-install \
    pdo \
    pdo_mysql \
    pdo_pgsql \
    intl \
    zip

# Enable Apache rewrite module (if needed for routing)
RUN a2enmod rewrite

# Install Composer as a non-root user
RUN curl -sS https://getcomposer.org/installer | php \
    && mv composer.phar /usr/local/bin/composer

# Set working directory
WORKDIR /var/www/html

# Copy only composer files first to leverage Docker cache
COPY --chown=www-data:www-data composer.json composer.lock ./

# Install dependencies (show full error output)
RUN COMPOSER_ALLOW_SUPERUSER=1 php -d memory_limit=-1 /usr/local/bin/composer install

# Now copy the rest of the app
COPY --chown=www-data:www-data . .

# If .env is in .dockerignore, uncomment the next line:
COPY --chown=www-data:www-data .env /var/www/html/.env

# Install dependencies as root user (default)
RUN COMPOSER_ALLOW_SUPERUSER=1 php -d memory_limit=-1 /usr/local/bin/composer install --no-interaction --no-scripts --optimize-autoloader --verbose

# Fix permissions for www-data after installing dependencies
RUN chown -R www-data:www-data /var/www/html

# Change Apache DocumentRoot to /var/www/html/app/api
RUN sed -i 's!/var/www/html!/var/www/html/app/api!g' /etc/apache2/sites-available/000-default.conf

# Expose port 80
EXPOSE 80