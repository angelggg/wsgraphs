from django.db import models

class Message(models.Model):
    tag = models.CharField(max_length=6)
    text = models.CharField(max_length=140)
