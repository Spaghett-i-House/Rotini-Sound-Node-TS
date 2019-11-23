import {SocketIOClient} from "./websocketclient";
import {v1 as uuid} from 'uuid';
import * as socketio from 'socket.io';

/**
 * WebsocketServer: a server using socketIO to handle new websocket connections
 * from the web client
 */
export class WebsocketServer{

    private socketIOServer: socketio.Server;
    private connectedClients: object;

    /**
     * constructor: create and start the socketIO server
     * @param port: the port to listen on
     */
    constructor(port: number){
        this.connectedClients = {};
        this.socketIOServer = require('socket.io')(port, {
            pingInterval: 1000,
            pingTimeout: 5000,
            cookie: false
        });
        this.addEventListeners();
    }

    /**
     * addEventListeners: currently server only handles connections so a connection
     * listener must be added
     */
    private addEventListeners(){
        this.socketIOServer.on('connection', (new_socket) => this.onConnection(new_socket));
    }
    /**
     * onConnection: Handles a new socketIO client connection
     * @param websocket : the socket that has just connected
     */
    private onConnection(websocket: socketio.Socket){
        console.log("Received new websocket connection");
        const id = uuid().toString();
        const client = new SocketIOClient(websocket, () => {
            delete this.connectedClients[id];
        });
        this.connectedClients[id] = client;
    }
}