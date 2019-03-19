This is a project to revolutionise school bus transport.

It is comprised of 3 parts:
1. A Graphical User Interface where students preslect their chosen seat on the bus and enter it into a Postgres databas
2. A facial recognition bus pass, where a motion sensor triggers a camera to take an image of the student as they get onto the bus. The image is compared against a database of registered students and if their face is recognised, the Postgres database is searched for their chosen seat.
3. A message is sent via the socket library to the chosen seat and the student's personalised Smart Mirror program is launched, with their unique set up, including daily timetable, email and year specific revision modules.

Part 3 is inspired by the awesome MagicMirror module created by Michael Teeuw. The MagicMirror module is first downloaded and installed onto the Rspberry Pi, then custom modules were created and added as well as the programme to launch the Smart Seat via socket encoding following successful face recognition.

Full instructions for installing MagicMirror can be found at https://github.com/MichMich/MagicMirror