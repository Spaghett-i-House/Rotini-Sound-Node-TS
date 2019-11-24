import sounddevice
import json

devices = sounddevice.query_devices()
input_devices = []
for i in devices:
    if i['max_input_channels'] != 0:
        input_devices.append(i['name'])

print(json.dumps(input_devices))