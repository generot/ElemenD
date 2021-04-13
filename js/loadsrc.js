const { Asset } = require("expo-asset");

function LoadImages() {
    const fdescriptors = {
        red: require("../assets/markers/red.png"),
        blue: require("../assets/markers/blue.png"),
        green: require("../assets/markers/green.png"),
        yellow: require("../assets/markers/yellow.png"),
        gray: require("../assets/markers/gray.png")
    };

    Object.keys(fdescriptors).forEach(fd => {
        fdescriptors[fd] = Asset.fromModule(fdescriptors[fd]).downloadAsync();
    });

    return fdescriptors;
}

module.exports = { LoadImages };