"""
Django settings for core project.
Production-ready version with Railway + Vercel deployment support.
"""

from pathlib import Path
import os
import dj_database_url
from dotenv import load_dotenv
from decouple import config
from datetime import timedelta

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent

# ─────────────────────────────────────────────
# SECURITY
# ─────────────────────────────────────────────
SECRET_KEY = config('SECRET_KEY', default='django-insecure-temporary-default-key-123')

# Set DEBUG=False in production via environment variable
DEBUG = config('DEBUG', default='False') == 'True'

ALLOWED_HOSTS = config(
    'ALLOWED_HOSTS',
    default='*'
).split(',')

APPEND_SLASH = False

AUTH_USER_MODEL = 'role.CustomUser'

# ─────────────────────────────────────────────
# APPS
# ─────────────────────────────────────────────
SHARED_APPS = [
    'django_tenants',
    'tenants',

    'django.contrib.contenttypes',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    'rest_framework',
    'rest_framework_simplejwt',
    'django_rest_passwordreset',
    'corsheaders',

    'role',
]

TENANT_APPS = [
    'django.contrib.contenttypes',
    'django.contrib.auth',
    'product',
    'Sale',
]

INSTALLED_APPS = list(SHARED_APPS) + [app for app in TENANT_APPS if app not in SHARED_APPS]

# ─────────────────────────────────────────────
# MIDDLEWARE
# ─────────────────────────────────────────────
MIDDLEWARE = [
    'django_tenants.middleware.main.TenantMainMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',      # ← NEW: serves static files
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'core.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'core.wsgi.application'

# ─────────────────────────────────────────────
# DATABASE (supports both local & Railway)
# ─────────────────────────────────────────────

DATABASE_URL = os.environ.get('DATABASE_URL')

if DATABASE_URL:
    # ✅ Production: parse Railway's DATABASE_URL but keep django-tenants engine
    db_config = dj_database_url.parse(DATABASE_URL)
    DATABASES = {
        'default': {
            'ENGINE': 'django_tenants.postgresql_backend',   # never change this
            'NAME': db_config['NAME'],
            'USER': db_config['USER'],
            'PASSWORD': db_config['PASSWORD'],
            'HOST': db_config['HOST'],
            'PORT': db_config['PORT'],
            'OPTIONS': {
                'options': '-c search_path=public',
                'sslmode': 'require',                        # Railway requires SSL
            },
        }
    }
else:
    # ✅ Local development: use your existing credentials
    DATABASES = {
        'default': {
            'ENGINE': 'django_tenants.postgresql_backend',
            'NAME': config('DB_NAME', default='Project1'),
            'USER': config('DB_USER', default='myuser'),
            'PASSWORD': config('DB_PASSWORD', default='mysecretpassword'),
            'HOST': config('DB_HOST', default='localhost'),
            'PORT': config('DB_PORT', default='5434'),
            'OPTIONS': {
                'options': '-c search_path=public',
            },
        }
    }

DATABASE_ROUTERS = (
    'django_tenants.routers.TenantSyncRouter',
)

# ─────────────────────────────────────────────
# TENANT CONFIG
# ─────────────────────────────────────────────
TENANT_MODEL = "tenants.Client"
TENANT_DOMAIN_MODEL = "tenants.Domain"

# ─────────────────────────────────────────────
# PASSWORD VALIDATION
# ─────────────────────────────────────────────
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

# ─────────────────────────────────────────────
# INTERNATIONALIZATION
# ─────────────────────────────────────────────
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

# ─────────────────────────────────────────────
# STATIC FILES (WhiteNoise for production)
# ─────────────────────────────────────────────
STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# ─────────────────────────────────────────────
# REST FRAMEWORK + JWT
# ─────────────────────────────────────────────
REST_FRAMEWORK = {
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 10,
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    )
}

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(days=1),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=30),
    "ROTATE_REFRESH_TOKENS": False,
    "BLACKLIST_AFTER_ROTATION": False,
}

# ─────────────────────────────────────────────
# CORS  (update FRONTEND_URL in Railway env vars)
# ─────────────────────────────────────────────

FRONTEND_URL = config('FRONTEND_URL', default='http://localhost:5173')

CORS_ALLOWED_ORIGIN_REGEXES = [
    r"^http://.*\.localhost:5173$",   # any subdomain on local dev
    r"^http://localhost:5173$",       # plain localhost dev
]

# Add production Vercel URL dynamically from env
CORS_ALLOWED_ORIGINS = [
    FRONTEND_URL,
]

CSRF_TRUSTED_ORIGINS = [
    "http://*.localhost:5173",
    FRONTEND_URL,
]

CORS_ALLOW_CREDENTIALS = True