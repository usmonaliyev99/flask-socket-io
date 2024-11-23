import json
from datetime import datetime
from flask import request
from app import socketio, redis
from flask_socketio import (
    emit,
    join_room,
    close_room,
    leave_room,
)


@socketio.on("disconnect")
def disconnect() -> None:
    try:
        user = redis.hmget("users", request.sid)
        redis.hdel("users", request.sid)

        user = json.loads(user[0])

        if not redis.hlen("users"):
            return close_room(user["room"])

        data = {
            "username": user["username"],
            "time": datetime.now().strftime("%H:%M:%S"),
        }
        emit("leave-member", data, to=user["room"])

    except Exception as e:
        print(e)


@socketio.event
def message(json) -> None:
    data = {
        "sid": request.sid,
        "username": json["username"],
        "message": json["message"],
        "time": datetime.now().strftime("%d.%m.%Y %H:%M:%S"),
    }

    emit("message", data, to=json["room"], include_self=False)


@socketio.event
def join(ask) -> None:
    # register user in room
    user = {request.sid: json.dumps({"username": ask["username"], "room": ask["room"]})}
    redis.hmset("users", user)

    redis.hset("rooms", ask["room"], ask["username"])

    join_room(ask["room"])

    data = {
        "username": ask["username"],
        "time": datetime.now().strftime("%H:%M:%S"),
    }
    emit("new-member", data, to=ask["room"])


@socketio.event
def leave(json) -> None:
    disconnect()
