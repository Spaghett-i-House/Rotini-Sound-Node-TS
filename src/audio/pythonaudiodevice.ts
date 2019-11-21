import {AudioDevice, AudioType} from "./audiodevice"
import {spawn} from "child_process";


export class PythonAudioDevice extends AudioDevice{

    constructor(device_index: number,
        blocksize: number,
        channels: number,
        dataType: AudioType){
            super(device_index, blocksize, channels, dataType);
            

    }


    public start(): void{

    }

    public stop(): void{

    }

} 