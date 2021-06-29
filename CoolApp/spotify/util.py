from .models import SpotifyToken
from django.utils import timezone
from datetime import timedelta
from .credentials import *
from requests import post, get, put

BASE_URL = 'https://api.spotify.com/v1/me/'

def get_user_tokens(session_id):
    # print("session_id", session_id)
    tokens =  SpotifyToken.objects.filter(user=session_id)
    if tokens.exists():
        return tokens[0]
    else:
        return None

def update_token(session_id, access_token, token_type, expires_in, refresh_token):
    tokens = get_user_tokens(session_id)
    expires_in = timezone.now() + timedelta(seconds=expires_in)

    if tokens:
        tokens.access_token = access_token
        tokens.token_type = token_type
        tokens.expires_in = expires_in
        tokens.refresh_token = refresh_token
        tokens.save(update_fields=['access_token', 'token_type', 'expires_in', 'refresh_token'])
    else:
        print("NO token found for user: ", session_id)
        tokens = SpotifyToken(user=session_id, refresh_token=refresh_token, token_type=token_type, expires_in=expires_in, access_token=access_token)
        tokens.save()

def is_authenticated(session_id):
    tokens =  get_user_tokens(session_id)
    if not tokens is None:
        exp = tokens.expires_in
        if (exp <= timezone.now()):
            refresh_token(session_id)
        return True
    return False

    
def refresh_token(session_id):
    token = get_user_tokens(session_id)
    refresh_token = token.refresh_token

    response = post("https://accounts.spotify.com/api/token", data = {
        'grant_type': 'refresh_token',
        'refresh_token': refresh_token
    }, headers={'Authorization' : 'Basic ' + BASE_64}).json()

    access_token = response.get('access_token')
    token_type = response.get('token_type')
    expires_in = response.get('expires_in')

    update_token(session_id=session_id, access_token=access_token, token_type=token_type, expires_in=expires_in, refresh_token=refresh_token)

def send_request(session_id, endpoint, post_=False, put_=False):
    tokens = get_user_tokens(session_id)

    response = None

    if tokens is None:
        return {'Error': "No token exists"}
    headers = {'Content-Type': 'application/json',
              'Authorization': tokens.token_type + ' ' + tokens.access_token}
    if post_:
        response = post(BASE_URL + endpoint, headers=headers)
    elif put_:
        print('puts on spotify')
        response = put(BASE_URL + endpoint, headers=headers)
    else:
        response = get(BASE_URL + endpoint, {}, headers=headers)
    
    try:
        return response.json()
    except:
        print(response.headers, response.reason)
        return {'Error': response.status_code}

    