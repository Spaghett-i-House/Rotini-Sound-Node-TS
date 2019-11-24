import {AudioInformation} from "./audioinformation";
import {exec} from "child_process";

class PythonAudioInformation extends AudioInformation{
    private pythonDevicePath: string = "./python/querydevices.py";
    private deviceInterval: any;

    constructor(){
        super();
        this.startInterval();
    }

    private startInterval(){
        this.execScript();
        this.deviceInterval = setInterval(() => this.execScript(), 5000);
    }

    private execScript(){
        exec(`python3 ${this.pythonDevicePath}`, (error, stdout, stderr) => {
            if(error){
                console.error("Error in query device script");
                console.error(error);
            }
            else{
                this.parsePythonReturn(stdout);
            }
            /*console.log(`stdout ${stdout}`);
            console.log(stdout);
            console.log(`stderr: ${stderr}`);
            console.log(stderr);*/
        });
    }

    private parsePythonReturn(stdout: string){
        try{
            let received_list = JSON.parse(stdout);
            this.deviceNames = received_list;
        }
        catch(err){
            console.error(err);
        }
    }

    public close(){
        super.close()
        clearTimeout(this.deviceInterval);
    }
}

let infoInstance = new PythonAudioInformation();
export const AudioInformationInstance = infoInstance;