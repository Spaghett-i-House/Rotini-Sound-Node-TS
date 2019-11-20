import {AudioDevice, AudioType} from "./audiodevice"

export class PythonAudioDevice extends AudioDevice{

    onAudioCallback: (data: Float32Array) => void;

    constructor(device_index: number,
        blocksize: number,
        channels: number,
        dataType: AudioType){
            super(device_index, blocksize, channels, dataType);


    }

    pullAudioChunk(): Float32Array{
        return null;
    }

    stop(): void{

    }

} 