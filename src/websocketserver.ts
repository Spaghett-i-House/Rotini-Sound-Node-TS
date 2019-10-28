import * as express from 'express';
import * as http from 'http';
import {WebsocketClient} from "./websocketclient";
import {v1 as uuid} from 'uuid';
import WebSocket = require('ws');

export class WebsocketServer{

    private websocketServer: WebSocket.Server;
    private connectedClients: object;

    constructor(port: number){
        this.connectedClients = {};
        this.websocketServer = new WebSocket.Server({
            port: port
        });
        this.addEventListeners();
    }

    private addEventListeners(){
        this.websocketServer.on('connection', (new_socket) => this.onConnection(new_socket));
        this.websocketServer.on('error', (err) => console.log(err));
    }

    private onConnection(websocket: WebSocket){
        console.log("Received new websocket connection");
        const id = uuid().toString();
        const client = new WebsocketClient(websocket, () => {
            delete this.connectedClients[id];
        });
        this.connectedClients[id] = client;
    }
}