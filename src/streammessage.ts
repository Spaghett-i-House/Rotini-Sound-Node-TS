import { BaseMessage, baseMessageFromString } from "./baseMessage";

export class InitStreamMessage extends BaseMessage{
    public deviceName: string;
    public sampleRate: number;
    public channels: number;

    /**
     * constructor
     * @param device_name 
     * @param samplerate 
     * @param channels 
     */
    constructor(device_name: string, samplerate: number, channels: number){
        super("INIT_STREAM", [], {});
        this.deviceName = device_name;
        this.sampleRate = samplerate;
        this.channels = channels;
    }

    public serialize(): object{
        const parentSerial = super.serialize();
        parentSerial['body']['device'] = this.deviceName;
        parentSerial['body']['samplerate'] = this.sampleRate;
        parentSerial['body']['channels'] = this.channels;
        return parentSerial;
    }
}

export function InitStreamFromString(message: string): InitStreamMessage{
    const base = baseMessageFromString(message);
    return new InitStreamMessage(base.body['device'], base.body['samplerate'], base.body['channels']);
}