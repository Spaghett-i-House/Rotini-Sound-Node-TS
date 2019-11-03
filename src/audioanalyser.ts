var fft = require('fft-js').fft;
var fftUtil = require('fft-js').util;


export class AudioAnalyser{
    /**
     * AudioAnalyser provides functions to analyse audio buffers with
     */
    
    public static getFrequencies(audioData: Float32Array, sampleRate: number){
        let phasors = fft(audioData);
        let frequencies = fftUtil.fftFreq(phasors, sampleRate);
        let magnatudes = fftUtil.fftMag(phasors);

        let both = frequencies.map((f, ix) => {
            return {frequecy: Math.floor(f), magnitude: magnatudes[ix]}
        });

        console.log(typeof(both), both);
        return both;
    }

    public static toFloat32Array(audioData: Buffer, fromType: AudioType){
        let arrayBuffer;

        if(fromType == AudioType.INT8){
            arrayBuffer = new Int8Array(audioData);
        }
        else if(fromType == AudioType.INT16){
            arrayBuffer = new Int16Array(audioData);
        }
        else if (fromType == AudioType.INT32){
            arrayBuffer = new Int32Array(audioData);
        }

        let finalFloatArray = new Float32Array(arrayBuffer.length); // float 32 array -1 to 1
        for(let i=0; i<finalFloatArray.length; i++){ // convert type to between -1 and 1
            finalFloatArray[i] = arrayBuffer[i]/fromType;
        }

        return finalFloatArray;
    }
}

export enum AudioType{
    INT8 = 127,
    INT16 = 32767,
    INT32 = 2147483647
}