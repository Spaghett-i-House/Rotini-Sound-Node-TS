import {AudioDevice} from "./audiodevice"
import { AudioType } from "../types/audio";
import {spawn, ChildProcess} from "child_process";
import { SIGTERM } from "constants";

export class PythonAudioDevice extends AudioDevice{
    private python_audio_filepath: string = "python/audiopipe.py"
    private python_subprocess: ChildProcess = null;

    constructor(device_name: string,
        blocksize: number,
        channels: number,
        dataType: AudioType){
            super(device_name, blocksize, channels, dataType);
    }


    public start(): void{
        //this.blocksize = 44100/60;
        this.python_subprocess = spawn("python3", [this.python_audio_filepath, this.device_name, this.blocksize.toString(), this.channels.toString()]);
        this.python_subprocess.stdout.on('data', (data) => this.onReceiveAudioBuffer(data));
        this.python_subprocess.stderr.on('data', (data) => this.onReceiveAudioError(data));
        this.python_subprocess.on('close', (code) => this.onReceivePythonClosed(code));
    }

    public stop(): void{
        this.python_subprocess.kill("SIGINT");
    }

    private onReceiveAudioBuffer(buffer: Buffer){
        let arra = new Float32Array(buffer.buffer, buffer.byteOffset,
            buffer.byteLength/Float32Array.BYTES_PER_ELEMENT);
        this.onAudio(arra);
    }

    private onReceiveAudioError(buffer: string){
        console.log(`error: ${buffer}`);
    }

    private onReceivePythonClosed(code: number){
        console.log(`close: ${code}`);
    }

} 