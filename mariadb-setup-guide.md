# Setting Up MariaDB for Laravel on Linux (Ubuntu/Debian)

This guide provides a complete walkthrough for setting up a MariaDB database for your Laravel application, including troubleshooting common "Access denied" and installation errors.

## Prerequisites:

- A Linux server (e.g., Ubuntu, Debian)
- SSH access to your server
- Laravel project directory (e.g., /var/www/accountability/)
- sudo privileges

## Part 1: Aggressive MariaDB Cleanup (If You Have Issues)

This section is crucial if you've encountered "Access denied," ERROR 1064, ERROR 1356, or dpkg errors during previous MariaDB installations. It ensures a completely clean slate.

> **Note:** If your MariaDB is already working perfectly and Laravel can connect, you can skip to Part 3.

### 1. Stop all running MariaDB/MySQL processes:

First, identify any lingering mysqld or mariadbd processes, especially those running with --skip-grant-tables.

```bash
sudo ps aux | grep mysql
sudo ps aux | grep mariadb
```

Look for processes like mysqld, mariadbd, mysqld_safe, etc. Note their Process IDs (PIDs) from the second column. Then, forcefully terminate them:

```bash
sudo kill -9 <PID1> <PID2> ... # Replace with actual PIDs
# Example: sudo kill -9 94235 94365
```

Verify they are gone:

```bash
sudo ps aux | grep mysql
sudo ps aux | grep mariadb
```

(You should only see grep processes now).

### 2. Stop the MariaDB service (if active):

```bash
sudo systemctl stop mariadb.service
```

(It's okay if it says "Unit mariadb.service not loaded" or similar).

### 3. Purge all MariaDB packages and remove all associated files:

This is the most critical step for a clean start. **WARNING: This will delete ALL existing MariaDB databases and data.**

```bash
# 3a. Remove core MariaDB packages
sudo apt autoremove --purge mariadb-server mariadb-client mariadb-common

# 3b. Remove any related libraries and plugins that might linger
sudo apt autoremove --purge libmariadb3 mariadb-client-core mariadb-plugin-provider-bzip2 mariadb-plugin-provider-lz4 mariadb-plugin-provider-lzma mariadb-plugin-provider-lzo mariadb-plugin-provider-snappy mariadb-server-core
```

(It's normal if some packages are reported as "not installed").

```bash
# 3c. Manually delete all remaining MariaDB data and configuration directories
sudo rm -rf /var/lib/mysql
sudo rm -rf /etc/mysql
sudo rm -rf /var/log/mysql
sudo rm -rf /var/run/mysqld # Important: removes the MariaDB socket file
sudo rm -rf /var/cache/apt/archives/mariadb* # Clears downloaded package cache
```

### 4. Clean your APT package cache:

```bash
sudo apt clean
sudo apt autoremove
```

## Part 2: Installing MariaDB

### 1. Update your package lists:

```bash
sudo apt update
```

### 2. Install MariaDB server and client:

```bash
sudo apt install mariadb-server mariadb-client
```

Monitor the output carefully. This command must complete without errors. If you see errors (e.g., dpkg errors), go back to Part 1 and ensure all processes and files are truly removed.

### 3. Run the MariaDB secure installation script:

This script guides you through essential security configurations for your new MariaDB installation, including setting the root password.

```bash
sudo mysql_secure_installation
```

Follow the prompts carefully:

- **"Enter current password for root (enter for none):"**
  - On a fresh install, this is usually blank. Just press Enter.
  - If it still prompts for a password after a fresh install and pressing Enter fails, try Reggiebiala1993 if you've ever tried to set it. If all attempts fail, you may need to repeat Part 1 and ensure the reinstall was clean.

- **"Change the root password? [Y/n]:"**
  - Answer Y (Yes).
  - Enter your desired root password (e.g., Reggiebiala1993). Type it carefully and remember it!

- **"Switch to unix_socket authentication [Y/n]:"**
  - Answer n (No). (This ensures you can connect with a password via Laravel).

- **"Remove anonymous users? [Y/n]:"**
  - Answer Y (Yes). (Security best practice).

- **"Disallow root login remotely? [Y/n]:"**
  - Answer Y (Yes). (Security best practice for local server).

- **"Remove test database and access to it? [Y/n]:"**
  - Answer Y (Yes). (Security and cleanliness).

- **"Reload privilege tables now? [Y/n]:"**
  - Answer Y (Yes). (Applies all changes immediately).

You should see "All done!" upon successful completion.

### 4. Verify MariaDB service status:

Ensure MariaDB is running and enabled to start on boot.

```bash
sudo systemctl status mariadb.service
```

If it's not active, start and enable it:

```bash
sudo systemctl start mariadb.service
sudo systemctl enable mariadb.service
```

## Part 3: Configure Database and Laravel

### 1. Test MariaDB root login:

This is the final check for your MariaDB setup.

```bash
mysql -u root -p
```

Enter the root password you set during mysql_secure_installation. You should successfully get to the MariaDB [(none)]> prompt.

### 2. Create your Laravel database:

While logged into the MariaDB prompt:

```sql
CREATE DATABASE sample_test;
```

Then, exit the MariaDB prompt:

```sql
EXIT;
```

### 3. Edit your Laravel .env file:

Navigate to your Laravel project root directory (e.g., /var/www/accountability/):

```bash
cd /var/www/accountability/ # If not already there
sudo nano .env
```

Ensure the following lines are uncommented (no # at the beginning) and that the DB_PASSWORD matches the root password you set for MariaDB:

```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=sample_test
DB_USERNAME=root
DB_PASSWORD=Reggiebiala1993 # <--- CONFIRM THIS MATCHES YOUR MARIA DB ROOT PASSWORD
```

Save the file (Ctrl+O, Enter, Ctrl+X in nano).

### 4. Clear Laravel application caches:

It's crucial to clear Laravel's configuration cache after changing the .env file for the new database credentials to take effect.

```bash
php artisan config:clear
php artisan cache:clear
php artisan optimize:clear
```

### 5. Run Laravel Migrations:

This command will create all the necessary tables (including for sessions and cache if configured) in your sample_test database.

```bash
php artisan migrate
```

This is the ultimate test of your Laravel application's database connection. If successful, you'll see messages about tables being created. If you get "Access denied," double-check your .env password and repeat Part 3, Step 1.

### 6. Run Laravel Seeders (Optional):

If your application has initial data defined in seeders:

```bash
php artisan db:seed
```

### 7. Link Storage (if your application uses file uploads):

```bash
php artisan storage:link
```

### 8. Start the Laravel Development Server:

```bash
php artisan serve
```

This will usually start a web server on http://127.0.0.1:8000. Open your web browser and navigate to this address to see your Laravel application running.

---

This comprehensive guide should help you get your MariaDB and Laravel application working together smoothly.
