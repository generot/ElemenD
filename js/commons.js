import React from 'react';
import { Marker } from 'react-native-maps';
import { View, TouchableOpacity, Text } from 'react-native';

export class Location {
    constructor(lng, lat) {
        this.lng = lng;
        this.lat = lat;
    }

    GetCoords() {
        return {
            longitude: this.lng,
            latitude: this.lat,
            longitudeDelta: 0.09,
            latitudeDelta: 0.09
        };
    }
}

export class MarkerDescriptor {
    constructor(id, type, position) {
        this.id = id;
        this.type = type;
        this.position = position;
    }

    GetObject() {
        return {
            id: this.id,
            type: this.type,
            position: {
                longitude: this.position.longitude,
                latitude: this.position.latitude
            }
        };
    }
}

export const DraggableMarker = ({coords, imgSource, markStyle, onDrEnd, _uri}) => {
    return ( 
        <Marker
         draggable = {true}
         coordinate = {coords}
         tracksViewChanges = {false}
         //image = {{ uri: _uri }}
         style = {markStyle}
         pinColor = {imgSource}
         onDragEnd = {event => onDrEnd(event)}
        />
    );
}

export const Menu = ({elems, buttonStyle, textStyle, onClose, onElse}) => {
    return (
        <View style={{ flexWrap: "wrap", flexDirection: "column", marginTop: 50 }}>
            {elems.map((elem, ix) => (
                <TouchableOpacity style={{
                    ...buttonStyle, 
                    marginTop: 75 * (ix + 1),
                    width: 300,
                    backgroundColor: elem == "X" ? "red" : buttonStyle.backgroundColor,
                }} 
                key={ix}
                onPress={() => elem == "X" ? onClose() : onElse(elem)}>
                    <Text style={textStyle}>{elem}</Text>
                </TouchableOpacity>
            ))}
        </View>
    );
}

export const PrimaryButtons = ({style, deviceDims, onAdd, onSubmit}) => {
    return (
        <View>
            <TouchableOpacity
            style = {{
             ...style.button, 
             transform: [ {translateX: -100}, {translateY: deviceDims.height - 100} ],
            }}
             onPress = {() => onAdd()}>
                <Text style = {style.text}>Add marker</Text>
            </TouchableOpacity>
            <TouchableOpacity
             style = {{
             ...style.button, 
             transform: [ {translateX: 100}, {translateY: deviceDims.height - 100} ],
            }}
            onPress = {() => onSubmit()}>
                <Text style = {style.text}>Submit marker</Text>
            </TouchableOpacity>
      </View>
    );
}

export const ErrorView = (styleObj, devWidth, setErr, setLoad) => {
    return (
        <View style = {{ flex: 1, backgroundColor: "#404040", justifyContent: "center" }}>
            <Text style = {styleObj.errorTxt}>An error occurred when connecting to the database server.</Text>
            <Text style = {{ ...styleObj.errorTxt, fontSize: 15 }}>-- Possible reasons for outage --</Text>
            <Text style = {{ 
                ...styleObj.errorTxt, ...styleObj.errorPrompt, marginLeft: devWidth / 4
            }}>Your internet connection might be down.</Text>
            <Text style = {{ 
                ...styleObj.errorTxt, ...styleObj.errorPrompt, marginLeft: devWidth / 4
            }}>The server might have been halted by the host.</Text>
            <TouchableOpacity style = {{ ...styleObj.button, bottom: 170 }} onPress = {() => { setErr(200); setLoad(false) }}>
                <Text style = {styleObj.text}>Refresh</Text>
            </TouchableOpacity>
        </View>
    );
}