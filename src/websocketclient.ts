import WebSocket = require('ws');
//import {AudioDevice, printAudioInputDevices} from './audiodevice';
import {PythonAudioDevice} from "./audio/pythonaudiodevice";
import {AudioDevice} from "./audio/audiodevice";
import { AudioType } from "./types/audio";
import {BaseMessage, baseMessageFromString} from './baseMessage';
import {InitStreamMessage, InitStreamFromString} from './streammessage'
import { AudioAnalyser } from "./audioanalyser"; //, AudioType } from './audioanalyser';
import * as socketio from 'socket.io';
import { AudioDataEvent } from './types/events';

export class SocketIOClient{

    private socket: socketio.Socket;
    private closeCallback: () => void;
    private audioDeviceStream: AudioDevice;
    private deviceListSendInterval: NodeJS.Timeout;
    private audioDeviceNames: string[]

    constructor(clientConnection: socketio.Socket, closeCallback: () => void){
        this.socket = clientConnection;
        this.socket.emit('ping');
        this.closeCallback = closeCallback;
        this.addEventListeners();
        this.startDeviceListInterval();
        console.log("Client with socket id", this.socket.id, "has connected");
    }

    private startDeviceListInterval(){
        //get devices from system
        /*const audioDevices = printAudioInputDevices();
        let audioNames = []
        audioDevices.forEach(element => {
            audioNames.push(element['name']);
        });*/
        let audioNames = ["device1", "device2"];
        console.log(audioNames);
        this.audioDeviceNames = audioNames;
        this.socket.emit('device_list', audioNames);
        this.deviceListSendInterval = setInterval(() => {
            //send list to client
            //console.log("Sending device name list to client");
            this.socket.emit('device_list', audioNames);
        }, 5000);
    }

    private addEventListeners(){
        this.socket.on('start_stream', (deviceName: string) => this.onStart(deviceName));
        this.socket.on('stop_stream', () => this.onCloseStream());
        this.socket.on('close', () => this.onClose());
        this.socket.on('disconnect', () => this.onClose())
        this.socket.on('error', (err) => console.log(err));
    }

    private async onStart(deviceindex){
        if(this.audioDeviceStream){
            this.audioDeviceStream.stop();
        }
        this.audioDeviceStream = new PythonAudioDevice(deviceindex, 1024, 1, AudioType.Float32);
            //(audioData) => {this.sendAudioFFT(audioData)});
        this.audioDeviceStream.subscribe('data', (data: Float32Array) => {
            this.sendAudioFFT(data);
        });
        this.audioDeviceStream.subscribe('error', (error) => {console.log("PyError")});

        this.audioDeviceStream.start();
        this.socket.emit('message_status', "Successfully started audio stream");
    }

    private async onCloseStream(){
        if(this.audioDeviceStream){
            this.audioDeviceStream.stop();
            this.socket.emit('message_status', "The stream was stopped");
        }
        else{
            this.socket.emit('message_warning', "The stream was already closed");
        }
    }

    private onClose(){
        this.closeCallback();
        try{
            this.audioDeviceStream.stop();
        } catch(err){
            console.log(err);
        }

        clearTimeout(this.deviceListSendInterval);
        console.log("Client with socket ID", this.socket.id, "has disconnected");
    }

    private sendAudio(audioData: Buffer){
        //console.log(this.socket);
        //console.log(audioData);
        this.socket.emit('audio', audioData);
    }

    private sendAudioFFT(audioData: Float32Array){
        // take fft
        try{
            //let asF32data = AudioAnalyser.toFloat32Array(audioData, AudioType.Float32);
            let frequencyData = AudioAnalyser.getFrequencies(audioData, 44100);
            this.socket.emit('audio', frequencyData);
        } catch(err){
            //console.error(err);
            console.log("[WARNING] Could not perform FFT Data length not sufficient");
        }
        //console.log(frequencyData);
        // send fft data
        
    }
}