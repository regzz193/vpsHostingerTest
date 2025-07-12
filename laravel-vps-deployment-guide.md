# Deploying a Laravel Application to a Linux VPS

This guide provides a complete walkthrough for setting up a production-ready Laravel application on a fresh Ubuntu Server VPS, using Nginx as the web server, MariaDB as the database, PHP-FPM for PHP processing, and Let's Encrypt for free SSL certificates.

## Prerequisites

Before you begin, ensure you have:

- A Linux VPS (this guide assumes Ubuntu Server 22.04 LTS or similar).
- SSH access to your VPS (root access is fine to start, but we'll create a new user).
- A domain name (e.g., yourdomain.com) that you can manage DNS records for.
- Your Laravel application pushed to a GitHub repository (or other Git provider).
- A local SSH client (Terminal on Linux/macOS, PowerShell/PuTTY on Windows).

## I. Initial Server Setup

### A. Connect via SSH

Open your local terminal and connect to your VPS. If you're logging in as root, be extra careful.

```bash
ssh root@your_vps_ip_address
```

Enter your root password when prompted.

### B. Update System & Create New User (Recommended)

It's best practice to work with a non-root user.

Update your package lists and upgrade existing packages:

```bash
sudo apt update
sudo apt upgrade -y
```

Create a new user (replace yourusername):

```bash
sudo adduser yourusername
```

Follow the prompts to set a password and user information.

Grant sudo privileges to the new user:

```bash
sudo usermod -aG sudo yourusername
```

Switch to the new user:

```bash
su - yourusername
```

From now on, use sudo before commands that require root privileges.

### C. Configure Firewall (UFW)

UFW (Uncomplicated Firewall) is enabled by default on many Ubuntu installs.

Allow SSH (so you don't lock yourself out):

```bash
sudo ufw allow OpenSSH
```

Enable the firewall:

```bash
sudo ufw enable
```

Type y and Enter to confirm.

Verify firewall status:

```bash
sudo ufw status
```

You should see OpenSSH allowed.

## II. Install Web Server (Nginx)

Nginx will serve your website files and pass PHP requests to PHP-FPM.

### A. Install Nginx

```bash
sudo apt install nginx -y
```

### B. Configure Nginx for Laravel

This involves creating a new Nginx server block for your domain.

Create your Nginx configuration file:

```bash
sudo nano /etc/nginx/sites-available/yourdomain.com
```

(Replace yourdomain.com with your actual domain).

Paste the following configuration. Crucially, ensure root points to your Laravel public directory and fastcgi_pass matches your PHP-FPM version (e.g., php8.2-fpm.sock or php8.3-fpm.sock).

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name yourdomain.com www.yourdomain.com; # Replace with your domain

    root /var/www/yourdomain.com/public; # IMPORTANT: Point to your Laravel public directory

    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";

    index index.php index.html index.htm;

    charset utf-8;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock; # !!! ADJUST PHP VERSION HERE (e.g., php8.3-fpm.sock) !!!
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\.ht {
        deny all;
    }
}
```

Save and exit (Ctrl+O, Enter, Ctrl+X).

### C. Test & Restart Nginx

Enable your site by creating a symbolic link:

```bash
sudo ln -s /etc/nginx/sites-available/yourdomain.com /etc/nginx/sites-enabled/
```

Disable the default Nginx welcome page (optional, but good practice):

```bash
sudo unlink /etc/nginx/sites-enabled/default
```

Test Nginx configuration for syntax errors:

```bash
sudo nginx -t
```

You should see: nginx: the configuration file ... syntax is ok and test is successful.

Restart Nginx to apply changes:

```bash
sudo systemctl restart nginx
```

## III. Install PHP & PHP-FPM

Laravel requires PHP and specific extensions. PHP-FPM (FastCGI Process Manager) handles PHP requests for Nginx.

### A. Add PPA for Newer PHP (Optional, Recommended for latest Laravel)

If you need a newer PHP version than what your Ubuntu repository provides (e.g., PHP 8.2 or 8.3), add Ondrej's PPA:

```bash
sudo apt install software-properties-common -y
sudo add-apt-repository ppa:ondrej/php -y
sudo apt update
```

### B. Install PHP and Extensions

Replace 8.2 with your desired PHP version (e.g., 8.3).

```bash
sudo apt install php8.2-fpm php8.2-mysql php8.2-mbstring php8.2-xml php8.2-bcmath php8.2-curl php8.2-zip php8.2-dom -y
```

### C. Configure PHP-FPM (Optional, usually fine by default)

By default, PHP-FPM runs as www-data, which matches Nginx's default user.

Verify PHP-FPM status:

```bash
sudo systemctl status php8.2-fpm # Adjust version
```

It should be active (running). If not, start it: sudo systemctl start php8.2-fpm

## IV. Install Database (MariaDB)

MariaDB is a popular, open-source relational database.

### A. Install MariaDB

```bash
sudo apt install mariadb-server -y
```

### B. Secure MariaDB Installation

This script will guide you through setting a root password, removing anonymous users, disallowing remote root login, and removing test databases.

```bash
sudo mysql_secure_installation
```

Enter current password for root (none): Just press Enter.

Set root password? Type Y and set a strong password. Remember this password!

For the rest of the questions, type Y and press Enter for the default (recommended) options.

### C. Create Database and User for Laravel

Log in to MariaDB as root:

```bash
sudo mysql -u root -p
```

Enter the root password you set during mysql_secure_installation.

Create your database:

```sql
CREATE DATABASE your_database_name CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

(Replace your_database_name with something like laravel_app_db).

Create a database user and grant privileges:

```sql
CREATE USER 'your_db_user'@'localhost' IDENTIFIED BY 'your_strong_db_password';
GRANT ALL PRIVILEGES ON your_database_name.* TO 'your_db_user'@'localhost';
FLUSH PRIVILEGES;
```

(Replace your_db_user, your_strong_db_password, and your_database_name).
Remember your_db_user and your_strong_db_password!

Exit MariaDB:

```sql
EXIT;
```

## V. Install Composer & Git

Composer is Laravel's dependency manager. Git is for cloning your project.

### A. Install Composer

```bash
curl -sS https://getcomposer.org/installer | php
sudo mv composer.phar /usr/local/bin/composer
```

### B. Install Git

```bash
sudo apt install git -y
```

## VI. Deploy Your Laravel Application

This section gets your code onto the server and sets up Laravel.

### A. Create Project Directory & Clone from GitHub

Create the web root directory:

```bash
sudo mkdir -p /var/www/yourdomain.com
```

Give your user ownership of the directory:

```bash
sudo chown -R $USER:$USER /var/www/yourdomain.com
```

Navigate into your project directory:

```bash
cd /var/www/yourdomain.com
```

Clone your Laravel repository:

Using HTTPS (simpler, but asks for password):

```bash
git clone https://github.com/your-github-username/your-repo-name.git .
```

Using SSH (recommended, more secure, requires SSH key setup on GitHub):
First, generate an SSH key on your VPS: ssh-keygen -t ed25519 -C "your_email@example.com". Copy the public key (cat ~/.ssh/id_ed25519.pub) and add it to your GitHub account settings. Then clone:

```bash
git clone git@github.com:your-github-username/your-repo-name.git .
```

### B. Configure .env File

Copy the example environment file:

```bash
cp .env.example .env
```

Edit the .env file:

```bash
nano .env
```

Adjust these crucial lines:

```
APP_ENV=production
APP_DEBUG=false
APP_URL=http://yourdomain.com (We'll change this to HTTPS later)
DB_DATABASE=your_database_name
DB_USERNAME=your_db_user
DB_PASSWORD=your_strong_db_password
```

Leave DB_HOST=127.0.0.1 and DB_PORT=3306 as they are.

Save and exit.

### C. Install Composer Dependencies

```bash
composer install --no-dev --optimize-autoloader
```

### D. Generate Application Key

```bash
php artisan key:generate
```

### E. Run Migrations & Seeders (if applicable)

```bash
php artisan migrate --force # --force is needed in production
php artisan db:seed         # Optional: If you have seeders
```

### F. Link Storage

```bash
php artisan storage:link
```

### G. Set Permissions

The web server user (www-data) needs read/write access to certain directories.

```bash
sudo chown -R www-data:www-data /var/www/yourdomain.com/storage
sudo chown -R www-data:www-data /var/www/yourdomain.com/bootstrap/cache
sudo chmod -R 775 /var/www/yourdomain.com/storage
sudo chmod -R 775 /var/www/yourdomain.com/bootstrap/cache
```

### H. Clear Laravel Caches

```bash
php artisan config:clear
php artisan cache:clear
php artisan optimize:clear
```

## VII. Configure Domain DNS

This is done via your domain registrar's (e.g., Hostinger's) DNS management panel.

### A. Point A Records to VPS IP

Log in to your domain registrar's control panel.

Find the DNS Management or DNS Zone Editor section.

Create or modify the A records:

- For yourdomain.com (Name: @ or blank), point to your_vps_ip_address.
- For www.yourdomain.com (Name: www), point to your_vps_ip_address.

Crucially: Ensure there are NO AAAA records (IPv6) pointing to incorrect or unconfigured IPv6 addresses on your VPS. Delete them if they exist and you're not using IPv6.

### B. Wait for Propagation

DNS changes take time to propagate. Use tools like DNS Checker to confirm that both yourdomain.com and www.yourdomain.com resolve to your VPS's IP address across multiple locations. Do NOT proceed until this is confirmed.

## VIII. Secure Your Site with SSL (HTTPS) - Let's Encrypt

This will encrypt traffic to your site and get rid of the "Not Secured" warning.

### A. Install Certbot

```bash
sudo apt install certbot python3-certbot-nginx -y
```

### B. Allow HTTPS Traffic Through Firewall

```bash
sudo ufw allow 'Nginx Full'
sudo ufw delete allow 'Nginx HTTP' # If you enabled it before
sudo ufw reload
```

### C. Obtain & Deploy Certificate

This command will automatically find your Nginx config, obtain the certificate, and modify Nginx to serve it and redirect HTTP to HTTPS.

```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

Follow the prompts:

- Enter an email address for renewal notices.
- Agree to the terms of service.
- Choose option 2 to redirect HTTP traffic to HTTPS.

If successful, you'll see a "Congratulations!" message.

### D. Verify Automatic Renewal

Certbot sets up automatic renewal. You can test it with a dry run:

```bash
sudo certbot renew --dry-run
```

If it runs without errors, your certificates should renew automatically.

### E. Update Laravel's APP_URL

Edit your .env file again:

```bash
nano .env
```

Change APP_URL to use https:

```
APP_URL=https://yourdomain.com
```

Save and exit.

Clear Laravel's configuration cache (again!):

```bash
php artisan config:clear
php artisan cache:clear
php artisan optimize:clear
```

## IX. Post-Deployment & Ongoing Maintenance

### A. Verify Site Functionality

Open your web browser and navigate to http://yourdomain.com and https://yourdomain.com. Both should redirect to HTTPS and display your Laravel application securely.

### B. Redeploying Updates

When you make changes to your code locally and push them to GitHub:

SSH into your VPS.

Navigate to your project directory: cd /var/www/yourdomain.com/

Pull the latest changes:

```bash
git pull
```

Install/Update PHP dependencies (if composer.json changed):

```bash
composer install --no-dev --optimize-autoloader
```

Run migrations (if database schema changed):

```bash
php artisan migrate --force
```

Clear/Cache Laravel configs (important after code changes):

```bash
php artisan config:clear
php artisan cache:clear
php artisan optimize:clear
php artisan route:cache # If you use route caching
php artisan view:cache # If you use view caching
```

## Troubleshooting Tips

- **White Screen**: Check storage/logs/laravel.log for errors (tail -f storage/logs/laravel.log). Verify file permissions (sudo chown -R www-data:www-data ..., sudo chmod -R 775 ...).

- **"Welcome to Nginx" page**: Your Nginx server_name doesn't match your domain, or you forgot to disable the default Nginx site.

- **"502 Bad Gateway"**: PHP-FPM isn't running or Nginx isn't configured to pass requests to the correct PHP-FPM socket. Check sudo systemctl status php8.2-fpm.

- **"Conflicting Server Name" on nginx -t**: You have multiple Nginx configuration files enabled in sites-enabled trying to handle the same domain/port. Disable or remove the redundant one (sudo unlink /etc/nginx/sites-enabled/old_config).

- **Certbot Authentication Failure (404/Timeout)**:
  - DNS propagation isn't complete (use dnschecker.org).
  - Firewall blocking port 80/443 (sudo ufw status).
  - Incorrect AAAA (IPv6) DNS records pointing to an unconfigured IPv6 on your VPS (delete them from your DNS).
  - Nginx server_name doesn't match the domain Certbot is trying to verify.

This guide covers the most common and robust way to deploy a Laravel application. Good luck with your deployments!
