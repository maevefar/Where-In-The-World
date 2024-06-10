function convertNSEW(value, NSEW){
    //changes the value to be negative if south or west 
    if (NSEW == "S" || NSEW == "W"){
        value = 0 - value; 
    }
    return value;
}

function convertDMS(coordinate){
    //converts a degree minute second coordinate into standard form 
    //breaks coordinate up into degrees, minutes, seconds, direction 
    let degree1 = coordinate[0];
    let min1 = coordinate[1];
    let sec1 = coordinate[2];
    let dir1 = coordinate[3];
    let degree2 = coordinate[4];
    let min2 = coordinate[5];
    let sec2 = coordinate[6];
    let dir2 = coordinate[7];

    //converts to decimal coordinate
    let decimalLatitude = (Number(degree1) + (min1/60) + (sec1/3600));
    let decimalLongitude = (Number(degree2) + (min2/60) + (sec2/3600));

    //deals with direction, make number positive or negative 
    decimalLatitude = convertNSEW(decimalLatitude, dir1);
    decimalLongitude = convertNSEW(decimalLongitude, dir2);

    //formats the coordinate
    const finalDecimalDegree = decimalLatitude + ", " + decimalLongitude;
    return finalDecimalDegree; 

}

function convertDMM(coordinate){
    //converts a degree and decimal minute coordinate to standard form 

    let degree1 = coordinate[0];
    let min1 = coordinate[1];
    let dir1 = coordinate[2];
    let degree2 = coordinate[3];
    let min2 = coordinate[4];
    let dir2 = coordinate[5];

    //converts to decimal coordinate
    let decimalLatitude = (Number(degree1) + (min1/60));
    let decimalLongitude = (Number(degree2) + (min2/60));

    //deals with direction, make number positive or negative 
    decimalLatitude = convertNSEW(decimalLatitude, dir1);
    decimalLongitude = convertNSEW(decimalLongitude, dir2);

    //formats the coordinate 
    const finalDecimalDegree = decimalLatitude + ", " + decimalLongitude;
    return finalDecimalDegree; 
}

function cleanDMMAndDMS(coordinate){
    //gets rid of any non numerical values to help the conversions
    let coor = coordinate;


    for (let i = 0; i < coor.length; i++){
        if (coor[i].includes(",")){
            coor[i] = coor[i].replace(/,/g, "");//gets rid of the commas
        }
        if (!(coor[i]=="N") && !(coor[i]=="S") && !(coor[i]=="E") && !(coor[i]=="W")){
            coor[i] = coor[i].replace(/[^\d.-]/g, '');//gets rid of everything not a number except for NSEW
        }
    }
    return coor;
}

function organizeData(line){
    //determins what type the input coordinate was the then be able to convert to standard 


    const splitLine = line.split(" ");
    const splitLineLength = splitLine.length;
    let convertedCoordinate = "";
    let nonNumCount = 0;

    //to check if NSEW are proper and not flipped
    let iOfW = -1; 
    let iOfS = -1;
    let iOfN = -1;
    let iOfE = -1;

    for (let i = 0; i < splitLineLength; i++){
        if (isNaN(splitLine[i])){
            nonNumCount++;
        }
    }

    //does not process if not valid coordinate
    //cases: coordinate is all not numbers, has more than 3 non number (2 NSEW values and a place marker, is only one value long)
    if ((nonNumCount == splitLineLength || nonNumCount > 3 || splitLineLength == 0) && splitLineLength != 8 && splitLineLength != 6 && splitLineLength != 9 && splitLineLength != 7) { 
        console.log("Unable to process: " + line);
        return;
    }

    if (splitLineLength == 8 || splitLineLength == 9){
        convertedCoordinate = cleanDMMAndDMS(splitLine);
        convertedCoordinate = convertDMS(convertedCoordinate);
    }

    else if(splitLineLength == 6 || splitLineLength == 7){
        convertedCoordinate = cleanDMMAndDMS(splitLine);
        convertedCoordinate = convertDMM(convertedCoordinate);

    }
    else{ 
        const directions = ["N", "S", "W", "E", "n", "s", "e", "w"];
        for (let i = 0; i < splitLineLength; i++){
            //checking NSWE
            if (i != splitLineLength-1){ 
                splitLine[i+1] = splitLine[i+1].replace(/,/g, "");//gets rid of the commas
            }
            splitLine[i] = splitLine[i].replace(/,/g, "");//gets rid of the commas

            if (directions.includes(splitLine[i+1]) && i != splitLineLength-1) {
                let directionUpper = splitLine[i+1].toUpperCase();
                if (directionUpper == "S"){
                    iOfS = i+1;
                    convertedCoordinate += 0 - splitLine[i] + ", ";
                }
                else if(directionUpper == "W"){
                    iOfW = i+1;
                    convertedCoordinate += 0 - splitLine[i] + ", ";
                }
                else { //E or W
                    if (directionUpper == "E"){
                        iOfE = i+1;
                    }
                    else if (directionUpper = "N"){
                        iOfN = i+1;
                    }
                    convertedCoordinate += splitLine[i] + ", ";
                }
            }
            else if (!(directions.includes(splitLine[i])) && !(isNaN(splitLine[i]))) { 
                convertedCoordinate += splitLine[i] + ", ";

            }
        }  
    }
    const splitAnswer =  convertedCoordinate.split(",");
    let decimalLatitude = splitAnswer[0];
    let decimalLongitude = splitAnswer[1];

    //if the coordinate is backwards (NSEW put wrong), will flip the lat and long to correct it
    let halfway = Math.ceil((splitLineLength-1)/2);
    if ((iOfS >= halfway) || (iOfN >= halfway) || (iOfE != -1 && iOfE <= halfway) || (iOfW != -1 && iOfW <= halfway)){
        //flip lat and long
        let temp = decimalLatitude;
        decimalLatitude = decimalLongitude;
        decimalLongitude = temp;
    }

    let decimalLatitudeSplit = decimalLatitude.split(".");
    let decimalLongitudeSplit = decimalLongitude.split(".");
    
    let decimalLatLen = decimalLatitudeSplit[0].length;
    let decimalLongLen = decimalLongitudeSplit[0].length;

    //formats to decimal length of 6
    const formattedLatitude = (Number (decimalLatitude)).toFixed(6).padEnd((decimalLatLen+6), '0'); //parseFloat()
    const formattedLongitude = (Number (decimalLongitude)).toFixed(6).padEnd((decimalLongLen+6), '0');

    if (parseInt(formattedLatitude) < -90 || parseInt(formattedLatitude) > 90 || parseInt(formattedLongitude) < -180 || parseInt(formattedLongitude) > 180){
        console.log("Unable to process: " + line + " becausec latitude or longitude out of range");
        return;
    }

    return (formattedLatitude + "," + formattedLongitude);
}


function readFile(fileName){
    //reads the file line by line and calls functions to convert each line 
    const fs = require('fs');
    const allContents = fs.readFileSync(fileName, 'utf-8');
    let finalCoordinate = ""; 
    let allCoordinates = "";
    allContents.split(/\r?\n/).forEach((line) => {
        console.log("line read from file: " + line);
        finalCoordinate = organizeData(line);
        console.log("final coor: " + finalCoordinate);
        if (finalCoordinate != undefined) {
            let splitLine = line.split(" ");
            let lastVal = splitLine[(splitLine.length-1)];
            if(isNaN(lastVal) && lastVal.length > 1) {
                allCoordinates += finalCoordinate + "," + lastVal  + " | ";
            }
            else{
                allCoordinates += finalCoordinate + " | ";
            }
        }
    });

    console.log("FINAL ANSWER: " + allCoordinates );
    writeFile(allCoordinates);
    return allCoordinates;
    
}

function writeFile(allCoordinates){
    //writes to a GeoJSON file 

    // Removes everything that is not the coordinate 
    const coordinatesArray = allCoordinates
    .replace("FINAL ANSWER:", "")
    .split(" | ")
    .filter(coord => coord !== "");
    const features = [];

    console.log("coor array " + coordinatesArray);

    for (const coord of coordinatesArray) { //iterates through coordinates
        const [latitude, longitude, name] = coord.split(",");
  
        // Create a GeoJSON feature object
        const feature = {
            type: "Feature",
            geometry: {
            type: "Point",
            coordinates: [parseFloat(longitude), parseFloat(latitude)] // Swaps the order of longitude and latitude 
         },
        properties: {
        name: name
      }
    };
        features.push(feature);
}

    // Create a GeoJSON object
    const geoJSON = {
        type: "FeatureCollection",
        features: features
    };
    const geoJSONString = JSON.stringify(geoJSON);

    console.log(geoJSONString);

    const fs = require('fs');
    fs.writeFile('data.geojson', geoJSONString, 'utf8', (err) => {
        if (err) {
            console.error('Error writing GeoJSON file:', err);
        } else {
            console.log('GeoJSON file created successfully.');
        }
        });
}

readFile("CoordinateInputs.txt");
