import WebSocket = require('ws');
//import {AudioDevice, printAudioInputDevices} from './audiodevice';
import {PythonAudioDevice} from "./audio/pythonaudiodevice";
import {AudioDevice} from "./audio/audiodevice";
import { AudioType, AudioEventType } from "./types/audio";
import { AudioAnalyser } from "./audioanalyser"; //, AudioType } from './audioanalyser';
import * as socketio from 'socket.io';
import {AudioInformationInstance} from './audio/pythonaudioinformation';
/**
 * SocketIOClient: represents a client connection to the socketIO server
 */
export class SocketIOClient{

    private socket: socketio.Socket;
    private closeCallback: () => void;
    private audioDeviceStream: AudioDevice;
    private deviceListSendInterval: NodeJS.Timeout;
    private audioDeviceNames: string[]
    private audioFilter: [number, number];

    /**
     * constructor
     * @param clientConnection: the socketIO socket connection representing the client
     * @param closeCallback: a callback function to be run on the client closing
     */
    constructor(clientConnection: socketio.Socket, closeCallback: () => void){
        this.socket = clientConnection;
        this.audioDeviceNames = [];
        this.socket.emit('ping');
        this.closeCallback = closeCallback;
        this.addEventListeners();
        this.startDeviceListInterval();
        console.log("Client with socket id", this.socket.id, "has connected");
    }

    /**
     * startDeviceListInterval: every 5 seconds a device list message will be send to the
     * client with a refreshed device list
     */
    private startDeviceListInterval(){
        let audioNames = AudioInformationInstance.getNames();
        console.log(audioNames);
        this.audioDeviceNames = audioNames;
        this.socket.emit('device_list', audioNames);
        this.deviceListSendInterval = setInterval(() => {
            //send list to client
            this.socket.emit('device_list', audioNames);
        }, 5000);
    }

    /**
     * addEventListeners: handles all events regarding the socketIO client connection
     */
    private addEventListeners(){
        this.socket.on('start_stream', (deviceName: string) => this.onStart(deviceName));
        this.socket.on('add_filter', (highval, lowval) => {
            console.log("filter added");
            this.audioFilter = [highval, lowval]
        });
        this.socket.on('remove_filter', () => {
            this.audioFilter = null
            console.log("filter removed");
        });
        this.socket.on('stop_stream', () => this.onCloseStream());
        this.socket.on('close', () => this.onClose());
        this.socket.on('disconnect', () => this.onClose())
        this.socket.on('error', (err) => console.log(err));
    }

    /**
     * onStart: Handles what to do on the reception of a start message
     * @param devicename: the name of the device to get audio from
     */
    private async onStart(devicename: string){
        if(this.audioDeviceStream){
            this.audioDeviceStream.stop();
        }
        this.audioDeviceStream = new PythonAudioDevice(devicename, 1024, 1, AudioType.Float32);
        this.audioDeviceStream.subscribe(AudioEventType.ONAUDIODATA, (data: Float32Array) => this.sendAudioFFT(data));
        this.audioDeviceStream.subscribe(AudioEventType.ERROR, (error) => {console.log(error.message.toString())});
        this.audioDeviceStream.start();
        this.socket.emit('message_status', "Successfully started audio stream");
    }
    
    /**
     * onCloseStream: handles the reception of a close audio message
     */
    private async onCloseStream(){
        if(this.audioDeviceStream){
            this.audioDeviceStream.stop();
            this.socket.emit('message_status', "The stream was stopped");
        }
        else{
            this.socket.emit('message_warning', "The stream was already closed");
        }
    }

    /**
     * onClose: handles the reception or detection of a client close message
     * closes out this client
     */
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

    /**
     * DEPRICIATED: sendAudio: handles the sending of raw audio bytes
     * @param audioData the raw audio bytes to send to the client
     */
    private sendAudio(audioData: Buffer){
        //console.log(this.socket);
        //console.log(audioData);
        this.socket.emit('audio', audioData);
    }

    /**
     * sendAudioFFT: handles the sending of an FFT from given audio bytes to the client
     * @param audioData a float32 array of audio samples to take the fft of
     */
    private sendAudioFFT(audioData: Float32Array){
        // take fft
        try{
            let frequencyData = AudioAnalyser.getFrequencies(audioData, 44100);
            if(this.audioFilter != null){
                const high = this.audioFilter[0];
                const low = this.audioFilter[1];
                frequencyData = AudioAnalyser.filterFFT(frequencyData, high, low);
            }
            this.socket.emit('audio', frequencyData);
        } catch(err){
            console.log("[WARNING] Could not perform FFT Data length not sufficient");
        }
        // send fft data
        
    }
}