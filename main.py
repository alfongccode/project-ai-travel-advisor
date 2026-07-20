import os
import json
import requests
from openai import OpenAI
from dotenv import load_dotenv, find_dotenv

WIKIMEDIA_API_URL = "https://commons.wikimedia.org/w/api.php"

SYSTEM_PROMPT = {
    "role": "system",
    "content": """
    You are an expert travel advisor. Your task is to gather the necessary information from the user and, once complete, generate a trip plan.

    ### Required data
    - Destination and trip duration
    - Interests (food, museums, hiking, beaches, nightlife, shopping, etc.)

    ### Optional data
    - Relevant preferences or constraints (budget, mobility, dates, etc.)

    ### Behavior
    - If any required data is missing, do NOT generate the itinerary. Instead, return a JSON with "status": "missing_info" and a clear question in "message".
    - If you have all the required data, return "status": "complete" along with the plan.
    - Respond ONLY with valid JSON. Do not include any text outside the JSON, no backticks, no explanations.

    ### Output schema (always one of these two formats)

    - Incomplete data example:
    {
        "status": "missing_info",
        "missing_fields": ["duration"],
        "message": "How many days will your trip to Pamplona last?"
    }

    - Output example:
    {
        "status": "complete",
        "trip_location": {
            "country": "Germany",
            "city": "Berlin",
        },
        "trip_title": "string",
        "trip_summary": "string",
        "itinerary": "string",
        "travel_tips": "string",
        "estimated_budget": {
            "amount": 300,
            "currency": "EUR"
        }
    }
    """
}

REQUEST_STATUS_TYPES = {
    "MISSING_INFO": "missing_info",
    "COMPLETE": "complete"
}
RESPONSE_REQUEST_STATUS = [REQUEST_STATUS_TYPES['MISSING_INFO'], REQUEST_STATUS_TYPES['COMPLETE']]

TOOLS = [{
    "type": "function",
    "function": {
        "name": "parse_trip_plan_output",
        "description": "Returns the status of the data collection or the complete travel plan",
        "parameters": {
            "type": "object",
            "properties": {
                "status": {"type": "string", "enum": RESPONSE_REQUEST_STATUS },
                "missing_fields": {"type": "array", "items": {"type": "string"}},
                "message": {"type": "string"},
                "trip_location": {
                    "type": "object",
                    "properties": {
                        "country": {"type": "string"},
                        "city": {"type": "string"},
                    },
                    "additionalProperties": False
                },
                "trip_title": {"type": "string"},
                "trip_summary": {"type": "string"},
                "itinerary": {"type": "string"},
                "travel_tips": {"type": "string"},
                "estimated_budget": {
                    "type": "object",
                    "properties": {
                        "amount": {"type": "integer"},
                        "currency": {"type": "string"}
                    },
                    "additionalProperties": False
                }
            },
            "required": ["status"],
            "additionalProperties": False
        }
    }
}]

def parse_trip_plan_output(data):
    request_status = data['status']
    if request_status == REQUEST_STATUS_TYPES['MISSING_INFO']:
        return data['message']
    if request_status == REQUEST_STATUS_TYPES['COMPLETE']:
        return f"{data['trip_title']}\n{data['trip_summary']}\n{data['itinerary']}\n{data['travel_tips']}"

TOOLS_MAPPING = {
    "parse_trip_plan_output": parse_trip_plan_output
}

class TravelAdvisor:
    def __init__(self):
        self.context = [SYSTEM_PROMPT]
        self.client = None
        
    def initialize_client_session(self):
        try:
            _ = load_dotenv(find_dotenv(), override=True)
            OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
            self.client = OpenAI(
                api_key=OPENAI_API_KEY,
            )
            return self
        except Exception as e:
            raise Exception("ERROR: Unable to establish a session with OpenAI")

    def generate_itinerary_image(self, itinerary):
        result = self.client.images.generate(
            model="gpt-image-1",
            prompt="""
            Create an image with maps and markers showing the locations included in this itinerary, connecting the markers with a dashed line to indicate the order. [ITINERARY]%s[/ITINERARY]
            """ % itinerary,
            size="auto"
        )
        print(result.data[0])
        return result.data[0].b64_json

    def get_photographs(self, trip_location, limit=4):
        search_input = ','.join([value for value in trip_location.values() if value])
        response = requests.get(WIKIMEDIA_API_URL, params={
            "action": "query",
            "generator": "search",
            "gsrsearch": search_input,
            "gsrnamespace": 6,
            "gsrlimit": limit,
            "prop": "imageinfo",
            "iiprop": "url",
            "format": "json"
        }, headers={"User-Agent": "TravelAdvisor/1.0 (example@ironhack.com)"})
        response.raise_for_status()
        data = response.json()
        return [ {"title": page["title"], "url": page["imageinfo"][0]["url"]} for page in data.get("query", {}).get("pages", {}).values() ]


    def ask(self, question, temperature=0):
        self.context.append({"role": "user", "content": question})
        response = self.client.chat.completions.create(
            model="gpt-4.1-mini",
            messages=self.context,
            temperature=temperature,
            tools=TOOLS,
            tool_choice={
                "type": "function",
                "function": {
                    "name": "parse_trip_plan_output"
                }
            }
        )
        message = response.choices[0].message
        function_name = message.tool_calls[0].function.name
        arguments = json.loads(message.tool_calls[0].function.arguments)
        response_text = TOOLS_MAPPING[function_name](arguments)
        if arguments['status'] == REQUEST_STATUS_TYPES['MISSING_INFO']:
            self.context.append({"role": "assistant", "content": response_text})
        print(arguments)
        return arguments

    def clear(self):
        self.context = [SYSTEM_PROMPT]
        
    def get_answers_history(self):
        return self.context[1:]

# Initialize singleton for context sharing
travel_advisor = TravelAdvisor().initialize_client_session()