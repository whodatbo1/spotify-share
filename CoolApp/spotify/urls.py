from django.urls import path, include
from .views import *

urlpatterns = [
    path('auth-uri', AuthURLView.as_view()),
    path('redirect', spotify_callback),
    path('is-auth', IsAuthenticated.as_view()),
    path('get-all', GetAllTokens.as_view()),
    path('get-song', get_song_info),
    path('curr-song', CurrentSong.as_view())
]