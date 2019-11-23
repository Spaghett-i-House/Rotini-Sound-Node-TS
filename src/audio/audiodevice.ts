import {AudioObserver, Subject, EventDispatcher, Handler} from "../types/observer";
import {AudioDataEvent, ErrorEvent, Event, CloseEvent_a} from "../types/events";
import {AudioType, AudioEventType} from '../types/audio';

/**
 * AudioDevice Represents a device that can receive audio from a given source
 *  with the purpose of abstracting away any functions related to receiving a processing
 *  this data
 */
export abstract class AudioDevice{
    
    protected device_name: string;
    protected blocksize: number;
    protected channels: number;
    protected dataType: number;
    protected mostRecentAudioChunk: Float32Array;
    protected events: Map<AudioEventType, EventDispatcher<Event>> = new Map<AudioEventType, EventDispatcher<Event>>([
        [AudioEventType.ONAUDIODATA, new EventDispatcher<Float32Array>()],
        [AudioEventType.ERROR, new EventDispatcher<ErrorEvent>()],
        [AudioEventType.CLOSE, new EventDispatcher<CloseEvent_a<AudioDevice>>()]
    ]);
    
    /**
     * Constructor: populate member variables to create a new AudioDevice
     * @param device_name the device name as found in system audio device driver
     * @param blocksize the amount of audio bytes to be received in each individual chunk, must me a subset of 2^n
     * @param channels the channels to receive data from currently only 1 is supported
     * @param audioType currently only for future support, is always set to float32
     */
    constructor(device_name: string, 
        blocksize: number,
        channels: number,
        audioType: AudioType){
            this.device_name = device_name;
            this.blocksize = blocksize;
            this.channels = channels;
            this.dataType = AudioType.Float32; // currently only float32
    }

    /**
     * subscribe allows classes to subscribe to the error, data, and close feed of audiodevice
     * @param event the name of the event to subscribe to, either error, data, or close
     * @param handler a function used as a callback for on event execution
     */
    public subscribe(event: AudioEventType, handler: Handler<any>): void{
        if(this.events.has(event)){
            this.events.get(event).register(handler);
        }
    }

    /**
     * onAudio signals AudioDevice that audio is ready and event needs to be fired
     * @param audioBytes a float32 array of audio bytes
     */
    protected onAudio(audioBytes: Float32Array){
        this.events.get(AudioEventType.ONAUDIODATA).fire(audioBytes);
        this.mostRecentAudioChunk = audioBytes;
    }

    /**
     * provides an easy interface for 
     * @param eventType: the type of event to be fired
     * @param fired: the item to be sent to all subscribers
     */
    protected fireEvent(eventType: AudioEventType, event: Event){
        if(this.events.get(eventType)){
            this.events.get(eventType).fire(event);
            return true;
        }
        return false;
    }

    /**
     * pullAudioChunk: allows access to audio without subscription
     * @return the most recent block of audio that was received or an empty array
     */
    public pullAudioChunk(): Float32Array{
        if(this.mostRecentAudioChunk){
            return this.mostRecentAudioChunk;
        }
        else{
            return new Float32Array(this.blocksize);
        }
    }

    /**
     * used to start the real stream of audio
     */
    abstract start(): void;

    /**
     * signals that a close event should be fired
     */
    public stop(){
        const closeEvent: CloseEvent_a<AudioDevice> ={
            closedObject: this
        }
        this.events.get(AudioEventType.CLOSE).fire(closeEvent)
    }
}