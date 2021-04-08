const mongodb = require("mongodb");

const url = "mongodb+srv://DatabaseEntryE1:<password>@cluster0.sq5n5.mongodb.net/ElemenD?retryWrites=true&w=majority";
const client = new mongodb.MongoClient(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

function UploadMarkers(client, arr) {
    client.connect(lst => {
        const col = client.db("ElemenData").collection("Markers");
        col.findOneAndUpdate(
            { type: "MarkerStorage" },
            { $set: { json: JSON.stringify(arr) } }
        )
    });

    client.close();
}

function DownloadMarkers() {
    return null;
}

module.exports = { UploadMarkers, DownloadMarkers, client };