const socket = io();


const urlSearch = new URLSearchParams(window.location.search);
const nickname = urlSearch.get('nickname');
const room = urlSearch.get('room');

socket.emit('selectRoomEvent', {
    nickname,
    room
}, (messages) => {
    messages.forEach(message => {
        createMessage(message);
    })
});

document.getElementById('logout').addEventListener('click', (event) => {
    window.location.href = 'index.html'
});

const header = document.getElementById('header');
header.innerHTML = `<h2>Dev Community - ${room}</h2>`;

const helloMessage = document.getElementById('helloMessage');
helloMessage.innerHTML = `<p>Olá ${nickname}, Seja Bem-vindo(a)!</p>`;

const inputMessage = document.getElementById('message');
const sendButton = document.getElementById('sendMessage');

inputMessage.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        const message = event.target.value;

        sendMessage(message);
        
        event.target.value = '';
    }
});

inputMessage.addEventListener('keyup', (event) => {
    if (event.target.value != '') {
        sendButton.className = sendButton.className.replace('disabled', '');
    } else {
        if (!sendButton.className.includes('disabled')) {
            sendButton.className += 'disabled';
        }
    }
});

sendButton.addEventListener('click', (event) => {
    if (inputMessage.value != '') {
        sendMessage(inputMessage.value);

        inputMessage.value = '';
    }
});

socket.on('sendMessageEvent', (data) => {
    createMessage(data);
});

function createMessage(data) {
    const messagesElement = document.getElementById('messages');

    messagesElement.innerHTML += `
        <div class="new_message d-flex flex-column ${data.user.nickname === nickname ? 'align-items-start' : 'align-items-end'}">
                <label class="form-label balloon-${data.user.nickname === nickname ? 'me' : 'their'}"> 
                    <div class="d-flex flex-column">
                        <span> ${data.text}</span>
                        <span><strong>${data.user.nickname === nickname ? 'Você' : data.user.nickname}</strong> - <hour>${dayjs(data.createdAt).format('DD/MM HH:mm')}</hour></span>
                    </div>
                </label>
        </div>
    `;

    console.log();
}

function sendMessage(message) {
    const data = {
        room,
        nickname,
        message
    }

    socket.emit('sendMessageEvent', data);
}