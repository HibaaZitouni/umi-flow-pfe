# Umi-Flow — Backend Laravel 11
## Stack : Laravel 11 · MySQL · Laravel Sanctum · PHP 8.2+

---

## 1. Installation

```bash
composer create-project laravel/laravel umi-flow-backend
cd umi-flow-backend
composer require laravel/sanctum spatie/laravel-permission
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
php artisan vendor:publish --provider="Spatie\Permission\PermissionServiceProvider"
```

## 2. .env
```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=umi_flow
DB_USERNAME=root
DB_PASSWORD=
SANCTUM_STATEFUL_DOMAINS=localhost:5173
FRONTEND_URL=http://localhost:5173
```

## 3. Lancer
```bash
php artisan migrate --seed
php artisan serve
```

## Rôles
| Rôle         | Domain          | Redirect      |
|--------------|-----------------|---------------|
| SUPER_ADMIN  | @admin.ac.ma    | /super-admin  |
| ADMIN_*      | @admin.ac.ma    | /admin        |
| PROFESSEUR   | @umi.ac.ma      | /home         |
| ETUDIANT     | @edu.umi.ac.ma  | /home         |