from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from .forms import SuperUserCreationForm
from django.utils.http import url_has_allowed_host_and_scheme

# --------------------------------------
# INITIAL SUPERUSER SETUP
# --------------------------------------
def initial_setup(request):
    """Create the first superuser if none exists."""
    if User.objects.filter(is_superuser=True).exists():
        return redirect('login')

    if request.method == 'POST':
        form = SuperUserCreationForm(request.POST)
        if form.is_valid():
            user = form.save(commit=False)
            user.is_superuser = True
            user.is_staff = True
            user.is_active = True
            user.save()
            login(request, user)
            return redirect('dashboard')
    else:
        form = SuperUserCreationForm()

    return render(request, 'authication/superuser.html', {'form': form})


# --------------------------------------
# SUPERUSER DASHBOARD
# --------------------------------------
@login_required(login_url='admin_login')
def dashboard_view(request):
    """Accessible only by superusers."""
    if not request.user.is_superuser:
        messages.error(request, "Access denied! Only superusers allowed.")
        return redirect('pos')
    return render(request, "authication/dashboard.html", {"first_name": request.user.first_name})


# --------------------------------------
# CASHIER POS
# --------------------------------------
@login_required(login_url='login')
def pos_view(request):
    """Accessible only by cashiers."""
    if request.user.is_superuser:
        messages.info(request, "Superusers must use the dashboard.")
        return redirect('dashboard')
    return render(request, "authication/pos_casheir.html", {"first_name": request.user.first_name})


# --------------------------------------
# STAFF REGISTRATION (SUPERUSER ONLY)
# --------------------------------------
@login_required(login_url='admin_login')
def register_view(request):
    if not request.user.is_superuser:
        messages.error(request, "Only superusers can register staff.")
        return redirect('pos')

    if request.method == 'POST':
        first_name = request.POST.get('first_name')
        last_name = request.POST.get('last_name')
        username = request.POST.get('username')
        email = request.POST.get('email')
        password = request.POST.get('password')
        confirm_password = request.POST.get('confirm_password')

        if password != confirm_password:
            messages.error(request, 'Passwords do not match.')
            return render(request, 'authication/register.html')

        if User.objects.filter(username=username).exists():
            messages.error(request, 'Username already taken.')
            return render(request, 'authication/register.html')

        if User.objects.filter(email=email).exists():
            messages.error(request, 'Email already registered.')
            return render(request, 'authication/register.html')

        myuser = User.objects.create_user(
            username=username,
            email=email,
            password=password,
            first_name=first_name,
            last_name=last_name,
        )
        myuser.save()
        messages.success(request, 'Staff added successfully.')
        return redirect('dashboard')

    return render(request, 'authication/register.html')


# --------------------------------------
# STAFF / CASHIER LOGIN
# --------------------------------------
def login_view(request):
    """Login view for staff/cashiers."""
    if request.method == "POST":
        username = request.POST.get("username")
        password = request.POST.get("password")
        user = authenticate(request, username=username, password=password)

        if user:
            if user.is_superuser:
                messages.error(request, "Use the Superuser login page.")
                return redirect('admin_login')

            login(request, user)
            next_url = request.GET.get('next')
            if next_url and url_has_allowed_host_and_scheme(next_url, allowed_hosts={request.get_host()}):
                return redirect(next_url)
            return redirect('pos')
        else:
            messages.error(request, "Invalid username or password.")

    return render(request, "authication/login.html")


# --------------------------------------
# SUPERUSER LOGIN
# --------------------------------------
def admin_login(request):
    """Login view for superusers only."""
    if request.method == "POST":
        username = request.POST.get("username")
        password = request.POST.get("password")
        user = authenticate(request, username=username, password=password)

        if user is not None and user.is_superuser:
            login(request, user)
            return redirect('dashboard')
        else:
            messages.error(request, "Invalid superuser credentials.")
            return redirect('admin_login')

    return render(request, "authication/admin_login.html")


# --------------------------------------
# LOGOUT
# --------------------------------------
def logout_view(request):
    logout(request)
    messages.success(request, 'Logout successful. Goodbye!')
    return redirect('login')
