export interface Event{

}

export interface AudioDataEvent extends Event{
    audioArray: Float32Array;
}

export interface ErrorEvent extends Event{
    message: string;
    location: string;
    type: string;
}

export interface CloseEvent_a<T> extends Event{
    closedObject: T;
}