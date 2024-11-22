from flask import Flask
from redis import Redis
from flask_socketio import SocketIO
from config import ROOT_DIR

# Create Flask app and SocketIO server
app = Flask(
    __name__,
    template_folder=ROOT_DIR,
    static_folder=f"{ROOT_DIR}/public",
    static_url_path="/public",
)

# Create redis connection
redis = Redis(db=9, decode_responses=True)

socketio = SocketIO(app, cors_allowed_origins="*")

# Import ws and http
from . import http
from . import ws
