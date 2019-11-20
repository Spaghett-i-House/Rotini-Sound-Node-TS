import sounddevice as sd
import sys
import argparse
from queue import Queue

sound_queue = Queue()

def callback(indata, frames, time, status):
    if status:
        print(status)
    sound_queue.put(indata.copy())

# get cmd line arguments
#print(sd.query_devices())
device = sys.argv[1]
chunksize = int(sys.argv[2]) or 1024


for i in sd.query_devices():
    print(i['name'])
try:
    with sd.InputStream(samplerate=44100,
                        channels=1,
                        callback=callback,
                        device=device,
                        blocksize=1024) as stream:
        print(sd.query_devices()[stream.device]['name'])
        while True:
            print(sound_queue.get().tobytes())
            #sound_queue.get()
except KeyboardInterrupt:
    exit()
except Exception as e:
    print(e)
    exit()