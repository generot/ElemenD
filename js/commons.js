import React, { useState } from 'react';
import { Marker } from 'react-native-maps';
import { View, Image, TouchableOpacity, Text } from 'react-native';

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
            position: this.position.GetCoords()
        };
    }
}

export const DraggableMarker = ({coords, imgSource, markStyle}) => {
    return( 
        <Marker
         draggable = {true}
         coordinate = {coords}
         tracksViewChanges = {false}
         icon = {imgSource}
         style = {markStyle}
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
                onPress={elem == "X" ? onClose : onElse(elem)}>
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
             onPress = {onAdd}>
                <Text style = {style.text}>Add marker</Text>
            </TouchableOpacity>
            <TouchableOpacity
             style = {{
             ...style.button, 
             transform: [ {translateX: 100}, {translateY: deviceDims.height - 100} ],
            }}
            onPress = {onSubmit}>
                <Text style = {style.text}>Submit marker</Text>
            </TouchableOpacity>
      </View>
    );
}