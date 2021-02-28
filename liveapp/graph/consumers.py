import json
from .models import Message
from channels.generic.websocket import AsyncWebsocketConsumer, JsonWebsocketConsumer


class GraphConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        await self.accept()

    async def receive(self, text_data=None, bytes_data=None):
        data = json.loads(text_data)
        if data.get("change") == "data" and data.get("value").isnumeric():
            await self.send(json.dumps({'change': 'data', 'value': int(data.get("value"))}))
        elif data.get("change") == "type":
            await self.send(json.dumps({'change': 'type', 'value': data.get("value")}))
        elif data.get("change") == "nelements":
            await self.send(json.dumps({'change': 'nelements', 'value': data.get("value")}))


class MessageConsumer(JsonWebsocketConsumer):

    def connect(self):
        self.accept()
        self.send("teste¡")

    def receive_json(self, content, **kwargs):
        tag, text = content.get("tag"), content.get("text")
        if tag and text:
            self.save_message(tag=tag, text=text)
        self.send_json([{"tag": m.tag, "text": m.text} for m in self.get_messages()])


    def save_message(self, tag: str, text: str):
            msg = Message.objects.create(tag=tag, text=text)
            return msg

    def get_messages(self, tag=None):
        return Message.objects.filter(tag=tag) if tag else Message.objects.all()




