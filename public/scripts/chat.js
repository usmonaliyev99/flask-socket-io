const messagesDiv = document.getElementById('messages');
const messageInput = document.getElementById('messageInput');

const params = new URLSearchParams(window.location.search);

const username = params.get('username')
const room = params.get('room')

const socket = io.connect('http://192.168.1.125:3139');

const onMessage = (data) => {
    const message = document.createElement('div');

    if (data?.username == username) {
        return;
    }

    message.textContent = `${data.username}: ${data?.message}`;

    messagesDiv.appendChild(message);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

const emitMessage = () => {
    const message = messageInput.value;
    if (!message) { return }

    socket.emit('message', { message, room, username });

    const messageDiv = document.createElement('div');
    messageDiv.textContent = `You: ${message}`;
    messageDiv.align = 'right'

    messagesDiv.appendChild(messageDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
    messageInput.value = '';
}

const onDisconnect = () => {
    const message = document.createElement('div');
    message.textContent = 'Disconnected from server';
    message.style.color = 'red';
    messagesDiv.appendChild(message);
}


messageInput.addEventListener('keydown', function (event) {
    if (event.code == 'Enter') {
        emitMessage()
    }
})

socket.on('message', onMessage);
socket.on('disconnect', onDisconnect);

socket.emit('join', { room, username })
