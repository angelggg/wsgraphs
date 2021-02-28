import os

from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
from django.core.asgi import get_asgi_application
from django.urls import path

from graph.consumers import GraphConsumer, MessageConsumer

ws_urlpatterns = [
    path('ws/graph/', GraphConsumer.as_asgi()),
    path('ws/messages/', MessageConsumer.as_asgi())

]
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'liveapp.settings')
application = ProtocolTypeRouter({
                'http': get_asgi_application(),
                'websocket': AuthMiddlewareStack(URLRouter(ws_urlpatterns))
            })
