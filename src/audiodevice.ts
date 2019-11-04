import * as portAudio from 'naudiodon';

export class AudioDevice{

    private portAudioDevice: portAudio.AudioInput;
    private onAudioCallback: (audioData: Buffer) => void;

    constructor(device_name: string, audio_data_callback: (audioData: Buffer) => void){
        this.onAudioCallback = audio_data_callback;
        this.portAudioDevice = new portAudio.AudioIO({
            inOptions: {
                channelCount: 1,
                sampleFormat: portAudio.SampleFormat16Bit,
                sampleRate: 44100,
                //deviceId: -1
                deviceName: device_name
            }
        });
        this.addEventListeners();
    }

    private addEventListeners(){
        this.portAudioDevice.on('data', (audioData: Buffer) => this.onData(audioData));
        this.portAudioDevice.on('close', () => console.log("audio device has closed"));
        this.portAudioDevice.on('end', () => console.log("audio device has ended"));
        this.portAudioDevice.on('error', (err) => {
            console.log(err);
            this.portAudioDevice.quit();
        });
    }

    private onData(audioData: Buffer){
        //console.log(audioData);
        this.onAudioCallback(audioData);
    }

    public start(){
        this.portAudioDevice.start();
    }

    public stop(){
        console.log("Stopping");
        this.portAudioDevice.quit();
    }
}

export function printAudioInputDevices(): object[]{
    const devices = portAudio.getDevices();
    let inputdevices = [];
    devices.forEach(element => {
        if (element.maxInputChannels > 0){
            inputdevices.push(element);
        }
    });
    return inputdevices;
}