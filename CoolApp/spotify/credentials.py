import base64
CLIENT_ID = "d3db37fe47c44d4d8331a3149781751c"
CLIENT_SECRET = "41f0e5b4fd84401facc4d77d89eee34c"
REDIRECT_URI = "http://127.0.0.1:8000/auth/redirect"
id_sec = CLIENT_ID + ":" + CLIENT_SECRET
BASE_64 = base64.b64encode((id_sec).encode('ascii')).decode('ascii')