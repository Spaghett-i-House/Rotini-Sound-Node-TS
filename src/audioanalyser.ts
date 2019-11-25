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
        //console.log(both);

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

    public static filterFFT(fft: Array<[number, number]>, lowFreq: number, highFreq: number){
        let newArr = [];
        const origlen = fft.length;
        let vcount = 0;
        let lowcounter = 0;
        let highcounter = 0;
        let lastfreq = [0, 0]
        fft.forEach((frequency) => {
            if(frequency[0] > lowFreq && frequency[0] < highFreq){
                //newMap[frequency] = fft[frequency];
                //console.log(frequency[0], frequency[1])
                vcount += 1;
                newArr.push([frequency[0], frequency[1]]);
                lastfreq = [frequency[0], frequency[1]]
            }
            else{
                newArr.push(lastfreq);
            }
        });
        /*const difference = origlen - vcount;
        const mult = vcount/origlen;
        const step = Math.ceil(1/mult);
        //console.log(step);
        let newnewarr = [];
        let i=0
        newArr.forEach((element) => {
            for(let i = 0; i<step; i++){
                newnewarr.push(element);
            }
        });
        /*for(let i = 0; i< newArr.length; i++){
            for(let u = i; u<step; u++){
                newArr.splice(i, 0, newArr[i]);
                i+=1;
            }
        }*/
        //console.log(origlen, newArr.length);
        return newArr;
    }
}



/*export enum AudioType{
    INT8 = 127,
    INT16 = 32767,
    INT32 = 2147483647
}*/