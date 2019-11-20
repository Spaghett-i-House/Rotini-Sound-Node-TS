import socket

AUDIODEVICEPORT = 5890

tcpsocket = socket.socket(socket.AF_INET, socket.SOCK_STREAM, 0)
tcpsocket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
tcpsocket.bind("", AUDIODEVICEPORT)