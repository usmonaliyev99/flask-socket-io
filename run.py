from app import app, socketio


def main():
    """
    Main entry point for the application.
    Starts the Eventlet WSGI server and listens on the specified address and port.
    """

    socketio.run(app, host="0.0.0.0", port=3139)


if __name__ == "__main__":
    main()
