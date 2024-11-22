from flask import request
from app import socketio
from flask_socketio import (
    send,
    emit,
    join_room,
    close_room,
    rooms,
    leave_room,
    disconnect,
)


# Define connection event with authentication
@socketio.on("connect")
def connect():
    print(f"Client connected: {request.sid}")


@socketio.on("disconnect")
def leave():
    print(f"Client disconnected: {request.sid}")


@socketio.event
def message(json):
    emit(
        "message",
        {"message": json["message"], "username": json["username"]},
        to=json["room"],
    )


@socketio.event
def join(json):
    join_room(json["room"])
