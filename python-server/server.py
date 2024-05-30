from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from messageHandler import MessageHandler
import os
import json


# If you need it in a hexadecimal format
hex_secret_key = os.urandom(256).hex()

# Create an instance of Flask
app = Flask(__name__)
app.secret_key = hex_secret_key
CORS(app)

messages = []

# Define a function to read messages from the file
def read_messages():
    with open('./messages/messages.json', 'r') as f:
        return json.load(f)

# Define a function to write messages to the file
def write_messages(messages):
    with open('./messages/messages.json', 'w') as f:
        json.dump(messages, f)

def updateMessagesCallback(updatedMessages):
    global messages
    messages = updatedMessages

@app.route('/image', methods=['GET'])
def get_image():
    image_name = request.args.get('image_name')
    images_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'images'))
    image_path = os.path.join(images_dir, image_name)
    if os.path.exists(image_path):
        return send_file(image_path, mimetype='image/png')
    else:
        return "Image not found", 404
    
@app.route('/music', methods=['GET'])
def get_music():
    music_name = request.args.get('music_name')
    music_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'music'))
    music_path = os.path.join(music_dir, music_name)
    if os.path.exists(music_path):
        return send_file(music_path, mimetype='audio/wav')
    else:
        return "Image not found", 404


# Define a route for the root URL '/'
@app.route('/' , methods=['POST'])
def index():
    global messages
    try:

        data = request.json
        if data['isNewChatRoom']:
            messages = []
        else:
            messages = read_messages()
        command = data['command']; 
        commandData = data['commandData']
        if command:
            type= 'chat-command'
        else:
            type= 'chat'
        print("command: ", command)
        formatedContent = { 'role': "user", 'content': data['content'], 'type': type}
        messageHandler = MessageHandler(messages, command, commandData, updateMessagesCallback)
        response = messageHandler.getResponse(formatedContent)
        messages.append(formatedContent)
        messages.append(response)
        write_messages(messages)
        return  jsonify(messages)
    
    except Exception as e:
        print("Error: ", e)
        formatedContent = { 'role': "user", 'content': data['content'], 'type': 'chat-error'}
        errorContent = { 'role': "system", 'content': 'An error occured loading model', 'type': 'chatbot-error'}
        messages.append(formatedContent)
        messages.append(errorContent)
        return "Error", 500


if __name__ == '__main__':
    # Run the Flask app
    app.run(debug=True, port=5000)

