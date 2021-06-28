from django.db import models
from django.utils.crypto import get_random_string

def get_unique_code():
    
    length = 6

    while(True):
        code = get_random_string(length=length)
        if Room.objects.filter(code=code).count() == 0:
            break
    
    return code


class Room(models.Model):
    code = models.CharField(max_length=12, default=get_unique_code, unique=True)
    host = models.CharField(max_length=25, unique=True)
    guest_can_pause = models.BooleanField(null=False, default=False)
    votes_to_skip = models.IntegerField(null=False, default=1)
    created_at = models.DateTimeField(auto_now_add=True)