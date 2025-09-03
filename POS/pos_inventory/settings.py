from pathlib import Path
import os

BASE_DIR = Path(__file__).resolve().parent.parent

# SECURITY
SECRET_KEY = os.environ.get('DJANGO_SECRET_KEY', 'django-insecure-demo-key')

# Debug mode (default False in production)
DEBUG = os.environ.get('DJANGO_DEBUG', 'False') == 'True'

# Allowed hosts
ALLOWED_HOSTS = [
    'Musa1.pythonanywhere.com',  #  domain
    '127.0.0.1',  # local dev
    'localhost',  # local dev
]

# Application definition
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    'authication',
    'product',
    'supplier',
    'point_of_sales',

    'rest_framework',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'pos_inventory.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / "templates"],
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

WSGI_APPLICATION = 'pos_inventory.wsgi.application'

# Database
if 'PYTHONANYWHERE_DOMAIN' in os.environ:
    #  Use MySQL on PythonAnywhere
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.mysql',
            'NAME': 'Musa1$default',  # change Musa1 to your PythonAnywhere username
            'USER': 'Musa1',          # same here
            'PASSWORD': os.environ.get('DB_PASSWORD', ''),  # set in Web → Environment variables
            'HOST': 'Musa1.mysql.pythonanywhere-services.com',
        }
    }
else:
    # Use SQLite locally
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': BASE_DIR / 'db.sqlite3',
        }
    }

# Password validation
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

# Internationalization
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

# Static files
STATIC_URL = '/static/'
STATICFILES_DIRS = [BASE_DIR / "static"]       # dev static files
STATIC_ROOT = BASE_DIR / "staticfiles"        # collected static for deployment

# Media files (images, uploads)
MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

# Default primary key field type
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# Session and login
SESSION_COOKIE_SECURE = not DEBUG   # secure cookies only in production
CSRF_COOKIE_SECURE = not DEBUG
SESSION_ENGINE = 'django.contrib.sessions.backends.db'
LOGIN_URL = '/login/'
