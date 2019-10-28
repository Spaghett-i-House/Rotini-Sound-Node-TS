import WebSocket = require('ws');
import {AudioDevice} from './audiodevice';
import {BaseMessage, baseMessageFromString} from './baseMessage';
import {InitStreamMessage, InitStreamFromString} from './streammessage'
export class WebsocketClient{

    private socket: WebSocket;
    private closeCallback: () => void;
    private audioDeviceStream: AudioDevice;
    private streams: object;

    constructor(clientConnection: WebSocket, closeCallback: () => void){
        this.streams = {};
        this.socket = clientConnection;
        this.closeCallback = closeCallback;

        this.addEventListeners();
    }

    private addEventListeners(){
        this.socket.on('message', (data: string) => this.onData(data));
        this.socket.on('close', () => this.onClose());
        this.socket.on('error', (err) => console.log(err));
    }

    private async onData(data: string){
        const message = InitStreamFromString(data);
        console.log(message.command);
        if(message.command == "INIT_STREAM"){
            const initMessage = InitStreamFromString(data);
            //this.audioDeviceStream = 
            this.streams[initMessage.deviceName] = new AudioDevice(initMessage.deviceName,
                (audioData) => {this.sendAudio(audioData)});
            this.streams[initMessage.deviceName].start();
        }

        console.log(data);
    }

    private onClose(){
        this.closeCallback();
    }

    private sendAudio(audioData: Buffer){
        //console.log(this.socket);
        this.socket.send(audioData);
    }
}