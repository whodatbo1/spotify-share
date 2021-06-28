
from django.urls import path
from .views import *

urlpatterns = [
    path('room/all', RoomView.as_view()),
    path('room/create', CreateRoomView.as_view()),
    path('room/get', GetRoomView.as_view()),
    path('room/join', JoinRoom.as_view()),
    path('room/leave', LeaveRoom.as_view()),
]
