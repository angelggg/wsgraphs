from django.urls import path
from .views import indexView, messagesView

urlpatterns = [
    path('', indexView),
    path('messages', messagesView)

]