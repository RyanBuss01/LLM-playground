from flask import Flask, request
from flask_cors import CORS
from modelHandler import ModelHandler


# Create an instance of Flask
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

modelVar = ModelHandler()
modelVar.load()

# Define a route for the root URL '/'
@app.route('/' , methods=['POST'])
def index():
    print('request recieved')
    data = request.json
    message = modelVar.predict(data['messages'])
    return message


if __name__ == '__main__':
    # Run the Flask app
    app.run(debug=True, port=5000)
