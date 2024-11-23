const logs = document.getElementById('logs');
const messages = document.getElementById('messages');
const messageInput = document.getElementById('messageInput');

const params = new URLSearchParams(window.location.search);

const username = params.get('username')
const room = params.get('room')

const socket = io.connect('http://127.0.0.1:3139');

const onMessage = (data) => {
    const message = document.createElement('div');
    message.classList = ['message']

    if (data?.username == username) {
        return;
    }

    message.textContent = `${data.username}: ${data?.message}`;

    messages.appendChild(message);
    messages.scrollTop = messages.scrollHeight;
}

function buildLog(data, icon = '') {
    if (icon) {
        icon += ' '
    }
    const div = document.createElement('div')
    div.classList = ['log']

    const username = document.createElement('span')
    username.setAttribute('style', 'font-size: large; display: flex; flex-direction: column; justify-content: center; margin-left: 10px;')
    username.innerText = `${icon}${data.username}`
    div.appendChild(username)

    const time = document.createElement('span')
    time.setAttribute('style', 'font-size: small; display: flex; flex-direction: column; justify-content: end; margin-right: 10px;')
    time.textContent = data.time
    div.appendChild(time)

    return div
}

const onNewMember = (data) => {
    const member = buildLog(data, '🟢')
    logs.appendChild(member)
    logs.scrollTop = logs.scrollHeight
}
const onLeaveMember = (data) => {
    const member = buildLog(data, icon = '🔴')
    logs.appendChild(member)
    logs.scrollTop = logs.scrollHeight
}

const emitMessage = () => {
    const message = messageInput.value;
    if (!message) { return }

    socket.emit('message', { message, room, username });

    const messageDiv = document.createElement('div');
    messageDiv.textContent = `You: ${message}`;
    messageDiv.align = 'right'
    messageDiv.classList = ['message']

    messages.appendChild(messageDiv);
    messages.scrollTop = messages.scrollHeight;
    messageInput.value = '';
}

const onDisconnect = () => {
    const message = document.createElement('div');
    message.textContent = 'Disconnected from server';
    message.style.color = 'red';
    messages.appendChild(message);
}


messageInput.addEventListener('keydown', function (event) {
    if (event.code == 'Enter') {
        emitMessage()
    }
})

socket.on('message', onMessage);
socket.on('new-member', onNewMember);
socket.on('leave-member', onLeaveMember);
socket.on('disconnect', onDisconnect);

socket.emit('join', { room, username })
