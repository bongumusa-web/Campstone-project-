from django.urls import path
from . import views

urlpatterns = [
    path('setup/', views.initial_setup, name='initial_setup'),
    path('login/', views.login_view, name='login'),
    path('admin-login/', views.admin_login, name='admin_login'),
    path('dashboard/', views.dashboard_view, name='dashboard'),
    path('pos/', views.pos_view, name='pos'),
    path('logout/', views.logout_view, name='logout'),
    path('register/', views.register_view, name='register'),
]
