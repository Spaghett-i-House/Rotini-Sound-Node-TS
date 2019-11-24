import {AudioObserver, Subject, EventDispatcher, Handler} from "../types/observer";
import {AudioDataEvent, ErrorEvent, Event, CloseEvent_a} from "../types/events";
import {AudioType, AudioEventType} from '../types/audio';

/**
 * AudioInformation Represents an interface to see information about system audio
 */
export abstract class AudioInformation{
    
    protected deviceNames: Array<string>;
    protected eventDispatcher: EventDispatcher<AudioInformation>;

    /**
     * constuctor: prepare variables
     */
    constructor(){
        this.deviceNames = []
        this.eventDispatcher = new EventDispatcher<AudioInformation>();
    }

    /**
     * getNames: provides access to a list of system device names
     */
    public getNames(){
        return this.deviceNames;
    }

    /**
     * subscribe: listeners can subscribe to see state changes regarding audio devices
     * @param handler: the callback function to run on state change 
     */
    public subscribe(handler: Handler<AudioInformation>){
        this.eventDispatcher.register(handler);
    }

    /**
     * onChange: signals that a change has been made that needs to propagate to all observers
     */
    private onChange(){
        this.eventDispatcher.fire(this);
    }

    /**
     * allows closing of all resources used
     */
    public close(){
        return;
    }
}