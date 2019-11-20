import * as portAudio from 'naudiodon';

/**
 * AudioDevice: a class used to access system audio
 */
export class AudioDevice{

    private portAudioDevice: portAudio.AudioInput;
    private onAudioCallback: (audioData: Buffer) => void;

    /**
     * constructor
     * @param device_name: the name of the pulseaudio device to get audio from 
     * @param audio_data_callback: a callback for what to do on audio data
     */
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

    /**
     * addEventListeners: connects the given audio devices to its asynchronous event streams
     */
    private addEventListeners(){
        this.portAudioDevice.on('data', (audioData: Buffer) => this.onData(audioData));
        this.portAudioDevice.on('close', () => console.log("audio device has closed"));
        this.portAudioDevice.on('end', () => console.log("audio device has ended"));
        this.portAudioDevice.on('error', (err) => {
            console.log(err);
            this.portAudioDevice.quit();
        });
    }

    /**
     * Used to split off the data event handler
     * @param audioData a buffer of audio data
     */
    private onData(audioData: Buffer){
        //console.log(audioData);
        this.onAudioCallback(audioData);
    }

    /**
     * starts the streaming of the portaudio device
     */
    public start(){
        this.portAudioDevice.start();
    }

    /**
     * stop stops the streaming of portaudio device, may have an issue
     * BUG: this.portaudio.quit seems to not actually stop os level device
     */
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