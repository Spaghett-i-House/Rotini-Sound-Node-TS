import {AudioDevice, printAudioInputDevices} from './audiodevice';
import {FileWriter} from 'wav';
import {WebsocketServer} from './websocketserver';

const websocketserver = new WebsocketServer(6879);
/*
let input_devices = printAudioInputDevices();

let outputFileStream = new FileWriter("./test.wav", {
    "channels": 2,
    "sampleRate": 44100
});

let streams = {};
let max = {};
input_devices.forEach(element => {
    max[element['name']] = 0
    streams[element['name']] = new AudioDevice(element['name'], (buff) =>{
        //console.log(element['name']);
        for(let i=0;i<buff.length;i++){
            if(buff[i] > max[element['name']]){
                max[element['name']] = buff[i];
                
            }
        }
    });
    streams[element['name']].start();

});

setInterval(() => {
    console.log(max);
}, 1000);
*/
/*let ad = new AudioDevice("loophw01", (buff) => {
    console.log(buff);
    outputFileStream.write(buff);
})//outputFileStream.write);
ad.start();*/


//setTimeout(ad.stop, 5000);
