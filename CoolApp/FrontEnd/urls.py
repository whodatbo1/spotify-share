from django.contrib import admin
from django.urls import path, include
from .views import index

app_name = 'FrontEnd'

urlpatterns = [
    path('', index, name=''),
    path('s', index, name='s'),
    path('join', index, name='join'),
    path('create', index, name='create'),
    path('room/<str:code>', index)
]