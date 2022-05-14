import express from 'express';
import { Server } from 'socket.io';
import http from 'http';
import path from 'path';

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, '..', 'public')));

export {server, io};