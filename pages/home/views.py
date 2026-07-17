import json
from django.shortcuts import render
from main import TravelAdvisor

ACTIONS_CLEAR = "clear"
travel_advisor = TravelAdvisor().initialize_client_session()

def home_view(request):
    response = {}
    if request.method == "POST":
        action = request.POST.get("action", None)
        user_request = request.POST.get("request", None)

        if action == ACTIONS_CLEAR:
            travel_advisor.clear()
        if user_request:
            arguments = travel_advisor.ask(user_request)
            if arguments['status'] == "complete":
                response = arguments
                response['itinerary_map'] = travel_advisor.generate_itinerary_image(arguments['itinerary'])
                response['photographs'] = travel_advisor.get_photographs(arguments['trip_location'])
            return render(request, "index.html", { "history": travel_advisor.get_answers_history(), "response": response })
    return render(request, "index.html")