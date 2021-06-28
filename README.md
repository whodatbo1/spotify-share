# spotify-share
A web app which lets multiple users interact with the same Spotify account using the Spotify API.

# Spotify API credentials

There should be a file called credentials.py in ./CoolApp/spotify, the content of which is the following:

```
    import base64
    CLIENT_ID = ...;
    CLIENT_SECRET = ...;
    REDIRECT_URI = "http://127.0.0.1:8000/auth/redirect"
    id_sec = CLIENT_ID + ":" + CLIENT_SECRET
    BASE_64 = base64.b64encode((id_sec).encode('ascii')).decode('ascii')
```
