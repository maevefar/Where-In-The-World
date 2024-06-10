# etude07
# By: Maeve Farley

# Introduction
My code reads a sequence of lines from the file CoordinateInputs.txt and converts the coordinates to into GeoJSON features and then writes to a GeoJSON file and displays the GeoJSON file on a map using leaflet. 

# Run Code 
Install and download leaflet:
npm install leaflet

Install python to then run the visulizaiton using this line:
python3 -m http.server

To run the javascript:
Node WhereInTheWorld.js

# Test Cases 
Different forms of Standard:
45.9 S, 170.5 E Dunedin
45.1234, -120.56789
37.752050 -122.507600

flipped NSWE:
23.6 W, -50.00
34.9 E, -80.00 N

DMS & DMM:
40° 45.0' N, 73° 58.0' W NYC
45 30 20 N, 120 10 30 E
45000 30 20 N, 120 10 30 E
45 30 20 N, 12000 10 30 E
45° 30' 20" N, 120° 10' 30" E
50 30' 20" N, 120° 10' 30" E
40° 25.789' N, 74° 0.987' W
45° 25.789 N, 74° 0.987' W

Invalid Input:
Ha Ha!
Ha, tricked you!
Ha
H
Testing a really long sentence in another impotrant edge case