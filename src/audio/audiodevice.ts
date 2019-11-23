import {AudioObserver, Subject, EventDispatcher, Handler} from "../types/observer";
import {AudioDataEvent, ErrorEvent, Event, CloseEvent_a} from "../types/events";
import {AudioType} from '../types/audio';


export abstract class AudioDevice{
    
    protected device_name: string;
    protected blocksize: number;
    protected channels: number;
    protected dataType: number;
    protected mostRecentAudioChunk: Float32Array;
    protected events: Map<String, EventDispatcher<Event>> = new Map<String, EventDispatcher<Event>>([
        ["data", new EventDispatcher<Float32Array>()],
        ["error", new EventDispatcher<ErrorEvent>()],
        ['close', new EventDispatcher<CloseEvent_a<AudioDevice>>()]
    ]);
    
    constructor(device_name: string, 
        blocksize: number,
        channels: number,
        dataType: AudioType){
            this.device_name = device_name;
            this.blocksize = blocksize;
            this.channels = channels;
            this.dataType = dataType;
    }

    public subscribe(event: string, handler: Handler<any>): void{
        if(this.events.has(event)){
            this.events.get(event).register(handler);
        }
    }

    protected onAudio(audioBytes: Float32Array){
        //const audioEvent: AudioDataEvent = {
        //    audioArray: audioBytes
        //}
        this.events.get('data').fire(audioBytes);
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