#!/usr/bin/env python3

# User Interface/Window/Buttons
from guizero import *
import time
from datetime import datetime

# Database/Best Before
import psycopg2

conn = psycopg2.connect('host=192.168.1.102 user=pi password=pibe dbname=bus_seat')
cur = conn.cursor()
cur.execute('''CREATE TABLE IF NOT EXISTS seatplan (name text, seat text)''')
# Global Variables
seat = ''
name = ''

#dbfile.execute("DELETE FROM seatplan WHERE date<=date('now')");


# Add To Seatplan

def add_name():

    global name, seat

    seat = seat_combo.value + ""
    name = name_combo.value + ""

    if seat_combo.value == 'Seat':
        print ("You haven't chosen a seat")
        warn("","You haven't chosen a seat")

    elif name_combo.value == 'Name':
        print ("You haven't chosen a name")
        warn("","You haven't selected a name")

    else :
        print ("Adding " +name +" to seat plan with seat " +seat)
        info("", "Adding selected seat")
        q = "insert into seatplan values ('"
        q += name
        q += "', '"
        q += seat
        q += "')"
        cur.execute(q)
        conn.commit()
        

# Build User Interface

app = App(title="School Bus Seat Plan", height=600, width=820, bg = "red")

t01 = Text(app, text="Welcome to the Monmouthshire School Bus Smart Seat Service", font="20", bg = "red")
t02 = Text(app, text="Please select your name and a seat number from the drop down list", font="20", bg = "red")#, grid=[0,4,5,1])
t03 = Text(app, text="", bg = "red", font="20")


# Drop down menu names
t04 = Text(app, text="Select your name from the list", bg = "red")
name_combo = Combo(app, options=["Name", "Ben Amos", "Tamsin Black", "Lola Burnard", "Thomas Carr", "John Cook", "Megan Corley", "Sophie Cumberland", "Harry Daykin", "Timothy Dent", "Henry Dibble", "Liana Dustan", "Bea Eaton", "Niamh Emes", "Dan Evans", "Mia Fashinu", "Garry Foot", "Millie Francis", "Joe French", "Debbie Gardner", "Rose Green", "Dilwyn Harpur", "Freddie Howells", "Katie Howells", "Trevor Jennett", "Gracie Jones", "Ethan Keele", "Erin King", "Lucas Meadows", "Seb Prince", "Lilly Rose", "William Smith", "Samuel Turner"]) 
t05 = Text(app, text="", bg = "red", font="20")

# Seat Combo Boxes
t06 = Text(app, text="Please choose a seat", bg = "red", font="20")
seat_combo = Combo(app, options=["Seat", 
	"1", "2", "3", "4", "5", "6", "7", "8", "9", "10", 
	"11", "12", "13", "14", "15", "16", "17", "18", "19", "20", 
	"21", "22", "23", "24", "25", "26", "27", "28", "29", "30",
	"31", ])

t07 = Text(app, text="", bg = "red", font="20")

# Add to Seatplan Button
t08 = Text(app, text="Please tap to confirm selected seat", bg = "red", font="20")
b11 = PushButton (app, command=add_name, text="Confirm Seat Selection")

# Display the App

app.display()
