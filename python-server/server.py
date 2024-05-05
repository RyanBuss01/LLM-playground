from flask import Flask, request
from flask_cors import CORS
from modelHandler import ModelHandler


# Create an instance of Flask
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

chat_model = ModelHandler('llama')
image_model = ModelHandler('image')


# Define a handler for the commands
def commandHandler(messages, command):
    if(command == '/instruct'):
        return chat_model.predict(messages)
    if(command == '/image'):
        return image_model.predict(messages)
         

def messagesHandler(messages):
    if(messages[0]['role']=='system'  and messages[0]['instruct'] == True):
        command = messages[0]['instruction']
        return commandHandler(messages, command)
    elif(messages[-1]['role']=='user' and messages[-1]['instruct'] == True):
        command = messages[-1]['instruction']
        return commandHandler(messages, command)
    else:
        return chat_model.predict(messages)


# Define a route for the root URL '/'
@app.route('/' , methods=['POST'])
def index():
    print('request recieved')
    data = request.json
    message = messagesHandler(data['messages'])
    return message


if __name__ == '__main__':
    # Run the Flask app
    app.run(debug=True, port=5000)
