export class BaseMessage{
    private as_json: Object;
    public command: string;
    public headers: [];
    public body: object;

    constructor(command: string, headers: [], body: object){
        this.command = command;
        this.headers = headers;
        this.body = body;
    }

    public serialize(): object{
        return {
            'command': this.command,
            'headers': this.headers,
            'body': this.body
        }
    }
}


export function baseMessageFromString(message: string){
    const messageJSON = JSON.parse(message);
    return new BaseMessage(messageJSON['command'], messageJSON['headers'], messageJSON['body']);
}
