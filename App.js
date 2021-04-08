import React, { useState } from 'react';
import { View, Dimensions, requireNativeComponent } from 'react-native';
import MapView from 'react-native-maps';

import { Location, DraggableMarker, Menu, PrimaryButtons, MarkerDescriptor } from '../ElemenD/js/commons.js';
import { style } from '../ElemenD/js/sheets.js';

import * as Font from 'expo-font';

const { UploadMarkers, DownloadMarkers, client } = require("../ElemenD/js/mrkdisplay.js");

/////////////////////////////////////////////////////////////////////
///////////////////////////////GLOBALS///////////////////////////////
/////////////////////////////////////////////////////////////////////
var positionTaken = false;
const menuElems = ["Red", "Yellow", "Green", "Blue", "Gray", "X"];

const deviceDims = Dimensions.get("screen");
const icons = require("../ElemenD/js/loadsrc.js")(); // <-- call to the 'icons' function
/////////////////////////////////////////////////////////////////////
///////////////////////////////GLOBALS///////////////////////////////
/////////////////////////////////////////////////////////////////////

const LoadFonts = async () => {
  await Font.loadAsync({
    "Impact": require("../ElemenD/assets/fonts/impact.ttf")
  });
}

const Setup = async (stateHandler) => {
  navigator.geolocation.getCurrentPosition((position) => {
    stateHandler(new Location(position.coords.longitude, position.coords.latitude).GetCoords());
  });

  await LoadFonts();
  positionTaken = true;
}

const SpriteMarker = ({ markStyle, coords, type }) => {
  return (
    <DraggableMarker
      markStyle = {markStyle}
      imgSource = {icons[type]}
      coords = {coords}
    />
  );
}

const elemend = () => {
  const [pos, setPos] = useState(new Location(0, 0).GetCoords());

  const [menuState, setMenuState] = useState(false);
  const [primaryState, setPrimaryState] = useState(true);

  const [arr, setArr] = useState([]);

  const toogle = () => {
    setMenuState(!menuState);
    setPrimaryState(!primaryState);
  };

  if (!positionTaken) {
    Setup(setPos);
  } else return (
    <View style = {{flex: 1}}>
      <MapView
        initialRegion = {pos}
        style = {style.container}
        minZoomLevel = {18}
        customMapStyle = {require("../ElemenD/json/customMap.json")}
      >
        {arr.map((marker, ix) => (
        <SpriteMarker
          key = {ix}
          markStyle = {style.marker}
          coords = {{ longitude: marker.position.longitude, latitude: marker.position.latitude }}
          type = {marker.type}/>
        ))}
      </MapView>

      {primaryState && <PrimaryButtons 
        style = {style} 
        deviceDims = {deviceDims} 
        onAdd = {toogle}
        onSubmit = {() => UploadMarkers(client, arr.map(x => x.GetObject()))}/>}
      {menuState && <Menu 
        elems = {menuElems}
        textStyle = {style.text}
        buttonStyle = {style.button}
        onClose = {toogle}
        onElse = {elem => () => setArr(
          new Array(
            ...arr, 
            new MarkerDescriptor(
              elem + `${Math.random() * 100}`, 
              elem.toLowerCase(), pos
            )
          )
        )}
      />}
    </View>
  );

  return (
    <View></View>
  );
}

export default elemend;