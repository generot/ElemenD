import React, { useState } from 'react';
import { View, Dimensions } from 'react-native';
import MapView from 'react-native-maps';

import { Location, DraggableMarker, Menu, PrimaryButtons, MarkerDescriptor, ErrorView } from '../ElemenD2/js/commons.js';
import { style } from '../ElemenD2/js/sheets.js';

import * as Font from 'expo-font';

const { UploadMarkers, DownloadMarkers } = require("../ElemenD2/js/mrkdisplay.js");
const icons = require("../ElemenD2/js/loadsrc.js")(); // <-- call to the 'icons' function

const menuElems = ["Red", "Yellow", "Green", "Blue", "Gray", "X"];
const deviceDims = Dimensions.get("screen");
const serverError = 404;

var positionTaken = false;

const LoadFonts = async () => {
  await Font.loadAsync({
    "Impact": require("../ElemenD2/assets/fonts/impact.ttf")
  });
}

const Setup = async (handlers) => {
  navigator.geolocation.getCurrentPosition((position) => {
    handlers["location"](new Location(position.coords.longitude, position.coords.latitude).GetCoords());

    DownloadMarkers().then(promise => {
      if(typeof promise === 'number' && promise == serverError) {
        handlers["error"](promise);
        return;
      }

      handlers["array"](promise);
      handlers["index"](promise.length);
      //console.log(`Array: ${JSON.stringify(promise)}\nLength: ${promise.length}`);
    })
  });

  await LoadFonts();
  positionTaken = true;
}

const SpriteMarker = ({ markStyle, coords, type, OnEnd }) => {
  return (
    <DraggableMarker
      markStyle = {markStyle}
      imgSource = {icons[type]}
      coords = {coords}
      onDrEnd = {event => OnEnd(event)}
    />
  );
}

const test = () => {
  DownloadMarkers().then(js => console.log(JSON.stringify(js)));
  return (<View/>);
}

const entry = () => {
  const [pos, setPos] = useState(new Location(0, 0).GetCoords());
  const [err, setErr] = useState(200);

  const [menuState, setMenuState] = useState(false);
  const [primaryState, setPrimaryState] = useState(true);

  const [arr, setArr] = useState([]);
  const [index, setIndex] = useState(0);

  const toogle = () => {
    setMenuState(!menuState);
    setPrimaryState(!primaryState);
  };

  if (!positionTaken) {
    Setup({
      location: setPos,
      array: setArr,
      index: setIndex,
      error: setErr
    });
  } else if(err != serverError) 
    return (
      <View style = {{flex: 1}}>
        <MapView
          initialRegion = {pos}
          style = {style.container}
          minZoomLevel = {18}
          customMapStyle = {require("../ElemenD2/json/customMap.json")}
        >
          {arr.map((marker, ix) => (
          <SpriteMarker
            key = {ix}
            markStyle = {style.marker}
            coords = {{ longitude: marker.position.longitude, latitude: marker.position.latitude }}
            type = {marker.type}
            OnEnd = {event => { if(marker instanceof MarkerDescriptor) marker.position = event.nativeEvent.coordinate } }/>
          ))}
        </MapView>

        {primaryState && <PrimaryButtons 
          style = {style} 
          deviceDims = {deviceDims} 
          onAdd = {toogle}
          onSubmit = {() => {
            if(arr.length)
              UploadMarkers({ 
                type: "MarkerStorage",
                newJson: arr.map(x => x.GetObject ? x.GetObject() : x)
              })
          }}/>}
        {menuState && <Menu 
          elems = {menuElems}
          textStyle = {style.text}
          buttonStyle = {style.button}
          onClose = {toogle}
          onElse = {elem => () => {
            setIndex(index + 1);
            setArr(
              new Array(
                ...arr, 
                new MarkerDescriptor(
                  index, 
                  elem.toLowerCase(), pos
                )
              ))
            }
            }
        />}
      </View>
    );
    else if(err == serverError) 
      return ErrorView(style.errorTxt, style.errorPrompt, deviceDims.width);

  return (<View/>)
}

const elemend = entry;

export default elemend;
