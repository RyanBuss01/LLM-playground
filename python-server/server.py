from flask import Flask, request, session, jsonify
from flask_cors import CORS
from modelHandler import ModelHandler
import os


# If you need it in a hexadecimal format
hex_secret_key = os.urandom(256).hex()



# Create an instance of Flask
app = Flask(__name__)
app.secret_key = hex_secret_key
CORS(app)  # Enable CORS for all routes

chat_model = ModelHandler('llama')
image_model = ModelHandler('image')



# Define a handler for the commands
def commandHandler(messages, content, command, commandData):
    if(command == '/instruct'):
        messages[-1] = {'role': 'system', 'content': commandData, type: 'instruct'}
        messages.append(content)
        return chat_model.predict(messages)
    if(command == '/image'):
        return image_model.predict(messages)
    if(command == '/help'):
        return messages.append({'role':'system', 'content':'/instruct \n/image', 'type': 'help'})
         

def messagesHandler(messages, content, command, commandData):
    if(command == '/instruct' or command == '/image'):
        return commandHandler(messages, content, command, commandData)
    else:
        messages.append(content)
        return chat_model.predict(messages)


# Define a route for the root URL '/'
@app.route('/' , methods=['POST'])
def index():
    if 'messages' not in session:
        session['messages'] = []
    print('request recieved')
    data = request.json
    content = data['content']  # This is the dictionary containing role, content, command, and type
    command = data['command'] 
    commandData = data['commandData']
    message = messagesHandler(session['messages'], content, command, commandData)
    session['messages'].append(message)
    session.modified = True
    return jsonify(session['messages'])


if __name__ == '__main__':
    # Run the Flask app
    app.run(debug=True, port=5000)


#  { role: "user", content: text, command: command, type: 'chat'}
# { role: "system", content: text, id: text.length, instruct:true, instruction:command }