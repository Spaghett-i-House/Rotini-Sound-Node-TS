/**
 * Represents the types that audio can be formatted as
 */
export enum AudioType {
    Int32,
    Int16,
    Int8,
    Float32
}

/**
 * Represents the events that can be found on AudioDevices
 */
export enum AudioEventType {
    ONAUDIODATA,
    ERROR,
    CLOSE
}