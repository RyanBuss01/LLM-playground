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

@app.route('/image', methods=['GET'])
def get_image():
    image_name = request.args.get('image_name')
    print('run')
    # image_name = 'result.jpg'
    # Resolve the path correctly relative to the project root
    images_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'images'))
    image_path = os.path.join(images_dir, image_name)
    print(image_path)
    if os.path.exists(image_path):
        return send_file(image_path, mimetype='image/png')
    else:
        return "Image not found", 404


# Define a route for the root URL '/'
@app.route('/' , methods=['POST'])
def index():
    data = request.json
    if data['isNewChatRoom']:
        messages = []
    else:
        messages = read_messages()
    command = data['command']; 
    commandData = data['commandData']
    formatedContent = { 'role': "user", 'content': data['content'], 'type': 'chat'}
    messageHandler = MessageHandler(messages, command, commandData)
    response = messageHandler.getResponse(formatedContent)
    messages.append(formatedContent)
    messages.append(response)
    write_messages(messages)
    print(messages)
    return  jsonify(messages)


if __name__ == '__main__':
    # Run the Flask app
    app.run(debug=True, port=5000)

