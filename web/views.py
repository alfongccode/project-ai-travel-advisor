from django.shortcuts import render

def web_view(request):
    return render(request, "index.html")