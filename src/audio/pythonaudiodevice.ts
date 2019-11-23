import {AudioDevice} from "./audiodevice"
import {CloseEvent_a, ErrorEvent} from "../types/events";
import { AudioType, AudioEventType } from "../types/audio";
import {spawn, ChildProcess} from "child_process";

/**
 * PythonAudioDevice: represents an audioDevice where data is taken from a
 * python subprocess
 */
export class PythonAudioDevice extends AudioDevice{
    private python_audio_filepath: string = "python/audiopipe.py"
    private python_subprocess: ChildProcess = null;

    /**
     * constructor: initializes a base audiodevice
     * @param device_name 
     * @param blocksize 
     * @param channels 
     * @param dataType 
     */
    constructor(device_name: string,
        blocksize: number,
        channels: number,
        dataType: AudioType){
            super(device_name, blocksize, channels, dataType);
    }

    /**
     * Start: creates a new instance of the python sound snagging program
     * and creates subscriptions to its events
     */
    public start(): void{
        if(this.python_subprocess){
            this.python_subprocess.kill("SIGINT");
        }
        this.python_subprocess = spawn("python", [this.python_audio_filepath, this.device_name, this.blocksize.toString(), this.channels.toString()]);
        this.python_subprocess.stdout.on('data', (data) => this.onReceiveAudioBuffer(data));
        this.python_subprocess.stderr.on('data', (data) => this.onReceiveAudioError(data));
        this.python_subprocess.on('close', (code) => this.onReceivePythonClosed(code));
    }

    /**
     * stop: stops the currently running python sound subprocess by sending a keyboard interupt
     */
    public stop(): void{
        this.python_subprocess.kill("SIGINT");
    }

    /**
     * onReceiveAudioBuffer: the python audio script writes raw audio buffers to stdout, this
     * function converts those buffers to usable float32Arrays
     * @param buffer the raw byte buffer from the python program
     */
    private onReceiveAudioBuffer(buffer: Buffer){
        let arra = new Float32Array(buffer.buffer, buffer.byteOffset,
            buffer.byteLength/Float32Array.BYTES_PER_ELEMENT);
        this.onAudio(arra);
    }

    /**
     * onReceiveAudioError: fires an error event for the python script
     * @param buffer the buffer received from the python script from stderr
     */
    private onReceiveAudioError(buffer: string){
        let errorEvent: ErrorEvent = {
            location: "Python script",
            message: buffer,
            type: "Error"
        }
        this.fireEvent(AudioEventType.ERROR, errorEvent);
    }

    /**
     * onReceivePythonClosed: fired when python receives a close program
     * @param code the code that python script fired on closing
     */
    private onReceivePythonClosed(code: number){
        console.log(`close: ${code}`);
        let closeEvent: CloseEvent_a<AudioDevice> = {
            closedObject: this
        }
        this.fireEvent(AudioEventType.CLOSE, closeEvent);
    }

} 