import face_recognition
import picamera
import numpy as np
import os
import time
import RPi.GPIO as GPIO
from gpiozero import MotionSensor
from socket import socket, AF_INET, SOCK_DGRAM
import subprocess
import psycopg2

#camera
camera = picamera.PiCamera()
camera.resolution = (320, 240)
output = np.empty((240, 320, 3), dtype=np.uint8)

#motion sensor
sensor = MotionSensor(4)

#communication
SERVER_IP   = '192.168.1.120'
PORT_NUMBER = 5000
SIZE = 1024
print ("Test client sending packets to IP {0}, via port {1}\n".format(SERVER_IP, PORT_NUMBER))

mySocket = socket( AF_INET, SOCK_DGRAM )

#database
conn = psycopg2.connect('dbname=bus_seat')
cur = conn.cursor()
def get_people_by_name(name):
    query = """
    SELECT
        seat
    FROM
        seatplan
    WHERE
        name = %s
    """
    values = (name, )
    cur.execute(query, values)
    return cur.fetchall()

# Load a sample picture and learn how to recognize it.
print("Loading known face image(s)")

#Freddie
freddie_image = face_recognition.load_image_file("/home/pi/freddie.jpg")
freddie_face_encoding = face_recognition.face_encodings(freddie_image)[0]

#Katie
katie_image = face_recognition.load_image_file("/home/pi/katie.jpg")
katie_face_encoding = face_recognition.face_encodings(katie_image)[0]

# Initialize some variables
face_locations = []
face_encodings = []

def main(name):
    global SERVER_IP
    os.system("espeak 'Welcome {0}.'".format(name))
    data = get_people_by_name(name)
    data = str(data).lstrip("[('").rstrip("', )]")
    print(data)
    os.system("espeak 'You are sitting in seat number {0}'".format(data))
    if data == "1":
        SERVER_IP = '192.168.1.118'
    mySocket.sendto(name.encode('utf-8'),(SERVER_IP,PORT_NUMBER))
    SERVER_IP = '192.168.1.120'
    time.sleep(50)
    

while True:
    camera.start_preview(alpha=192)
    sensor.wait_for_motion()
    os.system("espeak 'Please look directly into the camera.'")
    print("Capturing your image.")
    os.system("espeak 'Capturing your image.'")
    # Grab a single frame of video from the RPi camera as a numpy array
    camera.capture(output, format="rgb", use_video_port=True)
    
    # Find all the faces and face encodings in the current frame of video
    face_locations = face_recognition.face_locations(output)
    print("Found {} faces in image.".format(len(face_locations)))
    face_encodings = face_recognition.face_encodings(output, face_locations)

    # Loop over each face found in the frame to see if it's someone we know.
    for face_encoding in face_encodings:
        # See if the face is a match for the known face(s)
        match = face_recognition.compare_faces([freddie_face_encoding], face_encoding)
        match1 = face_recognition.compare_faces([katie_face_encoding], face_encoding)
        name = "Unknown Person"

        if match[0]:
            name = "Freddie Howells"
            main(name)
        elif match1[0]:
            name = "Katie Howells"
            main(name)
        elif name == "Unknown Person":
            os.system("espeak 'Sorry your face was not recognised. Please call Monmouthshire Transport Services'")

        print("{}".format(name) + " is on the bus.")
    time.sleep(5)
GPIO.cleanup()    

