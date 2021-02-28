from django.shortcuts import render


# Create your views here.

def indexView(request):
    return render(request=request, template_name='base.html', context={"text": "Hola1"})

def messagesView(request):
    return render(request=request, template_name='messages.html', context={})

