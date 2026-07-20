from django.urls import path
from . import views

urlpatterns = [
    path("", views.web_view, name="web"),
]