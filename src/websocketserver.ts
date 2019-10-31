import * as express from 'express';
import * as http from 'http';
import {SocketIOClient} from "./websocketclient";
import {v1 as uuid} from 'uuid';
import WebSocket = require('ws');
import * as socketio from 'socket.io';
import { Server } from 'tls';

export class WebsocketServer{

    private socketIOServer: socketio.Server;
    private connectedClients: object;

    constructor(port: number){
        this.connectedClients = {};
        this.socketIOServer = require('socket.io')(port, {
            pingInterval: 1000,
            pingTimeout: 5000,
            cookie: false
        });
        this.addEventListeners();
    }

    private addEventListeners(){
        this.socketIOServer.on('connection', (new_socket) => this.onConnection(new_socket));
        //this.socketIOServer.on('error', (err) => console.log(err));
    }

    private onConnection(websocket: socketio.Socket){
        console.log("Received new websocket connection");
        const id = uuid().toString();
        const client = new SocketIOClient(websocket, () => {
            delete this.connectedClients[id];
        });
        this.connectedClients[id] = client;
    }
}