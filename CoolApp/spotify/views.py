from django.shortcuts import render, redirect
from .credentials import *
from rest_framework.views import APIView
from requests import *
from rest_framework import generics, status
from rest_framework.response import Response
from .util import update_token, get_user_tokens, is_authenticated, send_request
from requests.exceptions import ConnectionError
from .serializers import SpotifyTokenSerializer
from .models import SpotifyToken
from api.models import Room

class AuthURLView(APIView):
    def get(self, request, format=None):
        scope = 'user-read-playback-state user-modify-playback-state user-read-currently-playing'

        parameters = {
            'client_id': CLIENT_ID,
            'response_type': 'code',
            'redirect_uri': REDIRECT_URI,
            'scope': scope
        }

        url = Request("GET", "https://accounts.spotify.com/authorize", params=parameters).prepare().url

        return Response(headers={'url': url}, status=status.HTTP_200_OK)

def get_song_info(code):
    try:
        response = send_request()
        return redirect('FrontEnd:')
    except Exception as e:
        print(e)
    return redirect('FrontEnd:')

def pause(code):
    try:
        response = put('https://api.spotify.com/v1/me/player/pause', headers = {
            'Authorization': 'Bearer ' + code
        }).json()
        return redirect('Frontend:')
    except Exception as e:
        print(e)
    return redirect('FrontEnd:')   

def play(code):
    try:
        response = put('https://api.spotify.com/v1/me/player/play', headers = {
            'Authorization': 'Bearer ' + code
        }).json()
        return redirect('Frontend:')
    except Exception as e:
        print(e)
    return redirect('FrontEnd:') 

def nextTrack(code):
    try:
        response = put('https://api.spotify.com/v1/me/player/next', headers = {
            'Authorization': 'Bearer ' + code
        }).json()
        return redirect('Frontend:')
    except Exception as e:
        print(e)
    return redirect('FrontEnd:')   

def previous(code):
    try:
        response = put('https://api.spotify.com/v1/me/player/previous', headers = {
            'Authorization': 'Bearer ' + code
        }).json()
        return redirect('Frontend:')
    except Exception as e:
        print(e)
    return redirect('FrontEnd:')   

class ChangePlayback(APIView):
    def get(self, request, format=None):
        room_code = self.request.session.get('room_code')
        room = Room.objects.filter(code=room_code)
        if room.exists():
            room = room[0]
        else:
            return Response({"Error"}, status=status.HTTP_404_NOT_FOUND)
        host = room.host

        endpoint = 'player/' + self.request.headers.get('type')
        print(endpoint)

        response = send_request(host, endpoint, put_=True, post_=False  )

        print('res', response)

        return Response()

class CurrentSong(APIView):
    def get(self, request, format=None):
        room_code = self.request.session.get('room_code')
        room = Room.objects.filter(code=room_code)
        if room.exists():
            room = room[0]
        else:
            return Response({"Error"}, status=status.HTTP_404_NOT_FOUND)
        host = room.host
        endpoint = 'player/currently-playing'

        response = send_request(host, endpoint)

        if('error' in response or 'item' not in response):
            return Response({"Error, no content"}, status=status.HTTP_204_NO_CONTENT)

        item = response.get('item')
        duration = item.get('duration_ms')
        progress = response.get('progress_ms')

        album = item.get('album')
        artist = item.get('artists')[0]

        album_cover = album.get('images')[0].get('url')
        album_name = album.get('name')
        album_date = album.get('release_date')

        artist_name = artist.get('name')

        track_name = response.get('item').get('name')
        is_playing = response.get('is_playing')

        # print("ac", item)
        info = {'album_cover': album_cover,
                'album_name': album_name,
                'album_date': album_date,
                'artist_name': artist_name,
                'track_name': track_name,
                'duration': duration,
                'progress': progress,
                'is_playing': is_playing
                }
        return Response(headers=info, status=status.HTTP_200_OK)


def spotify_callback(request):
    code = request.GET.get('code')
    error = request.GET.get('error')
    state = request.GET.get('state')
    
    try: 
        response = post('https://accounts.spotify.com/api/token', data={
            'grant_type': 'authorization_code',
            'code': code,
            'client_id': CLIENT_ID,
            'redirect_uri': REDIRECT_URI,
            'client_secret': CLIENT_SECRET
            }).json()
        # print("er", response)
        access_token = response.get('access_token')
        token_type = response.get('token_type')
        refresh_token = response.get('refresh_token')
        expires_in = response.get('expires_in')
        error = response.get('error')

        if not request.session.exists(request.session.session_key):
            request.session.create()
        update_token(session_id=request.session.session_key, access_token=access_token, token_type=token_type, refresh_token=refresh_token, expires_in=expires_in)

        return redirect('FrontEnd:')
    except ConnectionError as err:
        return redirect('FrontEnd:')
    
class GetAllTokens(generics.ListAPIView):
    queryset = SpotifyToken.objects.all()
    serializer_class = SpotifyTokenSerializer


class IsAuthenticated(APIView):
    def get(self, request, format=None):
        is_auth = is_authenticated(self.request.session.session_key)
        return Response({'status': is_auth}, status=status.HTTP_200_OK)


class GetAccessTokensView(APIView):
    def post(self, request, format=None):
        return 1
