from flask import render_template, request, redirect
from app import app


@app.route("/")
def index():
    username = request.args.get("username")
    room = request.args.get("room")

    if not (username or room):
        return redirect("/login")

    return render_template("templates/chat.html", username=username, room=room)


@app.route("/login")
def login():
    return render_template("templates/login.html")
