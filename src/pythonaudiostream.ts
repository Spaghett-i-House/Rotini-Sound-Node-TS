import {spawn, ChildProcess} from 'child_process';
/**
 * AudioDevice: a class used to access system audio
 */
export class PythonAudioDevice{

    private pythonSubprocess: ChildProcess;
    private onAudioCallback: (audioData: Buffer) => void;

    /**
     * constructor
     * @param device_name: the name of the pulseaudio device to get audio from 
     * @param audio_data_callback: a callback for what to do on audio data
     */
    constructor(device_name: string, audio_data_callback: (audioData: Buffer) => void){
        this.onAudioCallback = audio_data_callback;
        /*this.portAudioDevice = new portAudio.AudioIO({
            inOptions: {
                channelCount: 1,
                sampleFormat: portAudio.SampleFormat16Bit,
                sampleRate: 44100,
                //deviceId: -1
                deviceName: device_name
            }
        });
        this.addEventListeners();*/
        this.pythonSubprocess = spawn('python3', ['./python/audiopipe.py', device_name]);
        this.addEventListeners()
        /*this.pythonSubprocess.stdout.on('data', (data) => {
            console.log(data);
        });*/
        
    }

    /**
     * addEventListeners: connects the given audio devices to its asynchronous event streams
     */
    private addEventListeners(){
        this.pythonSubprocess.stderr.on('data', (data) => {
            console.log("ERROR");
            console.log(data.toString());
        });
        this.pythonSubprocess.on('close', (code) => {
            console.log(`Child process exited with code ${code}`);
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
        this.pythonSubprocess.stdout.on('data', (data) => {
            this.onData(data);
        });
    }

    /**
     * stop stops the streaming of portaudio device, may have an issue
     * BUG: this.portaudio.quit seems to not actually stop os level device
     */
    public stop(){
        this.pythonSubprocess.kill();
        console.log("Process killed");
    }
}

let testpy = new PythonAudioDevice('default', (data) => {
    console.log(data);
    let newArr  = new Float32Array(data.length/4);
    for(let i=0; i<data.length/4; i++){
        newArr[i] = data.readFloatBE(i*4);
    }
    console.log(newArr);
});

testpy.start();