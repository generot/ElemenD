import { StyleSheet } from 'react-native';

export const style = StyleSheet.create({
    container: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0
    },

    marker: {
      width: 100,
      height: 120
    },

    button: {
      position: "absolute",
      alignItems: "center",
      alignContent: "center",
      alignSelf: "center",
      width: 150,
      height: 60,
      borderRadius: 20,
      opacity: 0.5,
      backgroundColor: "#ffffff"
    },

    text: {
      marginTop: 17, // --> (button.height / 2) + 2
      color: "#000000",
      fontFamily: "Impact"
    },

    errorTxt: {
      color: "#cd0000", 
      fontFamily: "Impact", 
      fontSize: 30,
      flexWrap: "wrap",
      textAlign: "center"
    }, 

    errorPrompt: {
      fontSize: 12, 
      width: 200, 
      height: 40,
      marginTop: 10,
      backgroundColor: "#ffffff",
      color: "#000000",
      borderRadius: 100,
      opacity: 0.5
    }
});