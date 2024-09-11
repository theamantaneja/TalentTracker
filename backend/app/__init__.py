from flask import Flask
from flask_cors import CORS
from .routes import main

def create_app():
    
    LOCAL = "http://localhost:5173"
    PRODUCTION = ""
    
    app = Flask(__name__)

    # Enable CORS for specified origins
    CORS(app, resources={r"/analyze": {"origins": LOCAL}})  # Adjust as needed

    app.register_blueprint(main)  # Register the routes
    return app
