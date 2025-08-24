"""
URL configuration for pos_inventory project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.shortcuts import redirect
from django.contrib.auth.models import User
# for image uploads
from django.conf import settings
from django.conf.urls.static import static


def root_redirect(request):
    # If no superuser exists, go to setup page
    if not User.objects.filter(is_superuser=True).exists():
        return redirect('initial_setup')
    # Otherwise, go to login
    return redirect('login')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', root_redirect),           # root URL goes to setup/login
    path('', include('authication.urls')),  # your app URLs
    path('products/', include('product.urls', namespace='product')),  # product app
    path('suppliers/', include('supplier.urls', namespace='supplier')),  # supplier app
]



urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
