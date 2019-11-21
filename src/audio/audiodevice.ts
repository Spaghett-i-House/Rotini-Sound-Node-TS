import {AudioObserver, Subject, EventDispatcher, Handler} from "../types/observer";
import {AudioDataEvent, ErrorEvent, Event, CloseEvent_a} from "../types/events";

export abstract class AudioDevice{
    
    private device_index: number;
    private blocksize: number;
    private channels: number;
    private dataType: number;
    private mostRecentAudioChunk: Float32Array;
    private events: Map<String, EventDispatcher<Event>> = new Map<String, EventDispatcher<Event>>([
        ["data", new EventDispatcher<AudioDataEvent>()],
        ["error", new EventDispatcher<ErrorEvent>()],
        ['close', new EventDispatcher<CloseEvent_a<AudioDevice>>()]
    ]);
    
    constructor(device_index: number, 
        blocksize: number,
        channels: number,
        dataType: AudioType){
            this.device_index = device_index;
            this.blocksize = blocksize;
            this.channels = channels;
            this.dataType = dataType;
    }

    public subscribe(event: string, handler: Handler<any>): void{
        if(this.events.has(event)){
            this.events.get(event).register(handler);
        }
    }

    private onAudio(audioBytes: Float32Array){
        const audioEvent: AudioDataEvent = {
            audioArray: audioBytes
        }
        this.events.get('data').fire(audioEvent);
        this.mostRecentAudioChunk = audioBytes;
    }

    public pullAudioChunk(): Float32Array{
        if(this.mostRecentAudioChunk){
            return this.mostRecentAudioChunk;
        }
        else{
            return new Float32Array(this.blocksize);
        }
    }

    abstract start(): void;
    public stop(){
        const closeEvent: CloseEvent_a<AudioDevice> ={
            closedObject: this
        }
        this.events.get('close').fire(closeEvent)
    }
}

export enum AudioType{
    Int32,
    Int16,
    Int8,
    Float32
}