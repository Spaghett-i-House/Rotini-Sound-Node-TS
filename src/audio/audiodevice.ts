export abstract class AudioDevice implements IEventHandling<AudioDevice, number>{
    
    private device_index: number;
    private blocksize: number;
    private channels: number;
    private dataType: number;
    private _events: EventList<AudioDevice, number> = new EventList<AudioDevice, number>();

    onAudioCallback: (data: Float32Array) => void;
    
    constructor(device_index: number, 
        blocksize: number,
        channels: number,
        dataType: AudioType){
            this.device_index = device_index;
            this.blocksize = blocksize;
            this.channels = channels;
            this.dataType = dataType;
    }

    public subscribe(name: string, fn: (sender: AudioDevice, args: number) => void): void{

    }

    public unsubscribe(name: string, fn: (sender: AudioDevice, args: number) => void): void{
        
    }
    public pullAudioChunk(): Float32Array{
        
    }
    public start(): void;
    public stop(): void;
}

export enum AudioType{
    Int32,
    Int16,
    Int8,
    Float32
}

interface IEventHandling<TSender, TArgs> {
    subscribe(name: string, fn: (sender: TSender, args: TArgs) => void): void;
    unsubscribe(name: string, fn: (sender: TSender, args: TArgs) => void): void;
}