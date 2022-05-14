import { server } from "./http";
import './websocket';

server.listen(3333, () => {
    console.log('Application running on *:3333!')
})