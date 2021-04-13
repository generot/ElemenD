import React, { useState } from 'react';
import { View, Dimensions, Text } from 'react-native';
import MapView from 'react-native-maps';

import { Location, DraggableMarker, Menu, PrimaryButtons, MarkerDescriptor, ErrorView } from '../ElemenD2/js/commons.js';
import { style } from '../ElemenD2/js/sheets.js';
import { UploadMarkers, DownloadMarkers } from '../ElemenD2/js/req.js';
import { customMap } from '../ElemenD2/js/jsonWrapper.js';

import * as Font from 'expo-font';
import * as ExpoLocation from 'expo-location';
import AppLoading from 'expo-app-loading';

const { LoadImages } = require("../ElemenD2/js/loadsrc.js");

const menuElems = ["Red", "Yellow", "Green", "Blue", "Gray", "X"];
const deviceDims = Dimensions.get("screen");
const serverError = 404;

const ResolveURIs = async () => {
  const promises = LoadImages();
  let allKeys = Object.keys(promises);

  for(let key of allKeys) {
    const file = await promises[key];
    promises[key] = file.localUri;
  }

  return promises;
}

const Setup = async handlers => {
  let permission = await ExpoLocation.requestPermissionsAsync();
  let locationPromise = null;

  if(permission.status == 'granted') {
    locationPromise = ExpoLocation.getCurrentPositionAsync({})
    .then(loc => handlers["location"](new Location(loc.coords.longitude, loc.coords.latitude).GetCoords()))
    .catch(err => handlers["error"](6969));
  }

  // let uriPromise = ResolveURIs()
  // .then(obj => handlers["uri"](obj));

  let markerPromise = DownloadMarkers()
  .then(markerObj => {
    if(typeof markerObj === 'number' && markerObj === serverError) {
      handlers["error"](markerObj);
      return;
    }

    handlers["array"](markerObj);
    handlers["index"](markerObj.length);
  });

  let fontPromise = Font.loadAsync({
    "Impact": require("../ElemenD2/assets/fonts/impact.ttf")
  });

  return Promise.all([fontPromise, markerPromise, /*uriPromise*/, locationPromise]);
}

const SpriteMarker = ({ markStyle, coords, OnEnd, imgUri, type }) => {  
  return (
    <DraggableMarker
      markStyle = {markStyle}
      coords = {coords}
      imgSource = {type}
      onDrEnd = {event => OnEnd(event)}
      _uri = {imgUri}
    />
  );
}

const entry = () => {
  const [pos, setPos] = useState(new Location(43, 34).GetCoords());
  const [err, setErr] = useState(200 /*Vsichko e tip top pri kod 200*/);

  const [menuState, setMenuState] = useState(false);
  const [primaryState, setPrimaryState] = useState(true);

  const [loaded, setLoaded] = useState(false);

  const [arr, setArr] = useState([]);
  const [uris, setUris] = useState({});
  const [index, setIndex] = useState(0);

  const toogle = () => {
    setMenuState(!menuState);
    setPrimaryState(!primaryState);
  };

  if(!loaded) {
    return (
      <AppLoading
      startAsync = {() => Setup({
        location: setPos,
        array: setArr,
        index: setIndex,
        error: setErr,
        uri: setUris
      })}
      onFinish = {() => setLoaded(true)}
      onError = {() => console.log("An error occured.")}/>
    )
  }

  if(err != serverError) 
    return (
      <View style = {{flex: 1}}>
        <MapView
          initialRegion = {pos}
          style = {style.container}
          minZoomLevel = {18}
          customMapStyle = {customMap}
          showsUserLocation = {true}
          >
          {arr.map((marker, ix) => (
            <SpriteMarker
              key = {ix}
              markStyle = {style.marker}
              type = {marker.type}
              //imgUri = {uris[marker.type]}
              coords = {{ longitude: marker.position.longitude, latitude: marker.position.latitude }}
              OnEnd = {event => { if(marker instanceof MarkerDescriptor) marker.position = event.nativeEvent.coordinate } }/>
            ))}
        </MapView>
        
        {primaryState && <PrimaryButtons 
          style = {style} 
          deviceDims = {deviceDims} 
          onAdd = {() => toogle()}
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
          onElse = {elem => {
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
      return ErrorView(style, deviceDims.width, setErr, setLoaded);
}

const elemend = entry;

export default elemend;
