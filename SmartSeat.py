#!/usr/bin/env python3

import os
import signal
import sys
import time
import subprocess
from socket import socket, gethostbyname, AF_INET, SOCK_DGRAM

#communication seat 1
PORT_NUMBER = 5000
SIZE = 1024

hostName = gethostbyname( '0.0.0.0' )

mySocket = socket( AF_INET, SOCK_DGRAM )
mySocket.bind( (hostName, PORT_NUMBER) )

print ("Test server listening on port {0}\n".format(PORT_NUMBER))

while True:
    (data,addr) = mySocket.recvfrom(SIZE)
    data = data.decode('utf-8')

    if data == "Freddie Howells":
        # Launch personalised Smart Seat
        os.system("espeak 'Welcome Freddie Howells. I am launching Smart Seat now'")
        subprocess.call(['sh /home/pi/mm.sh'], shell=True)
    elif data == "Katie Howells":
        # Launch personalised Smart Seat
        os.system("espeak 'Welcome Katie Howells. I am launching Smart Seat now'")
        subprocess.call(['sh /home/pi/mm2.sh'], shell=True)
            
    time.sleep(5)
GPIO.cleanup()


