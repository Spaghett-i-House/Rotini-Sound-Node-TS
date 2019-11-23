var fft = require('fft-js').fft;
var fftUtil = require('fft-js').util;
import { AudioType } from "./types/audio";

export class AudioAnalyser{
    /**
     * AudioAnalyser provides functions to analyse audio buffers with
     */
    
    /**
     * getFrequencies: returns the frequency bins related to samples
     * @param audioData: the float32array of raw audio samples
     * @param sampleRate: the samplerate that the raw audio samples were recorded with
     */
    public static getFrequencies(audioData: Float32Array, sampleRate: number){
        let phasors = fft(audioData);
        let frequencies = fftUtil.fftFreq(phasors, sampleRate);
        let magnatudes = fftUtil.fftMag(phasors);

        let both = frequencies.map((f, ix) => {
            return [Math.floor(f), magnatudes[ix]]
        });

        return both;
    }

    /**
     * toFloat32Array: turns a buffer into an array of its given datatype
     * @param audioData 
     * @param fromType 
     */
    public static toFloat32Array(audioData: Buffer, fromType: AudioType){
        
        let arrayBuffer;

        if(fromType == AudioType.Int8){
            arrayBuffer = new Int8Array(audioData);
        }
        else if(fromType == AudioType.Int16){
            arrayBuffer = new Int16Array(audioData);
        }
        else if (fromType == AudioType.Int32){
            arrayBuffer = new Int32Array(audioData);
        }

        let finalFloatArray = new Float32Array(arrayBuffer.length); // float 32 array -1 to 1
        for(let i=0; i<finalFloatArray.length; i++){ // convert type to between -1 and 1
            finalFloatArray[i] = arrayBuffer[i]/fromType;
        }

        return finalFloatArray;
    }
}



/*export enum AudioType{
    INT8 = 127,
    INT16 = 32767,
    INT32 = 2147483647
}*/