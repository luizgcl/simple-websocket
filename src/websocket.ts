import { io } from './http';

interface UserRoom {
    socket_id: string,
    nickname: string,
    room: string
}

const users: UserRoom[] = [];

interface MessageRoom {
    room: string,
    text: string,
    createdAt: Date,
    user: UserRoom
}

const messages: MessageRoom[] = [];

io.on('connection', (socket) => {

    socket.on('selectRoomEvent', (data, callback) => {
        socket.join(data.room);

        const user = users.find(user => user.nickname === data.nickname && user.room === data.room);

        if (user) {
            user.socket_id = socket.id;
        } else {
            users.push({
                room: data.room,
                nickname: data.nickname,
                socket_id: socket.id
            });
        }

        const messagesRoom = getMessagesByRoom(data.room);
        callback(messagesRoom);
    });

    socket.on('sendMessageEvent', (data) => {
        const message: MessageRoom = {
            room: data.room,
            text: data.message,
            user: getUserByName(data.nickname) as UserRoom,
            createdAt: new Date()
        }

        messages.push(message);

        io.to(data.room).emit('sendMessageEvent', message);
    });
});

function getUserByName(nickname: string): UserRoom | undefined {
    return users.find(user => user.nickname === nickname);
}

function getMessagesByRoom(room: string) {
    const messagesRoom = messages.filter(message => message.room === room);
    return messagesRoom;
}