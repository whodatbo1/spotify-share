from django.shortcuts import render
from django.http import HttpResponse, JsonResponse

from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response


from .serializers import RoomSerializer
from .serializers import CreateRoomSerializer
# from .serializers import GetRoomSerializer
from .models import Room

class RoomView(generics.ListAPIView):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer

class GetRoomView(APIView):
    serializer_class = RoomSerializer
    lookup_url_kwarg = 'code'
    def get(self, request, format=None):
        code = request.GET.get(self.lookup_url_kwarg)

        if code != None:
            room = Room.objects.filter(code=code)
            if len(room) > 0:
                data = RoomSerializer(room[0]).data
                data['is_host'] = room[0].host == request.session.session_key
                return Response(data, status=status.HTTP_200_OK)
            return Response("Room doesn't exist. Do you want to create a new one?", status=status.HTTP_404_NOT_FOUND)
        return Response("No room code supplied.", status=status.HTTP_400_BAD_REQUEST)

class CreateRoomView(APIView):
    serializer_class = CreateRoomSerializer

    def post(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()
        
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            guest_can_pause = serializer.data.get('guest_can_pause')
            votes_to_skip = serializer.data.get('votes_to_skip')
            host = self.request.session.session_key
            queryset = Room.objects.filter(host=host)
            if queryset.exists():
                room = queryset[0]
                room.guest_can_pause = guest_can_pause
                room.votes_to_skip = votes_to_skip
                room.save(update_fields=['guest_can_pause', 'votes_to_skip'])
            else:
                room = Room(host=host, guest_can_pause=guest_can_pause, votes_to_skip=votes_to_skip)
                room.save()
            self.request.session['room_code'] = room.code
            return Response(RoomSerializer(room).data, status=status.HTTP_200_OK)
        return Response("Invalid input", status=status.HTTP_400_BAD_REQUEST)

class JoinRoom(APIView):
    join_room_arg = 'code'

    def post(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()
        
        code = request.data.get(self.join_room_arg)
        if code != None:
            room = Room.objects.filter(code=code)
            if len(room) > 0:
                room = room[0]
                self.request.session['room_code'] = code
                return Response({'message': 'Room joined'}, status=status.HTTP_200_OK)
            return Response("Room doesn't exist", status=status.HTTP_404_NOT_FOUND)
        return Response("Enter a code", status=status.HTTP_400_BAD_REQUEST)

class LeaveRoom(APIView):
    def post(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            return Response("Currently not in a room", status=status.HTTP_400_BAD_REQUEST)
        self.request.session['room_code'] = None
        host_id = self.request.session.session_key
        room_res = Room.objects.filter(host=host_id)
        if len(room_res) > 0:
            room = room_res[0]
            room.delete()
        return Response("Successfully left room", status=status.HTTP_200_OK)