import sounddevice as sd
import sys
import argparse
from queue import Queue

sound_queue = Queue()
fileo = open("logo.txt", "w")
fileo.write("Started\n")

def callback(indata, frames, time, status):
    #if status:
        #print(status)
    #fileo.write(str(indata.dtype)+"\n")
    #fileo.write(str(len(indata))+"\n")

    sound_queue.put(indata.copy())

# get cmd line arguments
#print(sd.query_devices())
device = sys.argv[1]
chunksize = int(sys.argv[2])
channels = int(sys.argv[3])
#fileo.write(str(chunksize))
device_names = []
for i in sd.query_devices():
    fileo.write(i['name'])
    device_names.append(i['name'])
    
if device not in sd.query_devices():
    device = device_names[0]

try:
    with sd.InputStream(samplerate=44100,
                        channels=channels,
                        callback=callback,
                        device=device,
                        blocksize=chunksize) as stream:
        #print(sd.query_devices()[stream.device]['name'])
        while True:

            sys.stdout.buffer.write(sound_queue.get().tobytes())
            #print(sound_queue.get().tobytes())
            #sound_queue.get()
except KeyboardInterrupt:
    fileo.close()
    exit(2)
except Exception as e:
    fileo.write(e)
    fileo.close()
    exit()
